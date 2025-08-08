import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import styles from '../styles/chat.module.css';
import { useReveal } from '../utils/useReveal';

type StepKey = 'nombre' | 'area' | 'motivo' | 'modalidad' | 'sede' | 'horario';

interface ChatMessage {
  type: 'bot' | 'user';
  text: string;
  timestamp: Date;
}
interface UserData {
  nombre: string;
  area: string;
  motivo: string;
  modalidad: string;
  sede: string;
  horario: string;
}

const chatSteps: { question: string; field: StepKey; options: string[] }[] = [
  {
    question:
      '¡Hola! Soy el asistente virtual del Dr. Walfred Rueda. Me da mucho gusto poder ayudarte. Para comenzar, ¿podrías decirme tu nombre?',
    field: 'nombre',
    options: []
  },
  {
    question: 'Mucho gusto, {nombre}. ¿En qué área te gustaría recibir atención?',
    field: 'area',
    options: ['Salud Mental', 'Salud Sexual', 'Ambas']
  },
  {
    question: 'Perfecto. ¿Cuál es el motivo principal de tu consulta?',
    field: 'motivo',
    options: [
      'Depresión', 'Ansiedad', 'TOC', 'Psicosis', 'Duelo',
      'Dificultades sexuales', 'Terapia de pareja', 'Orientación sexual', 'Otro'
    ]
  },
  {
    question: 'Entiendo. ¿Prefieres una consulta en línea o presencial?',
    field: 'modalidad',
    options: ['En línea', 'Presencial']
  },
  {
    question: '¿En cuál de nuestras sedes te gustaría recibir atención?',
    field: 'sede',
    options: ['Polanco', 'Santa Fe', 'Indistinto']
  },
  {
    question: 'Por último, ¿qué horario te conviene más?',
    field: 'horario',
    options: ['Lunes-Jueves 16:00-20:00h', 'Sábados 9:00-13:00h', 'Domingos 9:00-12:00h']
  }
];

