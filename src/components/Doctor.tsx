import React, { useState } from 'react';
import { useReveal } from '../utils/useReveal';

const Doctor: React.FC = () => {
  const { ref, isVisible } = useReveal();
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="doctor" className="section">
      <div className="container">
        <div
          ref={ref}
          className={`grid grid--2 reveal ${isVisible ? 'reveal--visible' : ''} doc-grid`}
          style={{ alignItems: 'center' }}
        >
          {/* Imagen */}
          <figure className="doc-figure">
            <img
              src="/images/drWalter.png"
              alt="Dr. Walfred Rueda"
              loading="lazy"
              className="doc-img"
              sizes="(max-width: 980px) 100vw, 50vw"
            />
          </figure>

          {/* Texto */}
          <div className="doc-copy">
            <h2 className="vgl-title">Sobre el Doctor</h2>

            <div
              className={`doc-bio ${expanded ? 'is-open' : 'is-collapsed'}`}
              aria-expanded={expanded}
            >
              <ul className="doc-list">
                <li>
                  Médico Cirujano por la <strong>UNAM</strong>, con especialidad en Psiquiatría por la UNAM y el
                  Instituto Nacional de Psiquiatría Ramón de la Fuente Muñiz (INPRFM).
                </li>
                <li>
                  Maestría en Ciencias Médicas y Alta Especialidad en <strong>TOC</strong> y Neurofisiología Cognitiva
                  en Psiquiatría (UNAM–INPRFM).
                </li>
                <li>
                  Formación en Estadística por <strong>CIMAT</strong> y Terapia Cognitivo-Conductual para Trastornos de
                  la Alimentación (Centro de Psicoterapia Cognitivo Conductual).
                </li>
                <li>
                  <strong>Doctor en Sexualidad Humana</strong> (AMSSAC) y Universidad Nexum de México.
                </li>
                <li>
                  Actualmente cursa la <strong>Maestría en Terapia Sexual</strong> con enfoque clínico e interdisciplinario.
                </li>
              </ul>
              <div className="doc-fade" aria-hidden />
            </div>

            {/* Botón solo visible en móvil (se oculta en desktop vía CSS) */}
            <div className="doc-moreBtn-wrap">
              <button
                type="button"
                className="doc-moreBtn"
                onClick={() => setExpanded(v => !v)}
                aria-controls="doctor"
              >
                {expanded ? 'Ver menos' : 'Ver más'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Doctor;
