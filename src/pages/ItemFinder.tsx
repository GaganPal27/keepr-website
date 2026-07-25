import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Shield, MapPin, CheckCircle } from 'lucide-react';

export default function ItemFinder() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchItem() {
      if (!id) return;
      try {
        // Fetch id and user_id too — needed to create conversation + send push notification
        const { data, error } = await supabase
          .from('items')
          .select('id, user_id, item_name, category, color, image_url')
          .eq('nfc_uid', id)
          .single();

        if (error) throw error;
        setItem(data);
      } catch (err: any) {
        setError("This item isn't registered or the tag is invalid.");
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [id]);

  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setSharing(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude, accuracy } = position.coords;

        // Log the scan (used for scan history / analytics)
        await supabase.from('nfc_scans').insert({
          nfc_uid: id,
          lat: latitude,
          lng: longitude,
          accuracy: accuracy,
        });

        // Create a conversation so the owner has something to open in the app.
        // conv_public_insert policy explicitly allows anonymous finders to do this.
        const { data: conv, error: convError } = await supabase
          .from('conversations')
          .insert({
            item_id: item.id,
            owner_id: item.user_id,
            finder_user_id: null,
            finder_name: 'Anonymous finder',
            scan_lat: latitude,
            scan_lng: longitude,
          })
          .select()
          .single();

        if (convError || !conv) {
          console.error('Conversation error:', convError);
          throw convError ?? new Error('Could not create conversation');
        }

        // Initial message so the owner has context when they open the chat
        await supabase.from('messages').insert({
          conversation_id: conv.id,
          sender_id: null,
          sender_name: 'Anonymous finder',
          body: `I found your "${item.item_name}"! Tap to connect with me.`,
        });

        // Actually send the push notification — this was the missing step before.
        const { error: pushError } = await supabase.functions.invoke('send-push-notification', {
          body: {
            owner_id: item.user_id,
            conversation_id: conv.id,
            item_name: item.item_name,
            finder_name: 'Anonymous finder',
            location_label: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          },
        });
        if (pushError) console.error('Push notification failed:', pushError);

        setSuccess(true);
      } catch (err) {
        alert("Failed to notify the owner. Please try again.");
      } finally {
        setSharing(false);
      }
    }, (err) => {
      setSharing(false);
      if (err.code === 1) {
        alert("Please allow location access so we can tell the owner where their item is!");
      } else {
        alert("Could not get your location.");
      }
    }, { enableHighAccuracy: true, timeout: 10000 });
  };

  if (loading) {
    return (
      <div className="container animate-fade-up" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2 className="gradient-text">Loading item details...</h2>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container animate-fade-up" style={{ padding: '60px 0', textAlign: 'center' }}>
        <div className="glass-panel" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <Shield size={48} className="text-slate-500" style={{ margin: '0 auto 20px' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Item Not Found</h2>
          <p className="text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-up" style={{ padding: '40px 0', maxWidth: '500px' }}>
      <div className="glass-panel" style={{ textAlign: 'center' }}>
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.item_name}
            style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 20px', border: '3px solid rgba(99, 102, 241, 0.5)' }}
          />
        ) : (
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '2px dashed rgba(99, 102, 241, 0.3)' }}>
            <Shield size={40} className="text-indigo-400" />
          </div>
        )}

        <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '8px' }}>{item.item_name}</h1>
        <p className="text-slate-400" style={{ marginBottom: '30px' }}>
          {item.color} • {item.category}
        </p>

        {success ? (
          <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '16px', padding: '24px' }}>
            <CheckCircle size={40} color="#22c55e" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ color: '#22c55e', fontSize: '1.25rem', marginBottom: '8px' }}>Owner Notified!</h3>
            <p className="text-slate-400" style={{ fontSize: '0.9rem' }}>
              Thank you for helping! The owner has been sent a notification. You can safely leave the item where you found it or hand it to a nearby lost & found desk.
            </p>
          </div>
        ) : (
          <>
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', color: '#f8fafc' }}>You found someone's lost item!</h3>
              <p className="text-slate-400" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                Please help return it by sharing its current location. The owner will receive an instant notification with a map.
              </p>
            </div>

            <button
              onClick={handleShareLocation}
              disabled={sharing}
              className="btn btn-primary"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              <MapPin size={20} />
              {sharing ? 'Locating...' : 'Help return it — Share location'}
            </button>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '16px' }}>
              Only your approximate area is shared. Your identity remains 100% anonymous.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
