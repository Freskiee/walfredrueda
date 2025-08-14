import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Specialty from './components/Specialty';
import Doctor from './components/Doctor';
import Services from './components/Services';
import VideoGalleryLite from './components/VideoGalleryLite'; // ⬅️ NUEVO
import ChatAssistant from './components/ChatAssistant';
import Schedule from './components/Schedule';
import Locations from './components/Locations';
import Payments from './components/Payments';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './styles/globals.css';

function App() {
  const videos = [
    {
      provider: "facebook" as const,
      id: "https://www.facebook.com/watch/?v=399258438928709",
      title: "Recomendación clínica",
      description: "El médico psiquiatra, Walfred Rueda Medina, recomienda que en caso de ser diagnosticadx con Trastorno Obsesivo Compulsivo, se tiene muy buen resultado combinando tratamiento farmacológico y terapia. 💊🗣️",
      thumb: "/images/fb-video-1.png"
    },
    {
      provider: "youtube" as const,
      id: "yCw2wcaS_9w",
      title: "Cómo diagnosticar esquizofrenia (Parte 1)",
      description: "El dr. Walfred Rueda nos explica cómo es que se diagnostica la esquizofrenia. 🧠",
      thumb: "/images/yt-video-1.png"
    },
    {
      provider: "youtube" as const,
      id: "6uX_fRprN_8",
      title: "Cómo diagnosticar esquizofrenia (Parte 2)",
      description: "El dr. Walfred Rueda nos explica cómo es que se diagnostica la esquizofrenia. 🧠",
      thumb: "/images/yt-video-2.png"
    }
  ];

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Specialty />
        <Doctor />
        <Services />

        <VideoGalleryLite items={videos} />

        <ChatAssistant />
        <Schedule />
        <Locations />
        <Payments />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
