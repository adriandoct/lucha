import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { MapPin, Clock, Phone, Mail, ChevronRight, Star, MessageCircle, Play, X, User, ArrowRight, Shield, Award, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Components for Home
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-md py-4 border-b border-red-900/30' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-[0_0_15px_rgba(220,38,38,0.8)]">
            LL
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase italic">
            Lucha<span className="text-red-600">Libre</span>
          </h1>
        </div>
        <div className="hidden md:flex space-x-8 items-center text-sm font-bold uppercase tracking-wider text-gray-300">
          <a href="#programas" className="hover:text-red-500 transition-colors">Programas</a>
          <a href="#maestros" className="hover:text-red-500 transition-colors">Maestros</a>
          <a href="#tienda" className="hover:text-red-500 transition-colors">Tienda</a>
          <a href="#contacto" className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 hover:shadow-[0_0_15px_rgba(220,38,38,0.8)] transition-all">
            Clase Gratis
          </a>
          <Link to="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link>
        </div>
      </div>
    </nav>
  );
};

const HeroCarousel = () => {
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1542838686-37ed7a2fb024?q=80&w=2070&auto=format&fit=crop", // Ring
      title: "FORJA TU LEYENDA",
      subtitle: "La mejor escuela de lucha libre profesional",
      btn: "Inscribirme Ahora"
    },
    {
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop", // Gym
      title: "ENTRENA COMO PROFESIONAL",
      subtitle: "Instalaciones de primer nivel y acondicionamiento",
      btn: "Ver Planes"
    },
    {
      image: "https://images.unsplash.com/photo-1599058945522-28d584b6f4ff?q=80&w=2069&auto=format&fit=crop", // Kids/Discipline
      title: "DISCIPLINA PARA TODAS LAS EDADES",
      subtitle: "Formamos valores, carácter y fuerza",
      btn: "Academia Infantil"
    },
    {
      image: "https://images.unsplash.com/photo-1574629810360-7efbb42fcea5?q=80&w=2070&auto=format&fit=crop", // Arena lights
      title: "VIVE EL ESPECTÁCULO",
      subtitle: "Demuestra tu talento en el centro del ring",
      btn: "Próximos Eventos"
    }
  ];

  return (
    <div className="h-screen w-full relative group">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="h-full w-full"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx} className="relative">
            <div className="absolute inset-0 bg-black/60 z-10" />
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-[10000ms] hover:scale-100" />
            
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
              <motion.h2 
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 uppercase italic tracking-tighter mb-4 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              >
                {slide.title}
              </motion.h2>
              <motion.p 
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl md:text-3xl text-red-500 font-bold tracking-wide uppercase mb-8 drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]"
              >
                {slide.subtitle}
              </motion.p>
              <motion.button 
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="px-8 py-4 bg-gradient-to-r from-red-700 to-red-500 text-white text-lg font-black uppercase tracking-widest rounded shadow-[0_0_20px_rgba(220,38,38,0.6)] hover:shadow-[0_0_30px_rgba(220,38,38,0.9)] transition-shadow flex items-center space-x-2"
              >
                <span>{slide.btn}</span>
                <ArrowRight size={24} />
              </motion.button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

