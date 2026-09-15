import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const heroBgRef = useRef(null);
  const heroContentRef = useRef(null);
  const vhWatermarkRef = useRef(null);

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCapability, setActiveCapability] = useState(0);
  const [activeWhy, setActiveWhy] = useState(0);
  const [activeProcess, setActiveProcess] = useState(0);
  const [hoveredTech, setHoveredTech] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: 'Web Development',
    details: ''
  });

  // Services data (01 to 06)
  const services = [
    {
      num: '01',
      title: 'WEB DEVELOPMENT',
      tagline: 'Build your digital presence.',
      description: 'High-performance digital flagship platforms, web applications, and headless architectures engineered with microsecond latency, fluid interaction, and enterprise-grade reliability.',
      deliverables: ['Custom Web Applications', 'Headless & Modular Architectures', 'Next.js & React Engineering', 'Design Systems & Interactive 3D'],
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1600&auto=format&fit=crop',
      alt: 'High-performance web architecture and digital development'
    },
    {
      num: '02',
      title: 'AI & MACHINE LEARNING',
      tagline: 'Intelligence for real-world decisions.',
      description: 'Proprietary predictive models, computer vision systems, and automated machine learning pipelines tailored to extract actionable foresight from complex enterprise data assets.',
      deliverables: ['Predictive Forecasting Models', 'Custom Neural Networks', 'Computer Vision (OpenCV / YOLO)', 'MLOps & Autonomous Model Pipelines'],
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
      alt: 'Neural network and machine learning visualization'
    },
    {
      num: '03',
      title: 'DATA ANALYTICS',
      tagline: 'Turn information into insight.',
      description: 'End-to-end telemetry, enterprise data warehouse pipelines, and executive intelligence dashboards that convert fragmented operational metrics into decisive business momentum.',
      deliverables: ['Real-Time Telemetry & Dashboards', 'Power BI & Custom Visualizations', 'Warehouse Pipelines (SQL / PostgreSQL)', 'Automated Anomaly Detection'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop',
      alt: 'Real-time telemetry and data analytics intelligence'
    },
    {
      num: '04',
      title: 'AI CHATBOTS',
      tagline: 'Conversations that work 24/7.',
      description: 'Context-aware autonomous conversational AI agents powered by state-of-the-art LLMs, grounded in company knowledge, executing workflows, and solving customer inquiries around the clock.',
      deliverables: ['Enterprise LLM Fine-Tuning & RAG', 'Omnichannel Customer Support Agents', 'Internal Knowledge Copilots', 'Multi-Language Conversational AI'],
      image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=1600&auto=format&fit=crop',
      alt: 'Conversational artificial intelligence and intelligent chat systems'
    },
    {
      num: '05',
      title: 'PROMOTION ADS',
      tagline: 'Creative that gets attention.',
      description: 'High-conversion algorithmic ad creatives, motion design, and precision video formats designed to capture mindshare, accelerate acquisition, and command brand authority.',
      deliverables: ['High-Conversion Motion Ads', 'Algorithmic Dynamic Creatives', 'Omnichannel Performance Assets', 'Product Showcase Visuals'],
      image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1600&auto=format&fit=crop',
      alt: 'Modern digital creative campaigns and promotion ads'
    },
    {
      num: '06',
      title: 'POSTERS & CREATIVE DESIGN',
      tagline: 'Visual communication built for brands.',
      description: 'Editorial brand identities, Swiss-inspired typographic systems, and bespoke marketing collateral crafted to communicate uncompromising technical excellence and institutional trust.',
      deliverables: ['Editorial Identity Systems', 'Architectural Typography Systems', 'High-Impact Brand Collateral', 'Digital & Print Exhibition Systems'],
      image: 'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?q=80&w=1600&auto=format&fit=crop',
      alt: 'Architectural creative typography and visual brand communication'
    }
  ];

  // Business Problem -> Solution transformation
  const transformations = [
    {
      problem: 'MANUAL WORK',
      solution: 'AUTOMATION',
      impact: 'Eliminate repetitive bottlenecks with autonomous end-to-end task execution and intelligent background jobs.',
      metric: '85% Reduction in Cycle Time'
    },
    {
      problem: 'SCATTERED DATA',
      solution: 'ANALYTICS',
      impact: 'Unify siloed spreadsheets and fragmented operational databases into unified, real-time executive intelligence.',
      metric: 'Single Source of Truth'
    },
    {
      problem: 'CUSTOMER QUESTIONS',
      solution: 'AI CHATBOT',
      impact: 'Deploy 24/7 intelligent LLM copilots that resolve complex multi-turn inquiries with zero latency.',
      metric: 'Sub-second Instant Resolution'
    },
    {
      problem: 'WEAK DIGITAL PRESENCE',
      solution: 'WEB PLATFORM',
      impact: 'Build a high-performance, art-directed digital flagship that commands respect and converts visitors at scale.',
      metric: '4.2x Conversion Velocity'
    },
    {
      problem: 'UNCLEAR FUTURE DEMAND',
      solution: 'MACHINE LEARNING',
      impact: 'Leverage predictive machine learning models to anticipate inventory, demand curves, and market changes.',
      metric: '94.8% Forecasting Accuracy'
    },
    {
      problem: 'WEAK PROMOTION',
      solution: 'CREATIVE + ADS',
      impact: 'Deploy precision digital campaigns, algorithmic ad assets, and editorial identity that capture market attention.',
      metric: '3.6x Return on Ad Spend'
    }
  ];

  // Selected Work projects (Agency Style with varied asymmetric layouts)
  const projects = [
    {
      num: '01',
      title: 'AURA LOGISTICS',
      statement: 'Autonomous Supply Chain Routing & Telemetry Portal',
      industry: 'Global Freight & Enterprise Infrastructure',
      tech: 'React • Node.js • PostgreSQL • Real-Time WebSockets',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop',
      impact: 'Tracking $180M+ monthly cargo volume with zero dispatch downtime.'
    },
    {
      num: '02',
      title: 'KINETIC NEURAL',
      statement: 'Predictive Energy Consumption & Asset Forecasting',
      industry: 'Smart Energy & Industrial IoT',
      tech: 'Python • PyTorch • Time-Series Transformers • AWS',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop',
      impact: '18.4% reduction in peak grid power variance.'
    },
    {
      num: '03',
      title: 'SYNAPSE COPILOT',
      statement: 'Autonomous Financial Intelligence & Compliance Assistant',
      industry: 'FinTech & Sovereign Wealth Advisory',
      tech: 'LLMs • Vector DB • FastAPI • TailwindCSS',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1600&auto=format&fit=crop',
      impact: '9,400+ audit hours automated quarterly.'
    },
    {
      num: '04',
      title: 'NEXUS BRANDING',
      statement: 'Global Creative Identity & Automated Campaign Engine',
      industry: 'Luxury Architecture & Modern Real Estate',
      tech: 'Generative Creative Design • Motion Systems • CDN',
      image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1600&auto=format&fit=crop',
      impact: 'Generated 2.4M organic impressions during launch week.'
    }
  ];

  // Capabilities with large typography & hover preview
  const capabilities = [
    {
      tag: 'WEB',
      headline: 'Digital products and platforms.',
      detail: 'From cloud-native web applications to responsive flagship brand environments built on React, Next.js, and performant APIs.',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop'
    },
    {
      tag: 'AI',
      headline: 'Intelligent systems and assistants.',
      detail: 'Custom LLM integrations, retrieval-augmented intelligence, and autonomous chat copilots tailored to enterprise workflows.',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop'
    },
    {
      tag: 'DATA',
      headline: 'Analytics and predictive intelligence.',
      detail: 'Unified telemetry data pipelines, real-time dashboards, and SQL/Postgres architecture for mission-critical operations.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop'
    },
    {
      tag: 'AUTOMATION',
      headline: 'Systems that work continuously.',
      detail: 'Automated business workflows, API bridges, background event listeners, and data synchronizers eliminating manual friction.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop'
    },
    {
      tag: 'CREATIVE',
      headline: 'Visual communication that gets noticed.',
      detail: 'Precision promotional ad assets, typography systems, and Swiss-grade brand direction that commands market reverence.',
      image: 'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?q=80&w=1200&auto=format&fit=crop'
    }
  ];

  // Why VERHOST Principles
  const principles = [
    {
      num: '01',
      title: 'BUSINESS FIRST',
      desc: 'We never write code for the sake of code. Every system, interface, and model is engineered to measurably drive revenue, efficiency, or competitive leverage.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop'
    },
    {
      num: '02',
      title: 'CUSTOM BY DESIGN',
      desc: 'No generic themes. No bloated off-the-shelf templates. Every digital platform and algorithm is tailor-built for your business domain and architectural requirements.',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop'
    },
    {
      num: '03',
      title: 'AI-NATIVE THINKING',
      desc: 'We architect systems designed from day one to harness artificial intelligence, structured data pipelines, and machine learning at scale.',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'
    },
    {
      num: '04',
      title: 'LONG-TERM PARTNERSHIP',
      desc: 'We operate as an extension of your leadership team — constantly iterating, monitoring production infrastructure, and deploying evolutionary upgrades.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop'
    }
  ];

  // Process Steps
  const processSteps = [
    { num: '01', name: 'DISCOVER', desc: 'In-depth architectural immersion, stakeholder alignment, and data auditing to define unambiguous objectives.' },
    { num: '02', name: 'DEFINE', desc: 'System blueprints, user journeys, data schemas, and mathematical performance criteria locked in with total precision.' },
    { num: '03', name: 'DESIGN', desc: 'High-fidelity art direction, interactive prototypes, and typographic systems engineered for maximum conversion.' },
    { num: '04', name: 'BUILD', desc: 'Full-stack engineering, clean modular codebases, custom neural models, and secure cloud infrastructure.' },
    { num: '05', name: 'LAUNCH', desc: 'Comprehensive stress testing, zero-downtime deployment, DNS provisioning, and telemetry verification.' },
    { num: '06', name: 'GROW', desc: 'Continuous telemetry monitoring, algorithmic optimization, and proactive capability scaling.' }
  ];

  // Technology Ecosystem
  const technologies = [
    { name: 'Python', role: 'Core AI, Data Science & Backend Engine' },
    { name: 'React', role: 'Performant Component Architecture' },
    { name: 'Node.js', role: 'Event-Driven High-Concurrency Microservices' },
    { name: 'SQL', role: 'Structured Relational Data Modeling' },
    { name: 'PostgreSQL', role: 'Enterprise ACID-Compliant Database' },
    { name: 'MongoDB', role: 'High-Velocity Distributed Document Storage' },
    { name: 'TensorFlow', role: 'Scalable Deep Learning Architectures' },
    { name: 'PyTorch', role: 'State-of-the-Art Neural Research & Modeling' },
    { name: 'OpenCV', role: 'Real-Time Computer Vision & Image Processing' },
    { name: 'YOLO', role: 'Sub-Millisecond Object Detection & Tracking' },
    { name: 'LLMs', role: 'Fine-Tuned Language Models & RAG Systems' },
    { name: 'Power BI', role: 'Executive Telemetry & BI Visualizations' },
    { name: 'APIs', role: 'RESTful, GraphQL & Streaming WebSockets' },
    { name: 'Cloud', role: 'AWS, Google Cloud & Hybrid Scalable Deployments' }
  ];

  // FAQs
  const faqs = [
    {
      q: 'What does VERHOST build?',
      a: 'VERHOST engineers complete digital systems: modern custom websites, machine learning models, predictive data pipelines, 24/7 autonomous AI chatbots, high-impact promotional advertising, and comprehensive creative identity systems.'
    },
    {
      q: 'What industries do you work with?',
      a: 'We partner with enterprise logistics, modern SaaS, manufacturing, real estate, professional services, healthcare, and retail businesses seeking measurable technical leverage and premium market positioning.'
    },
    {
      q: 'Can you build custom AI solutions?',
      a: 'Yes. We architect proprietary predictive forecasting engines, computer vision systems, recommendation models, and intelligent business process automation tailored specifically to your data assets.'
    },
    {
      q: 'Can you develop complete websites?',
      a: 'Absolutely. We design and develop bespoke, high-performance web platforms from scratch using React, Next.js, and robust APIs — ensuring microsecond speed, high conversion, and seamless mobile responsiveness.'
    },
    {
      q: 'Can you build AI chatbots?',
      a: 'Yes. We build context-aware, enterprise-grade conversational copilots integrated into WhatsApp, web portals, and CRM systems, powered by state-of-the-art LLMs trained on your internal documentation.'
    },
    {
      q: 'Can you provide analytics solutions?',
      a: 'We design end-to-end telemetry frameworks, data warehouses in PostgreSQL/SQL, and real-time interactive dashboards that translate raw operational numbers into actionable executive foresight.'
    },
    {
      q: 'Can you create promotional content?',
      a: 'Yes. We produce high-converting motion ads, digital campaign assets, and Swiss-inspired graphic typography that establish market authority and drive measurable customer acquisition.'
    },
    {
      q: 'How do we start a project?',
      a: 'Submit your inquiry via our online console or reach out directly to info.verhost@gmail.com / +91 93601 71336. Our engineering leads will schedule an introductory discovery session within 24 hours.'
    }
  ];

  useEffect(() => {
    // Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    const tickerCallback = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Scroll state for Navbar
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Hero sequential reveal animation on load
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      
      tl.from('#hero-eyebrow', { opacity: 0, y: -20, duration: 0.8, delay: 0.2 })
        .from('#hero-headline span.reveal-line', { opacity: 0, y: 40, stagger: 0.15, duration: 0.9 }, '-=0.4')
        .from('#hero-desc', { opacity: 0, y: 25, duration: 0.8 }, '-=0.5')
        .from('#hero-cta-group', { opacity: 0, y: 20, duration: 0.8 }, '-=0.5')
        .from('#hero-capability-bar', { opacity: 0, y: 15, duration: 0.7 }, '-=0.4')
        .from('#hero-scroll-indicator', { opacity: 0, duration: 1 }, '-=0.2');

      // Hero Parallax on Scroll
      if (heroBgRef.current) {
        gsap.fromTo(
          heroBgRef.current,
          { y: -50, scale: 1.12 },
          {
            y: 120,
            scale: 1.0,
            ease: 'none',
            scrollTrigger: {
              trigger: '#hero-section',
              start: 'top top',
              end: 'bottom top',
              scrub: 1.2
            }
          }
        );
      }

      // Parallax for Background Watermark Logo in CTA
      if (vhWatermarkRef.current) {
        gsap.fromTo(
          vhWatermarkRef.current,
          { scale: 0.9, opacity: 0.03, rotation: -2 },
          {
            scale: 1.08,
            opacity: 0.08,
            rotation: 2,
            ease: 'none',
            scrollTrigger: {
              trigger: '#final-cta-section',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5
            }
          }
        );
      }

      // Editorial reveal for Black Transition text
      gsap.fromTo(
        '.editorial-reveal-line',
        { opacity: 0.15, y: 25 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#transition-statement',
            start: 'top 75%',
            end: 'bottom 40%',
            scrub: 0.8
          }
        }
      );
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      lenis.destroy();
      gsap.ticker.remove(tickerCallback);
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = `*NEW PROJECT INQUIRY — VERHOST*\n\n` +
      `*Name:* ${formData.name}\n` +
      `*Email:* ${formData.email}\n` +
      `*Company:* ${formData.company || 'Not Specified'}\n` +
      `*Service Required:* ${formData.service}\n\n` +
      `*Project Details:*\n${formData.details}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919360171336?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
    }, 6000);
  };

  return (
    <div className="min-h-screen bg-white text-[#050505] selection:bg-[#16A34A] selection:text-white font-sans antialiased">
      
      {/* 4. PREMIUM NAVIGATION */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md border-b border-black/10 py-3.5 shadow-sm' 
            : 'bg-transparent border-b border-transparent py-5'
        }`}
      >
        <div className="max-w-[1360px] mx-auto px-6 sm:px-10 flex items-center justify-between">
          {/* Brand Monogram & Wordmark */}
          <a className="flex items-center gap-3.5 group" href="#">
            <img 
              alt="VERHOST Official Logo" 
              className="h-8 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
              src="/verhost-logo-transparent.png"
            />
            <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-[#050505] uppercase">
              VERHOST
            </span>
          </a>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-9 text-[12px] font-mono font-bold tracking-widest uppercase">
            <a className="text-[#050505]/75 hover:text-[#16A34A] transition-colors py-1" href="#services">SERVICES</a>
            <a className="text-[#050505]/75 hover:text-[#16A34A] transition-colors py-1" href="#solutions">SOLUTIONS</a>
            <a className="text-[#050505]/75 hover:text-[#16A34A] transition-colors py-1" href="#work">WORK</a>
            <a className="text-[#050505]/75 hover:text-[#16A34A] transition-colors py-1" href="#about">ABOUT</a>
            <a className="text-[#050505]/75 hover:text-[#16A34A] transition-colors py-1" href="#contact">CONTACT</a>
          </nav>

          {/* Right Action Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <a 
              className="hidden sm:inline-flex group items-center gap-2 px-5 py-2.5 bg-[#050505] text-white rounded-md text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 hover:bg-[#16A34A] hover:shadow-[0_8px_20px_rgba(22,163,74,0.3)]" 
              href="#contact"
            >
              <span>START A PROJECT</span>
              <span className="material-symbols-outlined text-sm transition-transform duration-200 group-hover:translate-x-1">arrow_forward</span>
            </a>
            <button 
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#050505] hover:text-[#16A34A] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              <span className="material-symbols-outlined text-2xl">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-black/10 bg-white/95 backdrop-blur-xl px-6 py-6 flex flex-col space-y-4 font-mono text-xs font-bold uppercase tracking-wider">
            <a className="py-2 text-[#050505] hover:text-[#16A34A] border-b border-black/5" href="#services" onClick={() => setMobileMenuOpen(false)}>SERVICES</a>
            <a className="py-2 text-[#050505] hover:text-[#16A34A] border-b border-black/5" href="#solutions" onClick={() => setMobileMenuOpen(false)}>SOLUTIONS</a>
            <a className="py-2 text-[#050505] hover:text-[#16A34A] border-b border-black/5" href="#work" onClick={() => setMobileMenuOpen(false)}>WORK</a>
            <a className="py-2 text-[#050505] hover:text-[#16A34A] border-b border-black/5" href="#about" onClick={() => setMobileMenuOpen(false)}>ABOUT</a>
            <a className="py-2 text-[#050505] hover:text-[#16A34A] border-b border-black/5" href="#contact" onClick={() => setMobileMenuOpen(false)}>CONTACT</a>
            <a 
              className="inline-flex items-center justify-center gap-2 py-3 bg-[#050505] text-white rounded-md text-xs font-mono font-bold tracking-wider" 
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>START A PROJECT</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>
        )}
      </header>

      {/* 3. HERO — CINEMATIC TECHNOLOGY FLAGSHIP */}
      <section 
        id="hero-section" 
        className="relative w-full min-h-[92vh] sm:min-h-screen flex items-center justify-center px-6 sm:px-10 lg:px-16 pt-32 pb-24 overflow-hidden bg-[#050B06] border-b border-black/20"
      >
        {/* Parallax Background Visual */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div ref={heroBgRef} className="w-full h-[160%] -top-[30%] absolute will-change-transform">
            <img 
              alt="Technology infrastructure and digital tree circuit systems" 
              className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.2]" 
              src="/hero-bg.jpg"
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050B06]/85 via-[#050D07]/60 to-[#050B06]/95"></div>
            <div className="absolute inset-0 bg-[radial-gradient(#19C763_1px,transparent_1px)] [background-size:40px_40px] opacity-15"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#16A34A]/20 rounded-full blur-[180px]"></div>
          </div>
        </div>

        {/* Hero Narrative Composition */}
        <div ref={heroContentRef} className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
          
          {/* Eyebrow */}
          <div id="hero-eyebrow" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#16A34A]/50 mb-8 shadow-[0_0_20px_rgba(22,163,74,0.25)]">
            <span className="w-2 h-2 rounded-full bg-[#19C763] animate-pulse"></span>
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#19C763]">
              SOVEREIGN DIGITAL ENGINEERING &amp; ARTIFICIAL INTELLIGENCE
            </span>
          </div>

          {/* Headline */}
          <h1 id="hero-headline" className="font-display font-extrabold text-[48px] sm:text-[76px] lg:text-[96px] leading-[0.95] tracking-tight uppercase text-white mb-8 drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
            <span className="reveal-line block">YOUR BUSINESS.</span>
            <span className="reveal-line block">
              <span className="text-[#19C763] drop-shadow-[0_0_35px_rgba(25,199,99,0.7)]">POWERED BY</span> TECHNOLOGY.
            </span>
          </h1>

          {/* Supporting Copy */}
          <p id="hero-desc" className="text-base sm:text-xl text-white/90 max-w-2xl mb-12 leading-relaxed font-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
            We build digital experiences, intelligent systems and data-driven solutions that move businesses forward.
          </p>

          {/* Action CTAs */}
          <div id="hero-cta-group" className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <a 
              className="group inline-flex items-center gap-2.5 px-8 py-4 bg-[#16A34A] text-white rounded-md text-xs sm:text-sm font-mono font-bold tracking-wider uppercase transition-all duration-300 hover:bg-[#19C763] shadow-[0_10px_30px_rgba(22,163,74,0.4)] hover:shadow-[0_12px_35px_rgba(25,199,99,0.6)]" 
              href="#contact"
            >
              <span>START A PROJECT</span>
              <span className="material-symbols-outlined text-base transition-transform duration-200 group-hover:translate-x-1">arrow_forward</span>
            </a>
            <a 
              className="inline-flex items-center gap-2 px-8 py-4 bg-black/60 backdrop-blur-md border border-[#16A34A]/50 text-white rounded-md text-xs sm:text-sm font-mono font-bold tracking-wider uppercase hover:bg-white hover:text-black hover:border-white transition-all duration-200 shadow-md" 
              href="#services"
            >
              <span>EXPLORE SERVICES</span>
            </a>
          </div>

          {/* Capability Bar */}
          <div id="hero-capability-bar" className="w-full max-w-2xl pt-6 border-t border-white/20 flex flex-wrap items-center justify-center gap-y-2 text-xs font-mono font-bold text-white tracking-widest uppercase">
            <span>WEB</span>
            <span className="mx-3 w-1.5 h-1.5 rounded-full bg-[#19C763] shadow-[0_0_8px_#19C763]"></span>
            <span>AI</span>
            <span className="mx-3 w-1.5 h-1.5 rounded-full bg-[#19C763] shadow-[0_0_8px_#19C763]"></span>
            <span>DATA</span>
            <span className="mx-3 w-1.5 h-1.5 rounded-full bg-[#19C763] shadow-[0_0_8px_#19C763]"></span>
            <span>CREATIVE</span>
            <span className="mx-3 w-1.5 h-1.5 rounded-full bg-[#19C763] shadow-[0_0_8px_#19C763]"></span>
            <span>AUTOMATION</span>
          </div>

          {/* Subtle Scroll Indicator */}
          <div id="hero-scroll-indicator" className="mt-14 flex flex-col items-center gap-2 text-white/50 hover:text-white transition-colors cursor-pointer" onClick={() => {
            document.getElementById('approach')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#19C763]">SCROLL DOWN</span>
            <span className="material-symbols-outlined text-sm animate-bounce text-[#19C763]">keyboard_double_arrow_down</span>
          </div>
        </div>
      </section>

      {/* 5. INTRODUCTION — LARGE EDITORIAL STATEMENT (NO CARDS) */}
      <section id="approach" className="w-full bg-[#FFFFFF] px-6 sm:px-10 lg:px-16 py-32 sm:py-40 border-b border-black/10">
        <div className="max-w-[1360px] mx-auto">
          {/* Small Label */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2.5 h-2.5 bg-[#16A34A]"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A]">
              THE VERHOST APPROACH
            </span>
          </div>

          {/* Huge Headline */}
          <div className="max-w-5xl">
            <h2 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-[76px] leading-[1.0] tracking-tight uppercase text-[#050505] mb-10">
              TECHNOLOGY<br />
              SHOULD SOLVE<br />
              REAL PROBLEMS.
            </h2>
            
            <div className="w-24 h-[2px] bg-[#16A34A] mb-8"></div>

            <p className="text-xl sm:text-2xl lg:text-3xl text-black/75 font-normal leading-relaxed max-w-3xl">
              We combine technology, creativity and intelligence to build practical solutions for modern businesses.
            </p>
          </div>
        </div>
      </section>

      {/* 6. SERVICES — VERTICAL EXPERIENCE (ALTERNATING EDITORIAL CASE STUDIES) */}
      <section id="services" className="w-full bg-[#FAFAF7] px-6 sm:px-10 lg:px-16 py-32 sm:py-40 border-b border-black/10">
        <div className="max-w-[1360px] mx-auto">
          
          {/* Header */}
          <div className="max-w-3xl mb-24">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A]">WHAT WE DO</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight uppercase text-[#050505] mb-4">
              TECHNOLOGY BUILT AROUND YOUR BUSINESS.
            </h2>
            <p className="text-base sm:text-lg text-black/60">
              Six core competencies engineered as scalable, interconnected business advantages.
            </p>
          </div>

          {/* Vertical Editorial Services (Alternating Left/Right) */}
          <div className="space-y-28 sm:space-y-36">
            {services.map((srv, idx) => {
              const isEven = idx % 2 === 1;
              return (
                <div 
                  key={srv.num}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center ${
                    isEven ? 'lg:grid-flow-dense' : ''
                  }`}
                >
                  {/* Service Visual Column */}
                  <div className={`lg:col-span-6 ${isEven ? 'lg:col-start-7' : ''}`}>
                    <div className="relative overflow-hidden rounded-md group border border-black/10 shadow-sm aspect-[16/10] bg-black/5">
                      <img 
                        alt={srv.alt} 
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter grayscale-[20%] group-hover:grayscale-0"
                        src={srv.image}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                      
                      {/* Floating Indicator Badge */}
                      <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-3 py-1 bg-black/80 backdrop-blur-md rounded border border-white/20 text-white font-mono text-[11px] uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#19C763]"></span>
                        <span>ENTERPRISE SYSTEM</span>
                      </div>
                    </div>
                  </div>

                  {/* Service Text Column */}
                  <div className={`lg:col-span-6 ${isEven ? 'lg:col-start-1' : ''} flex flex-col justify-center`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#16A34A]">{srv.num}</span>
                      <span className="w-8 h-[1px] bg-[#16A34A]"></span>
                    </div>

                    <h3 className="font-display font-extrabold text-2xl sm:text-4xl text-[#050505] uppercase tracking-tight mb-2">
                      {srv.title}
                    </h3>
                    
                    <p className="font-mono text-sm sm:text-base font-semibold text-[#16A34A] uppercase tracking-wider mb-5">
                      {srv.tagline}
                    </p>

                    <p className="text-base sm:text-lg text-black/70 leading-relaxed mb-6 font-normal">
                      {srv.description}
                    </p>

                    {/* Deliverables Taxonomy */}
                    <div className="mb-8 pt-4 border-t border-black/10">
                      <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-black/50 mb-3">CORE DELIVERABLES</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-black/80">
                        {srv.deliverables.map((item, dIdx) => (
                          <div key={dIdx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <a 
                        className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#050505] hover:text-[#16A34A] transition-colors group" 
                        href="#contact"
                      >
                        <span>DISCUSS {srv.title}</span>
                        <span className="material-symbols-outlined text-sm transition-transform duration-200 group-hover:translate-x-1">arrow_forward</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 7. STRONG BLACK TRANSITION STATEMENT */}
      <section id="transition-statement" className="w-full bg-[#050505] text-white px-6 sm:px-10 lg:px-16 py-36 sm:py-48 border-y border-white/10 relative overflow-hidden">
        {/* Subtle Ambient Emerald Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#16A34A]/10 rounded-full blur-[160px] pointer-events-none"></div>

        <div className="max-w-[1360px] mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-2.5 h-2.5 bg-[#19C763] shadow-[0_0_10px_#19C763]"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#19C763]">PHILOSOPHY IN ACTION</span>
          </div>

          <div className="max-w-5xl">
            <h2 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-[84px] leading-[0.98] tracking-tight uppercase text-white mb-10">
              <span className="editorial-reveal-line block">GOOD TECHNOLOGY</span>
              <span className="editorial-reveal-line block text-white/90">DISAPPEARS INTO</span>
              <span className="editorial-reveal-line block text-[#19C763] drop-shadow-[0_0_30px_rgba(25,199,99,0.5)]">GOOD BUSINESS.</span>
            </h2>

            <div className="w-24 h-[2px] bg-[#19C763] mb-8"></div>

            <p className="text-lg sm:text-xl text-white/70 font-normal leading-relaxed max-w-2xl font-sans">
              When software, artificial intelligence, and workflows are engineered with rigorous precision, complexity fades into frictionless, compounding growth.
            </p>
          </div>
        </div>
      </section>

      {/* 8. BUSINESS PROBLEM -> SOLUTION TRANSFORMATION */}
      <section id="solutions" className="w-full bg-[#FFFFFF] px-6 sm:px-10 lg:px-16 py-32 sm:py-40 border-b border-black/10">
        <div className="max-w-[1360px] mx-auto">
          
          <div className="max-w-4xl mb-20">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A]">PROBLEM RESOLUTION MATRIX</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight uppercase text-[#050505] mb-4">
              WE DON'T JUST BUILD TECHNOLOGY.<br />WE SOLVE PROBLEMS.
            </h2>
            <p className="text-base sm:text-lg text-black/60 max-w-2xl">
              Every friction point in modern enterprise operations maps to an engineered technological breakthrough.
            </p>
          </div>

          {/* Transformation Matrix Rows */}
          <div className="divide-y divide-black/10 border-y border-black/10">
            {transformations.map((item, index) => (
              <div 
                key={index}
                className="py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center group hover:bg-[#FAFAF7] transition-colors px-4 -mx-4 rounded"
              >
                {/* Problem -> Solution Pair */}
                <div className="lg:col-span-6 flex flex-wrap items-center gap-3 sm:gap-5">
                  <span className="font-mono text-xs text-black/40 font-bold">0{index + 1}</span>
                  <span className="font-display font-bold text-lg sm:text-2xl uppercase tracking-tight text-black/50 group-hover:text-black transition-colors">
                    {item.problem}
                  </span>
                  <span className="material-symbols-outlined text-[#16A34A] text-xl transition-transform duration-300 group-hover:translate-x-2">
                    east
                  </span>
                  <span className="font-display font-extrabold text-lg sm:text-2xl uppercase tracking-tight text-[#050505] group-hover:text-[#16A34A] transition-colors">
                    {item.solution}
                  </span>
                </div>

                {/* Impact Statement */}
                <div className="lg:col-span-4 text-xs sm:text-sm text-black/70 leading-relaxed font-sans">
                  {item.impact}
                </div>

                {/* Verified Metric Badge */}
                <div className="lg:col-span-2 lg:text-right">
                  <span className="inline-block px-3 py-1 bg-black/5 font-mono text-[11px] font-bold text-[#16A34A] uppercase tracking-wider rounded border border-black/5">
                    {item.metric}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. SELECTED WORK — US AGENCY STYLE (VARIED ASYMMETRIC LAYOUTS) */}
      <section id="work" className="w-full bg-[#FAFAF7] px-6 sm:px-10 lg:px-16 py-32 sm:py-40 border-b border-black/10">
        <div className="max-w-[1360px] mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A]">SELECTED WORK</span>
              </div>
              <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight uppercase text-[#050505]">
                BUILT FOR REAL BUSINESSES.
              </h2>
            </div>
            <p className="text-sm sm:text-base text-black/60 max-w-md">
              A curated portfolio of high-impact production engineering, custom AI architectures, and digital transformations.
            </p>
          </div>

          {/* Project 01: Full-Width Showcase Layout */}
          <div className="mb-24 pb-20 border-b border-black/10">
            <div className="relative w-full aspect-[21/9] rounded-md overflow-hidden border border-black/10 mb-8 group bg-black">
              <img 
                alt="AURA Logistics platform"
                className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-700"
                src={projects[0].image}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4 text-white">
                <div>
                  <span className="font-mono text-xs text-[#19C763] uppercase tracking-widest block mb-1">CASE STUDY 01</span>
                  <h3 className="font-display font-extrabold text-2xl sm:text-4xl uppercase">{projects[0].title}</h3>
                </div>
                <div className="font-mono text-xs text-white/80 bg-black/60 px-4 py-2 rounded backdrop-blur-md border border-white/20">
                  {projects[0].impact}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 font-display font-bold text-xl sm:text-2xl text-[#050505] uppercase">
                {projects[0].statement}
              </div>
              <div className="lg:col-span-4 font-mono text-xs text-black/60 space-y-1">
                <div><strong className="text-black">INDUSTRY:</strong> {projects[0].industry}</div>
                <div><strong className="text-black">STACK:</strong> {projects[0].tech}</div>
              </div>
              <div className="lg:col-span-3 lg:text-right">
                <a className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#050505] hover:text-[#16A34A] transition-colors group" href="#contact">
                  <span>VIEW CASE STUDY</span>
                  <span className="material-symbols-outlined text-sm transition-transform duration-200 group-hover:translate-x-1">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>

          {/* Project 02 & 03: Asymmetric Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-24 pb-20 border-b border-black/10">
            
            {/* Project 02: Large Portrait Layout */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div className="aspect-[4/3] rounded-md overflow-hidden border border-black/10 mb-6 group bg-black">
                <img 
                  alt="KINETIC NEURAL"
                  className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-700"
                  src={projects[1].image}
                  loading="lazy"
                />
              </div>
              <div>
                <span className="font-mono text-xs text-[#16A34A] uppercase tracking-widest block mb-1">CASE STUDY 02</span>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#050505] uppercase mb-2">{projects[1].title}</h3>
                <p className="text-sm text-black/70 mb-4">{projects[1].statement}</p>
                <div className="font-mono text-xs text-black/60 mb-4">
                  <div><strong>INDUSTRY:</strong> {projects[1].industry}</div>
                  <div><strong>STACK:</strong> {projects[1].tech}</div>
                </div>
                <a className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#050505] hover:text-[#16A34A] transition-colors group" href="#contact">
                  <span>VIEW CASE STUDY</span>
                  <span className="material-symbols-outlined text-sm transition-transform duration-200 group-hover:translate-x-1">arrow_forward</span>
                </a>
              </div>
            </div>

            {/* Project 03: Split Screen Architectural Layout */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div className="aspect-[4/3] rounded-md overflow-hidden border border-black/10 mb-6 group bg-black">
                <img 
                  alt="SYNAPSE COPILOT"
                  className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-700"
                  src={projects[2].image}
                  loading="lazy"
                />
              </div>
              <div>
                <span className="font-mono text-xs text-[#16A34A] uppercase tracking-widest block mb-1">CASE STUDY 03</span>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#050505] uppercase mb-2">{projects[2].title}</h3>
                <p className="text-sm text-black/70 mb-4">{projects[2].statement}</p>
                <div className="font-mono text-xs text-black/60 mb-4">
                  <div><strong>INDUSTRY:</strong> {projects[2].industry}</div>
                  <div><strong>STACK:</strong> {projects[2].tech}</div>
                </div>
                <a className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#050505] hover:text-[#16A34A] transition-colors group" href="#contact">
                  <span>VIEW CASE STUDY</span>
                  <span className="material-symbols-outlined text-sm transition-transform duration-200 group-hover:translate-x-1">arrow_forward</span>
                </a>
              </div>
            </div>

          </div>

          {/* Project 04: Horizontal Composition */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <span className="font-mono text-xs text-[#16A34A] uppercase tracking-widest block mb-1">CASE STUDY 04</span>
              <h3 className="font-display font-extrabold text-2xl sm:text-4xl text-[#050505] uppercase mb-3">{projects[3].title}</h3>
              <p className="text-base text-black/70 mb-4">{projects[3].statement}</p>
              <div className="font-mono text-xs text-black/60 space-y-1 mb-6">
                <div><strong>INDUSTRY:</strong> {projects[3].industry}</div>
                <div><strong>STACK:</strong> {projects[3].tech}</div>
                <div><strong>MEASURED IMPACT:</strong> {projects[3].impact}</div>
              </div>
              <a className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#050505] hover:text-[#16A34A] transition-colors group" href="#contact">
                <span>VIEW CASE STUDY</span>
                <span className="material-symbols-outlined text-sm transition-transform duration-200 group-hover:translate-x-1">arrow_forward</span>
              </a>
            </div>
            <div className="lg:col-span-7">
              <div className="aspect-[16/9] rounded-md overflow-hidden border border-black/10 group bg-black">
                <img 
                  alt="NEXUS BRANDING"
                  className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-700"
                  src={projects[3].image}
                  loading="lazy"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 10. CAPABILITIES SECTION (MASSIVE EDITORIAL TYPOGRAPHY + VISUAL PREVIEWS) */}
      <section id="capabilities" className="w-full bg-[#FFFFFF] px-6 sm:px-10 lg:px-16 py-32 sm:py-40 border-b border-black/10">
        <div className="max-w-[1360px] mx-auto">
          
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A]">TECHNICAL DOMAINS</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight uppercase text-[#050505] mb-16">
            CAPABILITIES
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Interactive Massive Typography List */}
            <div className="lg:col-span-8 divide-y divide-black/10 border-y border-black/10">
              {capabilities.map((cap, idx) => {
                const isActive = activeCapability === idx;
                return (
                  <div 
                    key={cap.tag}
                    onMouseEnter={() => setActiveCapability(idx)}
                    onClick={() => setActiveCapability(idx)}
                    className={`py-8 sm:py-10 transition-all duration-300 cursor-pointer ${
                      isActive ? 'bg-[#FAFAF7] px-6 -mx-6 rounded' : ''
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                      <div className="flex items-baseline gap-4">
                        <span className="font-mono text-xs text-black/40 font-bold">0{idx + 1}</span>
                        <h3 className={`font-display font-extrabold text-4xl sm:text-6xl uppercase tracking-tighter transition-all duration-300 ${
                          isActive ? 'text-[#16A34A] scale-[1.03] origin-left' : 'text-[#050505]'
                        }`}>
                          {cap.tag}
                        </h3>
                      </div>

                      <div className="max-w-xs">
                        <p className="font-display font-bold text-sm sm:text-base text-[#050505] mb-1 uppercase">
                          {cap.headline}
                        </p>
                        <p className="text-xs text-black/60 leading-relaxed">
                          {cap.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dynamic Sticky Visual Preview on Desktop */}
            <div className="hidden lg:block lg:col-span-4 sticky top-28">
              <div className="rounded-md overflow-hidden border border-black/10 shadow-sm bg-black aspect-[4/3] relative group">
                <img 
                  alt={capabilities[activeCapability].tag}
                  className="w-full h-full object-cover transition-all duration-500 filter contrast-[1.1]"
                  src={capabilities[activeCapability].image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white font-mono text-xs">
                  <div className="text-[#19C763] font-bold uppercase tracking-wider mb-1">CAPABILITY ARCHITECTURE</div>
                  <div className="font-sans font-bold text-base uppercase">{capabilities[activeCapability].headline}</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 11. WHY VERHOST (BUILT DIFFERENTLY + HOVER VISUAL PREVIEW) */}
      <section id="why" className="w-full bg-[#FAFAF7] px-6 sm:px-10 lg:px-16 py-32 sm:py-40 border-b border-black/10">
        <div className="max-w-[1360px] mx-auto">
          
          <div className="max-w-3xl mb-20">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A]">WHY VERHOST</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight uppercase text-[#050505] mb-4">
              BUILT DIFFERENTLY.
            </h2>
            <p className="text-base sm:text-lg text-black/60">
              Four fundamental operating principles that ensure technical rigor and commercial victory.
            </p>
          </div>

          {/* Numbered Rows with Thin Hairline Dividers */}
          <div className="divide-y divide-black/10 border-y border-black/10">
            {principles.map((pr, idx) => {
              const isSelected = activeWhy === idx;
              return (
                <div 
                  key={pr.num}
                  onMouseEnter={() => setActiveWhy(idx)}
                  onClick={() => setActiveWhy(idx)}
                  className={`py-10 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center cursor-pointer transition-colors px-6 -mx-6 rounded ${
                    isSelected ? 'bg-white shadow-sm' : 'hover:bg-white/60'
                  }`}
                >
                  <div className="lg:col-span-1 font-mono text-xs font-bold text-[#16A34A]">
                    {pr.num}
                  </div>
                  <div className="lg:col-span-4">
                    <h3 className={`font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight transition-colors ${
                      isSelected ? 'text-[#16A34A]' : 'text-[#050505]'
                    }`}>
                      {pr.title}
                    </h3>
                  </div>
                  <div className="lg:col-span-5">
                    <p className="text-base sm:text-lg text-black/70 leading-relaxed font-normal">
                      {pr.desc}
                    </p>
                  </div>
                  <div className="lg:col-span-2 hidden lg:flex justify-end">
                    <div className="w-20 h-14 rounded overflow-hidden border border-black/10 relative">
                      <img alt={pr.title} src={pr.image} className="w-full h-full object-cover filter grayscale" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 12. PROCESS (FROM IDEA TO IMPACT) */}
      <section id="process" className="w-full bg-[#FFFFFF] px-6 sm:px-10 lg:px-16 py-32 sm:py-40 border-b border-black/10">
        <div className="max-w-[1360px] mx-auto">
          
          <div className="max-w-3xl mb-20">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A]">DEPLOYMENT METHODOLOGY</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight uppercase text-[#050505] mb-4">
              FROM IDEA TO IMPACT.
            </h2>
            <p className="text-base sm:text-lg text-black/60">
              A disciplined, six-stage lifecycle engineered for predictability, transparency, and rapid delivery.
            </p>
          </div>

          {/* Interactive Timeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processSteps.map((step, idx) => {
              const isCurrent = activeProcess === idx;
              return (
                <div 
                  key={step.num}
                  onClick={() => setActiveProcess(idx)}
                  className={`p-8 border rounded-md transition-all duration-300 cursor-pointer ${
                    isCurrent 
                      ? 'border-[#16A34A] bg-[#FAFAF7] shadow-sm' 
                      : 'border-black/10 hover:border-black/30 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className={`font-mono text-sm font-bold ${isCurrent ? 'text-[#16A34A]' : 'text-black/40'}`}>
                      {step.num}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-[#16A34A] shadow-[0_0_8px_#16A34A]' : 'bg-black/10'}`}></span>
                  </div>

                  <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[#050505] uppercase mb-3">
                    {step.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-black/60 leading-relaxed font-sans">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 13. TECHNOLOGY ECOSYSTEM (TYPOGRAPHY MATRIX + HOVER DESCRIPTIONS) */}
      <section id="technology" className="w-full bg-[#FAFAF7] px-6 sm:px-10 lg:px-16 py-32 sm:py-40 border-b border-black/10">
        <div className="max-w-[1360px] mx-auto">
          
          <div className="max-w-3xl mb-16">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A]">ENGINEERING STACK</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight uppercase text-[#050505] mb-4">
              BUILT WITH MODERN TECHNOLOGY.
            </h2>
            <p className="text-base sm:text-lg text-black/60">
              Modern programming languages, deep learning frameworks, and scalable cloud primitives.
            </p>
          </div>

          {/* Interactive Typography Ecosystem Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {technologies.map((t) => {
              const isHovered = hoveredTech === t.name;
              return (
                <div 
                  key={t.name}
                  onMouseEnter={() => setHoveredTech(t.name)}
                  onMouseLeave={() => setHoveredTech(null)}
                  className={`p-6 bg-white border rounded-md transition-all duration-200 cursor-default ${
                    isHovered ? 'border-[#16A34A] shadow-sm' : 'border-black/10 hover:border-black/30'
                  }`}
                >
                  <div className={`font-mono text-lg sm:text-xl font-bold uppercase tracking-tight transition-colors mb-2 ${
                    isHovered ? 'text-[#16A34A]' : 'text-[#050505]'
                  }`}>
                    {t.name}
                  </div>
                  <div className={`text-[11px] font-mono transition-colors ${
                    isHovered ? 'text-black font-semibold' : 'text-black/60'
                  }`}>
                    {t.role}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 14. ABOUT VERHOST (STRONG COMPANY STORY + ARCHITECTURAL IMAGERY) */}
      <section id="about" className="w-full bg-[#FFFFFF] px-6 sm:px-10 lg:px-16 py-32 sm:py-40 border-b border-black/10">
        <div className="max-w-[1360px] mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Story Copy */}
            <div className="lg:col-span-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A]">ABOUT VERHOST</span>
              </div>

              <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight uppercase text-[#050505] mb-8">
                WE BUILD WHAT COMES NEXT.
              </h2>

              <p className="text-lg sm:text-xl text-black/80 font-normal leading-relaxed mb-6 font-sans">
                VERHOST is a technology and creative solutions company focused on helping businesses build stronger digital operations through web, AI, data and intelligent systems.
              </p>

              <p className="text-sm sm:text-base text-black/60 leading-relaxed mb-8">
                Founded on the premise that cutting-edge software engineering and disciplined visual art direction must operate as one, we deliver scalable digital leverage to forward-looking organizations globally.
              </p>

              {/* Company Metrics Row */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-black/10 font-mono">
                <div>
                  <div className="font-extrabold text-2xl sm:text-3xl text-[#16A34A]">99.9%</div>
                  <div className="text-[11px] text-black/50 uppercase mt-1">Platform Uptime</div>
                </div>
                <div>
                  <div className="font-extrabold text-2xl sm:text-3xl text-[#16A34A]">4.8x</div>
                  <div className="text-[11px] text-black/50 uppercase mt-1">Average ROI</div>
                </div>
                <div>
                  <div className="font-extrabold text-2xl sm:text-3xl text-[#16A34A]">24/7</div>
                  <div className="text-[11px] text-black/50 uppercase mt-1">Autonomous Ops</div>
                </div>
              </div>
            </div>

            {/* Single Large Architectural Visual */}
            <div className="lg:col-span-6">
              <div className="aspect-[4/3] rounded-md overflow-hidden border border-black/10 shadow-sm relative bg-black">
                <img 
                  alt="Modern architectural glass engineering workspace"
                  className="w-full h-full object-cover filter grayscale-[15%]"
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop"
                  loading="lazy"
                />
                <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded border border-white/20 text-white font-mono text-[10px] uppercase tracking-wider">
                  VERHOST GLOBAL INFRASTRUCTURE
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 15. FAQ — MINIMAL EDITORIAL ACCORDION (NO CARDS) */}
      <section id="faq" className="w-full bg-[#FAFAF7] px-6 sm:px-10 lg:px-16 py-32 sm:py-40 border-b border-black/10">
        <div className="max-w-[1360px] mx-auto">
          
          <div className="max-w-3xl mb-16">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A]">CLARITY &amp; GOVERNANCE</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight uppercase text-[#050505] mb-4">
              FREQUENTLY ASKED QUESTIONS.
            </h2>
            <p className="text-base sm:text-lg text-black/60">
              Clear answers regarding our engagement models, technical delivery, and capabilities.
            </p>
          </div>

          {/* Accordion List */}
          <div className="divide-y divide-black/10 border-y border-black/10">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="py-6 sm:py-8 transition-colors">
                  <button 
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full text-left flex items-center justify-between gap-4 group focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display font-extrabold text-lg sm:text-xl text-[#050505] uppercase tracking-tight group-hover:text-[#16A34A] transition-colors">
                      {faq.q}
                    </span>
                    <span className="material-symbols-outlined text-black/40 group-hover:text-[#16A34A] transition-transform duration-300 text-2xl flex-shrink-0" style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}>
                      add
                    </span>
                  </button>

                  {isOpen && (
                    <div className="mt-4 pt-2 text-sm sm:text-base text-black/70 leading-relaxed font-sans max-w-3xl">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 16. FINAL CTA — DRAMATIC OBSIDIAN WITH SUBTLE SCALING VH WATERMARK */}
      <section id="final-cta-section" className="relative w-full bg-[#050505] text-white px-6 sm:px-10 lg:px-16 py-36 sm:py-48 border-b border-white/10 overflow-hidden text-center flex flex-col items-center justify-center">
        
        {/* Subtle Scaling VH Logo Watermark in Background */}
        <div 
          ref={vhWatermarkRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none will-change-transform"
        >
          <img 
            alt="VH Watermark" 
            src="/verhost-logo-white.png" 
            className="w-[850px] sm:w-[1100px] h-auto object-contain opacity-5 filter brightness-100"
          />
        </div>

        {/* Ambient Emerald Pulse */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#16A34A]/15 rounded-full blur-[180px] pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 font-mono text-[11px] text-[#19C763] uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#19C763] animate-pulse"></span>
            <span>NEXT STEPS</span>
          </div>

          <h2 className="font-display font-extrabold text-4xl sm:text-7xl lg:text-[88px] leading-[0.95] tracking-tight uppercase text-white mb-8">
            HAVE AN IDEA?<br />
            <span className="text-[#19C763] drop-shadow-[0_0_35px_rgba(25,199,99,0.5)]">LET'S BUILD IT.</span>
          </h2>

          <p className="text-lg sm:text-2xl text-white/80 font-normal leading-relaxed mb-12 max-w-xl">
            Tell us what you're trying to solve.
          </p>

          <a 
            className="group inline-flex items-center gap-3 px-10 py-5 bg-[#16A34A] text-white rounded-md text-xs sm:text-sm font-mono font-bold tracking-wider uppercase transition-all duration-300 hover:bg-[#19C763] shadow-[0_12px_35px_rgba(22,163,74,0.4)] hover:shadow-[0_15px_45px_rgba(25,199,99,0.7)]" 
            href="#contact"
          >
            <span>START A PROJECT</span>
            <span className="material-symbols-outlined text-lg transition-transform duration-200 group-hover:translate-x-1">arrow_forward</span>
          </a>
        </div>
      </section>

      {/* 17. CONTACT — SLEEK HIGH-CONTRAST CONSOLE WITH DIRECT WHATSAPP */}
      <section id="contact" className="w-full bg-[#FFFFFF] px-6 sm:px-10 lg:px-16 py-32 sm:py-40 border-b border-black/10">
        <div className="max-w-[1360px] mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            
            {/* Left Column: Direct Contact & Channel Details */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A]">INITIATE ENGAGEMENT</span>
                </div>

                <h2 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight uppercase text-[#050505] mb-8">
                  LET'S TALK.
                </h2>

                <p className="text-base sm:text-lg text-black/70 leading-relaxed mb-10 font-normal">
                  Whether you are architecting a new product from zero or elevating an existing technological operation, our engineering leads are ready to collaborate.
                </p>

                <div className="space-y-6 pt-6 border-t border-black/10 font-mono text-sm">
                  <div>
                    <div className="text-[11px] text-black/40 font-bold uppercase tracking-wider mb-1">OFFICIAL INQUIRY EMAIL</div>
                    <a href="mailto:info.verhost@gmail.com" className="text-lg font-bold text-[#050505] hover:text-[#16A34A] transition-colors">
                      info.verhost@gmail.com
                    </a>
                  </div>

                  <div>
                    <div className="text-[11px] text-black/40 font-bold uppercase tracking-wider mb-1">DIRECT TELEPHONE &amp; WHATSAPP</div>
                    <a href="https://wa.me/919360171336" target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-[#050505] hover:text-[#16A34A] transition-colors">
                      +91 93601 71336
                    </a>
                  </div>

                  <div>
                    <div className="text-[11px] text-black/40 font-bold uppercase tracking-wider mb-1">HEADQUARTERS &amp; AVAILABILITY</div>
                    <div className="text-base text-black/80 font-bold">
                      Global Remote Deployment • Response within 24h
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="pt-8 mt-8 border-t border-black/10 inline-flex items-center gap-2.5 font-mono text-xs text-black/70">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
                <span>SYSTEM STATUS: ACCEPTING Q3 / Q4 CLIENT PROJECTS</span>
              </div>
            </div>

            {/* Right Column: Clean Hairline Inquiry Form */}
            <div className="lg:col-span-7 bg-[#FAFAF7] border border-black/10 rounded-md p-8 sm:p-12 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-black/70 mb-2">
                      YOUR NAME *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white border border-black/15 rounded px-4 py-3 text-sm text-[#050505] placeholder-black/30 focus:outline-none focus:border-[#16A34A] transition-colors font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-black/70 mb-2">
                      BUSINESS EMAIL *
                    </label>
                    <input 
                      type="email" 
                      required
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-white border border-black/15 rounded px-4 py-3 text-sm text-[#050505] placeholder-black/30 focus:outline-none focus:border-[#16A34A] transition-colors font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-black/70 mb-2">
                      COMPANY / ORGANIZATION
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Acme Corp"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full bg-white border border-black/15 rounded px-4 py-3 text-sm text-[#050505] placeholder-black/30 focus:outline-none focus:border-[#16A34A] transition-colors font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-black/70 mb-2">
                      REQUIRED SERVICE *
                    </label>
                    <select 
                      value={formData.service}
                      onChange={(e) => setFormData({...formData, service: e.target.value})}
                      className="w-full bg-white border border-black/15 rounded px-4 py-3 text-sm text-[#050505] focus:outline-none focus:border-[#16A34A] transition-colors font-sans"
                    >
                      <option value="Web Development">01 / Web Development</option>
                      <option value="AI & Machine Learning">02 / AI &amp; Machine Learning</option>
                      <option value="Data Analytics">03 / Data Analytics &amp; Reporting</option>
                      <option value="AI Chatbots">04 / AI Chatbot Creation</option>
                      <option value="Promotion Ads Generation">05 / Promotion Ads Generation</option>
                      <option value="Posters & Creative Design">06 / Posters &amp; Creative Design</option>
                      <option value="Full Comprehensive Suite">Full Comprehensive Suite</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-black/70 mb-2">
                    PROJECT DETAILS *
                  </label>
                  <textarea 
                    rows={4}
                    required
                    placeholder="Briefly describe your objectives, existing architecture, and timeline..."
                    value={formData.details}
                    onChange={(e) => setFormData({...formData, details: e.target.value})}
                    className="w-full bg-white border border-black/15 rounded px-4 py-3 text-sm text-[#050505] placeholder-black/30 focus:outline-none focus:border-[#16A34A] transition-colors font-sans"
                  ></textarea>
                </div>

                <div>
                  <button 
                    type="submit"
                    className="w-full group inline-flex items-center justify-center gap-2 py-4 bg-[#050505] text-white rounded font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:bg-[#16A34A] hover:shadow-[0_8px_25px_rgba(22,163,74,0.3)]"
                  >
                    <span>SEND INQUIRY</span>
                    <span className="material-symbols-outlined text-sm transition-transform duration-200 group-hover:translate-x-1">arrow_forward</span>
                  </button>
                  <p className="mt-3 text-[11px] font-mono text-black/50 text-center">
                    Submissions route directly to VERHOST Engineering via WhatsApp (+91 93601 71336).
                  </p>
                </div>

                {formSubmitted && (
                  <div className="p-4 bg-[#16A34A]/10 border border-[#16A34A]/30 rounded text-center text-xs font-mono text-[#16A34A] font-bold">
                    Inquiry dispatched! Opening WhatsApp channel...
                  </div>
                )}

              </form>
            </div>

          </div>

        </div>
      </section>

      {/* 18. MONOLITHIC BRAND FOOTER */}
      <footer className="w-full bg-[#050505] text-white px-6 sm:px-10 lg:px-16 pt-24 pb-16 border-t border-white/10">
        <div className="max-w-[1360px] mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-20 border-b border-white/10">
            
            {/* Brand Monogram & Mission */}
            <div className="lg:col-span-5 space-y-6">
              <a className="flex items-center gap-3.5 group" href="#">
                <img 
                  alt="VERHOST Official Logo" 
                  className="h-10 sm:h-12 w-auto object-contain brightness-100" 
                  src="/verhost-logo-white.png"
                />
                <span className="font-display font-extrabold text-2xl tracking-tight text-white uppercase">
                  VERHOST
                </span>
              </a>

              <p className="font-mono text-xs text-[#19C763] uppercase tracking-widest font-bold">
                AI • DATA • WEB • CREATIVE
              </p>

              <p className="text-sm text-white/60 max-w-sm leading-relaxed font-sans">
                Engineering sovereign digital systems, custom artificial intelligence, and art-directed corporate flagships for forward-looking enterprises globally.
              </p>
            </div>

            {/* Navigation Links */}
            <div className="lg:col-span-3 space-y-3 font-mono text-xs">
              <div className="text-[11px] text-white/40 font-bold uppercase tracking-wider mb-4">NAVIGATION</div>
              <div><a href="#services" className="text-white/70 hover:text-[#19C763] transition-colors">SERVICES</a></div>
              <div><a href="#solutions" className="text-white/70 hover:text-[#19C763] transition-colors">SOLUTIONS</a></div>
              <div><a href="#work" className="text-white/70 hover:text-[#19C763] transition-colors">WORK</a></div>
              <div><a href="#about" className="text-white/70 hover:text-[#19C763] transition-colors">ABOUT</a></div>
              <div><a href="#contact" className="text-white/70 hover:text-[#19C763] transition-colors">CONTACT</a></div>
            </div>

            {/* Social Channels */}
            <div className="lg:col-span-4 space-y-3 font-mono text-xs">
              <div className="text-[11px] text-white/40 font-bold uppercase tracking-wider mb-4">CONNECT</div>
              <div>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#19C763] transition-colors flex items-center gap-2">
                  <span>Instagram</span>
                  <span className="material-symbols-outlined text-xs">north_east</span>
                </a>
              </div>
              <div>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#19C763] transition-colors flex items-center gap-2">
                  <span>LinkedIn</span>
                  <span className="material-symbols-outlined text-xs">north_east</span>
                </a>
              </div>
              <div>
                <a href="https://github.com/zabbrotechnologies/verhost" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#19C763] transition-colors flex items-center gap-2">
                  <span>GitHub</span>
                  <span className="material-symbols-outlined text-xs">north_east</span>
                </a>
              </div>
            </div>

          </div>

          {/* Bottom Copyright & Ethos */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-white/40">
            <div>
              &copy; 2026 VERHOST. ALL RIGHTS RESERVED.
            </div>
            <div className="text-white/60 tracking-wider uppercase font-bold text-center sm:text-right">
              ROOTED IN VALUES. CONNECTED TO POSSIBILITIES.
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
