import React from 'react';
import { useReveal } from '../utils/useReveal';

const Doctor: React.FC = () => {
  const { ref, isVisible } = useReveal();

  // Contenedor de imagen con proporción estable y sin recortes
  const figureStyle: React.CSSProperties = {
    width: '100%',
    aspectRatio: '4 / 3',
    maxHeight: '540px',
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
    objectFit: 'contain', // muestra la imagen completa
    objectPosition: 'center',
    display: 'block',
  };

  return (
    <section id="doctor" className="section">
      <div className="container">
        <div
          ref={ref}
          className={`grid grid--2 reveal ${isVisible ? 'reveal--visible' : ''}`}
          style={{ alignItems: 'center', gap: '3rem' }}
        >
          {/* Foto */}
          <div className="image" style={figureStyle}>
            <img
              src="/images/drWalter.png"
              alt="Dr. Walfred Rueda"
              loading="lazy"
              style={imgStyle}
              sizes="(max-width: 980px) 100vw, 50vw"
            />
          </div>

          {/* Texto */}
          <div>
            <h2 className="vgl-title">Sobre el Doctor</h2>

            <div className="doc-text">
              <p>
                Médico Cirujano por la Universidad Nacional Autónoma de México (UNAM), con especialidad en
                Psiquiatría por la UNAM y el Instituto Nacional de Psiquiatría Ramón de la Fuente Muñiz.
              </p>
              <p>
                Cuenta con una Maestría en Ciencias Médicas por la misma institución, así como una Alta
                Especialidad en Trastorno Obsesivo-Compulsivo y Neurofisiología Cognitiva en Psiquiatría
                (UNAM–INPRFM).
              </p>
              <p>
                Posee formación en Estadística por el Centro de Investigación en Matemáticas (CIMAT) y estudios
                en Terapia Cognitivo-Conductual para Trastornos de la Alimentación por el Centro de Psicoterapia
                Cognitivo Conductual.
              </p>
              <p>
                Es Doctor en Sexualidad Humana por la Asociación Mexicana para la Salud Sexual A.C. (AMSSAC) y la
                Universidad Nexum de México.
              </p>
              <p>
                Actualmente cursa la Maestría en Terapia Sexual, con enfoque clínico e interdisciplinario.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Doctor;
