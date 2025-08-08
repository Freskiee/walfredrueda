import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{ background: 'var(--text)', color: 'white', padding: '2rem 0' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '1rem' }}>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '20px',
              fontWeight: 700,
              marginBottom: '0.5rem',
            }}
          >
            Dr. Walfred Rueda
          </div>
          <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>
            Psiquiatría con calidez humana y rigor científico
          </p>
        </div>
        
        <div className="divider" style={{ background: '#334155', margin: '1.5rem 0' }} />
        
        <div style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.6 }}>
          <p>Cédula profesional 3238649 · Cédula Especialidad 5052179</p>
          <p style={{ margin: 0 }}>© 2025 Dr. Walfred Rueda – Todos los derechos reservados</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;