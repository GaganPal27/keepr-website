export default function PrivacyPolicy() {
  return (
    <div className="container animate-fade-up" style={{ padding: '60px 0', maxWidth: '800px' }}>
      <div className="glass-panel">
        <h1 className="gradient-text" style={{ marginBottom: '16px' }}>Privacy Policy</h1>
        <p style={{ marginBottom: '40px', fontSize: '0.9rem' }}>Last Updated: June 20, 2026</p>

        <div className="content" style={{ color: 'var(--text-secondary)' }}>
          <h3 style={{ color: 'var(--text-primary)', marginTop: '32px', marginBottom: '16px' }}>1. Introduction</h3>
          <p style={{ marginBottom: '24px' }}>
            Welcome to Keepr. We respect your privacy and are committed to protecting your personal data in compliance with the Digital Personal Data Protection Act (DPDP Act). This policy explains how we collect, use, and protect your information when you use our mobile application and NFC/BLE tracking services.
          </p>

          <h3 style={{ color: 'var(--text-primary)', marginTop: '32px', marginBottom: '16px' }}>2. Data We Collect</h3>
          <p style={{ marginBottom: '16px' }}>We collect the following types of data:</p>
          <ul style={{ paddingLeft: '24px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><strong>Account Data:</strong> Name, email address, and phone number when you register.</li>
            <li><strong>Item Data:</strong> Descriptions and identifiers (UUIDs) of the items you register on Keepr.</li>
            <li><strong>Location Data:</strong> Background location data is collected anonymously to power the BLE beacon finding network. We also collect the specific location of an NFC scan when a finder reports your item.</li>
          </ul>

          <h3 style={{ color: 'var(--text-primary)', marginTop: '32px', marginBottom: '16px' }}>3. Purpose of Collection</h3>
          <p style={{ marginBottom: '24px' }}>
            Your data is used strictly for reuniting you with your lost items, providing push notifications, and facilitating communication between item owners and finders. Location data from the passive scanning network is used solely to update the last known locations of registered BLE beacons.
          </p>

          <h3 style={{ color: 'var(--text-primary)', marginTop: '32px', marginBottom: '16px' }}>4. Data Retention and Deletion</h3>
          <p style={{ marginBottom: '24px' }}>
            We retain your personal data only for as long as your account is active. You may request full deletion of your account and all associated data at any time through the Profile screen in the Keepr app. Upon deletion, your data is erased from our databases (Supabase) and payment providers (RevenueCat) within 30 days.
          </p>

          <h3 style={{ color: 'var(--text-primary)', marginTop: '32px', marginBottom: '16px' }}>5. Third-Party Sharing</h3>
          <p style={{ marginBottom: '24px' }}>
            We do not sell your personal data. We share necessary data with trusted service providers strictly for operational purposes:
            <br />- <strong>Supabase:</strong> For secure database hosting and edge functions.
            <br />- <strong>RevenueCat:</strong> For managing premium subscriptions.
            <br />- <strong>Expo:</strong> For delivering push notifications.
          </p>

          <h3 style={{ color: 'var(--text-primary)', marginTop: '32px', marginBottom: '16px' }}>6. Grievance Officer</h3>
          <p style={{ marginBottom: '24px' }}>
            In accordance with the DPDP Act, if you have any questions, concerns, or grievances regarding this privacy policy or your personal data, please contact our Grievance Officer:
          </p>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ marginBottom: '8px' }}><strong>Name:</strong> Gagan Pal</p>
            <p style={{ marginBottom: '8px' }}><strong>Email:</strong> gaganpal101722@gmail.com</p>
            <p style={{ margin: 0 }}>We are committed to resolving your grievance within 30 days of receipt.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