const ChatAssistant: React.FC = () => {
  const { ref, isVisible } = useReveal();

  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState<UserData>({
    nombre: '', area: '', motivo: '', modalidad: '', sede: '', horario: ''
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Refs
  const listRef = useRef<HTMLDivElement>(null);
  const greetedRef = useRef(false);          // evita doble saludo en StrictMode
  const lockRef = useRef(false);             // lock genérico anti doble click/enter
  const sendingRef = useRef(false);          // lock para input libre
  const askedRef = useRef<Set<number>>(new Set()); // pasos ya preguntados

  // Helpers
  const interp = (t: string, data: UserData) =>
    t.replace(/{(\w+)}/g, (_, k: string) => (data as any)[k] || `{${k}}`);

  const addBotMessage = (text: string, data = userData) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text: interp(text, data), timestamp: new Date() }]);
      setIsTyping(false);
    }, 450);
  };

  // pregunta un paso SÓLO una vez
  const askStep = (idx: number, data = userData) => {
    if (askedRef.current.has(idx)) return;
    askedRef.current.add(idx);
    addBotMessage(chatSteps[idx].question, data);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, { type: 'user', text, timestamp: new Date() }]);
  };

  // Saludo inicial (una sola vez con StrictMode)
  useEffect(() => {
    if (!isVisible || greetedRef.current) return;
    greetedRef.current = true;
    askStep(0);
    setShowOptions(true);
  }, [isVisible]);

  // Scroll SOLO dentro del contenedor
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  // Lock HOC
  function withLock<T extends any[]>(fn: (...a: T) => void | Promise<void>) {
    return async (...a: T) => {
      if (lockRef.current) return;
      lockRef.current = true;
      try { await fn(...a); }
      finally { setTimeout(() => (lockRef.current = false), 250); }
    };
  }

  const goNextWith = withLock((value: string) => {
    const step = chatSteps[currentStep];

    // 1) pinta respuesta del usuario
    addUserMessage(value);
    setShowOptions(false);

    // 2) actualiza estado y decide siguiente
    setUserData(prev => {
      const updated = { ...prev, [step.field]: value } as UserData;

      if (currentStep < chatSteps.length - 1) {
        const next = currentStep + 1;
        setCurrentStep(next);
        askStep(next, updated);      // <-- usa registro anti-duplicado
        setTimeout(() => setShowOptions(true), 550);
      } else {
        setTimeout(() => {
          addBotMessage('¡Perfecto! He recopilado toda la información. Te muestro un resumen de tu solicitud:');
          setTimeout(() => setIsCompleted(true), 400);
        }, 350);
      }
      return updated;
    });
  });

  const handleFreeTextSubmit = (value: string) => {
    if (!value.trim() || isTyping) return;
    goNextWith(value.trim());
  };

  const generateWhatsAppMessage = () => {
    const m =
`Hola Dr. Walfred, me gustaría agendar una consulta.

*Información de la solicitud:*
• Nombre: ${userData.nombre}
• Área: ${userData.area}
• Motivo: ${userData.motivo}
• Modalidad: ${userData.modalidad}
• Sede: ${userData.sede}
• Horario: ${userData.horario}

Quedo atento a su respuesta. ¡Gracias!`;
    window.open(`https://wa.me/525512999642?text=${encodeURIComponent(m)}`, '_blank');
  };

  return (
    <section id="chat" className="section">
      <div className="container">
        <div ref={ref} className={`reveal ${isVisible ? 'reveal--visible' : ''}`}>
          <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Chat Asistente</h2>

          {isVisible && (
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <div className={styles.chatContainer}>
                <div className={styles.chatHeader}>
                  <h3 className={styles.chatTitle}>
                    <MessageCircle size={18} style={{ display: 'inline', marginRight: 8 }} />
                    Asistente Dr. Walfred Rueda
                  </h3>
                </div>

                {/* Mensajes */}
                <div className={styles.chatMessages} ref={listRef}>
                  {messages.map((m, i) => (
                    <div key={i} className={`${styles.message} ${m.type === 'bot' ? styles.messageBot : styles.messageUser}`}>
                      <div className={`${styles.messageBubble} ${m.type === 'bot' ? styles.messageBubbleBot : styles.messageBubbleUser}`}>
                        {m.text}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className={`${styles.message} ${styles.messageBot}`}>
                      <div className={styles.typing}>
                        <div className={styles.typingDot}></div>
                        <div className={styles.typingDot}></div>
                        <div className={styles.typingDot}></div>
                      </div>
                    </div>
                  )}

                  {isCompleted && (
                    <div style={{ marginTop: '1rem' }}>
                      <div className={styles.summary}>
                        <div className={styles.summaryTitle}>Resumen de tu solicitud:</div>
                        <div className={styles.summaryItem}><span className={styles.summaryLabel}>Nombre:</span><span className={styles.summaryValue}>{userData.nombre}</span></div>
                        <div className={styles.summaryItem}><span className={styles.summaryLabel}>Área:</span><span className={styles.summaryValue}>{userData.area}</span></div>
                        <div className={styles.summaryItem}><span className={styles.summaryLabel}>Motivo:</span><span className={styles.summaryValue}>{userData.motivo}</span></div>
                        <div className={styles.summaryItem}><span className={styles.summaryLabel}>Modalidad:</span><span className={styles.summaryValue}>{userData.modalidad}</span></div>
                        <div className={styles.summaryItem}><span className={styles.summaryLabel}>Sede:</span><span className={styles.summaryValue}>{userData.sede}</span></div>
                        <div className={styles.summaryItem}><span className={styles.summaryLabel}>Horario:</span><span className={styles.summaryValue}>{userData.horario}</span></div>
                      </div>
                      <button className={styles.whatsappButton} type="button" onClick={generateWhatsAppMessage}>
                        <MessageCircle size={18} style={{ marginRight: 8 }} />
                        Enviar solicitud por WhatsApp
                      </button>
                    </div>
                  )}
                </div>

                {/* Opciones (único bloque) */}
                {!isCompleted && (
                  <div className={styles.chatOptions}>
                    {showOptions && (
                      chatSteps[currentStep].options.length > 0 ? (
                        chatSteps[currentStep].options.map((opt, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={styles.optionButton}
                            onClick={() => goNextWith(opt)}
                          >
                            {opt}
                          </button>
                        ))
                      ) : (
                        <div style={{ width: '100%', display: 'flex', gap: 8 }}>
                          <input
                            type="text"
                            placeholder="Escribe tu respuesta..."
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const input = e.currentTarget;
                                if (sendingRef.current) return;
                                if (input.value.trim()) {
                                  sendingRef.current = true;
                                  handleFreeTextSubmit(input.value);
                                  input.value = '';
                                  setTimeout(() => { sendingRef.current = false; }, 250);
                                }
                              }
                            }}
                            style={{
                              flex: 1,
                              padding: '0.75rem',
                              border: '1px solid var(--line)',
                              borderRadius: 'var(--radius)',
                              fontSize: 15,
                              outline: 'none'
                            }}
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                              if (!input) return;
                              if (sendingRef.current) return;
                              if (input.value.trim()) {
                                sendingRef.current = true;
                                handleFreeTextSubmit(input.value);
                                input.value = '';
                                setTimeout(() => { sendingRef.current = false; }, 250);
                              }
                            }}
                            style={{
                              padding: '0.75rem 1rem',
                              background: 'var(--accent)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: 'var(--radius)',
                              cursor: 'pointer',
                              fontSize: 14,
                              fontWeight: 500
                            }}
                          >
                            Enviar
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ChatAssistant;
