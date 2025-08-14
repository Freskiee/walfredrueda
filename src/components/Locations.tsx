import React, { useEffect, useState } from 'react';
import { MapPin, ExternalLink, Map as MapIcon, ChevronsDown, ChevronsUp } from 'lucide-react';
import { useReveal } from '../utils/useReveal';

const Locations: React.FC = () => {
  const { ref, isVisible } = useReveal();

  const locations = [
    {
      name: 'Briyam Medical Polanco',
      address: 'Av Presidente Masaryk 134-Int. 402. Polanco, Polanco V Secc, Miguel Hidalgo',
      mapUrl: 'https://www.google.com/maps/place/Av+Presidente+Masaryk+134,+Polanco,+Miguel+Hidalgo,+11550+Ciudad+de+México,+CDMX/',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.515292545234!2d-99.19199168509015!3d19.433579686907754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1f92004c2e4c9%3A0x8b6d3d9c4e3d4e4e!2sAv%20Presidente%20Masaryk%20134%2C%20Polanco%2C%20Miguel%20Hidalgo%2C%2011550%20Ciudad%20de%20M%C3%A9xico%2C%20CDMX!5e0!3m2!1ses!2smx!4v1647890123456!5m2!1ses!2smx',
      image: 'https://home.briyamcoworkingmedico.com/masaryk/wp-content/uploads/2024/05/Briyam-Sucursal-Masaryk-5.webp'
    },
    {
      name: 'Briyam Medical Center Santa Fe',
      address: 'Vasco de Quiroga 3900-Torre B, Piso 5. Santa Fe, Contadero. Cuajimalpa de Morelos',
      mapUrl: 'https://www.google.com/maps/place/Vasco+de+Quiroga+3900,+Santa+Fe,+Cuajimalpa+de+Morelos,+05348+Ciudad+de+México,+CDMX/',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3765.0987654321!2d-99.25123456789!3d19.359876543210987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85ce01e2f3b4c5d6%3A0x7e8f9a0b1c2d3e4f!2sVasco%20de%20Quiroga%203900%2C%20Santa%20Fe%2C%20Cuajimalpa%20de%20Morelos%2C%2005348%20Ciudad%20de%20M%C3%A9xico%2C%20CDMX!5e0!3m2!1ses!2smx!4v1647890987654!5m2!1ses!2smx',
      image: 'https://home.briyamcoworkingmedico.com/wp-content/uploads/2025/02/Galeria-1-BRIYAM-COWORKING-MEDICO.jpg'
    }
  ];

  // expandido por defecto en desktop, colapsado en móvil
  const defaultExpanded = () =>
    typeof window !== 'undefined' ? window.innerWidth >= 980 : true;

  const [open, setOpen] = useState<boolean[]>(
    Array.from({ length: locations.length }, () => defaultExpanded())
  );

  useEffect(() => {
    // Si el usuario cambia el ancho (por ejemplo inspector), sincronizamos una vez
    const onResize = () => {
      const desktop = window.innerWidth >= 980;
      setOpen((prev) => prev.map((_, i) => (prev[i] ? true : desktop)));
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const toggle = (i: number) =>
    setOpen((o) => o.map((v, idx) => (idx === i ? !v : v)));

  return (
    <section id="locations" className="section section--alt">
      <h2 className="vgl-title">Ubicación</h2>
      <div className="container">
        <div
          ref={ref}
          className={`reveal ${isVisible ? 'reveal--visible' : ''}`}
          style={{ marginTop: '2.2rem' }}
        >
          <div className="loc-grid">
            {locations.map((loc, i) => (
              <article key={loc.name} className="loc-card">
                {/* Imagen */}
                <div className="loc-hero">
                  <img src={loc.image} alt={loc.name} loading="lazy" />
                </div>

                {/* Meta */}
                <div className="loc-meta">
                  <h3 className="loc-title">{loc.name}</h3>
                  <p className="loc-address">
                    <MapPin className="loc-pin" size={18} />
                    {loc.address}
                  </p>
                </div>

                {/* Toggle mapa */}
                <button
                  type="button"
                  className="loc-toggle"
                  onClick={() => toggle(i)}
                  aria-expanded={open[i]}
                  aria-controls={`map-${i}`}
                >
                  <MapIcon size={16} />
                  {open[i] ? (
                    <>
                      Ocultar mapa <ChevronsUp size={16} />
                    </>
                  ) : (
                    <>
                      Ver mapa <ChevronsDown size={16} />
                    </>
                  )}
                </button>

                {/* Mapa (con animación). iFrame solo se monta si está abierto */}
                <div
                  id={`map-${i}`}
                  className={`loc-map ${open[i] ? 'is-open' : 'is-collapsed'}`}
                >
                  {open[i] && (
                    <iframe
                      src={loc.embedUrl}
                      title={`Mapa de ${loc.name}`}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  )}
                </div>

                {/* CTA */}
                <a
                  href={loc.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--outline loc-btn"
                >
                  <ExternalLink size={18} />
                  Cómo llegar
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Locations;
