import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Specialty from './components/Specialty';
import Doctor from './components/Doctor';
import Services from './components/Services';
import ChatAssistant from './components/ChatAssistant';
import Schedule from './components/Schedule';
import Locations from './components/Locations';
import Payments from './components/Payments';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './styles/globals.css';

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Specialty />
        <Doctor />
        <Services />
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