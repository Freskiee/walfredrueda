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
          <h2>Psiquiatría y Salud Sexual</h2>
          <p style={{ fontSize: '18px', marginTop: '2rem', textAlign: 'left' }}>
            Mi práctica se centra en brindar atención psiquiátrica integral con un enfoque humanizado y basado en evidencia científica. 
            Combino el rigor de la medicina psiquiátrica moderna con la calidez necesaria para crear un espacio seguro donde cada 
            persona pueda abordar sus necesidades de salud mental y sexual con confianza y dignidad.
          </p>
          <p style={{ fontSize: '18px', textAlign: 'left' }}>
            Cada consulta está diseñada para ser un encuentro terapéutico donde la escucha activa, el respeto y la comprensión 
            profunda del paciente son la base para construir juntos un plan de tratamiento personalizado y efectivo.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Specialty;