const PathSelection = () => {
  const [activePath, setActivePath] = useState(0);

  const paths = [
    { icon: <Award size={32} />, title: "Luchador Profesional", desc: "El camino hacia el campeonato. Técnica, caídas, lances y psicología del ring." },
    { icon: <User size={32} />, title: "Condición Física", desc: "Entrenamiento funcional inspirado en lucha libre para esculpir tu cuerpo." },
    { icon: <Shield size={32} />, title: "Escuela Infantil", desc: "Disciplina, acrobacias y valores para el desarrollo de los más jóvenes." },
    { icon: <MessageCircle size={32} />, title: "Showmanship", desc: "Creación de personaje, promos, manejo de micrófono y conexión con el público." }
  ];

  return (
    <section className="py-24 bg-gray-950 relative overflow-hidden" id="caminos">
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-red-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic mb-4">ELIGE TU <span className="text-red-600">CAMINO</span></h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Cada guerrero tiene su propia ruta. Selecciona tu objetivo y te mostraremos cómo llegar a la cima.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {paths.map((path, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              onClick={() => setActivePath(idx)}
              className={`cursor-pointer p-8 rounded-xl border ${activePath === idx ? 'border-red-500 bg-red-900/20 shadow-[0_0_20px_rgba(220,38,38,0.3)]' : 'border-gray-800 bg-gray-900 hover:border-gray-600'} transition-all`}
            >
              <div className={`mb-6 ${activePath === idx ? 'text-red-500' : 'text-gray-500'}`}>
                {path.icon}
              </div>
              <h3 className={`text-xl font-bold uppercase mb-3 ${activePath === idx ? 'text-white' : 'text-gray-300'}`}>{path.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{path.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          key={activePath}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-12 p-8 bg-gradient-to-r from-gray-900 to-black border border-red-900/50 rounded-xl flex flex-col md:flex-row items-center justify-between"
        >
          <div>
            <h4 className="text-2xl font-bold text-white mb-2 uppercase">Plan Recomendado: {paths[activePath].title}</h4>
            <p className="text-gray-400">Inicia tu entrenamiento esta misma semana. Incluye evaluación inicial gratuita.</p>
          </div>
          <button className="mt-6 md:mt-0 px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold uppercase rounded flex items-center space-x-2 transition-colors">
            <span>Ver Plan Detallado</span>
            <ChevronRight size={20} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

const Programs = () => {
  const programs = [
    { title: "Principiantes", level: "Básico", price: "$800/mes", schedule: "Lun-Mié-Vie", coach: "El Fuego" },
    { title: "Intermedio", level: "Medio", price: "$1000/mes", schedule: "Mar-Jue-Sáb", coach: "Máscara de Acero" },
    { title: "Avanzado", level: "Pro", price: "$1500/mes", schedule: "Lunes a Sábado", coach: "Maestro Trueno" },
    { title: "Infantil", level: "Niños (6-12)", price: "$700/mes", schedule: "Mar-Jue", coach: "Blue Kid" },
    { title: "Femenil", level: "Todos", price: "$800/mes", schedule: "Lun-Mié", coach: "Reina Roja" },
    { title: "Alto Rendimiento", level: "Élite", price: "$2000/mes", schedule: "Personalizado", coach: "El Fuego" }
  ];

  return (
    <section className="py-24 bg-black relative" id="programas">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic text-center mb-16">
          NUESTROS <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">PROGRAMAS</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((prog, idx) => (
            <div key={idx} className="group relative bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-yellow-500/50 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-0" />
              <div className="p-8 relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-black text-white uppercase italic">{prog.title}</h3>
                  <span className="px-3 py-1 bg-gray-800 text-yellow-500 text-xs font-bold uppercase rounded">{prog.level}</span>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center text-gray-400">
                    <Clock size={18} className="mr-3 text-red-500" />
                    <span>{prog.schedule}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <User size={18} className="mr-3 text-red-500" />
                    <span>Coach: {prog.coach}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-auto border-t border-gray-800 pt-6">
                  <span className="text-2xl font-bold text-white">{prog.price}</span>
                  <button className="px-6 py-2 bg-transparent border-2 border-red-600 text-red-500 hover:bg-red-600 hover:text-white font-bold uppercase transition-all rounded shadow-[0_0_0_rgba(220,38,38,0)] group-hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                    Unirme
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ExperienceWow = () => {
  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover opacity-40 filter grayscale contrast-125"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-boxer-doing-shadow-boxing-in-a-dark-gym-40156-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-red-900/40 to-black mix-blend-multiply" />
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Play size={80} className="text-white mx-auto mb-8 opacity-80 hover:opacity-100 cursor-pointer drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-[0_0_20px_rgba(0,0,0,1)]">
            No solo entrenas... <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 filter drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">te transformas.</span>
          </h2>
        </motion.div>
      </div>
    </section>
  );
};

const Masters = () => {
  const coaches = [
    { name: "Maestro Trueno", spec: "Lucha Clásica y Llavero", champ: "3x Campeón Nacional", img: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=1974&auto=format&fit=crop" },
    { name: "Máscara de Acero", spec: "Aérea y Acrobática", champ: "Campeón Crucero", img: "https://images.unsplash.com/photo-1599552375245-8c764e52541a?q=80&w=2070&auto=format&fit=crop" },
    { name: "Reina Roja", spec: "Femenil y Defensa", champ: "Reina del Ring 2024", img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2070&auto=format&fit=crop" }
  ];

  return (
    <section className="py-24 bg-gray-950" id="maestros">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic">LOS <span className="text-blue-500">MAESTROS</span></h2>
            <p className="text-gray-400 mt-4 text-lg">Aprende de leyendas vivientes del cuadrilátero.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {coaches.map((coach, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -15 }}
              className="bg-gray-900 rounded-xl overflow-hidden group shadow-2xl"
            >
              <div className="h-80 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/20 group-hover:bg-transparent transition-colors z-10" />
                <img src={coach.img} alt={coach.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110" />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-6 z-20">
                  <h3 className="text-3xl font-black text-white uppercase italic">{coach.name}</h3>
                </div>
              </div>
              <div className="p-6 border-t-4 border-blue-500 bg-gray-900">
                <p className="text-blue-400 font-bold uppercase mb-2">{coach.spec}</p>
                <div className="flex items-center text-yellow-500 mb-4">
                  <Award size={20} className="mr-2" />
                  <span className="font-medium">{coach.champ}</span>
                </div>
                <div className="flex space-x-4">
                  <span className="text-gray-500 hover:text-pink-500 cursor-pointer transition-colors font-bold text-sm">IG</span>
                  <span className="text-gray-500 hover:text-blue-500 cursor-pointer transition-colors font-bold text-sm">FB</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ViralStats = () => {
  return (
    <section className="py-16 bg-red-600 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} className="text-6xl font-black text-white mb-2">+500</motion.div>
            <div className="text-red-200 uppercase font-bold tracking-widest">Alumnos Entrenados</div>
          </div>
          <div>
            <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.2 }} className="text-6xl font-black text-white mb-2">+30</motion.div>
            <div className="text-red-200 uppercase font-bold tracking-widest">Campeones Formados</div>
          </div>
          <div>
            <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.4 }} className="flex justify-center items-center text-6xl font-black text-white mb-2">
              4.9 <Star size={40} className="ml-2 text-yellow-400 fill-yellow-400" />
            </motion.div>
            <div className="text-red-200 uppercase font-bold tracking-widest">Calificación Estelar</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MiniStore = () => {
  const products = [
    { name: "Máscara Pro 'Fuego'", price: "$1,200", img: "https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=1974&auto=format&fit=crop" },
    { name: "Playera Oficial", price: "$450", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080&auto=format&fit=crop" },
    { name: "Guantes de Impacto", price: "$650", img: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=1974&auto=format&fit=crop" },
    { name: "Botas Profesionales", price: "$2,500", img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1974&auto=format&fit=crop" }
  ];

  return (
    <section className="py-24 bg-black" id="tienda">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic text-center mb-16">
          NUESTRA <span className="text-yellow-500">TIENDA</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((prod, idx) => (
            <div key={idx} className="bg-gray-900 rounded-lg p-4 group border border-gray-800 hover:border-yellow-500 transition-colors">
              <div className="h-48 bg-gray-800 rounded-md mb-4 overflow-hidden">
                <img src={prod.img} alt={prod.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h4 className="text-white font-bold mb-2">{prod.name}</h4>
              <p className="text-yellow-500 font-bold mb-4">{prod.price}</p>
              <button className="w-full py-2 bg-transparent border border-white text-white hover:bg-white hover:text-black font-bold uppercase text-sm transition-colors rounded">
                Comprar
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-gray-950 pt-20 pb-10 border-t border-gray-900">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-bold text-sm">LL</div>
            <h2 className="text-xl font-black text-white uppercase italic">Lucha<span className="text-red-600">Libre</span></h2>
          </div>
          <p className="text-gray-400 mb-6">Forjando leyendas desde 1990. Disciplina, respeto y pasión por el deporte espectáculo.</p>
          <div className="flex space-x-4">
            <span className="text-gray-400 hover:text-white cursor-pointer font-bold">IG</span>
            <span className="text-gray-400 hover:text-white cursor-pointer font-bold">FB</span>
            <span className="text-gray-400 hover:text-white cursor-pointer font-bold">YT</span>
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-bold uppercase mb-6">Contacto</h4>
          <ul className="space-y-4 text-gray-400">
            <li className="flex items-start"><MapPin size={20} className="mr-3 text-red-500 flex-shrink-0" /> Av. del Ring 123, Ciudad Deportiva</li>
            <li className="flex items-center"><Phone size={20} className="mr-3 text-red-500" /> +52 555 123 4567</li>
            <li className="flex items-center"><Mail size={20} className="mr-3 text-red-500" /> info@luchalibre.com</li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-bold uppercase mb-6">Horarios</h4>
          <ul className="space-y-4 text-gray-400">
            <li className="flex justify-between"><span>Lunes a Viernes</span> <span>7:00 - 22:00</span></li>
            <li className="flex justify-between"><span>Sábados</span> <span>8:00 - 18:00</span></li>
            <li className="flex justify-between"><span>Domingos</span> <span>Eventos</span></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-bold uppercase mb-6">Newsletter</h4>
          <p className="text-gray-400 mb-4">Recibe noticias y promociones de eventos.</p>
          <div className="flex">
            <input type="email" placeholder="Tu email" className="bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-l focus:outline-none focus:border-red-500 w-full" />
            <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-r text-white font-bold">
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-900 pt-8 text-center text-gray-600 text-sm">
        &copy; {new Date().getFullYear()} Lucha Libre Pro School. Todos los derechos reservados.
      </div>
    </div>
  </footer>
);

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl mb-4 w-80 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-red-700 to-red-500 p-4 flex justify-between items-center text-white">
              <div className="flex items-center space-x-2">
                <Award size={20} />
                <span className="font-bold">Coach IA</span>
              </div>
              <button onClick={() => setIsOpen(false)}><X size={20} /></button>
            </div>
            <div className="p-4 h-64 overflow-y-auto space-y-4">
              <div className="bg-gray-800 p-3 rounded-lg text-sm text-gray-200">
                ¡Hola! Soy tu asistente virtual. ¿En qué te puedo ayudar hoy? ¿Buscas un plan de entrenamiento específico?
              </div>
            </div>
            <div className="p-3 border-t border-gray-800 flex">
              <input type="text" placeholder="Escribe tu duda..." className="bg-black text-white flex-1 px-3 py-2 rounded-l border border-gray-700 focus:outline-none focus:border-red-500 text-sm" />
              <button className="bg-red-600 px-3 py-2 rounded-r text-white"><ChevronRight size={16} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.6)] hover:bg-red-500 hover:scale-110 transition-all ml-auto"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};

export default function Home() {
  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-red-600 selection:text-white">
      <Navbar />
      <HeroCarousel />
      <PathSelection />
      <ExperienceWow />
      <Programs />
      <ViralStats />
      <Masters />
      <MiniStore />
      
      {/* Free Class Reservation Form */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-black relative" id="contacto">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-gray-950 border border-red-900/30 rounded-2xl p-8 md:p-12 shadow-[0_0_50px_rgba(220,38,38,0.1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-[80px]"></div>
            
            <div className="text-center mb-10 relative z-10">
              <h2 className="text-4xl font-black uppercase italic mb-4">RESERVA TU <span className="text-red-500">CLASE GRATIS</span></h2>
              <p className="text-gray-400">Da el primer paso en tu carrera deportiva. Cupo limitado.</p>
            </div>

            <form className="relative z-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Nombre Completo</label>
                  <input type="text" className="w-full bg-gray-900 border border-gray-800 text-white px-4 py-3 rounded focus:outline-none focus:border-red-500 transition-colors" placeholder="Rey Misterioso" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Edad</label>
                  <input type="number" className="w-full bg-gray-900 border border-gray-800 text-white px-4 py-3 rounded focus:outline-none focus:border-red-500 transition-colors" placeholder="18" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase mb-2">WhatsApp</label>
                  <input type="tel" className="w-full bg-gray-900 border border-gray-800 text-white px-4 py-3 rounded focus:outline-none focus:border-red-500 transition-colors" placeholder="+52 ..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Objetivo</label>
                  <select className="w-full bg-gray-900 border border-gray-800 text-white px-4 py-3 rounded focus:outline-none focus:border-red-500 transition-colors appearance-none">
                    <option>Convertirme en Profesional</option>
                    <option>Condición Física</option>
                    <option>Escuela Infantil</option>
                  </select>
                </div>
              </div>

              <button type="button" className="w-full bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-white font-black uppercase tracking-widest py-4 rounded shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.8)] transition-all transform hover:-translate-y-1">
                QUIERO MI CLASE GRATIS
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
      <ChatBot />
    </div>
  );
}
