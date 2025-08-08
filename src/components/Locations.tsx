import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { useReveal } from '../utils/useReveal';

const Locations: React.FC = () => {
  const { ref, isVisible } = useReveal();

  const locations = [
    {
      name: 'Briyam Medical Polanco',
      address: 'Av Presidente Masaryk 134-Int. 402. Polanco, Polanco V Secc, Miguel Hidalgo',
      mapUrl: 'https://www.google.com/maps/place/Av+Presidente+Masaryk+134,+Polanco,+Miguel+Hidalgo,+11550+Ciudad+de+México,+CDMX/',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.515292545234!2d-99.19199168509015!3d19.433579686907754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1f92004c2e4c9%3A0x8b6d3d9c4e3d4e4e!2sAv%20Presidente%20Masaryk%20134%2C%20Polanco%2C%20Miguel%20Hidalgo%2C%2011550%20Ciudad%20de%20M%C3%A9xico%2C%20CDMX!5e0!3m2!1ses!2smx!4v1647890123456!5m2!1ses!2smx',
      image: 'https://home.briyamcoworkingmedico.com/wp-content/uploads/2024/05/Briyam-Sucursal-Masaryk-02.webp'
    },
    {
      name: 'Briyam Medical Center Santa Fe',
      address: 'Vasco de Quiroga 3900-Torre B, Piso 5. Santa Fe, Contadero. Cuajimalpa de Morelos',
      mapUrl: 'https://www.google.com/maps/place/Vasco+de+Quiroga+3900,+Santa+Fe,+Cuajimalpa+de+Morelos,+05348+Ciudad+de+México,+CDMX/',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3765.0987654321!2d-99.25123456789!3d19.359876543210987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85ce01e2f3b4c5d6%3A0x7e8f9a0b1c2d3e4f!2sVasco%20de%20Quiroga%203900%2C%20Santa%20Fe%2C%20Cuajimalpa%20de%20Morelos%2C%2005348%20Ciudad%20de%20M%C3%A9xico%2C%20CDMX!5e0!3m2!1ses!2smx!4v1647890987654!5m2!1ses!2smx',
      image: 'https://home.briyamcoworkingmedico.com/wp-content/uploads/2025/02/Galeria-1-BRIYAM-COWORKING-MEDICO.jpg'
    }
  ];

  return (
    <section id="locations" className="section section--alt">
      <div className="container">
        <div
          ref={ref}
          className={`reveal ${isVisible ? 'reveal--visible' : ''}`}
        >
          <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Ubicación</h2>
          
          <div className="grid grid--2">
            {locations.map((location, index) => (
              <div key={index} className="card">
                <div className="image" style={{ height: '200px', marginBottom: '1.5rem' }}>
                  <img
                    src={location.image}
                    alt={location.name}
                    loading="lazy"
                  />
                </div>
                
                <h3>{location.name}</h3>
                <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <MapPin size={18} style={{ marginTop: '2px', flexShrink: 0 }} />
                  {location.address}
                </p>
                
                <div style={{ marginBottom: '1.5rem', borderRadius: 'var(--radius)', overflow: 'hidden', height: '200px' }}>
                  <iframe
                    src={location.embedUrl}
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Mapa de ${location.name}`}
                  />
                </div>
                
                <a
                  href={location.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--outline"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <ExternalLink size={18} />
                  Cómo llegar
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Locations;