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
      title: 'WEB DEVELOPMENT',
      tagline: 'Build your digital presence.',
      description: 'High-performance digital flagship platforms, web applications, and headless architectures engineered with microsecond latency, fluid interaction, and enterprise-grade reliability.',
      deliverables: ['Custom Web Applications', 'Headless & Modular Architectures', 'Next.js & React Engineering', 'Design Systems & Interactive 3D'],
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1600&auto=format&fit=crop',
      alt: 'VERHOST Web Development — High-performance web architecture and digital platforms'
    },
    {
      num: '02',
      title: 'AI & MACHINE LEARNING',
      tagline: 'Intelligence for real-world decisions.',
      description: 'Proprietary predictive models, computer vision systems, and automated machine learning pipelines tailored to extract actionable foresight from complex enterprise data assets.',
      deliverables: ['Predictive Forecasting Models', 'Custom Neural Networks', 'Computer Vision (OpenCV / YOLO)', 'MLOps & Autonomous Model Pipelines'],
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
      alt: 'VERHOST AI & Machine Learning — Neural network modeling and predictive intelligence'
    },
    {
      num: '03',
      title: 'DATA ANALYTICS',
      tagline: 'Turn information into insight.',
      description: 'End-to-end telemetry, enterprise data warehouse pipelines, and executive intelligence dashboards that convert fragmented operational metrics into decisive business momentum.',
      deliverables: ['Real-Time Telemetry & Dashboards', 'Power BI & Custom Visualizations', 'Warehouse Pipelines (SQL / PostgreSQL)', 'Automated Anomaly Detection'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop',
      alt: 'VERHOST Data Analytics — Real-time telemetry and enterprise business intelligence'
    },
    {
      num: '04',
      title: 'AI CHATBOTS',
      tagline: 'Conversations that work 24/7.',
      description: 'Context-aware autonomous conversational AI agents powered by state-of-the-art LLMs, grounded in company knowledge, executing workflows, and solving customer inquiries around the clock.',
      deliverables: ['Enterprise LLM Fine-Tuning & RAG', 'Omnichannel Customer Support Agents', 'Internal Knowledge Copilots', 'Multi-Language Conversational AI'],
      image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=1600&auto=format&fit=crop',
      alt: 'VERHOST AI Chatbots — Autonomous conversational AI and LLM agents'
    },
    {
      num: '05',
      title: 'PROMOTION ADS',
      tagline: 'Creative that gets attention.',
      description: 'High-conversion algorithmic ad creatives, motion design, and precision video formats designed to capture mindshare, accelerate acquisition, and command brand authority.',
      deliverables: ['High-Conversion Motion Ads', 'Algorithmic Dynamic Creatives', 'Omnichannel Performance Assets', 'Product Showcase Visuals'],
      image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1600&auto=format&fit=crop',
      alt: 'VERHOST Promotion Ads — High-conversion digital advertising and creative campaigns'
    },
    {
      num: '06',
      title: 'POSTERS & CREATIVE DESIGN',
      tagline: 'Visual communication built for brands.',
      description: 'Editorial brand identities, Swiss-inspired typographic systems, and bespoke marketing collateral crafted to communicate uncompromising technical excellence and institutional trust.',
      deliverables: ['Editorial Identity Systems', 'Architectural Typography Systems', 'High-Impact Brand Collateral', 'Digital & Print Exhibition Systems'],
      image: 'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?q=80&w=1600&auto=format&fit=crop',
      alt: 'VERHOST Creative Design — Editorial identity and architectural visual communication'
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

  // Process Steps
  const processSteps = [
    { num: '01', name: 'DISCOVER', desc: 'In-depth architectural immersion, stakeholder alignment, and data auditing to define unambiguous objectives.' },
    { num: '02', name: 'DEFINE', desc: 'System blueprints, user journeys, data schemas, and mathematical performance criteria locked in with total precision.' },
    { num: '03', name: 'DESIGN', desc: 'High-fidelity art direction, interactive prototypes, and typographic systems engineered for maximum conversion.' },
    { num: '04', name: 'BUILD', desc: 'Full-stack engineering, clean modular codebases, custom neural models, and secure cloud infrastructure.' },
    { num: '05', name: 'LAUNCH', desc: 'Comprehensive stress testing, zero-downtime deployment, DNS provisioning, and telemetry verification.' },
    { num: '06', name: 'GROW', desc: 'Continuous telemetry monitoring, algorithmic optimization, and proactive capability scaling.' }
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

      // ─── SERVICES SECTION: Header reveal ────────────────────────────────────
      gsap.from('#services-header', {
        opacity: 0, y: 40, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '#services', start: 'top 85%', toggleActions: 'play none none none' }
      });

      // Smooth reveal for each stacking service card as user scrolls down
      gsap.utils.toArray('.service-panel-card').forEach((card) => {
        gsap.from(card, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        });
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
      
      {/* 1. WHITE LIQUID GLASS NAVIGATION BAR */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/90 backdrop-blur-2xl border-b border-black/10 py-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)]' 
            : 'bg-white/80 backdrop-blur-2xl border-b border-black/10 py-4 sm:py-5 shadow-[0_4px_30px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.85)]'
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

              {/* Right Column: Premium Architectural Visual (Fills Blank Space) */}
              <div id="approach-right" className="lg:col-span-5">
                <div className="relative rounded-md overflow-hidden border border-black/10 shadow-lg aspect-[4/3] bg-black group">
                  <img 
                    alt="VERHOST Architectural Headquarters — Modern Glass Technology Innovation Workspace" 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter contrast-[1.08]"
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Floating Metadata Indicator */}
                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white font-mono text-[11px]">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/80 backdrop-blur-md rounded border border-white/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#19C763] animate-pulse"></span>
                      <span>VERHOST DIGITAL LABORATORY</span>
                    </div>
                    <span className="text-white/60">SOVEREIGN LABS</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 4. SERVICES — ANIMATED ONE-BY-ONE STACKING SHOWCASE */}
        <section id="services" className="relative w-full bg-[#FAFAF7] px-6 sm:px-10 lg:px-16 py-28 sm:py-36 border-b border-black/10">
          <div className="max-w-[1360px] mx-auto w-full">
            
            {/* Header with Title (Pill buttons removed as requested) */}
            <div id="services-header" className="w-full pb-10 sm:pb-14 border-b border-black/10 mb-12 sm:mb-16">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A]">WHAT WE DO</span>
                <span className="text-black/30 font-mono text-xs">/</span>
                <span className="text-black/60 font-mono text-xs uppercase tracking-wider">06 CORE DISCIPLINES</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl tracking-tight uppercase text-[#050505] max-w-3xl leading-[1.02]">
                  TECHNOLOGY BUILT AROUND YOUR BUSINESS.
                </h2>
                <p className="text-sm font-sans text-black/60 max-w-sm leading-relaxed">
                  Each discipline is engineered to operate autonomously or integrate into a unified, high-margin enterprise engine.
                </p>
              </div>
            </div>

            {/* Stacking Cards Deck (Smooth scroll down and up, zero pin spacer bugs) */}
            <div className="relative space-y-12 sm:space-y-16">
              {services.map((srv, idx) => (
                <div
                  key={srv.num}
                  className="service-panel-card sticky rounded-3xl border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] bg-white overflow-hidden will-change-transform"
                  style={{
                    top: `${84 + idx * 16}px`,
                    zIndex: idx + 1
                  }}
                >
                  {/* Card Content Grid (Top header bar removed as requested) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-6 sm:p-10 lg:p-12 relative overflow-hidden">
                    {/* Watermark Number in Butler Serif */}
                    <span className="absolute -bottom-8 -right-4 font-display font-bold text-[140px] sm:text-[220px] text-black/[0.03] select-none pointer-events-none leading-none">
                      {srv.num}
                    </span>

                    {/* Left: Service Details */}
                    <div className="lg:col-span-7 flex flex-col justify-center relative z-10">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2.5 py-0.5 bg-[#16A34A]/10 text-[#16A34A] font-mono text-xs font-bold rounded border border-[#16A34A]/25">
                          PRACTICE {srv.num} / 06
                        </span>
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#16A34A]">
                          &bull; {srv.tagline}
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#050505] uppercase tracking-tight mb-4">
                        {srv.title}
                      </h3>

                      <p className="text-base sm:text-lg text-black/75 leading-relaxed mb-6 font-normal font-sans">
                        {srv.description}
                      </p>

                      {/* Deliverables */}
                      <div className="mb-8 pt-4 border-t border-black/10">
                        <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-black/50 mb-3">
                          CORE DELIVERABLES &amp; CAPABILITIES
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono text-black/80">
                          {srv.deliverables.map((item, dIdx) => (
                            <div key={dIdx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <a 
                          className="inline-flex items-center gap-2 px-6 py-3 bg-[#050505] hover:bg-[#16A34A] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-md transition-all duration-300 shadow-md group" 
                          href="#contact"
                        >
                          <span>DISCUSS {srv.title}</span>
                          <span className="material-symbols-outlined text-sm transition-transform duration-200 group-hover:translate-x-1">arrow_forward</span>
                        </a>
                        <span className="text-xs font-mono text-black/40">SOVEREIGN ARCHITECTURE</span>
                      </div>
                    </div>

                    {/* Right: Service Visual Showcase */}
                    <div className="lg:col-span-5 relative z-10 h-full flex items-center">
                      <div className="relative overflow-hidden rounded-2xl group border border-black/10 shadow-lg w-full aspect-[4/3] bg-black/5">
                        <img 
                          alt={srv.alt} 
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-95 contrast-[1.08]"
                          src={srv.image}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>
                        
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white font-mono text-[11px]">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/80 backdrop-blur-md rounded-lg border border-white/20 uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#19C763] animate-pulse"></span>
                            <span>VERHOST PRACTICE {srv.num}</span>
                          </div>
                          <span className="text-white/70 text-[10px] uppercase font-bold">PRODUCTION GRADE</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Status Indicator */}
            <div className="w-full flex items-center justify-between text-xs font-mono text-black/50 pt-10 border-t border-black/10 mt-12">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
                <span className="text-[#050505] font-bold">06 PRACTICES &mdash; FULL ARCHITECTURAL SUITE</span>
              </div>
              <div className="flex items-center gap-2 text-black/40">
                <span className="hidden sm:inline">CONTINUE SCROLLING</span>
                <span className="material-symbols-outlined text-sm text-[#16A34A]">south</span>
              </div>
            </div>

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

              {/* Right Column: Cinematic Neural Hardware Visual (Fills Blank Space) */}
              <div className="lg:col-span-5">
                <div id="transition-image-wrap" className="relative rounded-md overflow-hidden border border-white/15 shadow-2xl aspect-[4/3] bg-[#0A0D0A] group">
                  <img 
                    alt="VERHOST Neural Hardware and High-Performance Compute Infrastructure" 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-95 contrast-[1.15]"
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                  
                  {/* Floating Metadata Indicator */}
                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white font-mono text-[11px]">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/80 backdrop-blur-md rounded border border-[#16A34A]/40 text-[#19C763]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#19C763] animate-pulse"></span>
                      <span>AUTONOMOUS INTELLIGENCE CORE</span>
                    </div>
                    <span className="text-white/50">VERHOST LABS</span>
                  </div>
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

        {/* 7. CAPABILITIES SECTION (TECHNICAL DOMAINS) */}
        <section id="capabilities" className="w-full bg-[#FAFAF7] px-6 sm:px-10 lg:px-16 py-32 sm:py-40 border-b border-black/10">
          <div className="max-w-[1360px] mx-auto">
            
            <div id="capabilities-header" className="max-w-3xl mb-14">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A]">TECHNICAL DOMAINS</span>
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl tracking-tight uppercase text-[#050505] mb-4">
                VERHOST CAPABILITIES
              </h2>
              <p className="text-base sm:text-lg text-black/60 font-sans">
                Explore our core technological practices and enterprise architecture disciplines.
              </p>
            </div>

            {/* Mobile / Tablet Visual Preview (visible on smaller screens) */}
            <div className="block lg:hidden mb-8 rounded-2xl overflow-hidden border border-black/10 shadow-md bg-black aspect-[16/10] relative">
              <img 
                alt={`VERHOST ${capabilities[activeCapability].tag}`}
                className="w-full h-full object-cover transition-all duration-500 filter contrast-[1.1]"
                src={capabilities[activeCapability].image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white font-mono text-xs">
                <div className="text-[#19C763] font-bold uppercase tracking-wider mb-1">
                  0{activeCapability + 1} &bull; {capabilities[activeCapability].tag}
                </div>
                <div className="font-display font-bold text-base uppercase text-white">
                  {capabilities[activeCapability].headline}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Interactive Massive Typography List */}
              <div id="capabilities-list" className="lg:col-span-8 divide-y divide-black/10 border-y border-black/10">
                {capabilities.map((cap, idx) => {
                  const isActive = activeCapability === idx;
                  return (
                    <div 
                      key={cap.tag}
                      onMouseEnter={() => setActiveCapability(idx)}
                      onClick={() => setActiveCapability(idx)}
                      className={`capability-row py-8 sm:py-10 transition-all duration-300 cursor-pointer ${
                        isActive ? 'bg-white px-6 -mx-6 rounded-xl shadow-sm border-l-4 border-l-[#16A34A]' : 'hover:bg-black/[0.02]'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                        <div className="flex items-baseline gap-4">
                          <span className={`font-mono text-xs font-bold transition-colors ${isActive ? 'text-[#16A34A]' : 'text-black/40'}`}>
                            0{idx + 1}
                          </span>
                          <h3 className={`font-display font-bold text-4xl sm:text-6xl uppercase tracking-tighter transition-all duration-300 ${
                            isActive ? 'text-[#16A34A] scale-[1.02] origin-left' : 'text-[#050505]'
                          }`}>
                            {cap.tag}
                          </h3>
                        </div>

                        <div className="max-w-xs">
                          <p className="font-display font-bold text-sm sm:text-base text-[#050505] mb-1 uppercase">
                            {cap.headline}
                          </p>
                          <p className="text-xs text-black/60 leading-relaxed font-sans">
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
                <div className="rounded-2xl overflow-hidden border border-black/10 shadow-lg bg-black aspect-[4/3] relative group">
                  <img 
                    alt={`VERHOST ${capabilities[activeCapability].tag} Capability Architecture`}
                    className="w-full h-full object-cover transition-all duration-500 filter contrast-[1.1]"
                    src={capabilities[activeCapability].image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-5 left-5 right-5 text-white font-mono text-xs">
                    <div className="text-[#19C763] font-bold uppercase tracking-wider mb-1">
                      PRACTICE 0{activeCapability + 1} ARCHITECTURE
                    </div>
                    <div className="font-display font-bold text-xl uppercase text-white mb-1">
                      {capabilities[activeCapability].tag}
                    </div>
                    <div className="text-white/80 font-sans text-xs">
                      {capabilities[activeCapability].headline}
                    </div>
                  </div>
                </div>
              </div>

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

        {/* 9. PROCESS (DEPLOYMENT METHODOLOGY) — EXACTLY LIKE IMAGE 2 */}
        <section id="process" className="w-full bg-[#FAFAF7] px-6 sm:px-10 lg:px-16 py-32 sm:py-40 border-b border-black/10">
          <div className="max-w-[1360px] mx-auto">
            
            <div id="process-header" className="max-w-3xl mb-16">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A]">DEPLOYMENT METHODOLOGY</span>
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl tracking-tight uppercase text-[#050505] mb-4">
                FROM IDEA TO IMPACT.
              </h2>
              <p className="text-base sm:text-lg text-black/60 font-sans">
                A disciplined, six-stage lifecycle engineered by VERHOST for predictability, transparency, and rapid delivery.
              </p>
            </div>

            {/* Clean 6-Card Grid matching Image 2 */}
            <div id="process-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {processSteps.map((step, idx) => {
                const isCurrent = activeProcess === idx;
                return (
                  <div 
                    key={step.num}
                    onClick={() => setActiveProcess(idx)}
                    className={`p-8 rounded-lg border transition-all duration-300 cursor-pointer bg-white ${
                      isCurrent 
                        ? 'border-2 border-[#16A34A] shadow-sm' 
                        : 'border border-black/10 hover:border-black/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <span className={`font-mono text-sm font-bold ${isCurrent ? 'text-[#16A34A]' : 'text-black/40'}`}>
                        {step.num}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-[#16A34A]' : 'bg-black/10'}`}></span>
                    </div>

                    <h3 className="font-display font-bold text-xl sm:text-2xl text-[#050505] uppercase mb-3">
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
