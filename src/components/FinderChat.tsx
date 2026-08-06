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
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '600px', maxHeight: '70vh', padding: 0, overflow: 'hidden', marginTop: '24px' }}>
      
      {/* Header */}
      <div style={{ padding: '16px 24px', background: 'var(--accent-glow)', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Chat with Owner</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: '600' }}>Connecting anonymously...</p>
        </div>
        <button onClick={handleShareLink} style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 'bold' }}>
          {typeof navigator.share === 'function' ? <Share2 size={16} /> : <Copy size={16} />}
          Share Link
        </button>
      </div>

      {/* Trust Copy */}
      <div style={{ padding: '12px 24px', background: 'rgba(34, 197, 94, 0.05)', borderBottom: '1px solid var(--border-glass)', fontSize: '0.8rem', color: '#15803d', textAlign: 'center' }}>
        Your identity is shared anonymously. The owner's identity is fully protected.
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loading && messages.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8' }}>Loading messages...</p>
        ) : (
          messages.map(msg => {
            const isMine = msg.sender_id === null;
            return (
              <div key={msg.id} style={{ alignSelf: isMine ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                <div style={{ 
                  background: isMine ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' : '#f1f5f9', 
                  padding: '12px 16px', 
                  borderRadius: '16px', 
                  borderBottomRightRadius: isMine ? '4px' : '16px',
                  borderBottomLeftRadius: !isMine ? '4px' : '16px',
                  color: isMine ? '#fff' : 'var(--text-primary)',
                  fontSize: '0.95rem',
                  lineHeight: '1.4',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  {msg.image_url ? (
                    <img src={msg.image_url} alt="Sent photo" style={{ width: '100%', borderRadius: '8px', marginBottom: msg.body && msg.body !== 'Sent a photo' ? '8px' : 0 }} />
                  ) : null}
                  {(!msg.image_url || (msg.body && msg.body !== 'Sent a photo')) && msg.body}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px', textAlign: isMine ? 'right' : 'left' }}>
                  {!isMine && <span style={{fontWeight: 600, marginRight: 4}}>{msg.sender_name}</span>}
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} style={{ padding: '12px 16px', borderTop: '1px solid var(--border-glass)', display: 'flex', gap: '8px', background: 'var(--bg-dark)', alignItems: 'center' }}>
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
          style={{ flexShrink: 0, background: 'rgba(99, 102, 241, 0.1)', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', borderRadius: '50%', transition: 'background 0.2s' }}
        >
          {uploading ? <Loader2 size={22} className="animate-spin" /> : <ImageIcon size={22} />}
        </button>
        <input 
          type="text" 
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Message..."
          style={{ flex: 1, minWidth: 0, background: '#f8fafc', border: '1px solid var(--border-glass)', borderRadius: '24px', padding: '12px 16px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.95rem' }}
        />
        <button type="submit" disabled={!newMessage.trim() && !uploading} style={{ flexShrink: 0, background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', border: 'none', width: '46px', height: '46px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: newMessage.trim() ? 'pointer' : 'not-allowed', opacity: newMessage.trim() ? 1 : 0.5, boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}>
          <Send size={20} style={{ marginLeft: '-2px' }} />
        </button>
      </form>
    </div>
  );
}
