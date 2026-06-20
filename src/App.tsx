import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="bg-glow"></div>
      <div className="bg-glow-alt"></div>
      
      <nav className="navbar">
        <div className="container navbar-content">
          <Link to="/" className="logo">
            <Shield className="text-indigo-500" fill="currentColor" size={28} />
            Keepr
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <a href="#features" className="nav-link">Features</a>
            <a href="#download" className="nav-link">Download App</a>
          </div>
        </div>
      </nav>

      <main style={{ paddingTop: '120px', minHeight: 'calc(100vh - 200px)' }}>
        {children}
      </main>

      <footer>
        <div className="container footer-content">
          <div className="logo" style={{ fontSize: '1.25rem' }}>
            <Shield size={20} />
            Keepr
          </div>
          <div className="footer-links">
            <Link to="/privacy" className="nav-link">Privacy Policy</Link>
            <Link to="/terms" className="nav-link">Terms of Service</Link>
          </div>
          <p style={{ fontSize: '0.875rem' }}>© {new Date().getFullYear()} Keepr. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
