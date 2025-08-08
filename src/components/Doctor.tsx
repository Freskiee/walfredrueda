import React from 'react';
import { useReveal } from '../utils/useReveal';

const Doctor: React.FC = () => {
  const { ref, isVisible } = useReveal();

  return (
    <section id="doctor" className="section">
      <div className="container">
        <div
          ref={ref}
          className={`grid grid--2 reveal ${isVisible ? 'reveal--visible' : ''}`}
          style={{ alignItems: 'center', gap: '4rem' }}
        >
          <div className="image" style={{ height: '500px' }}>
            <img
              src="https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Dr. Walfred Rueda"
              loading="lazy"
            />
          </div>

          <div>
            <h2>Sobre el Doctor</h2>
            <div style={{ marginTop: '2rem', textAlign: 'left' }}>
              <p>
                Médico Cirujano egresado de la UNAM con especialidad en Psiquiatría por el Instituto Nacional de Psiquiatría Ramón de la Fuente Muñiz (INPRFM). 
                Cuenta con Maestría en Ciencias Médicas por la UNAM y Alta Especialidad en Trastorno Obsesivo Compulsivo y Trastornos Relacionados por el INPRFM.
              </p>
              <p>
                Certificado por el Consejo Mexicano de Psiquiatría (CIMAT) y con formación en Terapia Cognitivo Conductual. 
                Actualmente cursa el Doctorado en Sexualidad Humana por el Instituto Mexicano de Sexología y la Maestría en Terapia Sexual por el 
                Centro de Investigación en Sexualidad Humana.
              </p>
              <p>
                Su enfoque integra la medicina basada en evidencia con un trato humano y personalizado, creando un ambiente de confianza 
                para abordar tanto la salud mental como la salud sexual de sus pacientes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Doctor;