import React from 'react';
import { useReveal } from '../utils/useReveal';

const Specialty: React.FC = () => {
  const { ref, isVisible } = useReveal();

  return (
    <section id="specialty" className="section section--alt">
      <div className="container">
        <div
          ref={ref}
          className={`reveal ${isVisible ? 'reveal--visible' : ''}`}
          style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}
        >
          <h2 className="vgl-title">Psiquiatría y Salud Sexual</h2>
          <p style={{ fontSize: '18px', marginTop: '2rem', textAlign: 'left' }}>
          Espacio para adultos en búsqueda de salud mental y sexual. Un enfoque integral que combina la escucha empática, la comprensión humanista y los tratamientos basados en evidencia, para acompañar procesos como depresión, ansiedad, duelo, psicosis y dificultades sexuales, con respeto y profesionalismo.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Specialty;