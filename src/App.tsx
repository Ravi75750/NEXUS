import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import ContactForm from './components/ContactForm';
import AIStrategyBot from './components/AIStrategyBot';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import GlobalBackground from './components/GlobalBackground';
import ReviewSystem from './components/ReviewSystem';
import TeamSection from './components/TeamSection';
import { Toaster } from 'react-hot-toast';
import Loader from './components/Loader';

function LandingPage() {
  return (
    <>
      <Hero />
      <Services />
      <Portfolio />
      <ReviewSystem />
      <TeamSection />
      <ContactForm />
    </>
  );
}

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <AIStrategyBot />
    </>
  );
}

export default function App() {
  const [isBooting, setIsBooting] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isBooting) {
    return <Loader fullPage />;
  }

  return (
    <BrowserRouter>
      <div className="relative min-h-screen selection:bg-nexus-cyan selection:text-nexus-dark">
        <GlobalBackground />
        <Toaster 
          position="bottom-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(5, 5, 5, 0.8)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1rem',
              backdropFilter: 'blur(10px)',
              fontSize: '14px',
              fontWeight: 500,
            },
            success: {
              iconTheme: {
                primary: '#00aaff',
                secondary: '#fff',
              },
            },
          }}
        />
        
        <Routes>
          <Route path="/" element={
            <MainLayout>
              <LandingPage />
            </MainLayout>
          } />
          <Route path="/admin" element={
            <div className="bg-nexus-dark min-h-screen">
              <AdminPanel />
            </div>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
