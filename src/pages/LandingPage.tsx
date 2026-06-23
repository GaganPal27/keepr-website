import { Shield, Smartphone, Radio } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="container animate-fade-up">
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '100px 0', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '24px' }}>
          Never lose your <br />
          <span className="gradient-text-accent">valuables again.</span>
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
          Keepr is the world's first dual-protection system combining active NFC tagging and passive BLE tracking. Secure your keys, wallet, and pets.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <a href="#download" className="btn btn-primary">
            Get the App
          </a>
          <a href="#features" className="btn btn-secondary">
            Learn More
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={{ padding: '80px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 className="gradient-text">Dual Protection Technology</h2>
          <p>Two layers of security to ensure you get your items back.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          <div className="glass-panel delay-100 animate-fade-up">
            <Smartphone className="text-indigo-400" size={40} style={{ marginBottom: '24px' }} />
            <h3>NFC Tap to Scan</h3>
            <p>
              Attach a Keepr NFC sticker to your item. If someone finds it, they simply tap it with their phone to view your contact info and send you their location instantly.
            </p>
          </div>

          <div className="glass-panel delay-200 animate-fade-up">
            <Radio className="text-indigo-400" size={40} style={{ marginBottom: '24px' }} />
            <h3>Passive BLE Tracking</h3>
            <p>
              Drop a Keepr BLE Beacon in your bag. The Keepr app community silently and securely updates its location in the background whenever anyone walks by.
            </p>
          </div>

          <div className="glass-panel delay-300 animate-fade-up">
            <Shield className="text-indigo-400" size={40} style={{ marginBottom: '24px' }} />
            <h3>Privacy First</h3>
            <p>
              Your personal information is never exposed to the public. You control what finders see, and community tracking is completely anonymous.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="download" style={{ padding: '100px 0', textAlign: 'center' }}>
        <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.2)' }}>
          <h2 style={{ marginBottom: '24px' }}>Ready to secure your world?</h2>
          <p style={{ marginBottom: '40px' }}>
            Download the Keepr app today and set up your first NFC tag or BLE beacon in under 60 seconds.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary">
              Download for iOS
            </button>
            <button className="btn btn-secondary">
              Download for Android
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
