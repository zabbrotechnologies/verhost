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
  const [openFaq, setOpenFaq] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeHeroTab, setActiveHeroTab] = useState(0);
  const [reelModalOpen, setReelModalOpen] = useState(false);
  const [activeServiceIdx, setActiveServiceIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const mouseStartX = useRef(0);
  const isMouseDown = useRef(false);
  const hasMouseDragged = useRef(false);
  const lastWheelTime = useRef(0);
  const navDirectionRef = useRef('next');

  // ─── 3D Rotating Ribbon Carousel for Methodology ─────────────────────────
  const [ribbonRotation, setRibbonRotation] = useState(0);
  const ribbonRotationRef = useRef(0);
  const isRibbonDragging = useRef(false);
  const ribbonStartX = useRef(0);
  const ribbonStartRotation = useRef(0);
  const isRibbonHovered = useRef(false);
  const targetRibbonRotation = useRef(null);
  const ribbonAnimFrame = useRef(null);
  const [activeMethodologyPhase, setActiveMethodologyPhase] = useState(0);

  // Ribbon Continuous Rotation & Physics Loop
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time) => {
      const dt = Math.min(50, time - lastTime);
      lastTime = time;

      if (targetRibbonRotation.current !== null) {
        const diff = targetRibbonRotation.current - ribbonRotationRef.current;
        if (Math.abs(diff) < 0.15) {
          ribbonRotationRef.current = targetRibbonRotation.current;
          targetRibbonRotation.current = null;
        } else {
          ribbonRotationRef.current += diff * 0.12;
        }
      } else if (!isRibbonDragging.current) {
        // Continuous smooth auto-rotation (~0.13 deg per frame at 60fps)
        const speed = isRibbonHovered.current ? 0.04 : 0.13;
        ribbonRotationRef.current = (ribbonRotationRef.current + speed * (dt / 16.666)) % 360;
      }

      setRibbonRotation(ribbonRotationRef.current);

      // Compute active phase (4 phases, each spans 90 degrees)
      const norm = ((ribbonRotationRef.current % 360) + 360) % 360;
      const computedPhase = Math.floor((360 - norm + 45) / 90) % 4;
      setActiveMethodologyPhase(computedPhase);

      ribbonAnimFrame.current = requestAnimationFrame(loop);
    };

    ribbonAnimFrame.current = requestAnimationFrame(loop);
    return () => {
      if (ribbonAnimFrame.current) cancelAnimationFrame(ribbonAnimFrame.current);
    };
  }, []);

  const handleRibbonMouseDown = (e) => {
    isRibbonDragging.current = true;
    ribbonStartX.current = e.clientX;
    ribbonStartRotation.current = ribbonRotationRef.current;
    targetRibbonRotation.current = null;
  };

  const handleRibbonMouseMove = (e) => {
    if (!isRibbonDragging.current) return;
    const deltaX = e.clientX - ribbonStartX.current;
    ribbonRotationRef.current = (ribbonStartRotation.current - deltaX * 0.28) % 360;
  };

  const handleRibbonMouseUp = () => {
    isRibbonDragging.current = false;
  };

  const handleRibbonTouchStart = (e) => {
    if (e.touches.length === 1) {
      isRibbonDragging.current = true;
      ribbonStartX.current = e.touches[0].clientX;
      ribbonStartRotation.current = ribbonRotationRef.current;
      targetRibbonRotation.current = null;
    }
  };

  const handleRibbonTouchMove = (e) => {
    if (!isRibbonDragging.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - ribbonStartX.current;
    ribbonRotationRef.current = (ribbonStartRotation.current - deltaX * 0.32) % 360;
  };

  const handleRibbonTouchEnd = () => {
    isRibbonDragging.current = false;
  };

  const rotateToPhase = (phaseIdx) => {
    const targetDeg = -(phaseIdx * 90);
    const current = ribbonRotationRef.current;
    const diff = ((((targetDeg - current) % 360) + 540) % 360) - 180;
    targetRibbonRotation.current = current + diff;
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', checkMobile);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motionHandler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', motionHandler);

    return () => {
      window.removeEventListener('resize', checkMobile);
      mediaQuery.removeEventListener('change', motionHandler);
    };
  }, []);

  const goToPrevService = () => {
    navDirectionRef.current = 'prev';
    setActiveServiceIdx((prev) => (prev > 0 ? prev - 1 : services.length - 1));
  };

  const goToNextService = () => {
    navDirectionRef.current = 'next';
    setActiveServiceIdx((prev) => (prev < services.length - 1 ? prev + 1 : 0));
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      goToNextService();
    } else if (diff < -45) {
      goToPrevService();
    }
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    isMouseDown.current = true;
    hasMouseDragged.current = false;
    mouseStartX.current = e.clientX;
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown.current) return;
    const diff = mouseStartX.current - e.clientX;
    if (Math.abs(diff) > 8) {
      hasMouseDragged.current = true;
    }
  };

  const handleMouseUp = (e) => {
    if (!isMouseDown.current) return;
    isMouseDown.current = false;
    const diff = mouseStartX.current - e.clientX;
    if (diff > 45) {
      goToNextService();
    } else if (diff < -45) {
      goToPrevService();
    }
    setTimeout(() => {
      hasMouseDragged.current = false;
    }, 60);
  };

  const handleMouseLeave = () => {
    if (isMouseDown.current) {
      isMouseDown.current = false;
      setTimeout(() => {
        hasMouseDragged.current = false;
      }, 60);
    }
  };

  const handleWheel = (e) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0);
    if (Math.abs(delta) > 35) {
      const now = Date.now();
      if (now - lastWheelTime.current > 420) {
        lastWheelTime.current = now;
        if (delta > 0) {
          goToNextService();
        } else {
          goToPrevService();
        }
      }
    }
  };

  const handleCarouselKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPrevService();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToNextService();
    }
  };

  const getCardOffset = (idx, current) => {
    let diff = (idx - current) % 6;
    if (diff < -3) diff += 6;
    if (diff > 3) diff -= 6;
    // Tie-breaker for the 6th card (diff 3 / -3) to maintain consistent slide direction
    if (diff === 3 || diff === -3) {
      diff = navDirectionRef.current === 'next' ? -3 : 3;
    }
    return diff;
  };

  const scrollToService = (index) => {
    if (index !== activeServiceIdx) {
      navDirectionRef.current = index > activeServiceIdx ? 'next' : 'prev';
      setActiveServiceIdx(index);
    }
    const el = document.getElementById('services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: 'Web Development',
    details: ''
  });

  // US Agency Hero Practice Matrix
  const heroPractices = [
    {
      code: '01 / PRACTICE',
      title: 'WEB ARCHITECTURE',
      badge: 'ENTERPRISE DIGITAL PLATFORMS',
      metric: '0.08s TIME TO INTERACTIVE',
      headline: 'Flagship Web Applications Engineered for Speed & Scale.',
      desc: 'Bespoke Next.js & React architectures, modular design systems, and microsecond APIs built for high-stakes brand dominance.',
      tags: ['Next.js 15', 'TypeScript', 'Tailwind', 'Headless CMS', 'WebGL / 3D'],
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
      highlight: 'ENTERPRISE READY'
    },
    {
      code: '02 / PRACTICE',
      title: 'AI & NEURAL SYSTEMS',
      badge: 'PROPRIETARY INTELLIGENCE',
      metric: '99.2% REASONING PRECISION',
      headline: 'Tailor-Trained Models & Autonomous Cognitive Engines.',
      desc: 'Predictive forecasting, computer vision models, and proprietary enterprise LLMs trained directly on internal data assets.',
      tags: ['PyTorch', 'Custom Neural Nets', 'OpenCV / YOLO', 'MLOps Pipelines'],
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
      highlight: 'SOTA ACCURACY'
    },
    {
      code: '03 / PRACTICE',
      title: 'DATA TELEMETRY',
      badge: 'REAL-TIME DECISION CURVES',
      metric: 'SUB-SECOND PIPELINES',
      headline: 'Warehouse Infrastructure & Executive Telemetry Dashboards.',
      desc: 'Unifying distributed operational streams into real-time executive foresight, automated anomaly alerts, and decisive business leverage.',
      tags: ['PostgreSQL', 'Timescale', 'Power BI / Grafana', 'Streaming Telemetry'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
      highlight: 'ZERO DATA SILOS'
    },
    {
      code: '04 / PRACTICE',
      title: 'AUTONOMOUS COPILOTS',
      badge: '24/7 ENTERPRISE AGENTS',
      metric: '100% CONTEXT RETENTION',
      headline: 'Multi-Turn LLM Agents Grounded in Enterprise Knowledge.',
      desc: 'Conversational copilots executing customer support, internal workflows, and multi-system transactions around the clock.',
      tags: ['RAG Architecture', 'Vector Embeddings', 'CRM Integration', 'Omnichannel'],
      image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=1200&auto=format&fit=crop',
      highlight: '24/7 OPERATION'
    }
  ];

  // Services data (01 to 06)
  const services = [
    {
      num: '01',
      title: 'DIGITAL PRESENCE',
      tagline: 'Build your digital presence.',
      description: 'Premium websites, web applications, and digital experiences engineered to make your business visible, credible, and conversion-ready.',
      deliverables: ['Business Websites', 'Web Applications', 'E-commerce Platforms', 'Interactive Digital Experiences'],
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1600&auto=format&fit=crop',
      alt: 'VERHOST Digital Presence — Premium websites and digital experiences'
    },
    {
      num: '02',
      title: 'INTELLIGENT SOLUTIONS',
      tagline: 'Turn AI into business capability.',
      description: 'AI and machine-learning systems designed to solve real operational problems, automate decisions, and uncover predictive intelligence.',
      deliverables: ['Predictive AI', 'Computer Vision', 'Custom ML Models', 'AI-Powered Applications'],
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
      alt: 'VERHOST Intelligent Solutions — AI and machine-learning systems'
    },
    {
      num: '03',
      title: 'BUSINESS INTELLIGENCE',
      tagline: 'Turn your data into decisions.',
      description: 'Transform fragmented business data into clear dashboards, actionable insights, and intelligent reporting systems.',
      deliverables: ['Business Dashboards', 'Power BI Solutions', 'Data Pipelines', 'Automated Insights'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop',
      alt: 'VERHOST Business Intelligence — Dashboards and actionable insights'
    },
    {
      num: '04',
      title: 'AI CONVERSATIONS',
      tagline: 'Let your business communicate 24/7.',
      description: 'Intelligent conversational systems that understand customers, access your business knowledge, and handle conversations across digital channels.',
      deliverables: ['AI Chatbots', 'Knowledge Assistants', 'Customer Support Agents', 'Multilingual AI'],
      image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=1600&auto=format&fit=crop',
      alt: 'VERHOST AI Conversations — Intelligent conversational systems'
    },
    {
      num: '05',
      title: 'GROWTH CREATIVE',
      tagline: 'Create attention. Drive action.',
      description: 'High-impact advertising creatives engineered for modern digital platforms, helping businesses communicate their value and reach customers effectively.',
      deliverables: ['Promotional Videos', 'Social Media Ads', 'Product Ads', 'Campaign Creatives'],
      image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1600&auto=format&fit=crop',
      alt: 'VERHOST Growth Creative — High-impact advertising creatives'
    },
    {
      num: '06',
      title: 'BRAND COMMUNICATION',
      tagline: 'Make your brand impossible to overlook.',
      description: 'Strategic visual communication that gives businesses a consistent, professional, and memorable identity across digital and physical touchpoints.',
      deliverables: ['Posters & Marketing Creatives', 'Brand Identity', 'Social Media Designs', 'Digital & Print Collateral'],
      image: 'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?q=80&w=1600&auto=format&fit=crop',
      alt: 'VERHOST Brand Communication — Strategic visual communication and identity'
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

  // Capabilities with large typography & rich interactive previews
  const capabilities = [
    {
      tag: 'WEB',
      headline: 'Digital products and platforms.',
      detail: 'From cloud-native web applications to responsive flagship brand environments built on React, Next.js, and performant APIs.',
      badge: 'ENTERPRISE DIGITAL PLATFORMS',
      metric: '< 85ms Latency',
      stack: ['Next.js 15', 'TypeScript', 'Tailwind', 'Cloudflare', 'Headless CMS'],
      deliverables: ['Bespoke Web Platforms', 'Scalable Microfrontends', 'High-Converting Landing Experiences', 'Modular Design Systems'],
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop'
    },
    {
      tag: 'AI',
      headline: 'Intelligent systems and assistants.',
      detail: 'Custom LLM integrations, retrieval-augmented intelligence, and autonomous chat copilots tailored to enterprise workflows.',
      badge: 'PROPRIETARY INTELLIGENCE',
      metric: '99.4% Precision',
      stack: ['PyTorch', 'Enterprise LLMs', 'RAG Pipelines', 'Vector DBs', 'FastAPI'],
      deliverables: ['Custom Neural Networks', 'Document RAG Intelligence', 'Predictive Analysis Engines', 'Vision & Audio AI'],
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop'
    },
    {
      tag: 'DATA',
      headline: 'Analytics and predictive intelligence.',
      detail: 'Unified telemetry data pipelines, real-time dashboards, and SQL/Postgres architecture for mission-critical operations.',
      badge: 'EXECUTIVE TELEMETRY',
      metric: 'Sub-Second Ingestion',
      stack: ['PostgreSQL', 'TimescaleDB', 'Apache Kafka', 'Power BI', 'Grafana'],
      deliverables: ['Executive Foresight Dashboards', 'Data Warehouse ETL', 'Streaming Anomaly Detection', 'Unified Reporting Cubes'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop'
    },
    {
      tag: 'AUTOMATION',
      headline: 'Systems that work continuously.',
      detail: 'Automated business workflows, API bridges, background event listeners, and data synchronizers eliminating manual friction.',
      badge: '24/7 AUTONOMOUS OPS',
      metric: '85% Cycle Time Cut',
      stack: ['Autonomous Agents', 'Webhook Integrations', 'Queue Workers', 'Event Buses'],
      deliverables: ['Cross-System Sync', 'Zero-Touch Workflows', 'Background Event Watchers', 'Automated QA Pipelines'],
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop'
    },
    {
      tag: 'CREATIVE',
      headline: 'Visual communication that gets noticed.',
      detail: 'Precision promotional ad assets, typography systems, and Swiss-grade brand direction that commands market reverence.',
      badge: 'EDITORIAL ART DIRECTION',
      metric: '4.2x Engagement',
      stack: ['Motion Graphics', 'Figma Systems', 'Cinema 4D / WebGL', 'Brand Typography'],
      deliverables: ['Editorial Identity Systems', 'High-Converting Motion Ads', 'Design Guidelines', 'Interactive Brand Collateral'],
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

  // Methodology Showcase Cards matching reference image
  const methodologyCards = [
    {
      id: 'citrus',
      title: 'Beverage Architecture & Citrus Sky',
      category: 'Brand Systems',
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'apparel',
      title: 'Haute Couture Product Engineering',
      category: 'Physical Merchandising',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'volcanic',
      title: '3D Generative Product Assets',
      category: 'Creative Computation',
      image: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'can',
      title: 'Sustainable Minimalist Packaging',
      category: 'Industrial Systems',
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'streetwear',
      title: 'Editorial Lookbooks & Visual Direction',
      category: 'Art Direction',
      image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'tote',
      title: 'Botanical Retail Merchandising',
      category: 'Eco Merchandising',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'berry',
      title: 'High-Speed Product Dynamic CGI',
      category: 'Motion Systems',
      image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'architecture',
      title: 'Sovereign Cloud Platform Infrastructure',
      category: 'Enterprise Cloud',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop'
    }
  ];

  // 24 cards (3 dense repeats of 8 items) for seamless, continuous 360-degree cylindrical ribbon
  const denseMethodologyCards = [
    ...methodologyCards,
    ...methodologyCards,
    ...methodologyCards
  ];

  const methodologyPhases = [
    {
      num: '#01',
      title: 'Strategy & Planning',
      desc: 'Discovery immersion, architecture blueprints, data auditing, and unambiguous KPIs.'
    },
    {
      num: '#02',
      title: 'Design & Development',
      desc: 'High-fidelity prototyping, full-stack systems engineering, and custom AI model pipelines.'
    },
    {
      num: '#03',
      title: 'Launch & Growth',
      desc: 'Zero-downtime deployment, DNS provisioning, performance telemetry, and conversion velocity.'
    },
    {
      num: '#04',
      title: 'Ongoing Support',
      desc: 'Continuous telemetry monitoring, algorithmic optimization, 24/7 SLAs, and capability scaling.'
    }
  ];

  // Legacy reference for backward compatibility
  const processSteps = methodologyPhases;

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

    const ctx = gsap.context(() => {

      // ─── HERO: Sequential load reveal ───────────────────────────────────────
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('#hero-headline span.reveal-line', { opacity: 0, y: 40, stagger: 0.15, duration: 0.9, delay: 0.2 })
        .from('#hero-desc', { opacity: 0, y: 25, duration: 0.8 }, '-=0.4')
        .from('#hero-metrics', { opacity: 0, y: 25, duration: 0.8 }, '-=0.4')
        .from('#hero-cta-group', { opacity: 0, y: 20, duration: 0.8 }, '-=0.4');

      // ─── HERO: Parallax background on scroll ────────────────────────────────
      if (heroBgRef.current) {
        gsap.fromTo(heroBgRef.current,
          { y: -50, scale: 1.12 },
          { y: 120, scale: 1.0, ease: 'none',
            scrollTrigger: { trigger: '#hero-section', start: 'top top', end: 'bottom top', scrub: 1.2 }
          }
        );
      }

      // ─── APPROACH SECTION: Fade + slide from left/right ─────────────────────
      gsap.from('#approach-left', {
        opacity: 0, x: -60, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: '#approach', start: 'top 78%', toggleActions: 'play none none none' }
      });
      gsap.from('#approach-right', {
        opacity: 0, x: 60, scale: 0.96, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: '#approach', start: 'top 78%', toggleActions: 'play none none none' }
      });
      // Animated underline bar
      gsap.from('#approach-divider', {
        scaleX: 0, transformOrigin: 'left', duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: '#approach', start: 'top 72%', toggleActions: 'play none none none' }
      });
      // Pillars stagger
      gsap.from('.approach-pillar', {
        opacity: 0, y: 30, stagger: 0.2, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: '#approach-pillars', start: 'top 85%', toggleActions: 'play none none none' }
      });

      // ─── SERVICES: Clean entrance reveal ─────────────────────────────────────
      gsap.from('#services-heading-group', {
        opacity: 0, y: 35, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '#services', start: 'top 80%', toggleActions: 'play none none none' }
      });

      // ─── TRANSITION STATEMENT: Editorial text scrub ─────────────────────────
      gsap.fromTo('.editorial-reveal-line',
        { opacity: 0.15, y: 25 },
        { opacity: 1, y: 0, stagger: 0.2, duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: '#transition-statement', start: 'top 75%', end: 'bottom 40%', scrub: 0.8 }
        }
      );
      // Metric badges pop up
      gsap.from('.transition-metric', {
        opacity: 0, y: 30, scale: 0.9, stagger: 0.2, duration: 0.9, ease: 'back.out(1.5)',
        scrollTrigger: { trigger: '#transition-metrics', start: 'top 85%', toggleActions: 'play none none none' }
      });
      // Right image clip-path reveal
      gsap.fromTo('#transition-image-wrap',
        { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
        { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 1.3, ease: 'expo.inOut',
          scrollTrigger: { trigger: '#transition-statement', start: 'top 72%', toggleActions: 'play none none none' }
        }
      );

      // ─── SOLUTIONS SECTION: Header + row stagger ────────────────────────────
      gsap.from('#solutions-header', {
        opacity: 0, y: 50, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '#solutions', start: 'top 80%', toggleActions: 'play none none none' }
      });
      document.querySelectorAll('.transformation-row').forEach((row, i) => {
        gsap.from(row, {
          opacity: 0, x: -40, duration: 0.8, delay: i * 0.06, ease: 'power2.out',
          scrollTrigger: { trigger: row, start: 'top 88%', toggleActions: 'play none none none' }
        });
      });

      // ─── CAPABILITIES SECTION: Header reveal ────────────────────────────────
      gsap.from('#capabilities-header', {
        opacity: 0, y: 40, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: '#capabilities', start: 'top 85%', toggleActions: 'play none none none' }
      });

      // ─── WHY VERHOST: Header + rows ─────────────────────────────────────────
      gsap.from('#why-header', {
        opacity: 0, y: 50, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '#why', start: 'top 80%', toggleActions: 'play none none none' }
      });
      gsap.from('.why-row', {
        opacity: 0, y: 40, stagger: 0.15, duration: 0.85, ease: 'power2.out',
        scrollTrigger: { trigger: '#why-list', start: 'top 82%', toggleActions: 'play none none none' }
      });

      // ─── PROCESS: Header reveal ──────────────────────────────────────────────
      gsap.from('#process-header', {
        opacity: 0, y: 40, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: '#process', start: 'top 85%', toggleActions: 'play none none none' }
      });

      // ─── ABOUT: Slide text left, parallax image right ───────────────────────
      gsap.from('#about-copy', {
        opacity: 0, x: -60, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: '#about', start: 'top 78%', toggleActions: 'play none none none' }
      });
      gsap.from('#about-image-wrap', {
        opacity: 0, x: 60, scale: 0.95, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: '#about', start: 'top 78%', toggleActions: 'play none none none' }
      });
      // Metric counter animation
      document.querySelectorAll('.about-metric').forEach((el) => {
        gsap.from(el, {
          opacity: 0, y: 25, scale: 0.85, duration: 0.7, ease: 'back.out(1.5)',
          scrollTrigger: { trigger: '#about-metrics', start: 'top 88%', toggleActions: 'play none none none' }
        });
      });

      // ─── FAQ: Header + accordion stagger ────────────────────────────────────
      gsap.from('#faq-header', {
        opacity: 0, y: 50, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '#faq', start: 'top 80%', toggleActions: 'play none none none' }
      });
      gsap.from('.faq-item', {
        opacity: 0, y: 30, stagger: 0.08, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: '#faq-list', start: 'top 82%', toggleActions: 'play none none none' }
      });

      // ─── FINAL CTA: Dramatic entrance ───────────────────────────────────────
      gsap.from('#cta-eyebrow', {
        opacity: 0, y: -20, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '#final-cta-section', start: 'top 80%', toggleActions: 'play none none none' }
      });
      gsap.from('#cta-headline', {
        opacity: 0, y: 60, scale: 0.96, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '#final-cta-section', start: 'top 75%', toggleActions: 'play none none none' }
      });
      gsap.from('#cta-subtext', {
        opacity: 0, y: 30, duration: 0.9, ease: 'power2.out', delay: 0.2,
        scrollTrigger: { trigger: '#final-cta-section', start: 'top 75%', toggleActions: 'play none none none' }
      });
      gsap.from('#cta-button', {
        opacity: 0, scale: 0.9, duration: 0.8, ease: 'back.out(1.5)', delay: 0.35,
        scrollTrigger: { trigger: '#final-cta-section', start: 'top 75%', toggleActions: 'play none none none' }
      });

      // ─── CTA Watermark parallax ──────────────────────────────────────────────
      if (vhWatermarkRef.current) {
        gsap.fromTo(vhWatermarkRef.current,
          { scale: 0.9, opacity: 0.03, rotation: -2 },
          { scale: 1.08, opacity: 0.08, rotation: 2, ease: 'none',
            scrollTrigger: { trigger: '#final-cta-section', start: 'top bottom', end: 'bottom top', scrub: 1.5 }
          }
        );
      }

      // ─── CONTACT SECTION ─────────────────────────────────────────────────────
      gsap.from('#contact-left', {
        opacity: 0, x: -60, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: '#contact', start: 'top 78%', toggleActions: 'play none none none' }
      });
      gsap.from('#contact-form', {
        opacity: 0, x: 60, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: '#contact', start: 'top 78%', toggleActions: 'play none none none' }
      });

      // ─── FOOTER: Stagger links up ────────────────────────────────────────────
      gsap.from('.footer-col', {
        opacity: 0, y: 40, stagger: 0.15, duration: 0.9, ease: 'power2.out',
        scrollTrigger: { trigger: 'footer', start: 'top 90%', toggleActions: 'play none none none' }
      });

      // ─── HORIZONTAL SCROLLING MARQUEE for section separators ─────────────────
      // (runs continuously via gsap)
      gsap.to('.marquee-track', {
        xPercent: -50,
        repeat: -1,
        duration: 18,
        ease: 'none'
      });

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
    <div className="min-h-screen bg-white text-[#050505] selection:bg-[#16A34A] selection:text-white font-sans antialiased w-full max-w-full overflow-x-hidden">
      
      {/* 1. ALWAYS SOLID WHITE NAVIGATION BAR */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b border-black/10 ${
          scrolled 
            ? 'py-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.08)]' 
            : 'py-4 sm:py-5 shadow-[0_4px_25px_rgba(0,0,0,0.04)]'
        }`}
        role="banner"
      >
        <div className="max-w-[1360px] mx-auto px-6 sm:px-10 flex items-center justify-between">
          
          {/* Brand Monogram & Wordmark (Obsidian over White Liquid Glass) */}
          <a className="flex items-center gap-3.5 group" href="#" aria-label="VERHOST Home">
            <img 
              alt="VERHOST Official Logo" 
              className="h-8 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
              src="/verhost-logo.png"
            />
            <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-[#050505] uppercase">
              VERHOST
            </span>
          </a>

          {/* Center Navigation Links (Clean Frosted Liquid Glass, NO BLACK BOXES!) */}
          <nav className="hidden lg:flex items-center gap-1.5 text-[12px] font-mono font-bold tracking-widest uppercase" aria-label="Main Navigation">
            {[
              { name: 'SERVICES', href: '#services' },
              { name: 'SOLUTIONS', href: '#solutions' },
              { name: 'CAPABILITIES', href: '#capabilities' },
              { name: 'ABOUT', href: '#about' },
              { name: 'CONTACT', href: '#contact' }
            ].map((link) => (
              <a 
                key={link.name}
                href={link.href}
                className="px-4 py-2 rounded-full text-black/75 hover:text-[#16A34A] hover:bg-black/5 transition-all duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <a 
              className="hidden sm:inline-flex group items-center gap-2 px-5 py-2.5 bg-[#16A34A] hover:bg-[#19C763] text-white rounded-md text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 shadow-[0_4px_20px_rgba(22,163,74,0.35)]" 
              href="#contact"
            >
              <span>START A PROJECT</span>
              <span className="material-symbols-outlined text-sm transition-transform duration-200 group-hover:translate-x-1">arrow_forward</span>
            </a>
            <button 
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#050505] hover:text-[#16A34A] focus:outline-none rounded-md border border-black/10 bg-white/70 backdrop-blur-md"
              aria-label="Toggle Navigation Menu"
            >
              <span className="material-symbols-outlined text-2xl">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu in White Liquid Glass */}
        {mobileMenuOpen && (
          <div id="mobile-nav-menu" className="lg:hidden border-t border-black/10 bg-white/95 backdrop-blur-2xl px-6 py-6 flex flex-col space-y-3 font-mono text-xs font-bold uppercase tracking-wider text-[#050505] shadow-2xl">
            <a className="py-2.5 px-3 rounded hover:bg-black/5 border-b border-black/5 text-black/80 hover:text-[#16A34A] transition-colors" href="#services" onClick={() => setMobileMenuOpen(false)}>SERVICES</a>
            <a className="py-2.5 px-3 rounded hover:bg-black/5 border-b border-black/5 text-black/80 hover:text-[#16A34A] transition-colors" href="#solutions" onClick={() => setMobileMenuOpen(false)}>SOLUTIONS</a>
            <a className="py-2.5 px-3 rounded hover:bg-black/5 border-b border-black/5 text-black/80 hover:text-[#16A34A] transition-colors" href="#capabilities" onClick={() => setMobileMenuOpen(false)}>CAPABILITIES</a>
            <a className="py-2.5 px-3 rounded hover:bg-black/5 border-b border-black/5 text-black/80 hover:text-[#16A34A] transition-colors" href="#about" onClick={() => setMobileMenuOpen(false)}>ABOUT</a>
            <a className="py-2.5 px-3 rounded hover:bg-black/5 border-b border-black/5 text-black/80 hover:text-[#16A34A] transition-colors" href="#contact" onClick={() => setMobileMenuOpen(false)}>CONTACT</a>
            <a 
              className="inline-flex items-center justify-center gap-2 py-3 bg-[#16A34A] text-white rounded text-xs font-mono font-bold tracking-wider mt-2 shadow-md" 
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>START A PROJECT</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>
        )}
      </header>

      {/* MAIN CONTENT LANDMARK */}
      <main id="main-content" role="main">

        {/* 2. HERO — PREMIER US DIGITAL & AI AGENCY FLAGSHIP */}
        <section 
          id="hero-section" 
          className="relative w-full min-h-screen flex flex-col justify-between px-6 sm:px-10 lg:px-16 pt-32 sm:pt-36 pb-16 overflow-hidden bg-[#050806] border-b border-white/10"
          aria-label="VERHOST Sovereign Digital & AI Agency"
        >
          {/* Parallax Background Visual & High-End Agency Architectural Depth */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div ref={heroBgRef} className="w-full h-[150%] -top-[25%] absolute will-change-transform">
              <img 
                alt="VERHOST Global Headquarters — Premier Sovereign Digital & AI Engineering Agency in Downtown Manhattan, New York" 
                className="w-full h-full object-cover filter brightness-[0.68] contrast-[1.12] saturate-[1.05]" 
                src="/hero-bg.jpg"
              />
              {/* Layered US Agency Luxury Obsidian & Emerald Vignettes */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#050806]/90 via-[#050806]/55 to-[#050806]/98"></div>
              <div className="absolute inset-0 bg-[radial-gradient(#19C763_1px,transparent_1px)] [background-size:48px_48px] opacity-15"></div>
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[600px] bg-[#16A34A]/12 rounded-full blur-[170px]"></div>
              <div className="absolute bottom-10 right-10 w-[550px] h-[450px] bg-[#19C763]/10 rounded-full blur-[150px]"></div>
            </div>
          </div>

          {/* Hero Content Architecture */}
          <div ref={heroContentRef} className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center text-center my-auto">
            
            {/* Editorial Headline / Quote in Butler Serif */}
            <h1 id="hero-headline" className="font-display uppercase tracking-[-0.02em] text-white mb-10 w-full drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
              <span className="reveal-line block text-[44px] sm:text-[76px] md:text-[98px] lg:text-[114px] xl:text-[126px] font-normal leading-[0.90] tracking-tight">
                WE ARCHITECT
              </span>
              <span className="reveal-line block text-[44px] sm:text-[76px] md:text-[98px] lg:text-[114px] xl:text-[126px] font-light italic leading-[0.90] text-[#19C763] drop-shadow-[0_0_40px_rgba(25,199,99,0.5)]">
                SOVEREIGN DIGITAL
              </span>
              <span className="reveal-line block text-[40px] sm:text-[70px] md:text-[90px] lg:text-[106px] xl:text-[118px] font-normal leading-[0.90] tracking-tight">
                POWER &amp; AI.
              </span>
            </h1>

            {/* Agency Narrative Paragraph */}
            <p id="hero-desc" className="text-base sm:text-lg lg:text-xl text-white/85 leading-relaxed font-sans font-light max-w-3xl mb-10 text-center">
              VERHOST is an elite independent technology agency. We partner with industry-defining enterprises and venture-backed founders to engineer bespoke web platforms, proprietary neural models, and autonomous AI systems that command market dominance.
            </p>

            {/* 3 Core Agency Metrics */}
            <div id="hero-metrics" className="grid grid-cols-3 gap-4 sm:gap-8 font-mono text-xs w-full max-w-2xl mb-12">
              <div className="border-l border-[#19C763]/50 pl-3 sm:pl-4 text-left">
                <div className="text-[10px] sm:text-[11px] text-white/50 tracking-widest uppercase">LATENCY</div>
                <div className="text-white font-bold text-lg sm:text-2xl my-0.5">&lt; 85ms</div>
                <div className="text-[10px] sm:text-[11px] text-[#19C763]">Edge Speed</div>
              </div>
              <div className="border-l border-[#19C763]/50 pl-3 sm:pl-4 text-left">
                <div className="text-[10px] sm:text-[11px] text-white/50 tracking-widest uppercase">ENTERPRISE IMPACT</div>
                <div className="text-[#19C763] font-bold text-lg sm:text-2xl my-0.5">$140M+</div>
                <div className="text-[10px] sm:text-[11px] text-white/50">Value Created</div>
              </div>
              <div className="border-l border-[#19C763]/50 pl-3 sm:pl-4 text-left">
                <div className="text-[10px] sm:text-[11px] text-white/50 tracking-widest uppercase">RETENTION</div>
                <div className="text-white font-bold text-lg sm:text-2xl my-0.5">99.4%</div>
                <div className="text-[10px] sm:text-[11px] text-[#19C763]">CSAT Score</div>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div id="hero-cta-group" className="flex flex-wrap items-center justify-center sm:justify-start gap-4 w-full pt-8 border-t border-white/10">
              <a 
                className="group inline-flex items-center gap-3 px-8 py-4 bg-[#16A34A] text-white text-xs sm:text-sm font-mono font-bold tracking-widest uppercase transition-all duration-300 hover:bg-[#19C763] shadow-[0_10px_30px_rgba(22,163,74,0.4)] hover:shadow-[0_14px_45px_rgba(25,199,99,0.6)] border border-[#19C763]" 
                href="#contact"
              >
                <span>INITIATE AN ENGAGEMENT</span>
                <span className="material-symbols-outlined text-base transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1">north_east</span>
              </a>
              
              <button 
                type="button"
                onClick={() => setReelModalOpen(true)}
                className="inline-flex items-center gap-3 px-7 py-4 bg-black/60 hover:bg-white/10 text-white font-mono text-xs sm:text-sm font-bold tracking-widest uppercase border border-white/25 transition-all duration-300 backdrop-blur-md hover:border-[#19C763]/60 group"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#19C763] animate-pulse"></span>
                <span>WATCH 2026 AGENCY REEL</span>
                <span className="material-symbols-outlined text-base text-[#19C763] transition-transform group-hover:scale-125">play_circle</span>
              </button>

              <a 
                href="#services"
                className="hidden sm:inline-flex items-center gap-2 px-6 py-4 text-white/70 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors ml-auto border border-white/10 hover:border-white/30 backdrop-blur-sm"
              >
                <span>EXPLORE PRACTICES [06]</span>
                <span className="material-symbols-outlined text-sm">arrow_downward</span>
              </a>
            </div>

          </div>
        </section>

        {/* AGENCY SHOWREEL MODAL */}
        {reelModalOpen && (
          <div 
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label="VERHOST 2026 Agency Showreel"
          >
            <div className="relative w-full max-w-5xl bg-[#080D0A] border border-white/20 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(25,199,99,0.3)]">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/50">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#19C763] animate-pulse"></span>
                  <span className="font-mono text-xs font-bold text-white tracking-widest uppercase">
                    VERHOST &bull; 2026 SOVEREIGN AGENCY SHOWREEL
                  </span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setReelModalOpen(false)}
                  className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Close Showreel"
                >
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>

              {/* Video / Reel Presentation Area */}
              <div className="relative aspect-[16/9] w-full bg-black overflow-hidden flex items-center justify-center">
                <img 
                  src="/hero-bg.jpg" 
                  alt="Agency Reel Preview" 
                  className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.2]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                
                {/* Centered Reel Overlay Details */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16A34A]/20 border border-[#19C763]/50 text-[#19C763] font-mono text-xs uppercase tracking-widest">
                    <span>NOW STREAMING &bull; 4K HIGH FIDELITY</span>
                  </div>
                  <h3 className="font-display text-3xl sm:text-5xl text-white font-bold uppercase tracking-tight max-w-2xl">
                    Engineering The Sovereign Enterprise
                  </h3>
                  <p className="text-white/80 font-sans text-sm sm:text-base max-w-xl">
                    From mission-critical cloud web applications to autonomous LLMs and predictive data telemetry.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-4 justify-center">
                    <a 
                      href="#contact" 
                      onClick={() => setReelModalOpen(false)}
                      className="px-6 py-3 bg-[#16A34A] hover:bg-[#19C763] text-white font-mono text-xs font-bold uppercase tracking-widest rounded transition-colors"
                    >
                      SCHEDULE A DISCOVERY CALL
                    </a>
                    <button 
                      type="button"
                      onClick={() => setReelModalOpen(false)}
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold uppercase tracking-widest rounded transition-colors"
                    >
                      RETURN TO OVERVIEW
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MARQUEE SEPARATOR — Continuously scrolling kinetic text strip */}
        <div className="w-full bg-[#050505] overflow-hidden py-4 border-y border-white/10">
          <div className="flex whitespace-nowrap">
            <div className="marquee-track flex items-center gap-0">
              {Array.from({ length: 2 }).map((_, trackIdx) => (
                <div key={trackIdx} className="flex items-center gap-0">
                  {['WEB DEVELOPMENT', 'ARTIFICIAL INTELLIGENCE', 'DATA ANALYTICS', 'AI CHATBOTS', 'PROMOTION ADS', 'CREATIVE DESIGN', 'AUTOMATION', 'MACHINE LEARNING'].map((item, i) => (
                    <React.Fragment key={i}>
                      <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-white/80 px-6">{item}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#19C763] flex-shrink-0"></span>
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. INTRODUCTION — THE VERHOST APPROACH (WITH EDITORIAL ARCHITECTURAL VISUAL IN BLANK SPACE) */}
        <section id="approach" className="w-full bg-[#FFFFFF] px-6 sm:px-10 lg:px-16 py-32 sm:py-40 border-b border-black/10">
          <div className="max-w-[1360px] mx-auto">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column: Statement & Key Principles */}
              <div id="approach-left" className="lg:col-span-7">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-2.5 h-2.5 bg-[#16A34A]"></span>
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A]">
                    THE VERHOST APPROACH
                  </span>
                </div>

                <h2 className="font-display font-bold text-4xl sm:text-6xl lg:text-[74px] leading-[1.0] tracking-[-0.04em] uppercase text-[#050505] mb-8">
                  TECHNOLOGY<br />
                  SHOULD SOLVE<br />
                  REAL PROBLEMS.
                </h2>
                
                <div id="approach-divider" className="w-24 h-[2px] bg-[#16A34A] mb-8"></div>

                <p className="text-xl sm:text-2xl text-black/75 font-normal leading-relaxed mb-8">
                  VERHOST combines sovereign software engineering, algorithmic intelligence, and refined art direction to build practical digital systems for modern enterprises.
                </p>

                {/* Editorial Highlight Pillars */}
                <div id="approach-pillars" className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-black/10 font-mono text-xs text-black/70">
                  <div className="approach-pillar space-y-1">
                    <div className="text-[11px] font-bold text-[#16A34A] uppercase">01 / PRACTICAL COMPUTATION</div>
                    <div>Bridging state-of-the-art research with zero-downtime production architectures.</div>
                  </div>
                  <div className="approach-pillar space-y-1">
                    <div className="text-[11px] font-bold text-[#16A34A] uppercase">02 / MEASURABLE ROI</div>
                    <div>Eliminating manual bottlenecks and accelerating operational conversion velocity.</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Mobile Product Engineering Visual */}
              <div id="approach-right" className="lg:col-span-5 flex items-center justify-center">
                <div className="relative w-full max-w-lg lg:max-w-none group">
                  <img 
                    alt="Sovereign Mobile Product Engineering Showcase" 
                    className="w-full h-auto object-contain filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.18)] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    src="/mobile-showcase-transparent.png"
                    loading="lazy"
                  />
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 4. BESPOKE SERVICES SECTION WITH OVERSIZED WATERMARK BACKDROP & LAYERED CAROUSEL */}
        <section 
          id="services" 
          className="relative w-full bg-[#FAFAF7] overflow-hidden scroll-mt-24 pt-16 sm:pt-20 lg:pt-24 pb-14 sm:pb-16 lg:pb-20 border-b border-black/10 select-none"
          aria-label="Services — 06 Core Disciplines"
        >
          {/* Architectural Oversized Faded SERVICES Background Watermark */}
          <div 
            aria-hidden="true" 
            className="absolute top-2 sm:top-4 lg:top-6 left-1/2 -translate-x-1/2 select-none pointer-events-none z-0 w-full text-center overflow-hidden"
          >
            <span className="font-display font-extrabold text-[18vw] sm:text-[16vw] lg:text-[14vw] tracking-[0.14em] text-black/[0.04] leading-none uppercase inline-block whitespace-nowrap">
              SERVICES
            </span>
          </div>

          {/* Section Header Container */}
          <div className="max-w-[1440px] 2xl:max-w-[1600px] mx-auto w-full px-4 sm:px-8 lg:px-12 relative z-10">
            
            {/* Editorial Section Header */}
            <div id="services-heading-group" className="pb-5 sm:pb-6 mb-5 sm:mb-6 border-b border-black/10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#16A34A]">
                      CORE DISCIPLINES
                    </span>
                    <span className="text-black/30 font-mono text-xs">/</span>
                    <span className="text-black/60 font-mono text-[11px] uppercase tracking-wider">
                      06 ARCHITECTURAL PRACTICES
                    </span>
                  </div>

                  <h2 className="font-display font-bold text-2xl sm:text-4xl lg:text-[44px] tracking-tight uppercase text-[#050505] leading-[1.04] max-w-2xl">
                    TECHNOLOGY BUILT AROUND YOUR BUSINESS.
                  </h2>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <p className="text-xs sm:text-[13px] font-sans text-black/65 max-w-sm leading-relaxed">
                    Six sovereign practices engineered to operate autonomously or integrate into a unified, high-margin enterprise engine.
                  </p>
                  <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-black/10 font-mono text-xs">
                    <span className="text-black/40 uppercase">ACTIVE:</span>
                    <span className="text-[#16A34A] font-bold text-sm">
                      0{activeServiceIdx + 1} <span className="text-black/30 font-normal">/ 06</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Discipline Navigation Pills */}
              <div 
                className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1"
                role="tablist"
                aria-label="Service disciplines"
              >
                {services.map((srv, idx) => {
                  const isCurrent = activeServiceIdx === idx;
                  return (
                    <button
                      key={srv.num}
                      type="button"
                      role="tab"
                      aria-selected={isCurrent}
                      aria-controls={`service-card-${idx}`}
                      id={`service-pill-${idx}`}
                      onClick={() => scrollToService(idx)}
                      className={`flex-shrink-0 px-3 py-1 rounded-full font-mono text-[11px] font-bold transition-all duration-300 uppercase cursor-pointer flex items-center gap-1.5 ${
                        isCurrent
                          ? 'bg-[#16A34A] text-white shadow-md shadow-[#16A34A]/25 scale-[1.02]'
                          : 'bg-black/5 text-black/60 hover:text-black hover:bg-black/10'
                      }`}
                    >
                      <span className={`text-[9px] ${isCurrent ? 'text-white/80' : 'text-[#16A34A]'}`}>{srv.num}</span>
                      <span>{srv.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ─── BESPOKE 5-CARD FANNED CAROUSEL STAGE (REFINED 67% SIZING AT 100%) ─── */}
          <div 
            className="relative w-full max-w-[1920px] mx-auto overflow-hidden outline-none py-2 sm:py-4 px-2 sm:px-4 cursor-grab active:cursor-grabbing select-none"
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label="Core Services Carousel"
            onKeyDown={handleCarouselKeyDown}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onWheel={handleWheel}
          >
            <div className="relative w-full h-[490px] sm:h-[530px] md:h-[560px] lg:h-[590px] xl:h-[620px] flex items-center justify-center">
              {services.map((srv, idx) => {
                const diff = getCardOffset(idx, activeServiceIdx);
                const isActive = diff === 0;
                const isVisible = Math.abs(diff) <= (isMobile ? 1 : 2);

                // High-performance GPU-composited geometry matched to 67% view proportions
                let xTransform = '-50%';
                let yTransform = '-50%';
                let scale = 1.05;
                let zIndex = 35;
                let opacity = 1;

                if (isMobile) {
                  if (diff === 0) {
                    scale = 1;
                    zIndex = 35;
                    opacity = 1;
                  } else if (diff === -1) {
                    xTransform = 'calc(-50% - 76%)';
                    yTransform = 'calc(-50% + 12px)';
                    scale = 0.88;
                    zIndex = 25;
                    opacity = 0.6;
                  } else if (diff === 1) {
                    xTransform = 'calc(-50% + 76%)';
                    yTransform = 'calc(-50% + 12px)';
                    scale = 0.88;
                    zIndex = 25;
                    opacity = 0.6;
                  } else if (diff <= -2) {
                    xTransform = 'calc(-50% - 130%)';
                    yTransform = 'calc(-50% + 18px)';
                    scale = 0.7;
                    opacity = 0;
                    zIndex = 5;
                  } else {
                    xTransform = 'calc(-50% + 130%)';
                    yTransform = 'calc(-50% + 18px)';
                    scale = 0.7;
                    opacity = 0;
                    zIndex = 5;
                  }
                } else {
                  // Desktop 5-card fanned layout with balanced spread matching the screenshot
                  if (diff === 0) {
                    scale = 1.04;
                    zIndex = 35;
                    opacity = 1;
                  } else if (diff === -1) {
                    xTransform = 'calc(-50% - clamp(180px, 16vw, 290px))';
                    yTransform = 'calc(-50% + 14px)';
                    scale = 0.90;
                    zIndex = 25;
                    opacity = 0.88;
                  } else if (diff === 1) {
                    xTransform = 'calc(-50% + clamp(180px, 16vw, 290px))';
                    yTransform = 'calc(-50% + 14px)';
                    scale = 0.90;
                    zIndex = 25;
                    opacity = 0.88;
                  } else if (diff === -2) {
                    xTransform = 'calc(-50% - clamp(350px, 31vw, 560px))';
                    yTransform = 'calc(-50% + 28px)';
                    scale = 0.78;
                    zIndex = 15;
                    opacity = 0.76;
                  } else if (diff === 2) {
                    xTransform = 'calc(-50% + clamp(350px, 31vw, 560px))';
                    yTransform = 'calc(-50% + 28px)';
                    scale = 0.78;
                    zIndex = 15;
                    opacity = 0.76;
                  } else if (diff <= -3) {
                    xTransform = 'calc(-50% - clamp(460px, 42vw, 760px))';
                    yTransform = 'calc(-50% + 36px)';
                    scale = 0.65;
                    opacity = 0;
                    zIndex = 5;
                  } else {
                    xTransform = 'calc(-50% + clamp(460px, 42vw, 760px))';
                    yTransform = 'calc(-50% + 36px)';
                    scale = 0.65;
                    opacity = 0;
                    zIndex = 5;
                  }
                }

                return (
                  <div
                    key={srv.num}
                    id={`service-card-${idx}`}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${srv.num} of 06: ${srv.title}`}
                    aria-hidden={!isActive}
                    onClick={() => {
                      if (hasMouseDragged.current) return;
                      if (diff !== 0) {
                        navDirectionRef.current = diff > 0 ? 'next' : 'prev';
                        setActiveServiceIdx(idx);
                      }
                    }}
                    style={{
                      transform: `translate3d(${xTransform}, ${yTransform}, 0) scale(${scale})`,
                      zIndex,
                      opacity,
                      boxShadow: isActive 
                        ? '0 25px 60px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.1)' 
                        : '0 15px 35px -10px rgba(0, 0, 0, 0.25)',
                      pointerEvents: isVisible ? 'auto' : 'none',
                      transition: prefersReducedMotion 
                        ? 'none' 
                        : 'transform 480ms cubic-bezier(0.22, 1, 0.36, 1), opacity 480ms cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                    className={`group absolute left-1/2 top-1/2 w-[78vw] sm:w-[290px] md:w-[320px] lg:w-[340px] xl:w-[360px] 2xl:w-[380px] h-[450px] sm:h-[480px] md:h-[510px] lg:h-[530px] xl:h-[550px] 2xl:h-[570px] rounded-[28px] sm:rounded-[32px] overflow-hidden will-change-[transform,opacity] select-none bg-black ${
                      isActive ? 'cursor-default' : 'cursor-pointer hover:opacity-95'
                    }`}
                  >
                    {/* Base Static Grayscale Image Layer (GPU-cached) */}
                    <img 
                      alt={srv.alt}
                      src={srv.image}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-[0.92] brightness-[0.88] select-none pointer-events-none"
                    />

                    {/* Full Color Image Layer - smooth GPU opacity crossfade */}
                    <img 
                      alt=""
                      src={srv.image}
                      loading="lazy"
                      aria-hidden="true"
                      style={{ opacity: isActive ? 1 : 0 }}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out select-none pointer-events-none"
                    />

                    {/* Inactive Card Dimming Scrim */}
                    <div 
                      aria-hidden="true"
                      style={{ opacity: isActive ? 0 : 0.25 }}
                      className="absolute inset-0 bg-black transition-opacity duration-500 ease-out pointer-events-none"
                    />

                    {/* Top Right Circular Arrow Icon (Matching Reference) */}
                    <div className="absolute top-4 right-4 z-20">
                      {isActive ? (
                        <a
                          href="#contact"
                          aria-label={`Inquire about ${srv.title}`}
                          className="w-10 h-10 rounded-full bg-white/20 hover:bg-[#16A34A] backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                        >
                          <span className="material-symbols-outlined text-lg">north_east</span>
                        </a>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white/70 flex items-center justify-center">
                          <span className="material-symbols-outlined text-lg">north_east</span>
                        </div>
                      )}
                    </div>

                    {/* ─── BOTTOM FROSTED GLASS EFFECT PANEL (MATCHING REFERENCE) ─── */}
                    <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-6 backdrop-blur-xl bg-black/50 border-t border-white/20 text-left flex flex-col justify-end transition-colors duration-300">
                      {/* Rating Stars & Practice Indicator */}
                      <div className="flex items-center gap-1 text-amber-400 text-xs mb-1.5 select-none">
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                        <span className="font-mono text-[10px] text-white/70 uppercase tracking-widest ml-1 font-bold">
                          PRACTICE {srv.num}
                        </span>
                      </div>

                      {/* Service Name */}
                      <h3 className="font-display font-bold text-xl sm:text-2xl text-white uppercase tracking-tight leading-[1.1] mb-1 drop-shadow-sm">
                        {srv.title}
                      </h3>

                      {/* Tagline / Subtitle */}
                      <p className="text-xs text-white/75 font-mono uppercase tracking-wider line-clamp-1">
                        {srv.tagline}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── CIRCULAR PAGINATION DOTS (MATCHING REFERENCE) ─── */}
          <div 
            className="relative z-20 flex items-center justify-center gap-2.5 mt-4 sm:mt-6"
            role="tablist"
            aria-label="Services carousel pagination"
          >
            {/* Previous Button */}
            <button
              type="button"
              onClick={goToPrevService}
              aria-label="Previous service discipline"
              className="w-9 h-9 rounded-full border border-black/20 hover:border-black hover:bg-black hover:text-white text-black/70 flex items-center justify-center transition-all duration-200 cursor-pointer mr-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
            </button>

            {/* 6 Circular Dots */}
            {services.map((srv, idx) => {
              const isCurrent = activeServiceIdx === idx;
              return (
                <button
                  key={srv.num}
                  type="button"
                  role="tab"
                  aria-selected={isCurrent}
                  aria-label={`Go to service ${srv.num}: ${srv.title}`}
                  onClick={() => {
                    if (idx !== activeServiceIdx) {
                      navDirectionRef.current = idx > activeServiceIdx ? 'next' : 'prev';
                      setActiveServiceIdx(idx);
                    }
                  }}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    isCurrent 
                      ? 'w-3.5 h-3.5 bg-black border-2 border-black scale-110 shadow-sm' 
                      : 'w-3 h-3 bg-transparent border-2 border-black/55 hover:border-black hover:scale-105'
                  }`}
                />
              );
            })}

            {/* Next Button */}
            <button
              type="button"
              onClick={goToNextService}
              aria-label="Next service discipline"
              className="w-9 h-9 rounded-full border border-black/20 hover:border-black hover:bg-black hover:text-white text-black/70 flex items-center justify-center transition-all duration-200 cursor-pointer ml-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </section>

        {/* 5. STRONG BLACK TRANSITION STATEMENT (WITH CINEMATIC NEURAL VISUAL IN BLANK SPACE) */}
        <section id="transition-statement" className="w-full bg-[#050505] text-white px-6 sm:px-10 lg:px-16 py-36 sm:py-44 border-y border-white/10 relative overflow-hidden">
          {/* Subtle Ambient Emerald Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#16A34A]/10 rounded-full blur-[160px] pointer-events-none"></div>

          <div className="max-w-[1360px] mx-auto relative z-10">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column: Philosophy Statement */}
              <div className="lg:col-span-7">
                <div className="flex items-center gap-3 mb-8">
                  <span className="w-2.5 h-2.5 bg-[#19C763] shadow-[0_0_10px_#19C763]"></span>
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#19C763]">PHILOSOPHY IN ACTION</span>
                </div>

                <h2 className="font-display font-bold text-4xl sm:text-6xl lg:text-[76px] leading-[0.98] tracking-[-0.04em] uppercase text-white mb-8">
                  <span className="editorial-reveal-line block">GOOD TECHNOLOGY</span>
                  <span className="editorial-reveal-line block text-white/90">DISAPPEARS INTO</span>
                  <span className="editorial-reveal-line block text-[#19C763] drop-shadow-[0_0_30px_rgba(25,199,99,0.5)]">GOOD BUSINESS.</span>
                </h2>

                <div className="w-24 h-[2px] bg-[#19C763] mb-8"></div>

                <p className="text-lg sm:text-xl text-white/70 font-normal leading-relaxed max-w-2xl font-sans mb-8">
                  When software, artificial intelligence, and workflows are engineered with rigorous precision, complexity fades into frictionless, compounding growth.
                </p>

                {/* Telemetry Metric Badges */}
                <div id="transition-metrics" className="grid grid-cols-2 gap-6 pt-6 border-t border-white/15 font-mono">
                  <div className="transition-metric">
                    <div className="text-2xl sm:text-3xl font-bold text-[#19C763]">99.9%</div>
                    <div className="text-[11px] text-white/50 uppercase mt-1">Autonomous Reliability</div>
                  </div>
                  <div className="transition-metric">
                    <div className="text-2xl sm:text-3xl font-bold text-[#19C763]">0-DOWNTIME</div>
                    <div className="text-[11px] text-white/50 uppercase mt-1">Seamless Adaptation</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Autonomous Cloud Architecture Visual with Animated Green Wire Connection Points (No Box, Transparent Background) */}
              <div className="lg:col-span-5 flex items-center justify-center">
                <div id="transition-image-wrap" className="relative w-full aspect-[1024/788] group">
                  {/* Subtle Ambient Green Core Glow */}
                  <div className="absolute inset-x-[15%] inset-y-[20%] bg-[#19C763]/20 blur-[50px] rounded-full pointer-events-none"></div>

                  {/* Transparent 3D Cloud Architecture Hub */}
                  <img 
                    alt="VERHOST Autonomous Sovereign Cloud Architecture and Neural Node Network" 
                    className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_25px_60px_rgba(25,199,99,0.28)] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    src="/cloud-architecture-hub-transparent.png"
                    loading="eager"
                  />
                  
                  {/* Interactive / Animated Green Point Wires Overlay */}
                  <svg className="absolute inset-0 z-20 w-full h-full pointer-events-none select-none" viewBox="0 0 1024 788" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <filter id="hub-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur1" />
                        <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur2" />
                        <feMerge>
                          <feMergeNode in="blur2" />
                          <feMergeNode in="blur1" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <radialGradient id="center-hub-pulse" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#19C763" stopOpacity="0.4" />
                        <stop offset="50%" stopColor="#19C763" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#19C763" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Central Cloud Node Breathing Ambient Pulse */}
                    <circle cx="512" cy="420" r="140" fill="url(#center-hub-pulse)">
                      <animate attributeName="r" values="130;160;130" dur="3.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.6;1;0.6" dur="3.5s" repeatCount="indefinite" />
                    </circle>

                    {/* Circuit Wire Traces (Connecting Central Hub to 6 Pedestal Nodes) */}
                    <path d="M 440 648 L 236 752" stroke="#19C763" strokeWidth="1.8" strokeOpacity="0.65" />
                    <path d="M 400 668 L 196 772" stroke="#19C763" strokeWidth="1.8" strokeOpacity="0.65" />
                    <path d="M 360 688 L 156 792" stroke="#19C763" strokeWidth="1.8" strokeOpacity="0.65" />

                    <path d="M 588 672 L 792 772" stroke="#19C763" strokeWidth="1.8" strokeOpacity="0.65" />
                    <path d="M 628 652 L 832 752" stroke="#19C763" strokeWidth="1.8" strokeOpacity="0.65" />
                    <path d="M 668 632 L 872 732" stroke="#19C763" strokeWidth="1.8" strokeOpacity="0.65" />

                    <path d="M 350 550 L 172 516" stroke="#19C763" strokeWidth="1.8" strokeOpacity="0.65" />
                    <path d="M 320 615 L 172 560" stroke="#19C763" strokeWidth="1.8" strokeOpacity="0.65" />

                    <path d="M 670 550 L 848 516" stroke="#19C763" strokeWidth="1.8" strokeOpacity="0.65" />
                    <path d="M 700 615 L 848 560" stroke="#19C763" strokeWidth="1.8" strokeOpacity="0.65" />

                    <path d="M 355 310 L 246 248" stroke="#19C763" strokeWidth="1.8" strokeOpacity="0.65" />
                    <path d="M 375 322 L 266 260" stroke="#19C763" strokeWidth="1.8" strokeOpacity="0.65" />

                    <path d="M 668 310 L 778 248" stroke="#19C763" strokeWidth="1.8" strokeOpacity="0.65" />
                    <path d="M 648 322 L 758 260" stroke="#19C763" strokeWidth="1.8" strokeOpacity="0.65" />

                    {/* Faint Energy Tracer Beams along Wires */}
                    <path d="M 440 648 L 236 752" stroke="#52FFA0" strokeWidth="2" strokeDasharray="8 20" filter="url(#hub-glow)">
                      <animate attributeName="stroke-dashoffset" values="0;-56" dur="1.8s" repeatCount="indefinite" />
                    </path>
                    <path d="M 588 672 L 792 772" stroke="#52FFA0" strokeWidth="2" strokeDasharray="8 20" filter="url(#hub-glow)">
                      <animate attributeName="stroke-dashoffset" values="0;-56" dur="1.8s" repeatCount="indefinite" />
                    </path>
                    <path d="M 350 550 L 172 516" stroke="#52FFA0" strokeWidth="2" strokeDasharray="8 20" filter="url(#hub-glow)">
                      <animate attributeName="stroke-dashoffset" values="0;-56" dur="2s" repeatCount="indefinite" />
                    </path>
                    <path d="M 670 550 L 848 516" stroke="#52FFA0" strokeWidth="2" strokeDasharray="8 20" filter="url(#hub-glow)">
                      <animate attributeName="stroke-dashoffset" values="0;-56" dur="2s" repeatCount="indefinite" />
                    </path>
                    <path d="M 355 310 L 246 248" stroke="#52FFA0" strokeWidth="2" strokeDasharray="8 20" filter="url(#hub-glow)">
                      <animate attributeName="stroke-dashoffset" values="0;-56" dur="1.6s" repeatCount="indefinite" />
                    </path>
                    <path d="M 668 310 L 778 248" stroke="#52FFA0" strokeWidth="2" strokeDasharray="8 20" filter="url(#hub-glow)">
                      <animate attributeName="stroke-dashoffset" values="0;-56" dur="1.6s" repeatCount="indefinite" />
                    </path>

                    {/* Moving Green Points / Data Packets on Wires (Bidirectional) */}
                    {/* Bottom-Left Wires */}
                    <circle r="4.5" fill="#FFFFFF" filter="url(#hub-glow)">
                      <animateMotion dur="2.2s" repeatCount="indefinite" path="M 440 648 L 236 752" />
                    </circle>
                    <circle r="3.5" fill="#52FFA0" filter="url(#hub-glow)">
                      <animateMotion dur="2.8s" begin="1.1s" repeatCount="indefinite" path="M 196 772 L 400 668" />
                    </circle>
                    <circle r="4" fill="#FFFFFF" filter="url(#hub-glow)">
                      <animateMotion dur="2.5s" begin="0.5s" repeatCount="indefinite" path="M 360 688 L 156 792" />
                    </circle>

                    {/* Bottom-Right Wires */}
                    <circle r="4.5" fill="#FFFFFF" filter="url(#hub-glow)">
                      <animateMotion dur="2.0s" repeatCount="indefinite" path="M 588 672 L 792 772" />
                    </circle>
                    <circle r="3.5" fill="#52FFA0" filter="url(#hub-glow)">
                      <animateMotion dur="3.0s" begin="0.7s" repeatCount="indefinite" path="M 832 752 L 628 652" />
                    </circle>
                    <circle r="4" fill="#FFFFFF" filter="url(#hub-glow)">
                      <animateMotion dur="2.4s" begin="1.3s" repeatCount="indefinite" path="M 668 632 L 872 732" />
                    </circle>

                    {/* Mid-Left Wires */}
                    <circle r="4" fill="#52FFA0" filter="url(#hub-glow)">
                      <animateMotion dur="2.4s" begin="0.3s" repeatCount="indefinite" path="M 350 550 L 172 516" />
                    </circle>
                    <circle r="3.5" fill="#FFFFFF" filter="url(#hub-glow)">
                      <animateMotion dur="2.7s" begin="1.5s" repeatCount="indefinite" path="M 172 560 L 320 615" />
                    </circle>

                    {/* Mid-Right Wires */}
                    <circle r="4" fill="#FFFFFF" filter="url(#hub-glow)">
                      <animateMotion dur="2.5s" begin="0.8s" repeatCount="indefinite" path="M 670 550 L 848 516" />
                    </circle>
                    <circle r="3.5" fill="#52FFA0" filter="url(#hub-glow)">
                      <animateMotion dur="2.2s" begin="1.2s" repeatCount="indefinite" path="M 848 560 L 700 615" />
                    </circle>

                    {/* Top-Left Wires */}
                    <circle r="4" fill="#FFFFFF" filter="url(#hub-glow)">
                      <animateMotion dur="2.0s" begin="0.2s" repeatCount="indefinite" path="M 355 310 L 246 248" />
                    </circle>
                    <circle r="3.5" fill="#52FFA0" filter="url(#hub-glow)">
                      <animateMotion dur="2.6s" begin="1.0s" repeatCount="indefinite" path="M 266 260 L 375 322" />
                    </circle>

                    {/* Top-Right Wires */}
                    <circle r="4" fill="#FFFFFF" filter="url(#hub-glow)">
                      <animateMotion dur="2.3s" begin="0.4s" repeatCount="indefinite" path="M 668 310 L 778 248" />
                    </circle>
                    <circle r="3.5" fill="#52FFA0" filter="url(#hub-glow)">
                      <animateMotion dur="2.5" begin="1.4s" repeatCount="indefinite" path="M 758 260 L 648 322" />
                    </circle>
                  </svg>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 6. BUSINESS PROBLEM -> SOLUTION TRANSFORMATION */}
        <section id="solutions" className="w-full bg-[#FFFFFF] px-6 sm:px-10 lg:px-16 py-32 sm:py-40 border-b border-black/10">
          <div className="max-w-[1360px] mx-auto">
            
            <div id="solutions-header" className="max-w-4xl mb-20">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A]">PROBLEM RESOLUTION MATRIX</span>
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl tracking-tight uppercase text-[#050505] mb-4">
                WE DON'T JUST BUILD TECHNOLOGY.<br />WE SOLVE PROBLEMS.
              </h2>
              <p className="text-base sm:text-lg text-black/60 max-w-2xl">
                Every friction point in modern enterprise operations maps to an engineered technological breakthrough by VERHOST.
              </p>
            </div>

            {/* Transformation Matrix Rows */}
            <div className="divide-y divide-black/10 border-y border-black/10">
              {transformations.map((item, index) => (
                <div 
                  key={index}
                  className="transformation-row py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center group hover:bg-[#FAFAF7] transition-colors px-4 -mx-4 rounded"
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
                    <span className="font-display font-bold text-lg sm:text-2xl uppercase tracking-tight text-[#050505] group-hover:text-[#16A34A] transition-colors">
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

        {/* 8. WHY VERHOST (BUILT DIFFERENTLY + HOVER VISUAL PREVIEW) */}
        <section id="why" className="w-full bg-[#FFFFFF] px-6 sm:px-10 lg:px-16 py-32 sm:py-40 border-b border-black/10">
          <div className="max-w-[1360px] mx-auto">
            
            <div id="why-header" className="max-w-3xl mb-20">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A]">WHY VERHOST</span>
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl tracking-tight uppercase text-[#050505] mb-4">
                BUILT DIFFERENTLY.
              </h2>
              <p className="text-base sm:text-lg text-black/60">
                Four fundamental operating principles that ensure technical rigor and commercial victory.
              </p>
            </div>

            {/* Numbered Rows with Thin Hairline Dividers */}
            <div id="why-list" className="divide-y divide-black/10 border-y border-black/10">
              {principles.map((pr, idx) => {
                const isSelected = activeWhy === idx;
                return (
                  <div 
                    key={pr.num}
                    onMouseEnter={() => setActiveWhy(idx)}
                    onClick={() => setActiveWhy(idx)}
                    className={`why-row py-10 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center cursor-pointer transition-colors px-6 -mx-6 rounded ${
                      isSelected ? 'bg-[#FAFAF7] shadow-sm' : 'hover:bg-[#FAFAF7]/60'
                    }`}
                  >
                    <div className="lg:col-span-1 font-mono text-xs font-bold text-[#16A34A]">
                      {pr.num}
                    </div>
                    <div className="lg:col-span-4">
                      <h3 className={`font-display font-bold text-2xl sm:text-3xl uppercase tracking-tight transition-colors ${
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
                        <img alt={`VERHOST ${pr.title}`} src={pr.image} className="w-full h-full object-cover filter grayscale" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* 9. PROCESS (DEPLOYMENT METHODOLOGY) — 3D ROTATING CONCAVE RIBBON MATCHING REFERENCE IMAGE */}
        <section 
          id="process" 
          className="relative w-full bg-[#FAFAF7] overflow-hidden scroll-mt-28 pt-28 sm:pt-36 lg:pt-44 pb-20 sm:pb-28 border-b border-black/10 select-none"
          aria-label="Deployment Methodology — Behind the Architecture"
        >
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
            
            {/* Header matching Reference Image */}
            <div id="process-header" className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#16A34A]">BEHIND THE DESIGNS</span>
              </div>
              <h2 className="font-display font-medium text-4xl sm:text-6xl lg:text-7xl tracking-tight text-[#050505] mb-5 leading-[1.08]">
                Curious What Else We've<br className="hidden sm:inline" /> Created?
              </h2>
              <p className="text-base sm:text-lg text-black/60 font-sans max-w-2xl mx-auto leading-relaxed mb-8">
                Explore more brand identities, packaging, and digital design work in our extended portfolio.
              </p>

              {/* Pill Button with Green Circle Arrow matching reference */}
              <div className="flex justify-center">
                <a 
                  href="#work"
                  className="inline-flex items-center gap-3.5 pl-6 pr-2.5 py-2 rounded-full border border-black/15 bg-white text-sm font-sans font-medium text-[#050505] shadow-sm hover:shadow-md hover:border-black/30 transition-all group"
                >
                  <span>See more Projects</span>
                  <span className="w-8 h-8 rounded-full bg-[#16A34A] flex items-center justify-center text-white transition-transform duration-300 group-hover:translate-x-0.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </a>
              </div>
            </div>

            {/* 3D Rotating Concave Ribbon Stage */}
            <div 
              id="process-ribbon-stage"
              className="relative w-full h-[340px] sm:h-[440px] lg:h-[480px] overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
              style={{ perspective: isMobile ? '800px' : '1200px' }}
              onMouseDown={handleRibbonMouseDown}
              onMouseMove={handleRibbonMouseMove}
              onMouseUp={handleRibbonMouseUp}
              onMouseLeave={() => {
                isRibbonHovered.current = false;
                handleRibbonMouseUp();
              }}
              onMouseEnter={() => {
                isRibbonHovered.current = true;
              }}
              onTouchStart={handleRibbonTouchStart}
              onTouchMove={handleRibbonTouchMove}
              onTouchEnd={handleRibbonTouchEnd}
            >
              {/* Left/Right Edge Soft Gradient Masks */}
              <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#FAFAF7] to-transparent pointer-events-none z-30"></div>
              <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#FAFAF7] to-transparent pointer-events-none z-30"></div>

              {/* 3D Preserved Cylinder Container */}
              <div 
                className="relative w-full h-full flex items-center justify-center pointer-events-none"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {denseMethodologyCards.map((card, i) => {
                  const N = denseMethodologyCards.length; // 24
                  const baseAngle = i * (360 / N); // 15 deg per card
                  const deg = ((baseAngle + ribbonRotation) % 360 + 360) % 360;
                  const diff = deg > 180 ? deg - 360 : deg;

                  // Hide back-facing cards outside the front 150-degree arc
                  if (Math.abs(diff) > 75) return null;

                  const rad = (diff * Math.PI) / 180;
                  // Radius and depth scale with viewport
                  const radiusX = isMobile ? 320 : 780;
                  const depthZ = isMobile ? 120 : 270;
                  const x = Math.sin(rad) * radiusX;
                  const z = (1 - Math.cos(rad)) * depthZ;
                  const y = -(1 - Math.cos(rad)) * (isMobile ? 12 : 24);
                  const scale = (isMobile ? 0.70 : 0.72) + (1 - Math.cos(rad)) * (isMobile ? 0.46 : 0.52);
                  const rotY = -diff * (isMobile ? 0.50 : 0.65);
                  const rotZ = -diff * 0.035;
                  const opacity = Math.max(0, Math.min(1, (75 - Math.abs(diff)) / 12));
                  const zIndex = Math.round((1 - Math.cos(rad)) * 100);

                  return (
                    <div
                      key={`${card.id}-${i}`}
                      className="absolute w-[150px] sm:w-[185px] lg:w-[210px] h-[240px] sm:h-[300px] lg:h-[340px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.16)] bg-black/5 will-change-transform pointer-events-auto transition-shadow duration-300 hover:shadow-[0_25px_50px_rgba(0,0,0,0.25)]"
                      style={{
                        transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${rotY.toFixed(1)}deg) rotateZ(${rotZ.toFixed(1)}deg) scale(${scale.toFixed(2)})`,
                        zIndex,
                        opacity: opacity.toFixed(2)
                      }}
                      onClick={() => {
                        // Smoothly rotate clicked card to center
                        const targetDeg = -(baseAngle % 360);
                        const current = ribbonRotationRef.current;
                        const diffAngle = ((((targetDeg - current) % 360) + 540) % 360) - 180;
                        targetRibbonRotation.current = current + diffAngle;
                      }}
                    >
                      <img 
                        src={card.image} 
                        alt={card.title} 
                        className="w-full h-full object-cover select-none pointer-events-none"
                        loading="eager"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4 Methodology Pillars matching reference image */}
            <div 
              id="process-grid" 
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto mt-10 sm:mt-16 pt-8 border-t border-black/10"
            >
              {methodologyPhases.map((phase, idx) => {
                const isActive = activeMethodologyPhase === idx;
                return (
                  <button
                    key={phase.num}
                    type="button"
                    onClick={() => rotateToPhase(idx)}
                    className={`text-center group p-3 sm:p-4 rounded-xl transition-all cursor-pointer ${
                      isActive ? 'bg-black/[0.03]' : 'hover:bg-black/[0.02]'
                    }`}
                  >
                    <div className={`font-mono font-bold text-sm sm:text-base mb-1.5 transition-colors ${
                      isActive ? 'text-[#16A34A]' : 'text-[#16A34A]/80 group-hover:text-[#16A34A]'
                    }`}>
                      {phase.num}
                    </div>
                    <div className="font-display font-medium text-base sm:text-lg text-[#050505] mb-1">
                      {phase.title}
                    </div>
                    <p className="text-xs text-black/55 font-sans leading-relaxed line-clamp-2">
                      {phase.desc}
                    </p>
                  </button>
                );
              })}
            </div>

          </div>
        </section>

        {/* 10. ABOUT VERHOST (STRONG COMPANY STORY + ARCHITECTURAL IMAGERY) */}
        <section id="about" className="w-full bg-[#FFFFFF] px-6 sm:px-10 lg:px-16 py-32 sm:py-40 border-b border-black/10">
          <div className="max-w-[1360px] mx-auto">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              
              {/* Story Copy */}
              <div id="about-copy" className="lg:col-span-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A]">ABOUT VERHOST</span>
                </div>

                <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl tracking-tight uppercase text-[#050505] mb-8">
                  WE BUILD WHAT COMES NEXT.
                </h2>

                <p className="text-lg sm:text-xl text-black/80 font-normal leading-relaxed mb-6 font-sans">
                  VERHOST is a sovereign technology and creative solutions company focused on helping modern businesses build stronger digital operations through web, AI, data, and intelligent systems.
                </p>

                <p className="text-sm sm:text-base text-black/60 leading-relaxed mb-8">
                  Founded on the premise that cutting-edge software engineering and disciplined visual art direction must operate as one, VERHOST delivers scalable digital leverage to forward-looking organizations globally.
                </p>

                {/* Company Metrics Row */}
                <div id="about-metrics" className="grid grid-cols-3 gap-6 pt-6 border-t border-black/10 font-mono">
                  <div className="about-metric">
                    <div className="font-bold text-2xl sm:text-3xl text-[#16A34A]">99.9%</div>
                    <div className="text-[11px] text-black/50 uppercase mt-1">Platform Uptime</div>
                  </div>
                  <div className="about-metric">
                    <div className="font-bold text-2xl sm:text-3xl text-[#16A34A]">4.8x</div>
                    <div className="text-[11px] text-black/50 uppercase mt-1">Average ROI</div>
                  </div>
                  <div className="about-metric">
                    <div className="font-bold text-2xl sm:text-3xl text-[#16A34A]">24/7</div>
                    <div className="text-[11px] text-black/50 uppercase mt-1">Autonomous Ops</div>
                  </div>
                </div>
              </div>

              {/* Single Large Architectural Visual */}
              <div id="about-image-wrap" className="lg:col-span-6">
                <div className="aspect-[4/3] rounded-md overflow-hidden border border-black/10 shadow-sm relative bg-black">
                  <img 
                    alt="VERHOST Global Technology Innovation Center and Architecture"
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

        {/* 11. FAQ — MINIMAL EDITORIAL ACCORDION (NO CARDS) */}
        <section id="faq" className="w-full bg-[#FAFAF7] px-6 sm:px-10 lg:px-16 py-32 sm:py-40 border-b border-black/10">
          <div className="max-w-[1360px] mx-auto">
            
            <div id="faq-header" className="max-w-3xl mb-16">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A]">CLARITY &amp; GOVERNANCE</span>
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl tracking-tight uppercase text-[#050505] mb-4">
                FREQUENTLY ASKED QUESTIONS.
              </h2>
              <p className="text-base sm:text-lg text-black/60">
                Clear answers regarding VERHOST engagement models, technical delivery, and capabilities.
              </p>
            </div>

            {/* Accordion List */}
            <div id="faq-list" className="divide-y divide-black/10 border-y border-black/10">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={index} className="faq-item py-6 sm:py-8 transition-colors">
                    <button 
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full text-left flex items-center justify-between gap-4 group focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <span className="font-display font-bold text-lg sm:text-xl text-[#050505] uppercase tracking-tight group-hover:text-[#16A34A] transition-colors">
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

        {/* 12. FINAL CTA — DRAMATIC OBSIDIAN WITH SUBTLE SCALING VH WATERMARK */}
        <section id="final-cta-section" className="relative w-full bg-[#050505] text-white px-6 sm:px-10 lg:px-16 py-36 sm:py-48 border-b border-white/10 overflow-hidden text-center flex flex-col items-center justify-center">
          
          {/* Subtle Scaling VH Logo Watermark in Background */}
          <div 
            ref={vhWatermarkRef}
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none will-change-transform"
          >
            <img 
              alt="VERHOST Monogram Logo Watermark" 
              src="/verhost-logo-white.png" 
              className="w-[850px] sm:w-[1100px] h-auto object-contain opacity-5 filter brightness-100"
            />
          </div>

          {/* Ambient Emerald Pulse */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#16A34A]/15 rounded-full blur-[180px] pointer-events-none"></div>

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            <div id="cta-eyebrow" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 font-mono text-[11px] text-[#19C763] uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#19C763] animate-pulse"></span>
              <span>NEXT STEPS WITH VERHOST</span>
            </div>

            <h2 id="cta-headline" className="font-display font-bold text-4xl sm:text-7xl lg:text-[88px] leading-[0.95] tracking-tight uppercase text-white mb-8">
              HAVE AN IDEA?<br />
              <span className="text-[#19C763] drop-shadow-[0_0_35px_rgba(25,199,99,0.5)]">LET'S BUILD IT.</span>
            </h2>

            <p id="cta-subtext" className="text-lg sm:text-2xl text-white/80 font-normal leading-relaxed mb-12 max-w-xl">
              Tell VERHOST what you're trying to solve.
            </p>

            <a 
              id="cta-button"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-[#16A34A] text-white rounded-md text-xs sm:text-sm font-mono font-bold tracking-wider uppercase transition-all duration-300 hover:bg-[#19C763] shadow-[0_12px_35px_rgba(22,163,74,0.4)] hover:shadow-[0_15px_45px_rgba(25,199,99,0.7)]" 
              href="#contact"
            >
              <span>START A PROJECT</span>
              <span className="material-symbols-outlined text-lg transition-transform duration-200 group-hover:translate-x-1">arrow_forward</span>
            </a>
          </div>
        </section>

        {/* 13. CONTACT — SLEEK HIGH-CONTRAST CONSOLE WITH DIRECT WHATSAPP */}
        <section id="contact" className="w-full bg-[#FFFFFF] px-6 sm:px-10 lg:px-16 py-32 sm:py-40 border-b border-black/10">
          <div className="max-w-[1360px] mx-auto">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
              
              {/* Left Column: Direct Contact & Channel Details */}
              <div id="contact-left" className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A]">INITIATE ENGAGEMENT</span>
                  </div>

                  <h2 className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl tracking-tight uppercase text-[#050505] mb-8">
                    LET'S TALK.
                  </h2>

                  <p className="text-base sm:text-lg text-black/70 leading-relaxed mb-10 font-normal">
                    Whether you are architecting a new product from zero or elevating an existing technological operation, VERHOST engineering leads are ready to collaborate.
                  </p>

                  <div className="space-y-6 pt-6 border-t border-black/10 font-mono text-sm">
                    <div>
                      <div className="text-[11px] text-black/40 font-bold uppercase tracking-wider mb-1">OFFICIAL VERHOST INQUIRY EMAIL</div>
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
                        VERHOST Global Remote Deployment • Response within 24h
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
              <div id="contact-form" className="lg:col-span-7 bg-[#FAFAF7] border border-black/10 rounded-md p-8 sm:p-12 shadow-sm">
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
                      <span>SEND INQUIRY TO VERHOST</span>
                      <span className="material-symbols-outlined text-sm transition-transform duration-200 group-hover:translate-x-1">arrow_forward</span>
                    </button>
                    <p className="mt-3 text-[11px] font-mono text-black/50 text-center">
                      Submissions route directly to VERHOST Engineering via WhatsApp (+91 93601 71336).
                    </p>
                  </div>

                  {formSubmitted && (
                    <div className="p-4 bg-[#16A34A]/10 border border-[#16A34A]/30 rounded text-center text-xs font-mono text-[#16A34A] font-bold">
                      Inquiry dispatched! Opening VERHOST WhatsApp channel...
                    </div>
                  )}

                </form>
              </div>

            </div>

          </div>
        </section>

      </main>

      {/* 14. MONOLITHIC BRAND FOOTER */}
      <footer className="w-full bg-[#050505] text-white px-6 sm:px-10 lg:px-16 pt-24 pb-16 border-t border-white/10" role="contentinfo">
        <div className="max-w-[1360px] mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-20 border-b border-white/10">
            
            {/* Brand Monogram & Mission */}
            <div className="footer-col lg:col-span-6 space-y-6">
              <a className="flex items-center gap-3.5 group" href="#" aria-label="VERHOST Home">
                <img 
                  alt="VERHOST Official Logo" 
                  className="h-10 sm:h-12 w-auto object-contain brightness-100" 
                  src="/verhost-logo-white.png"
                />
                <span className="font-display font-bold text-2xl tracking-tight text-white uppercase">
                  VERHOST
                </span>
              </a>

              <p className="font-mono text-xs text-[#19C763] uppercase tracking-widest font-bold">
                AI • DATA • WEB • CREATIVE • CLOUD
              </p>

              <p className="text-sm text-white/60 max-w-sm leading-relaxed font-sans">
                VERHOST engineers sovereign digital systems, custom artificial intelligence, and art-directed corporate flagships for forward-looking enterprises globally.
              </p>
            </div>

            {/* Navigation Links */}
            <div className="footer-col lg:col-span-3 space-y-3 font-mono text-xs">
              <div className="text-[11px] text-white/40 font-bold uppercase tracking-wider mb-4">VERHOST INDEX</div>
              <div><a href="#services" className="text-white/70 hover:text-[#19C763] transition-colors">SERVICES</a></div>
              <div><a href="#solutions" className="text-white/70 hover:text-[#19C763] transition-colors">SOLUTIONS</a></div>
              <div><a href="#capabilities" className="text-white/70 hover:text-[#19C763] transition-colors">CAPABILITIES</a></div>
              <div><a href="#about" className="text-white/70 hover:text-[#19C763] transition-colors">ABOUT</a></div>
              <div><a href="#contact" className="text-white/70 hover:text-[#19C763] transition-colors">CONTACT</a></div>
            </div>

            {/* Social Channels */}
            <div className="footer-col lg:col-span-3 space-y-3 font-mono text-xs">
              <div className="text-[11px] text-white/40 font-bold uppercase tracking-wider mb-4">CONNECT WITH VERHOST</div>
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
