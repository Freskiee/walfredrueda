import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { useReveal } from '../utils/useReveal';

const Hero: React.FC = () => {
  const { ref, isVisible } = useReveal();

  // Contenedor responsivo para la imagen (sin recortes)
  const figureStyle: React.CSSProperties = {
    width: '100%',
    aspectRatio: '16 / 10',     // proporción agradable para hero
    maxHeight: '460px',         // límite en desktop
    borderRadius: '16px',
    overflow: 'hidden',
    background: 'var(--panel, #f3f4f6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const imgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',       // 👉 muestra la imagen completa
    objectPosition: 'center',
    display: 'block',
  };

  return (
    <section id="hero" className="section" style={{ paddingTop: '120px' }}>
      <div className="container">
        <div
          ref={ref}
          className={`grid grid--2 reveal ${isVisible ? 'reveal--visible' : ''}`}
          style={{ alignItems: 'center', gap: '4rem' }}
        >
          <div>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', lineHeight: '1.1', marginBottom: '0.5rem' }}>
              Psiquiatría con calidez humana y rigor científico
            </h1>
            <p style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', color: 'var(--muted)', marginBottom: '1.5rem', fontWeight: 400 }}>
              Acompañamiento integral para tu salud mental y sexual
            </p>

            <div className="chips">
              <span className="chip">Consultas en línea y presencial</span>
              <span className="chip">Atención adulta</span>
              <span className="chip">Espacio libre de estigmas</span>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
              <a
                href="https://wa.me/5512999642?text=Hola%20Dr.%20Walfred%2C%20me%20gustaría%20agendar%20una%20consulta."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--primary"
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
              <a href="tel:5512999642" className="btn btn--outline">
                <Phone size={18} />
                Llamar
              </a>
            </div>
          </div>

          {/* Imagen del hero sin recortes */}
          <div className="image" style={figureStyle}>
            <img
              src="/images/heroImg.png"
              alt="Dr. Walfred Rueda - Consulta médica"
              loading="lazy"
              style={imgStyle}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>

      {/* Aire extra en móvil debajo del hero */}
      <style>{`
        @media (max-width: 640px) {
          #hero.section { padding-top: 88px; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
