import React from 'react';
import { Brain, Heart, Users } from 'lucide-react';
import { useReveal } from '../utils/useReveal';

const Services: React.FC = () => {
  const { ref, isVisible } = useReveal();

  const services = [
    {
      icon: <Brain size={32} />,
      title: 'Atención Psiquiátrica',
      description: 'Atención psiquiátrica para adultos con enfoque científico, farmacológico y psicoterapéutico breve.',
    },
    {
      icon: <Heart size={32} />,
      title: 'Trastornos Mentales',
      description: 'Diagnóstico y tratamiento de depresión, ansiedad, trastorno bipolar, psicosis, TOC y otros trastornos mentales.',
    },
    {
      icon: <Users size={32} />,
      title: 'Salud Sexual',
      description: 'Asesoría clínica en salud sexual desde la psiquiatría y la sexología, en un espacio ético, profesional y libre de estigmas.',
    },
  ];

  return (
    <section id="services" className="section section--alt">
      <div className="container">
        <div
          ref={ref}
          className={`reveal ${isVisible ? 'reveal--visible' : ''}`}
        >
          <h2 className="vgl-title" style={{ marginBottom: '3rem' }}>Servicios</h2>
          
          <div className="grid grid--3">
            {services.map((service, index) => (
              <div key={index} className="card">
                <div style={{ color: 'var(--accent)', marginBottom: '1rem' }}>
                  {service.icon}
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;