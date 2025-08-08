import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Inicio', href: '#hero' },
    { label: 'Especialidad', href: '#specialty' },
    { label: 'Sobre el Doctor', href: '#doctor' },
    { label: 'Servicios', href: '#services' },
    { label: 'Chat', href: '#chat' },
    { label: 'Horarios', href: '#schedule' },
    { label: 'Ubicación', href: '#locations' },
    { label: 'Contacto', href: '#contact' },
  ];

  const handleMenuClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${isScrolled ? 'var(--line)' : 'transparent'}`,
        transition: 'var(--transition)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 20px' }}>
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '18px',
            fontWeight: 700,
            color: 'var(--text)',
            cursor: 'pointer',
          }}
          onClick={() => handleMenuClick('#hero')}
        >
          Dr. Walfred Rueda
        </div>

        {/* Desktop Menu */}
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick(item.href);
              }}
              style={{
                color: 'var(--text)',
                fontSize: '15px',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'var(--transition)',
                display: window.innerWidth > 980 ? 'block' : 'none',
              }}
            >
              {item.label}
            </a>
          ))}

          {/* Mobile Menu Button */}
          <button
            style={{
              display: window.innerWidth <= 980 ? 'block' : 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              color: 'var(--text)',
            }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--bg)',
            borderBottom: '1px solid var(--line)',
            padding: '1rem 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick(item.href);
              }}
              style={{
                color: 'var(--text)',
                fontSize: '16px',
                fontWeight: 500,
                textDecoration: 'none',
                padding: '0.75rem 20px',
                transition: 'var(--transition)',
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;