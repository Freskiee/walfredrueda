import React from 'react';
import { CreditCard, Banknote, Smartphone, Globe } from 'lucide-react';
import { useReveal } from '../utils/useReveal';

const Payments: React.FC = () => {
  const { ref, isVisible } = useReveal();

  const paymentMethods = [
    {
      icon: <Banknote size={24} />,
      name: 'Efectivo',
    },
    {
      icon: <CreditCard size={24} />,
      name: 'Tarjeta Visa',
    },
    {
      icon: <Smartphone size={24} />,
      name: 'Transferencia',
    },
    {
      icon: <Globe size={24} />,
      name: 'PayPal',
    },
  ];

  return (
    <section id="payments" className="section">
      <h2 className="vgl-title">Métodos de Pago</h2>
      <div className="container">
        <div
          ref={ref}
          className={`reveal ${isVisible ? 'reveal--visible' : ''}`}
          style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}
        >
          
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            {paymentMethods.map((method, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem',
                  minWidth: '120px',
                }}
              >
                <div style={{ color: 'var(--accent)' }}>
                  {method.icon}
                </div>
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>
                  {method.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payments;