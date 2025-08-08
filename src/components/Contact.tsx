import React from 'react';
import { MessageCircle, Phone, Mail } from 'lucide-react';
import { useReveal } from '../utils/useReveal';

const Contact: React.FC = () => {
  const { ref, isVisible } = useReveal();

  return (
    <section id="contact" className="section section--alt">
      <div className="container">
        <div
          ref={ref}
          className={`reveal ${isVisible ? 'reveal--visible' : ''}`}
        >
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
            <h2>Contacto</h2>
            <p style={{ fontSize: '18px', marginBottom: '2.5rem', lineHeight: '1.6' }}>
              Estoy aquí para acompañarte en tu proceso de bienestar mental y sexual. 
              No dudes en contactarme para agendar tu consulta o resolver cualquier duda.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="https://wa.me/525512999642?text=Hola%20Dr.%20Walfred%2C%20me%20gustaría%20agendar%20una%20consulta."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--primary"
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
              
              <a href="tel:5512999642" className="btn btn--outline">
                <Phone size={18} />
                Llamar
              </a>
              
              <a href="mailto:dr@walfredrueda.com" className="btn btn--secondary">
                <Mail size={18} />
                Correo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;