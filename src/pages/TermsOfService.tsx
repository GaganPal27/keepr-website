export default function TermsOfService() {
  return (
    <div className="container animate-fade-up" style={{ padding: '60px 0', maxWidth: '800px' }}>
      <div className="glass-panel">
        <h1 className="gradient-text" style={{ marginBottom: '16px' }}>Terms of Service</h1>
        <p style={{ marginBottom: '40px', fontSize: '0.9rem' }}>Last Updated: June 20, 2026</p>

        <div className="content" style={{ color: 'var(--text-secondary)' }}>
          <h3 style={{ color: 'var(--text-primary)', marginTop: '32px', marginBottom: '16px' }}>1. Acceptance of Terms</h3>
          <p style={{ marginBottom: '24px' }}>
            By accessing or using the Keepr app and website, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services. You must be at least 18 years old to create an account.
          </p>

          <h3 style={{ color: 'var(--text-primary)', marginTop: '32px', marginBottom: '16px' }}>2. Description of Service</h3>
          <p style={{ marginBottom: '24px' }}>
            Keepr provides a platform and hardware integration (NFC and BLE) intended to assist in the recovery of lost items. We do not guarantee the recovery of any lost item, nor are we liable for any loss, theft, or damage to your property.
          </p>

          <h3 style={{ color: 'var(--text-primary)', marginTop: '32px', marginBottom: '16px' }}>3. User Responsibilities</h3>
          <p style={{ marginBottom: '24px' }}>
            You are responsible for maintaining the confidentiality of your account credentials. You agree not to use Keepr for any unlawful purpose, including tracking individuals without their explicit consent.
          </p>

          <h3 style={{ color: 'var(--text-primary)', marginTop: '32px', marginBottom: '16px' }}>4. Subscriptions and Payments</h3>
          <p style={{ marginBottom: '24px' }}>
            Certain features of Keepr are available via premium subscription. Payments are processed through standard app store mechanisms (RevenueCat). Subscriptions automatically renew unless canceled at least 24 hours before the end of the current period.
          </p>

          <h3 style={{ color: 'var(--text-primary)', marginTop: '32px', marginBottom: '16px' }}>5. Limitation of Liability</h3>
          <p style={{ marginBottom: '24px' }}>
            To the maximum extent permitted by law, Keepr and its developers shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
          </p>
        </div>
      </div>
    </div>
  );
}
