import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Send, Share2, Copy, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function FinderChat({ conversationId, item }: { conversationId: string, item: any }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase.rpc('get_conversation_messages', {
        p_conversation_id: conversationId
      });
      if (error) throw error;
      if (data) setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    let intervalId: any;
    
    const startPolling = () => {
      intervalId = setInterval(() => {
        if (!document.hidden) fetchMessages();
      }, 5000);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(intervalId);
      } else {
        fetchMessages();
        startPolling();
      }
    };

    startPolling();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [conversationId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas to Blob failed'));
          }, 'image/jpeg', 0.8);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    try {
      setUploading(true);
      const compressedBlob = await compressImage(file);
      const fileName = `${conversationId}/${Date.now()}.jpg`;
      
      const { error: uploadError } = await supabase.storage
        .from('item-images')
        .upload(fileName, compressedBlob, { contentType: 'image/jpeg' });
        
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('item-images')
        .getPublicUrl(fileName);

      const { error: msgError } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: null,
        sender_name: 'Anonymous finder',
        body: 'Sent a photo',
        image_url: publicUrl
      });

      if (msgError) throw msgError;
      
      fetchMessages();
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const body = newMessage;
    setNewMessage('');
    
    // Optimistic UI update
    const tempMsg = {
      id: crypto.randomUUID(),
      body,
      sender_id: null,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);

    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: null,
      sender_name: 'Anonymous finder',
      body
    });

    if (error) {
      alert('Failed to send message');
      fetchMessages(); // revert optimistic update
    }
  };

  const handleShareLink = async () => {
    const url = window.location.href;
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: `Chat with ${item.item_name} Owner`,
          text: `Here is the link to continue your anonymous chat with the owner of the lost ${item.item_name}.`,
          url,
        });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '600px', maxHeight: '70vh', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', marginTop: '24px' }}>
      
      {/* Header */}
      <div style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.1)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', color: '#f8fafc' }}>Chat with Owner</h3>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>Connecting anonymously</p>
        </div>
        <button onClick={handleShareLink} style={{ background: 'transparent', border: 'none', color: '#6366f1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 'bold' }}>
          {typeof navigator.share === 'function' ? <Share2 size={16} /> : <Copy size={16} />}
          Save Link
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading && messages.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8' }}>Loading messages...</p>
        ) : (
          messages.map(msg => {
            const isMine = msg.sender_id === null;
            return (
              <div key={msg.id} style={{ alignSelf: isMine ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                <div style={{ 
                  background: isMine ? '#6366f1' : 'rgba(255,255,255,0.1)', 
                  padding: '10px 14px', 
                  borderRadius: '16px', 
                  borderBottomRightRadius: isMine ? '4px' : '16px',
                  borderBottomLeftRadius: !isMine ? '4px' : '16px',
                  color: '#fff',
                  fontSize: '0.95rem',
                  lineHeight: '1.4'
                }}>
                  {msg.image_url ? (
                    <img src={msg.image_url} alt="Sent photo" style={{ width: '100%', borderRadius: '8px', marginBottom: msg.body && msg.body !== 'Sent a photo' ? '8px' : 0 }} />
                  ) : null}
                  {(!msg.image_url || (msg.body && msg.body !== 'Sent a photo')) && msg.body}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px', textAlign: isMine ? 'right' : 'left' }}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.2)', alignItems: 'center' }}>
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          onChange={handleImageUpload} 
          style={{ display: 'none' }} 
        />
        <button 
          type="button" 
          onClick={() => fileInputRef.current?.click()} 
          disabled={uploading}
          style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}
        >
          {uploading ? <Loader2 size={24} className="animate-spin" /> : <ImageIcon size={24} />}
        </button>
        <input 
          type="text" 
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Message owner anonymously..."
          style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '12px 16px', color: '#fff', outline: 'none', fontSize: '0.95rem' }}
        />
        <button type="submit" disabled={!newMessage.trim() && !uploading} style={{ background: '#6366f1', border: 'none', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: newMessage.trim() ? 'pointer' : 'not-allowed', opacity: newMessage.trim() ? 1 : 0.5 }}>
          <Send size={18} style={{ marginLeft: '-2px' }} />
        </button>
      </form>
    </div>
  );
}
