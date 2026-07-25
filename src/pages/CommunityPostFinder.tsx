import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Shield, ExternalLink } from 'lucide-react';

export default function CommunityPostFinder() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      if (!id) return;
      try {
        // Try community_items first (Found posts)
        const { data: communityItem } = await supabase
          .from('community_items')
          .select('id, title, category, description, image_url, location_label, status')
          .eq('id', id)
          .single();

        if (communityItem) {
          setPost({ ...communityItem, type: 'found' });
          return;
        }

        // Try lost_item_posts (Lost posts)
        const { data: lostItem } = await supabase
          .from('lost_item_posts')
          .select('id, title, category, description, image_url, location_label, status')
          .eq('id', id)
          .single();

        if (lostItem) {
          setPost({ ...lostItem, type: 'lost' });
          return;
        }

        setError('This post was not found or has been removed.');
      } catch (err: any) {
        setError('This post was not found or has been removed.');
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  const appDeepLink = post
    ? `lostfoundnfc://lost-post/${id}`
    : `lostfoundnfc://`;

  if (loading) {
    return (
      <div className="container animate-fade-up" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2 className="gradient-text">Loading post...</h2>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container animate-fade-up" style={{ padding: '60px 0', textAlign: 'center' }}>
        <div className="glass-panel" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <Shield size={48} className="text-slate-500" style={{ margin: '0 auto 20px' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Post Not Found</h2>
          <p className="text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  const isLost = post.type === 'lost';
  const emoji = isLost ? '🚨' : '📦';
  const label = isLost ? 'Lost Item' : 'Found Item';

  return (
    <div className="container animate-fade-up" style={{ padding: '40px 0', maxWidth: '500px' }}>
      <div className="glass-panel" style={{ textAlign: 'center' }}>
        {post.image_url ? (
          <img
            src={post.image_url}
            alt={post.title}
            style={{ width: '120px', height: '120px', borderRadius: '16px', objectFit: 'cover', margin: '0 auto 20px', border: '3px solid rgba(99, 102, 241, 0.3)' }}
          />
        ) : (
          <div style={{ fontSize: '56px', marginBottom: '16px', lineHeight: 1.2 }}>{emoji}</div>
        )}

        <div style={{ display: 'inline-block', background: isLost ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', border: `1px solid ${isLost ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`, borderRadius: '100px', padding: '4px 14px', marginBottom: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: isLost ? '#ef4444' : '#22c55e' }}>{label}</span>
        </div>

        <h1 className="gradient-text" style={{ fontSize: '1.75rem', marginBottom: '8px' }}>{post.title}</h1>
        <p className="text-slate-400" style={{ marginBottom: '8px' }}>{post.category}</p>
        {post.location_label && (
          <p className="text-slate-400" style={{ fontSize: '0.85rem', marginBottom: '20px' }}>📍 {post.location_label}</p>
        )}
        {post.description && (
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '28px' }}>{post.description}</p>
        )}

        <a
          className="btn btn-primary"
          href={appDeepLink}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', textDecoration: 'none' }}
        >
          <ExternalLink size={18} />
          {isLost ? 'View Lost Item in App' : 'View Found Item in App'}
        </a>
        <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '16px' }}>
          Requires the Keepr Lost &amp; Found app to be installed on your device.
        </p>
      </div>
    </div>
  );
}
