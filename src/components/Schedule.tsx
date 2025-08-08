import React from 'react';
import { Clock, Monitor, MapPin } from 'lucide-react';
import { useReveal } from '../utils/useReveal';

const Schedule: React.FC = () => {
  const { ref, isVisible } = useReveal();

  const schedules = [
    {
      icon: <Clock size={32} />,
      title: 'Lunes a Jueves',
      time: '16:00 – 20:00 h',
      description: 'Consultas de tarde en ambas sedes',
    },
    {
      icon: <Clock size={32} />,
      title: 'Sábados',
      time: '9:00 – 13:00 h',
      description: 'Consultas matutinas disponibles',
    },
    {
      icon: <Clock size={32} />,
      title: 'Domingos',
      time: '9:00 – 12:00 h',
      description: 'Horario especial de fin de semana',
    },
  ];

  return (
    <section id="schedule" className="section">
      <div className="container">
        <div
          ref={ref}
          className={`reveal ${isVisible ? 'reveal--visible' : ''}`}
        >
          <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Horarios</h2>
          <p style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '18px', color: 'var(--muted)' }}>
            <Monitor size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
            Consultas en línea y presencial
          </p>
          
          <div className="grid grid--3">
            {schedules.map((schedule, index) => (
              <div key={index} className="card" style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--accent)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                  {schedule.icon}
                </div>
                <h3>{schedule.title}</h3>
                <p style={{ fontSize: '20px', fontWeight: 600, color: 'var(--accent)', margin: '0.5rem 0' }}>
                  {schedule.time}
                </p>
                <p style={{ color: 'var(--muted)', fontSize: '15px' }}>
                  {schedule.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Schedule;