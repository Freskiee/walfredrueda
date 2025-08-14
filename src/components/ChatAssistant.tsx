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
  motivo: string;         // guardamos string; si hubo multi-selección, va como "a, b, c"
  modalidad: string;
  sede: string;
  horario: string;
}

const topicsMental = [
  'Depresión', 'Ansiedad', 'TOC', 'Psicosis', 'Duelo', 'Trastorno Bipolar', 'Otro'
];
const topicsSexual = [
  'Dificultades sexuales', 'Terapia de pareja', 'Orientación sexual',
  'Disfunción eréctil', 'Bajo deseo sexual', 'Dolor sexual', 'Otro'
];

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
    options: [] // dinámico según área (abajo)
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

function stepIndexByField(field: StepKey) {
  return chatSteps.findIndex(s => s.field === field);
}

const ChatAssistant: React.FC = () => {
  const { ref, isVisible } = useReveal();

  // ---------- REFS ----------
  const listRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const freeInputRef = useRef<HTMLInputElement>(null);

  const greetedRef = useRef(false);
  const finishedRef = useRef(false); // Parche anti-duplicados cierre
  const lockRef = useRef(false);
  const sendingRef = useRef(false);
  const askedRef = useRef<Set<number>>(new Set());
  const resizeObsRef = useRef<ResizeObserver | null>(null);

  // ---------- ESTADO BASE ----------
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState<UserData>({
    nombre: '', area: '', motivo: '', modalidad: '', sede: '', horario: ''
  });

  const [isCompleted, setIsCompleted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');

  // UX “Más opciones” (solo móvil, unidireccional)
  const [showAll, setShowAll] = useState(false);

  // Multi-selección de “motivo” cuando área = “Ambas”
  const [selectedMotivos, setSelectedMotivos] = useState<string[]>([]);

  // Auto-scroll: stick to bottom
  const [atBottom, setAtBottom] = useState(true);

  // ---------- OPCIONES DINÁMICAS ----------
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 560;

  const currentOptions = (() => {
    const step = chatSteps[currentStep];
    if (step.field !== 'motivo') return step.options;
    const area = userData.area;
    if (area === 'Salud Mental') return topicsMental;
    if (area === 'Salud Sexual') return topicsSexual;
    return Array.from(new Set([...topicsMental, ...topicsSexual]));
  })();

  const topOptions = (!isMobile ? currentOptions : currentOptions.slice(0, 5)); // en desktop mostramos TODO sin “más”
  const moreOptions = (!isMobile ? [] : currentOptions.slice(5));               // “Más” solo en móvil

  const allowMultiMotivo = chatSteps[currentStep].field === 'motivo' && userData.area === 'Ambas';

  // ---------- HELPERS SCROLL ----------
  function isNearBottom(el: HTMLElement, threshold = 48) {
    return el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
  }
  function handleScroll() {
    const el = listRef.current;
    if (!el) return;
    setAtBottom(isNearBottom(el));
  }
  function scrollToBottom(smooth = true) {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  }
  function scrollToBottomChain(times = 3) {
    const el = listRef.current;
    if (!el) return;
    let i = 0;
    const tick = () => {
      el.scrollTop = el.scrollHeight;
      if (++i < times) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // ---------- HELPERS MENSAJES ----------
  const interp = (t: string, data: UserData) =>
    t.replace(/{(\w+)}/g, (_, k: string) => (data as any)[k] || `{${k}}`);

  // Anti-spam: evita mensajes bot idénticos consecutivos
  const addBotMessage = (text: string, data = userData) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.type === 'bot' && last.text === interp(text, data)) {
          return prev; // ya está, no dupliques
        }
        return [...prev, { type: 'bot', text: interp(text, data), timestamp: new Date() }];
      });
      setIsTyping(false);
      if (atBottom) scrollToBottomChain(2);
    }, 450);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, { type: 'user', text, timestamp: new Date() }]);
    if (atBottom) scrollToBottomChain(2);
  };

  const askStep = (idx: number, data = userData) => {
    if (askedRef.current.has(idx)) return;
    askedRef.current.add(idx);
    addBotMessage(chatSteps[idx].question, data);
  };

  // ---------- LOCK HOC ----------
  function withLock<T extends any[]>(fn: (...a: T) => void | Promise<void>) {
    return async (...a: T) => {
      if (lockRef.current) return;
      lockRef.current = true;
      try { await fn(...a); }
      finally { setTimeout(() => (lockRef.current = false), 250); }
    };
  }

  // ---------- NAVEGACIÓN ENTRE PASOS ----------
  const goToStep = (targetIdx: number) => {
    // limpiar askedRef de ese paso en adelante
    Array.from(askedRef.current).forEach(i => {
      if (i >= targetIdx) askedRef.current.delete(i);
    });
    finishedRef.current = false; // reset guard
    setIsCompleted(false);
    setCurrentStep(targetIdx);
    setShowOptions(true);
    setShowAll(false);
    setSelectedMotivos([]);
    optionsRef.current?.scrollTo({ top: 0 });
    askStep(targetIdx);
  };

  const goNextWith = withLock((value: string) => {
    const step = chatSteps[currentStep];

    // 1) pinta respuesta del usuario
    addUserMessage(value);
    setShowOptions(false);

    // 2) actualiza estado y decide siguiente (saltando sede si es En línea)
    setUserData(prev => {
      const updated = { ...prev, [step.field]: value } as UserData;

      let next = currentStep + 1;

      if (step.field === 'modalidad') {
        if (value !== 'Presencial') {
          (updated as any).sede = '';
          const sedeIdx = stepIndexByField('sede');
          if (sedeIdx !== -1 && next === sedeIdx) next = sedeIdx + 1;
        }
      }

      // Si ya estaba En línea y el siguiente es sede, saltar igual
      const sedeIdx = stepIndexByField('sede');
      if (updated.modalidad && updated.modalidad !== 'Presencial' && next === sedeIdx) {
        next = sedeIdx + 1;
      }

      if (next < chatSteps.length) {
        setCurrentStep(next);
        askStep(next, updated);
        setTimeout(() => setShowOptions(true), 550);
      } else {
        // ✅ evita duplicados de cierre/resumen
        if (finishedRef.current) return updated;
        finishedRef.current = true;

        setTimeout(() => {
          addBotMessage('¡Perfecto! He recopilado toda la información. Te muestro un resumen de tu solicitud:');
          setTimeout(() => setIsCompleted(true), 400);
        }, 350);
      }

      return updated;
    });
  });

  // ---------- INPUT LIBRE (nombre) ----------
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const handleSendMessage = () => {
    const v = inputValue.trim();
    if (!v || isTyping) return;
    goNextWith(v);
    setInputValue('');
  };

  // ---------- SELECCIÓN DE MOTIVOS ----------
  const toggleMotivo = (opt: string) => {
    if (!allowMultiMotivo) {
      // single-select → avanza directo
      goNextWith(opt);
      return;
    }
    // multi-select → togglear
    setSelectedMotivos(prev => {
      const has = prev.includes(opt);
      return has ? prev.filter(x => x !== opt) : [...prev, opt];
    });
  };

  const sendSelectedMotivos = () => {
    if (selectedMotivos.length === 0) return;
    goNextWith(selectedMotivos.join(', '));
    setSelectedMotivos([]);
  };

  // ---------- EFECTOS ----------
  // Saludo inicial (StrictMode safe)
  useEffect(() => {
    if (!isVisible || greetedRef.current) return;
    greetedRef.current = true;
    askStep(0);
    setShowOptions(true);
  }, [isVisible]);

  // Medir altura de opciones -> variable CSS para padding dinámico
  useEffect(() => {
    if (!optionsRef.current || !containerRef.current) return;

    const setVar = () => {
      const h = optionsRef.current ? optionsRef.current.offsetHeight : 0;
      containerRef.current!.style.setProperty('--options-h', `${h}px`);
      if (atBottom) requestAnimationFrame(() => scrollToBottom(false));
    };

    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(optionsRef.current);
    window.addEventListener('resize', setVar);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', setVar);
    };
  }, [showOptions, isCompleted, atBottom]);

  // Observa cambios de tamaño del área de mensajes
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    resizeObsRef.current = new ResizeObserver(() => {
      if (atBottom) scrollToBottomChain(3);
    });
    resizeObsRef.current.observe(el);

    // Baja una vez al montar
    el.scrollTop = el.scrollHeight;

    return () => {
      resizeObsRef.current?.disconnect();
      resizeObsRef.current = null;
    };
  }, []);

  // Mensajes nuevos → stick to bottom si procede
  useEffect(() => {
    if (atBottom) scrollToBottomChain(3);
  }, [messages]);

  // Bot “escribiendo” → mantén abajo si procede
  useEffect(() => {
    if (isTyping && atBottom) scrollToBottomChain(2);
  }, [isTyping, atBottom]);

  // Auto-focus cuando el paso es de texto libre
  useEffect(() => {
    const step = chatSteps[currentStep];
    if (step.options.length === 0) {
      requestAnimationFrame(() => freeInputRef.current?.focus());
    }
  }, [currentStep]);

  // Reset “Más opciones” y selección múltiple al cambiar de paso o área
  useEffect(() => {
    setShowAll(false);
    setSelectedMotivos([]);
    optionsRef.current?.scrollTo({ top: 0 });
  }, [currentStep, userData.area]);

  // ---------- RESET / WHATSAPP ----------
  const resetFlow = () => {
    finishedRef.current = false; // reset guard
    setUserData({ nombre: '', area: '', motivo: '', modalidad: '', sede: '', horario: '' });
    setCurrentStep(0);
    setIsCompleted(false);
    setMessages([]);
    askedRef.current = new Set();
    greetedRef.current = true; // no repite el efecto de saludo
    setShowOptions(true);
    setShowAll(false);
    setSelectedMotivos([]);
    // Mostrar bienvenida de nuevo
    setMessages([{ type: 'bot', text: chatSteps[0].question, timestamp: new Date() }]);
    setShowOptions(true);
    // setShowAllOptions removido por migración UX acordeónfalse);
    scrollToBottomChain(2);
  };

  const generateWhatsAppMessage = () => {
    const m =
`Hola Dr. Walfred, me gustaría agendar una consulta.

*Información de la solicitud:*
• Nombre: ${userData.nombre}
• Área: ${userData.area}
• Motivo: ${userData.motivo}
• Modalidad: ${userData.modalidad}
• Sede: ${userData.modalidad === 'En línea' ? 'N/A (en línea)' : userData.sede}
• Horario: ${userData.horario}

Quedo atento a su respuesta. ¡Gracias!`;
    window.open(`https://wa.me/525512999642?text=${encodeURIComponent(m)}`, '_blank');
    setTimeout(resetFlow, 500);
  };

  // ---------- RENDER ----------
  return (
    <section id="chat-assistant" className="section section--alt">
      <h2 className="vgl-title">Chat Asistente</h2>
      <div className="container">
        <div ref={ref} className={`reveal ${isVisible ? 'reveal--visible' : ''}`} style={{ marginTop: '1.5rem' }}>
          

          {isVisible && (
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <div className={styles.chatContainer} ref={containerRef}>
                <div className={styles.chatHeader}>
                  <h3 className={styles.chatTitle}>
                    <MessageCircle size={18} style={{ display: 'inline', marginRight: 8 }} />
                    Asistente Dr. Walfred Rueda
                  </h3>
                </div>

                {/* Mensajes */}
                <div className={styles.chatMessages} ref={listRef} onScroll={handleScroll}>
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={`${styles.message} ${m.type === 'bot' ? styles.messageBot : styles.messageUser}`}
                    >
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
                        <div className={styles.summaryItem}><span className={styles.summaryLabel}>Sede:</span>
                          <span className={styles.summaryValue}>
                            {userData.modalidad === 'En línea' ? 'N/A (en línea)' : userData.sede || '—'}
                          </span>
                        </div>
                        <div className={styles.summaryItem}><span className={styles.summaryLabel}>Horario:</span><span className={styles.summaryValue}>{userData.horario}</span></div>
                      </div>
                      <button className={styles.whatsappButton} type="button" onClick={generateWhatsAppMessage}>
                        <MessageCircle size={18} style={{ marginRight: 8 }} />
                        Enviar solicitud por WhatsApp
                      </button>
                    </div>
                  )}
                </div>

                {/* Opciones */}
                {!isCompleted && (
                  <div className={styles.chatOptions} ref={optionsRef}>
                    {showOptions && (
                      // Paso con opciones
                      currentOptions.length > 0 ? (
                        <>
                          {/* MOTIVO con multi-select cuando área = Ambas */}
                          {chatSteps[currentStep].field === 'motivo' ? (
                            <>
                              {/* Desktop: chips (todas); Mobile: top-5 + botón “Más opciones” + tarjetas seleccionables */}
                              {!isMobile ? (
                                <>
                                  {currentOptions.map((opt, idx) => {
                                    const selected = allowMultiMotivo && selectedMotivos.includes(opt);
                                    return (
                                      <button
                                        key={`desk-${idx}`}
                                        type="button"
                                        className={`${styles.optionButton} ${styles.optionButtonPill} ${selected ? styles.optionSelected : ''}`}
                                        onClick={() => toggleMotivo(opt)}
                                      >
                                        {opt}
                                      </button>
                                    );
                                  })}
                                  {allowMultiMotivo && (
                                    <button
                                      type="button"
                                      className={`${styles.ctaContinue} ${selectedMotivos.length === 0 ? styles.ctaDisabled : ''}`}
                                      disabled={selectedMotivos.length === 0}
                                      onClick={sendSelectedMotivos}
                                    >
                                      Continuar
                                    </button>
                                  )}
                                </>
                              ) : (
                                <>
                                  {/* Mobile: mostramos top-5 como tarjetas */}
                                  {topOptions.map((opt, idx) => {
                                    const selected = allowMultiMotivo && selectedMotivos.includes(opt);
                                    return (
                                      <button
                                        key={`mob-top-${idx}`}
                                        type="button"
                                        className={`${styles.optionCardMobile} ${selected ? styles.optionSelected : ''}`}
                                        onClick={() => toggleMotivo(opt)}
                                      >
                                        <span className={styles.optionCheck}>{selected ? '✓' : ''}</span>
                                        <span className={styles.optionText}>{opt}</span>
                                      </button>
                                    );
                                  })}

                                  {/* Botón “Más opciones (N)” una sola vez; al tocar, se muestra todo y desaparece */}
                                  {moreOptions.length > 0 && !showAll && (
                                    <button
                                      type="button"
                                      className={`${styles.optionButton} ${styles.optionToggle}`}
                                      onClick={() => {
                                        setShowAll(true);
                                        requestAnimationFrame(() => {
                                          if (!optionsRef.current) return;
                                          optionsRef.current.scrollTo({
                                            top: optionsRef.current.scrollHeight,
                                            behavior: 'smooth'
                                          });
                                        });
                                      }}
                                    >
                                      Más opciones ({moreOptions.length})
                                    </button>
                                  )}

                                  {showAll && moreOptions.map((opt, idx) => {
                                    const selected = allowMultiMotivo && selectedMotivos.includes(opt);
                                    return (
                                      <button
                                        key={`mob-more-${idx}`}
                                        type="button"
                                        className={`${styles.optionCardMobile} ${selected ? styles.optionSelected : ''}`}
                                        onClick={() => toggleMotivo(opt)}
                                      >
                                        <span className={styles.optionCheck}>{selected ? '✓' : ''}</span>
                                        <span className={styles.optionText}>{opt}</span>
                                      </button>
                                    );
                                  })}

                                  {allowMultiMotivo && (
                                    <button
                                      type="button"
                                      className={`${styles.ctaContinue} ${selectedMotivos.length === 0 ? styles.ctaDisabled : ''}`}
                                      disabled={selectedMotivos.length === 0}
                                      onClick={sendSelectedMotivos}
                                    >
                                      Continuar
                                    </button>
                                  )}
                                </>
                              )}
                            </>
                          ) : (
                            // Cualquier otro paso con opciones (chips estándar)
                            <>
                              {currentOptions.map((opt, idx) => (
                                <button
                                  key={`opt-${idx}`}
                                  type="button"
                                  className={`${styles.optionButton} ${styles.optionButtonPill}`}
                                  onClick={() => goNextWith(opt)}
                                >
                                  {opt}
                                </button>
                              ))}
                            </>
                          )}
                        </>
                      ) : (
                        // Paso de texto libre (nombre)
                        <div style={{ width: '100%', display: 'flex', gap: 8 }}>
                          <input
                            ref={freeInputRef}
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                            placeholder="Escribe tu respuesta..."
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
                            onClick={handleSendMessage}
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

              {!isCompleted && (userData.area || userData.modalidad) && (
                <div className={styles.backRowOutside}>
                  {userData.area && currentStep >= stepIndexByField('motivo') && (
                    <button
                      type="button"
                      className={styles.backBtn}
                      onClick={() => goToStep(stepIndexByField('area'))}
                    >
                      ← Cambiar área
                    </button>
                  )}
                  {userData.modalidad && currentStep >= stepIndexByField('sede') && (
                    <button
                      type="button"
                      className={styles.backBtn}
                      onClick={() => goToStep(stepIndexByField('modalidad'))}
                    >
                      ← Cambiar modalidad
                    </button>
                  )}
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ChatAssistant;
