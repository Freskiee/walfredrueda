import React from 'react';
import { MessageCircle, Phone, Mail } from 'lucide-react';
import { useReveal } from '../utils/useReveal';
import styles from '../styles/contact.module.css';

const Contact: React.FC = () => {
  const { ref, isVisible } = useReveal();

  return (
    <section className={`section section--alt ${styles.contact}`}>
      <div className="container">
        <div
          ref={ref}
          className={`reveal ${isVisible ? 'reveal--visible' : ''}`}
        >
          <div className={styles.body} style={{ marginTop: '2.2rem' }}>
            <h2 className="vgl-title">Contacto</h2>

            <p className={styles.desc}>
              Estoy aquí para acompañarte en tu proceso de bienestar mental y sexual.
              No dudes en contactarme para agendar tu consulta o resolver cualquier duda.
            </p>

            <div className={styles.actions}>
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
