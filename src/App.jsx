import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: 'web',
    budget: '< $5,000 / Starter Project',
    details: ''
  });

  useEffect(() => {
    // Initialize Lenis Smooth Scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // GSAP Scroll Animations
    const sections = document.querySelectorAll('section');
    sections.forEach((sec) => {
      gsap.fromTo(
        sec,
        { opacity: 0.9, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
    }, 6000);
  };

  return (
    <div className="min-h-screen bg-white text-[#050505] selection:bg-[#16A34A] selection:text-white font-sans antialiased">
{/* 2. STICKY NAVBAR */}
<header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E5EAE5] transition-all duration-300">
<div className="max-w-[1440px] mx-auto h-20 px-6 sm:px-10 flex items-center justify-between">
{/* Left: Official Logo */}
<a className="flex items-center group py-2" href="#">
<img alt="VERHOST Logo" className="h-10 sm:h-11 w-auto object-contain" src="/verhost-logo-transparent.png"/>
</a>
{/* Center: Navigation Links */}
<nav className="hidden lg:flex items-center gap-8 text-xs font-bold tracking-widest uppercase">
<a className="text-black hover:text-[#16A34A] transition-colors py-1" href="#home">HOME</a>
<a className="text-black/75 hover:text-[#16A34A] transition-colors py-1" href="#services">SERVICES</a>
<a className="text-black/75 hover:text-[#16A34A] transition-colors py-1" href="#solutions">SOLUTIONS</a>
<a className="text-black/75 hover:text-[#16A34A] transition-colors py-1" href="#work">WORK</a>
<a className="text-black/75 hover:text-[#16A34A] transition-colors py-1" href="#about">ABOUT</a>
<a className="text-black/75 hover:text-[#16A34A] transition-colors py-1" href="#contact">CONTACT</a>
</nav>
{/* Right: Action Button & Mobile Toggle */}
<div className="flex items-center gap-3">
<a className="hidden sm:inline-flex group items-center gap-2 px-5 py-2.5 bg-[#050505] text-white rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-300 hover:bg-[#16A34A] hover:shadow-[0_8px_20px_rgba(22,163,74,0.28)]" href="#contact">
<span>START A PROJECT</span>
<span className="material-symbols-outlined text-sm transition-transform duration-200 group-hover:translate-x-0.5">arrow_forward</span>
</a>
<button 
  type="button"
  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
  className="lg:hidden p-2 text-black hover:text-[#16A34A] focus:outline-none"
  aria-label="Toggle Navigation Menu"
>
  <span className="material-symbols-outlined text-2xl">{mobileMenuOpen ? 'close' : 'menu'}</span>
</button>
</div>
</div>
{/* Mobile Navigation Dropdown */}
{mobileMenuOpen && (
  <nav className="lg:hidden border-t border-[#E5EAE5] bg-white px-6 py-4 flex flex-col space-y-3 font-mono text-xs font-bold uppercase tracking-wider">
    <a className="py-2 text-black hover:text-[#16A34A] border-b border-black/5" href="#home" onClick={() => setMobileMenuOpen(false)}>HOME</a>
    <a className="py-2 text-black/80 hover:text-[#16A34A] border-b border-black/5" href="#services" onClick={() => setMobileMenuOpen(false)}>SERVICES</a>
    <a className="py-2 text-black/80 hover:text-[#16A34A] border-b border-black/5" href="#solutions" onClick={() => setMobileMenuOpen(false)}>SOLUTIONS</a>
    <a className="py-2 text-black/80 hover:text-[#16A34A] border-b border-black/5" href="#work" onClick={() => setMobileMenuOpen(false)}>WORK</a>
    <a className="py-2 text-black/80 hover:text-[#16A34A] border-b border-black/5" href="#about" onClick={() => setMobileMenuOpen(false)}>ABOUT</a>
    <a className="py-2 text-black/80 hover:text-[#16A34A]" href="#contact" onClick={() => setMobileMenuOpen(false)}>CONTACT</a>
    <a className="inline-flex items-center justify-center gap-2 py-3 bg-[#050505] text-white rounded-lg text-xs font-bold" href="#contact" onClick={() => setMobileMenuOpen(false)}>
      <span>START A PROJECT</span>
      <span className="material-symbols-outlined text-sm">arrow_forward</span>
    </a>
  </nav>
)}
</header>
{/* MAIN CONTAINER */}
<main className="w-full pt-20" id="home">
{/* 3. HERO SECTION */}
<section className="relative w-full bg-[#FAFAF7] px-6 sm:px-10 lg:px-16 pt-16 pb-24 border-b border-[#E5EAE5] overflow-hidden">
<div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
{/* Left 7 Cols */}
<div className="lg:col-span-7 flex flex-col items-start z-10">
<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5EAE5] mb-6 shadow-sm">
<span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
<span className="text-[11px] font-mono font-bold uppercase tracking-wider text-black">VERHOST / TECHNOLOGY &amp; CREATIVE SOLUTIONS</span>
</div>
<h1 className="font-display font-extrabold text-[44px] sm:text-[62px] lg:text-[76px] leading-[0.95] tracking-tight uppercase text-[#050505] mb-6">
            YOUR BUSINESS.<br/>
<span className="text-[#16A34A]">POWERED BY</span> TECHNOLOGY.
          </h1>
<p className="text-base sm:text-lg text-black/75 max-w-xl mb-10 leading-relaxed font-normal">
            We turn ideas into real-world digital solutions — from websites and AI systems to data, creative technology and intelligent automation.
          </p>
<div className="flex flex-wrap items-center gap-4 mb-12">
<a className="group inline-flex items-center gap-2.5 px-8 py-4 bg-[#050505] text-white rounded-lg text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 hover:bg-[#16A34A] shadow-[0_10px_25px_rgba(5,5,5,0.1)] hover:shadow-[0_12px_28px_rgba(22,163,74,0.3)]" href="#contact">
<span>START A PROJECT</span>
<span className="material-symbols-outlined text-base transition-transform duration-200 group-hover:translate-x-1">arrow_forward</span>
</a>
<a className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-black text-[#050505] rounded-lg text-xs sm:text-sm font-bold tracking-wider uppercase hover:bg-black hover:text-white transition-all duration-200 shadow-sm" href="#services">
<span>EXPLORE SERVICES</span>
</a>
</div>
{/* Capability bar */}
<div className="w-full pt-6 border-t border-[#E5EAE5] flex flex-wrap items-center gap-y-2 text-xs font-mono font-bold text-black tracking-wider uppercase">
<span>WEB</span>
<span className="mx-3 w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
<span>AI</span>
<span className="mx-3 w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
<span>DATA</span>
<span className="mx-3 w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
<span>CREATIVE</span>
<span className="mx-3 w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
<span>AUTOMATION</span>
</div>
</div>
{/* Right 5 Cols: Official VERHOST Brand Architecture Monolith with Glass Badges */}
<div className="lg:col-span-5 relative flex justify-center items-center">
<div className="relative w-full max-w-lg aspect-[4/5] bg-gradient-to-b from-[#090B09] via-[#050505] to-[#0A150D] rounded-2xl border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] overflow-hidden p-6 flex flex-col items-center justify-center group">
  {/* Ambient Tech Glow */}
  <div className="absolute w-72 h-72 bg-[#16A34A]/25 rounded-full blur-[90px] pointer-events-none transition-all duration-700 group-hover:bg-[#16A34A]/35"></div>
  
  {/* Engineering Grid Overlay */}
  <div className="absolute inset-0 bg-[radial-gradient(#16A34A_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none"></div>

  {/* Official Logo Centerpiece */}
  <div className="relative z-10 p-8 flex flex-col items-center justify-center max-w-[85%]">
    <img 
      alt="VERHOST Official Brand Mark" 
      className="w-full max-w-[280px] h-auto object-contain filter drop-shadow-[0_15px_35px_rgba(22,163,74,0.3)] transition-transform duration-500 group-hover:scale-105 select-none" 
      src="/verhost-logo-white.png"
    />
    <div className="mt-6 flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-[#19C763] animate-ping"></span>
      <span className="text-[10px] font-mono tracking-widest text-[#19C763] uppercase">SOVEREIGN CORE INFRASTRUCTURE</span>
    </div>
  </div>

  {/* Top Glass Card */}
  <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl border border-[#16A34A]/30 shadow-[0_8px_30px_rgba(0,0,0,0.08)] flex items-center gap-3">
    <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A] ring-4 ring-[#16A34A]/20"></div>
    <div>
      <span className="text-[10px] font-mono font-bold tracking-widest text-[#16A34A] uppercase block">AI • DATA • WEB</span>
      <span className="text-xs font-bold text-[#050505] tracking-tight">Connected technology stack</span>
    </div>
  </div>

  {/* Bottom Glass Card */}
  <div className="absolute bottom-5 right-5 bg-[#050505]/90 backdrop-blur-md px-5 py-3.5 rounded-xl border border-white/10 shadow-[0_16px_36px_rgba(0,0,0,0.3)] text-white">
    <div className="flex items-center gap-2 mb-0.5">
      <span className="material-symbols-outlined text-[#19C763] text-sm">bolt</span>
      <span className="text-[10px] font-mono font-bold tracking-wider text-[#19C763] uppercase">EXECUTION PIPELINE</span>
    </div>
    <p className="text-xs font-semibold tracking-wider text-white/90 uppercase">BUILD • AUTOMATE • GROW</p>
  </div>
</div>
</div>
</div>
</section>
{/* 4. BRAND STATEMENT */}
<section className="w-full bg-white px-6 sm:px-10 lg:px-16 py-28 border-b border-[#E5EAE5]">
<div className="max-w-[1440px] mx-auto">
<div className="flex items-center gap-2 mb-4">
<span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
<span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A]">IDEAS • SOLUTIONS • GROWTH</span>
</div>
<div className="max-w-4xl">
<h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-[56px] leading-[1.05] tracking-tight uppercase text-[#050505]">
            TECHNOLOGY THAT MOVES BUSINESS FORWARD.
          </h2>
<div className="h-[2px] w-32 bg-[#16A34A] my-6"></div>
<p className="text-lg sm:text-xl text-black/70 font-normal leading-relaxed max-w-3xl">
            From building your digital presence to creating intelligent systems, VERHOST combines technology and creativity to solve real business challenges.
          </p>
</div>
{/* Three Principles Row */}
<div className="mt-14 pt-10 border-t border-[#E5EAE5] grid grid-cols-1 md:grid-cols-3 gap-8">
<div className="flex items-center gap-3">
<span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
<span className="font-display font-extrabold text-xl uppercase tracking-wider text-[#050505]">INNOVATIVE</span>
<span className="text-xs text-black/50 ml-auto font-mono">01</span>
</div>
<div className="flex items-center gap-3 md:border-l md:border-[#E5EAE5] md:pl-8">
<span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
<span className="font-display font-extrabold text-xl uppercase tracking-wider text-[#050505]">TECH-DRIVEN</span>
<span className="text-xs text-black/50 ml-auto font-mono">02</span>
</div>
<div className="flex items-center gap-3 md:border-l md:border-[#E5EAE5] md:pl-8">
<span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
<span className="font-display font-extrabold text-xl uppercase tracking-wider text-[#050505]">CLIENT-FOCUSED</span>
<span className="text-xs text-black/50 ml-auto font-mono">03</span>
</div>
</div>
</div>
</section>
{/* 5. SERVICES (SIX CAPABILITIES. ONE TECHNOLOGY PARTNER.) */}
<section className="w-full bg-[#FAFAF7] px-6 sm:px-10 lg:px-16 py-28 border-b border-[#E5EAE5]" id="services">
<div className="max-w-[1440px] mx-auto">
{/* Header */}
<div className="max-w-3xl mb-16">
<div className="flex items-center gap-2 mb-3">
<span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A]">OUR SERVICES</span>
</div>
<h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight uppercase text-[#050505] mb-4">
            SIX CAPABILITIES. ONE TECHNOLOGY PARTNER.
          </h2>
<p className="text-base sm:text-lg text-black/60">
            From modern web presence to predictive artificial intelligence, we deliver comprehensive technological excellence.
          </p>
</div>
<div className="space-y-12">
{/* 01: WEB DEVELOPMENT (Split with Laptop Mockup) */}
<div className="bg-white rounded-[14px] border border-[#E5EAE5] p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center shadow-sm">
<div className="lg:col-span-5 flex flex-col justify-between space-y-6">
<div>
<span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A] block mb-2">01 / WEB DEVELOPMENT</span>
<h3 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#050505] uppercase tracking-tight leading-snug mb-3">
                  BUILD YOUR DIGITAL PRESENCE.
                </h3>
<p className="text-sm sm:text-base text-black/70 leading-relaxed mb-6">
                  Modern, responsive, high-performance websites engineered for superior load speed, immaculate responsiveness, and high conversion.
                </p>
{/* Feature List */}
<ul className="space-y-2 text-xs sm:text-sm font-medium text-black/80 font-mono">
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span> Business Websites</li>
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span> E-commerce Solutions</li>
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span> Custom Web Applications</li>
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span> Responsive Design</li>
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span> Ongoing Support &amp; Optimization</li>
</ul>
</div>
<div className="pt-2">
<a className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#050505] hover:text-[#16A34A] transition-colors" href="#contact">
<span>DISCUSS WEB PLATFORMS</span>
<span className="material-symbols-outlined text-base">arrow_forward</span>
</a>
</div>
</div>
<div className="lg:col-span-7 aspect-[16/10] bg-black rounded-xl overflow-hidden shadow-lg border border-black/10">
<img alt="VERHOST Web Application Interface" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1V513xzKmIfDUH9sTdKmkC6HwhnHF0dqgGEC_QW0UD7JNXaERDdEAb4IZn4KvPZUVVvI51TNSqBkpO72jFfYoxL2Zawik24V2U8lBZFOkhh0pipnBiJnAejGHUVu-eS76sh4Fug_1EJYJR60lpsnYCEt9FOPaZN8XeTtgtvQBW89xxTpHcMR325PU6AfTfdOo4kyEkL0d4gf_jzV1qHmpYuoGuZObEkFkvf9D89JGfpdguc3tc0E3uhNTw"/>
</div>
</div>
{/* Dual Block: 02 PROMOTION ADS GENERATION + 03 POSTERS & CREATIVE DESIGN */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
{/* 02: PROMOTION ADS GENERATION */}
<div className="lg:col-span-6 bg-[#050505] text-white rounded-[14px] p-8 lg:p-10 flex flex-col justify-between border border-black shadow-xl">
<div>
<span className="text-xs font-mono font-bold uppercase tracking-widest text-[#19C763] block mb-2">02 / PROMOTION ADS GENERATION</span>
<h3 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight mb-4">
                  MAKE YOUR BUSINESS IMPOSSIBLE TO IGNORE.
                </h3>
<p className="text-sm text-white/70 leading-relaxed mb-6">
                  Creative promotional campaigns and digital advertising calibrated for maximum conversion rate optimization.
                </p>
<div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
<div className="flex items-center justify-between mb-2">
<span className="text-[10px] font-mono tracking-widest text-[#19C763] uppercase font-bold">CAMPAIGN CONVERSION SURGE</span>
<span className="text-[10px] font-mono px-2 py-0.5 bg-[#16A34A]/20 text-[#19C763] rounded font-bold">VERIFIED</span>
</div>
<div className="font-display font-black text-4xl text-[#19C763] tracking-tight mb-1">+340%</div>
<p className="text-xs text-white/60">Average customer response surge across multi-channel campaign deployments.</p>
</div>
<ul className="space-y-2 text-xs font-mono text-white/80">
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#19C763]"></span> Social Media Ads</li>
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#19C763]"></span> Ad Creatives &amp; Copy</li>
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#19C763]"></span> Target Audience Setup</li>
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#19C763]"></span> Campaign Management</li>
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#19C763]"></span> Promotional Content</li>
</ul>
</div>
<div className="pt-8">
<a className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#19C763] hover:underline" href="#contact">
<span>LAUNCH PROMOTIONAL CAMPAIGNS</span>
<span className="material-symbols-outlined text-base">arrow_forward</span>
</a>
</div>
</div>
{/* 03: POSTERS & CREATIVE DESIGN */}
<div className="lg:col-span-6 bg-white rounded-[14px] border border-[#E5EAE5] p-8 lg:p-10 flex flex-col justify-between shadow-sm">
<div>
<span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A] block mb-2">03 / POSTERS &amp; CREATIVE DESIGN</span>
<h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#050505] uppercase tracking-tight mb-3">
                  IDEAS THAT PEOPLE REMEMBER.
                </h3>
<p className="text-sm text-black/70 leading-relaxed mb-6">
                  Visual communication for brands, products, and events built on rigorous Swiss typography and minimalist architectural aesthetics.
                </p>
{/* Swiss Poster Style Visual Card */}
<div className="bg-[#F6F7F5] border border-[#E5EAE5] rounded-xl p-6 mb-6">
<div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-[#16A34A] border-b border-[#E5EAE5] pb-2 mb-3">
<span>VISUAL ARCHITECTURE</span>
<span>SWISS DESIGN SYSTEM</span>
</div>
<div className="font-display font-black text-2xl tracking-tighter text-[#050505] mb-2 uppercase">RESONANT IDENTITIES</div>
<p className="text-xs text-black/60 font-sans">High-impact editorial layouts and collateral that captivate target audiences instantly.</p>
</div>
<ul className="space-y-2 text-xs font-mono text-black/80">
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span> Business Posters</li>
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span> Event &amp; Festival Posters</li>
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span> Product Promotions</li>
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span> Social Media Creatives</li>
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span> Custom Design Solutions</li>
</ul>
</div>
<div className="pt-8">
<a className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#050505] hover:text-[#16A34A] transition-colors" href="#contact">
<span>DISCUSS CREATIVE DESIGN</span>
<span className="material-symbols-outlined text-base">arrow_forward</span>
</a>
</div>
</div>
</div>
{/* Dual Block: 04 DATA ANALYTICS & REPORTING + 05 MACHINE LEARNING */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
{/* 04: DATA ANALYTICS & REPORTING */}
<div className="lg:col-span-7 bg-white rounded-[14px] border border-[#E5EAE5] p-8 lg:p-10 flex flex-col justify-between shadow-sm">
<div>
<span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A] block mb-2">04 / DATA ANALYTICS &amp; REPORTING</span>
<h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#050505] uppercase tracking-tight mb-3">
                  TURN DATA INTO DECISIONS.
                </h3>
<p className="text-sm text-black/70 leading-relaxed mb-6">
                  Transform business information into actionable insight through high-clarity visual telemetry and KPI dashboards.
                </p>
<div className="aspect-[16/9] w-full rounded-xl overflow-hidden border border-[#E5EAE5] shadow-sm bg-white mb-6">
<img alt="VERHOST Enterprise Glass Data Analytics Interface" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1USjVT4pGeBJHBtrI_wPzS3u-Z_Pf68KOx-E04Zt311kZFX9wJaNAKw2cRUjNsFec2aSoRtCr1Hn86fgRx-le1lgj_0stxEfLSoDEuB4bgS-Mdojh1u4EU_fi4cKV0SOw7M5FZrKdnyFFvT0QJBYRWG43mdNWBKESVZP-ea_inhbQPyY7bNjNvsr0-WFjhBdyjdMKw6YskUIBKeyg4wA5djR-3Yvvhiwoq3bfwAywYf2s4791hrj5OC4Nk"/>
</div>
<ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-black/80">
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span> Data Visualization</li>
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span> Custom Reports</li>
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span> Business Insights</li>
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span> Performance Tracking</li>
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span> KPI Dashboards</li>
</ul>
</div>
<div className="pt-6">
<a className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#050505] hover:text-[#16A34A] transition-colors" href="#contact">
<span>DISCOVER DATA PIPELINES</span>
<span className="material-symbols-outlined text-base">arrow_forward</span>
</a>
</div>
</div>
{/* 05: MACHINE LEARNING */}
<div className="lg:col-span-5 bg-white rounded-[14px] border border-[#E5EAE5] p-8 lg:p-10 flex flex-col justify-between shadow-sm">
<div>
<span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A] block mb-2">05 / MACHINE LEARNING</span>
<h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#050505] uppercase tracking-tight mb-3">
                  USE YOUR DATA TO UNDERSTAND WHAT'S NEXT.
                </h3>
<p className="text-sm text-black/70 leading-relaxed mb-6">
                  Predictive systems for trends, sales, demand, and risk modeled directly around sovereign operational requirements.
                </p>
<div className="aspect-[16/9] w-full rounded-xl overflow-hidden border border-[#E5EAE5] shadow-sm bg-black mb-6">
<img alt="Predictive Machine Learning Vector Trajectory" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1WMkxb93f0FloziKd6JnQmQuDpvzwsf9P96GYhR8ngWSESa8sv4Eclbt6b_N2QnjeVim0y1JJLDHb5BqmvQw0QL_SRMiXZjY6EWaYNyOamGdDZTXJbSHKUQyBKf_eyv7YChX_cPWGZtSqJBQRFex_KsIA6swT7PnZCEaEQgbR3jF8ZQhHmtf7B8Y8hCY-5cJs3WVEhMSws4RDIFixZVAxl_L_ltNUjiCN7Z1N3l-lWM0ojKt30puXnCIAtv"/>
</div>
<ul className="space-y-2 text-xs font-mono text-black/80">
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span> Trend Forecasting</li>
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span> Sales Prediction</li>
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span> Demand Prediction</li>
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span> Risk Analysis</li>
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span> Custom ML Models</li>
</ul>
</div>
<div className="pt-6">
<a className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#050505] hover:text-[#16A34A] transition-colors" href="#contact">
<span>EXPLORE ML MODELS</span>
<span className="material-symbols-outlined text-base">arrow_forward</span>
</a>
</div>
</div>
</div>
{/* 06: AI CHATBOT CREATION */}
<div className="bg-white rounded-[14px] border border-[#E5EAE5] p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-sm">
<div className="lg:col-span-6 space-y-4">
<span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A] block">06 / AI CHATBOT CREATION</span>
<h3 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#050505] uppercase tracking-tight">
                INTELLIGENCE THAT WORKS 24/7.
              </h3>
<p className="text-sm sm:text-base text-black/70 leading-relaxed">
                AI-powered conversational systems for automated customer support, immediate lead qualification, and business workflows.
              </p>
<ul className="space-y-2 text-xs sm:text-sm font-mono text-black/80 pt-2">
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span> Website Chatbots</li>
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span> Customer Support Bots</li>
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span> Lead Generation Bots</li>
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span> Business Assistants</li>
<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span> Custom AI Solutions</li>
</ul>
<div className="pt-4">
<a className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#050505] hover:text-[#16A34A] transition-colors" href="#contact">
<span>SETUP INTELLIGENT ASSISTANTS</span>
<span className="material-symbols-outlined text-base">arrow_forward</span>
</a>
</div>
</div>
{/* Interactive Terminal UI Visual */}
<div className="lg:col-span-6 bg-[#050505] rounded-xl border border-black/10 p-6 shadow-xl space-y-3 font-mono text-white">
<div className="flex items-center justify-between pb-3 border-b border-white/10">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-[#19C763] animate-pulse"></span>
<span className="text-xs font-mono font-bold uppercase tracking-wider text-white/90">VERHOST DISPATCH CONTROLLER v4.2</span>
</div>
<span className="text-[11px] font-mono text-[#19C763] font-semibold">12ms ROUTING</span>
</div>
<div className="p-3 bg-white/10 rounded-lg text-xs text-white/80 max-w-[85%]">
                "Qualify tier-1 enterprise prospects from incoming platform traffic and orchestrate direct calendar synchronization."
              </div>
<div className="p-3 bg-[#16A34A]/20 border border-[#16A34A]/40 text-white rounded-lg text-xs max-w-[90%] ml-auto space-y-1">
<div className="flex items-center gap-1.5 text-[#19C763] text-[10px] font-mono font-bold">
<span className="material-symbols-outlined text-xs">verified</span>
<span>SOVEREIGN DISPATCH ENGINE</span>
</div>
<p className="text-white/90">Enterprise profile authenticated. Scheduling sync dispatched to executive calendar.</p>
</div>
</div>
</div>
</div>
</div>
</section>
{/* 6. SOLUTIONS SECTION (PROBLEM → SOLUTION MATRIX) */}
<section className="w-full bg-white px-6 sm:px-10 lg:px-16 py-28 border-b border-[#E5EAE5]" id="solutions">
<div className="max-w-[1440px] mx-auto">
<div className="max-w-3xl mb-16">
<span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A] block mb-2">WHAT CAN WE SOLVE?</span>
<h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight uppercase text-[#050505]">
            YOUR PROBLEM. OUR TECHNOLOGY.
          </h2>
<p className="text-base sm:text-lg text-black/60 mt-3">
            Every business encounters distinct operational bottlenecks. We map exact technological architectures to resolve them.
          </p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{/* Item 1 */}
<div className="bg-[#FBFBFA] border border-[#E5EAE5] p-8 rounded-xl flex flex-col justify-between hover:border-[#16A34A]/40 transition-colors">
<div className="space-y-4">
<span className="text-[11px] font-mono font-bold uppercase tracking-widest text-black/50">CHALLENGE 01</span>
<div>
<h4 className="font-display font-extrabold text-xl text-[#050505] uppercase">Digital Presence</h4>
<p className="text-xs text-black/60 mt-1">Outdated web presence, poor conversion, and slow legacy performance.</p>
</div>
<div className="h-px w-full bg-[#E5EAE5]"></div>
<div>
<span className="text-[10px] font-mono font-bold text-[#16A34A] uppercase tracking-wider block mb-1">VERHOST SOLUTION</span>
<p className="text-sm font-semibold text-[#050505]">Professional business website &amp; scalable web architecture.</p>
</div>
</div>
</div>
{/* Item 2 */}
<div className="bg-[#FBFBFA] border border-[#E5EAE5] p-8 rounded-xl flex flex-col justify-between hover:border-[#16A34A]/40 transition-colors">
<div className="space-y-4">
<span className="text-[11px] font-mono font-bold uppercase tracking-widest text-black/50">CHALLENGE 02</span>
<div>
<h4 className="font-display font-extrabold text-xl text-[#050505] uppercase">Customer Engagement</h4>
<p className="text-xs text-black/60 mt-1">Missed inquiries outside business hours and slow response rates.</p>
</div>
<div className="h-px w-full bg-[#E5EAE5]"></div>
<div>
<span className="text-[10px] font-mono font-bold text-[#16A34A] uppercase tracking-wider block mb-1">VERHOST SOLUTION</span>
<p className="text-sm font-semibold text-[#050505]">24/7 AI conversational chatbot &amp; autonomous lead qualification.</p>
</div>
</div>
</div>
{/* Item 3 */}
<div className="bg-[#FBFBFA] border border-[#E5EAE5] p-8 rounded-xl flex flex-col justify-between hover:border-[#16A34A]/40 transition-colors">
<div className="space-y-4">
<span className="text-[11px] font-mono font-bold uppercase tracking-widest text-black/50">CHALLENGE 03</span>
<div>
<h4 className="font-display font-extrabold text-xl text-[#050505] uppercase">Business Data</h4>
<p className="text-xs text-black/60 mt-1">Fragmented metrics across disparate tools and lack of executive clarity.</p>
</div>
<div className="h-px w-full bg-[#E5EAE5]"></div>
<div>
<span className="text-[10px] font-mono font-bold text-[#16A34A] uppercase tracking-wider block mb-1">VERHOST SOLUTION</span>
<p className="text-sm font-semibold text-[#050505]">Real-time telemetry dashboards &amp; unified executive reporting.</p>
</div>
</div>
</div>
{/* Item 4 */}
<div className="bg-[#FBFBFA] border border-[#E5EAE5] p-8 rounded-xl flex flex-col justify-between hover:border-[#16A34A]/40 transition-colors">
<div className="space-y-4">
<span className="text-[11px] font-mono font-bold uppercase tracking-widest text-black/50">CHALLENGE 04</span>
<div>
<h4 className="font-display font-extrabold text-xl text-[#050505] uppercase">Business Prediction</h4>
<p className="text-xs text-black/60 mt-1">Uncertainty in supply demand, seasonal trends, and risk management.</p>
</div>
<div className="h-px w-full bg-[#E5EAE5]"></div>
<div>
<span className="text-[10px] font-mono font-bold text-[#16A34A] uppercase tracking-wider block mb-1">VERHOST SOLUTION</span>
<p className="text-sm font-semibold text-[#050505]">Machine learning forecast models &amp; predictive demand forecasting.</p>
</div>
</div>
</div>
{/* Item 5 */}
<div className="bg-[#FBFBFA] border border-[#E5EAE5] p-8 rounded-xl flex flex-col justify-between hover:border-[#16A34A]/40 transition-colors">
<div className="space-y-4">
<span className="text-[11px] font-mono font-bold uppercase tracking-widest text-black/50">CHALLENGE 05</span>
<div>
<h4 className="font-display font-extrabold text-xl text-[#050505] uppercase">Repetitive Work</h4>
<p className="text-xs text-black/60 mt-1">Valuable operational hours lost to manual data copying and routine workflows.</p>
</div>
<div className="h-px w-full bg-[#E5EAE5]"></div>
<div>
<span className="text-[10px] font-mono font-bold text-[#16A34A] uppercase tracking-wider block mb-1">VERHOST SOLUTION</span>
<p className="text-sm font-semibold text-[#050505]">Autonomous intelligent workflow automation pipelines.</p>
</div>
</div>
</div>
{/* Item 6: Summary trigger card */}
<div className="bg-[#050505] text-white p-8 rounded-xl flex flex-col justify-between">
<div className="space-y-4">
<span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#19C763]">CUSTOM ARCHITECTURE</span>
<h4 className="font-display font-extrabold text-xl uppercase">HAVE A SPECIFIC SYSTEM CHALLENGE?</h4>
<p className="text-xs text-white/70">Consult directly with our engineering architects to design a bespoke sovereign infrastructure.</p>
</div>
<div className="pt-6">
<a className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#19C763] hover:underline" href="#contact">
<span>TALK WITH AN ENGINEER</span>
<span className="material-symbols-outlined text-sm">arrow_forward</span>
</a>
</div>
</div>
</div>
</div>
</section>
{/* 7. WHY VERHOST (DARK SECTION) */}
<section className="w-full bg-[#050505] text-white px-6 sm:px-10 lg:px-16 py-32 relative overflow-hidden">
{/* Subtle Emerald Glow */}
<div className="absolute -top-40 right-0 w-[550px] h-[550px] bg-[#16A34A]/10 rounded-full blur-[130px] pointer-events-none"></div>
<div className="max-w-[1440px] mx-auto relative z-10">
<div className="h-1 w-20 bg-[#16A34A] mb-8"></div>
<div className="max-w-4xl mb-16">
<span className="text-xs font-mono font-bold uppercase tracking-widest text-[#19C763] block mb-2">WHY VERHOST</span>
<h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-[60px] leading-[1.0] uppercase tracking-tight mb-4">
            MORE THAN JUST A SERVICE PROVIDER.
          </h2>
<p className="text-base sm:text-lg text-white/70 max-w-2xl font-light leading-relaxed">
            We combine technology, creativity and business thinking to build solutions that actually serve a purpose.
          </p>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
{/* 01 / BUSINESS FIRST */}
<div className="p-8 bg-white/5 border border-white/10 rounded-xl flex flex-col justify-between min-h-[220px] hover:border-[#16A34A]/50 transition-colors">
<span className="font-mono text-xs font-bold text-[#19C763] uppercase">01 / BUSINESS FIRST</span>
<div>
<h4 className="font-display font-bold text-lg uppercase text-white mb-2">PROBLEM OVER HYPE</h4>
<p className="text-xs text-white/60 leading-relaxed">We start with the problem, not the technology. Every line of code exists to drive a tangible commercial metric.</p>
</div>
</div>
{/* 02 / ONE PARTNER */}
<div className="p-8 bg-white/5 border border-white/10 rounded-xl flex flex-col justify-between min-h-[220px] hover:border-[#16A34A]/50 transition-colors">
<span className="font-mono text-xs font-bold text-[#19C763] uppercase">02 / ONE PARTNER</span>
<div>
<h4 className="font-display font-bold text-lg uppercase text-white mb-2">UNIFIED STACK</h4>
<p className="text-xs text-white/60 leading-relaxed">Web, AI, data, and creative services under one roof without communication siloing or contractor friction.</p>
</div>
</div>
{/* 03 / CUSTOM SOLUTIONS */}
<div className="p-8 bg-white/5 border border-white/10 rounded-xl flex flex-col justify-between min-h-[220px] hover:border-[#16A34A]/50 transition-colors">
<span className="font-mono text-xs font-bold text-[#19C763] uppercase">03 / CUSTOM SOLUTIONS</span>
<div>
<h4 className="font-display font-bold text-lg uppercase text-white mb-2">TAILORED BUILDS</h4>
<p className="text-xs text-white/60 leading-relaxed">Solutions designed around actual business requirements, avoiding bloated cookie-cutter frameworks.</p>
</div>
</div>
{/* 04 / LONG-TERM SUPPORT */}
<div className="p-8 bg-white/5 border border-white/10 rounded-xl flex flex-col justify-between min-h-[220px] hover:border-[#16A34A]/50 transition-colors">
<span className="font-mono text-xs font-bold text-[#19C763] uppercase">04 / LONG-TERM SUPPORT</span>
<div>
<h4 className="font-display font-bold text-lg uppercase text-white mb-2">CONTINUOUS SCALE</h4>
<p className="text-xs text-white/60 leading-relaxed">We continue supporting and improving the solution after delivery with active telemetry and ML tuning.</p>
</div>
</div>
</div>
</div>
</section>
{/* 8. PROCESS (OUR PROCESS — FROM IDEA TO IMPACT) */}
<section className="w-full bg-[#FAFAF7] px-6 sm:px-10 lg:px-16 py-28 border-b border-[#E5EAE5]" id="process">
<div className="max-w-[1440px] mx-auto">
<div className="flex items-center gap-2 mb-3">
<span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A]">OUR PROCESS</span>
</div>
<h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight uppercase text-[#050505] mb-16">
          FROM IDEA TO IMPACT.
        </h2>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative">
{/* Step 01 */}
<div className="bg-white p-6 rounded-xl border border-[#E5EAE5] space-y-4">
<span className="font-display font-black text-4xl text-black/15 select-none block">01</span>
<div className="h-0.5 w-10 bg-[#16A34A]"></div>
<h4 className="font-display font-bold text-base text-[#050505] uppercase tracking-tight">DISCOVER</h4>
<p className="text-xs text-black/65 leading-relaxed">Understand the business and system requirements deeply.</p>
</div>
{/* Step 02 */}
<div className="bg-white p-6 rounded-xl border border-[#E5EAE5] space-y-4">
<span className="font-display font-black text-4xl text-black/15 select-none block">02</span>
<div className="h-0.5 w-10 bg-[#16A34A]"></div>
<h4 className="font-display font-bold text-base text-[#050505] uppercase tracking-tight">PLAN</h4>
<p className="text-xs text-black/65 leading-relaxed">Define the right solution, stack, and technology roadmap.</p>
</div>
{/* Step 03 */}
<div className="bg-white p-6 rounded-xl border border-[#E5EAE5] space-y-4">
<span className="font-display font-black text-4xl text-black/15 select-none block">03</span>
<div className="h-0.5 w-10 bg-[#16A34A]"></div>
<h4 className="font-display font-bold text-base text-[#050505] uppercase tracking-tight">DESIGN</h4>
<p className="text-xs text-black/65 leading-relaxed">Create the experience, UI layouts, and architecture structure.</p>
</div>
{/* Step 04 */}
<div className="bg-white p-6 rounded-xl border border-[#16A34A]/50 shadow-[0_10px_25px_rgba(22,163,74,0.12)] space-y-4 relative">
<div className="flex items-center justify-between">
<span className="font-display font-black text-4xl text-[#16A34A] select-none block">04</span>
<span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping"></span>
</div>
<div className="h-0.5 w-10 bg-[#16A34A]"></div>
<h4 className="font-display font-bold text-base text-[#050505] uppercase tracking-tight">BUILD</h4>
<p className="text-xs text-black/80 font-medium leading-relaxed">Develop and integrate the complete sovereign solution.</p>
</div>
{/* Step 05 */}
<div className="bg-white p-6 rounded-xl border border-[#E5EAE5] space-y-4">
<span className="font-display font-black text-4xl text-black/15 select-none block">05</span>
<div className="h-0.5 w-10 bg-[#16A34A]"></div>
<h4 className="font-display font-bold text-base text-[#050505] uppercase tracking-tight">LAUNCH</h4>
<p className="text-xs text-black/65 leading-relaxed">Rigorous stress testing, CI/CD deployment, and delivery.</p>
</div>
{/* Step 06 */}
<div className="bg-white p-6 rounded-xl border border-[#E5EAE5] space-y-4">
<span className="font-display font-black text-4xl text-black/15 select-none block">06</span>
<div className="h-0.5 w-10 bg-[#16A34A]"></div>
<h4 className="font-display font-bold text-base text-[#050505] uppercase tracking-tight">SUPPORT</h4>
<p className="text-xs text-black/65 leading-relaxed">Improve, monitor, and scale systems continuously.</p>
</div>
</div>
</div>
</section>
{/* 9. SELECTED WORK (BUILT FOR REAL BUSINESSES) */}
<section className="w-full bg-white px-6 sm:px-10 lg:px-16 py-28 border-b border-[#E5EAE5]" id="work">
<div className="max-w-[1440px] mx-auto">
<div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
<div>
<span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A] block mb-2">SELECTED WORK</span>
<h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight uppercase text-[#050505]">
              BUILT FOR REAL BUSINESSES.
            </h2>
</div>
<a className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#050505] hover:text-[#16A34A] transition-colors" href="#contact">
<span>VIEW ALL CLIENT REPOSITORIES</span>
<span className="material-symbols-outlined text-base">arrow_forward</span>
</a>
</div>
{/* Featured Project 1 */}
<div className="bg-[#FAFAF7] rounded-[14px] border border-[#E5EAE5] overflow-hidden shadow-sm mb-10 group">
<div className="grid grid-cols-1 lg:grid-cols-12">
<div className="lg:col-span-8 aspect-[16/9] lg:aspect-auto overflow-hidden bg-black">
<img alt="Enterprise Node Orchestration" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700" src="https://lh3.googleusercontent.com/aida/AEtjO1VgVwWGPl-KgE067JfDa010RZgWOqOCJ8YE9G0TduFIgYW-muGGNP-7Z_xy96e8S3Ekor0nTMB6eh7bOatoKIhwhmMC4aQRFQIGFqtN6q0F9f0JyQI2dFct5TySZSdtMWgGyPdBDHUytXbdsev84J-SGk62qQlbbqeTjtnIV_fGGTmf4YZeMG_emanb4ISgLcylhP91NpWirLqlFA4mHJOZBQffiVnMHS5cxSgQhxWbcUqeRCrEycmymUI"/>
</div>
<div className="lg:col-span-4 p-8 sm:p-10 flex flex-col justify-between">
<div className="space-y-4">
<span className="text-xs font-mono font-bold uppercase tracking-wider text-[#16A34A] block">AI SYSTEMS &amp; INFRASTRUCTURE</span>
<h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#050505] uppercase tracking-tight">
                  ENTERPRISE NODE ORCHESTRATION
                </h3>
<p className="text-sm text-black/70 leading-relaxed">
                  Autonomous workflow automation platform coordinating distributed cloud computing nodes, cutting redundant operational cycles by 64%.
                </p>
<div className="pt-2 text-xs font-mono space-y-1 text-black/60">
<p><span className="font-bold text-black">Industry:</span> Global Distributed Logistics</p>
<p><span className="font-bold text-black">What was built:</span> Cluster Orchestration Engine</p>
<p><span className="font-bold text-black">Technology:</span> Python, PyTorch, Node.js, Docker</p>
</div>
</div>
<div className="pt-6">
<a className="group/btn inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#050505] group-hover/btn:text-[#16A34A] transition-colors" href="#contact">
<span>VIEW PROJECT</span>
<span className="material-symbols-outlined text-base transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
</a>
</div>
</div>
</div>
</div>
{/* Project 2 & 3 Dual Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
{/* Project 2 */}
<div className="bg-[#FAFAF7] rounded-[14px] border border-[#E5EAE5] p-6 sm:p-8 flex flex-col justify-between group">
<div className="aspect-[16/10] rounded-lg overflow-hidden bg-white border border-[#E5EAE5] mb-6">
<img alt="Aura Risk Platform" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700" src="https://lh3.googleusercontent.com/aida/AEtjO1USjVT4pGeBJHBtrI_wPzS3u-Z_Pf68KOx-E04Zt311kZFX9wJaNAKw2cRUjNsFec2aSoRtCr1Hn86fgRx-le1lgj_0stxEfLSoDEuB4bgS-Mdojh1u4EU_fi4cKV0SOw7M5FZrKdnyFFvT0QJBYRWG43mdNWBKESVZP-ea_inhbQPyY7bNjNvsr0-WFjhBdyjdMKw6YskUIBKeyg4wA5djR-3Yvvhiwoq3bfwAywYf2s4791hrj5OC4Nk"/>
</div>
<div>
<span className="text-xs font-mono font-bold uppercase tracking-wider text-[#16A34A] block mb-1">DATA ANALYTICS &amp; INTELLIGENCE</span>
<h4 className="font-display font-bold text-xl text-[#050505] uppercase mb-2">AURA RISK PLATFORM</h4>
<p className="text-xs sm:text-sm text-black/70 leading-relaxed mb-4">
                Institutional decision console delivering predictive multi-market risk modeling and sub-second asset telemetry.
              </p>
<div className="text-xs font-mono space-y-1 text-black/60 mb-6">
<p><span className="font-bold text-black">Industry:</span> Quantitative FinTech</p>
<p><span className="font-bold text-black">Technology:</span> React, PostgreSQL, Python, Power BI</p>
</div>
<a className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#050505] group-hover:text-[#16A34A] transition-colors" href="#contact">
<span>VIEW PROJECT</span>
<span className="material-symbols-outlined text-base">arrow_forward</span>
</a>
</div>
</div>
{/* Project 3 */}
<div className="bg-[#FAFAF7] rounded-[14px] border border-[#E5EAE5] p-6 sm:p-8 flex flex-col justify-between group">
<div className="aspect-[16/10] rounded-lg overflow-hidden bg-black border border-[#E5EAE5] mb-6">
<img alt="Strata Operational Core" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700" src="https://lh3.googleusercontent.com/aida/AEtjO1V513xzKmIfDUH9sTdKmkC6HwhnHF0dqgGEC_QW0UD7JNXaERDdEAb4IZn4KvPZUVVvI51TNSqBkpO72jFfYoxL2Zawik24V2U8lBZFOkhh0pipnBiJnAejGHUVu-eS76sh4Fug_1EJYJR60lpsnYCEt9FOPaZN8XeTtgtvQBW89xxTpHcMR325PU6AfTfdOo4kyEkL0d4gf_jzV1qHmpYuoGuZObEkFkvf9D89JGfpdguc3tc0E3uhNTw"/>
</div>
<div>
<span className="text-xs font-mono font-bold uppercase tracking-wider text-[#16A34A] block mb-1">WEB DEVELOPMENT &amp; E-COMMERCE</span>
<h4 className="font-display font-bold text-xl text-[#050505] uppercase mb-2">STRATA OPERATIONAL CORE</h4>
<p className="text-xs sm:text-sm text-black/70 leading-relaxed mb-4">
                High-performance enterprise web application engineered for instant transactional visibility and high-load traffic.
              </p>
<div className="text-xs font-mono space-y-1 text-black/60 mb-6">
<p><span className="font-bold text-black">Industry:</span> Enterprise Commerce</p>
<p><span className="font-bold text-black">Technology:</span> Next.js, Tailwind CSS, Node.js, SQL</p>
</div>
<a className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#050505] group-hover:text-[#16A34A] transition-colors" href="#contact">
<span>VIEW PROJECT</span>
<span className="material-symbols-outlined text-base">arrow_forward</span>
</a>
</div>
</div>
</div>
</div>
</section>
{/* 10. TECHNOLOGY ECOSYSTEM SECTION */}
<section className="w-full bg-[#FAFAF7] px-6 sm:px-10 lg:px-16 py-28 border-b border-[#E5EAE5]">
<div className="max-w-[1440px] mx-auto">
<div className="max-w-3xl mb-16">
<span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A] block mb-2">ECOSYSTEM</span>
<h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight uppercase text-[#050505]">
            PROVEN TECHNOLOGIES. ZERO EXPERIMENTAL FLUFF.
          </h2>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
{/* DEVELOPMENT */}
<div className="bg-white p-8 rounded-xl border border-[#E5EAE5] shadow-sm">
<span className="text-xs font-mono font-bold text-[#16A34A] uppercase tracking-wider block mb-4">01 / DEVELOPMENT</span>
<h4 className="font-display font-bold text-xl uppercase mb-4 text-[#050505]">CORE CODEBASE</h4>
<div className="flex flex-wrap gap-2">
<span className="px-2.5 py-1 bg-[#FAFAF7] border border-[#E5EAE5] rounded text-xs font-mono font-medium">Python</span>
<span className="px-2.5 py-1 bg-[#FAFAF7] border border-[#E5EAE5] rounded text-xs font-mono font-medium">JavaScript</span>
<span className="px-2.5 py-1 bg-[#FAFAF7] border border-[#E5EAE5] rounded text-xs font-mono font-medium">React</span>
<span className="px-2.5 py-1 bg-[#FAFAF7] border border-[#E5EAE5] rounded text-xs font-mono font-medium">Node.js</span>
<span className="px-2.5 py-1 bg-[#FAFAF7] border border-[#E5EAE5] rounded text-xs font-mono font-medium">HTML5</span>
<span className="px-2.5 py-1 bg-[#FAFAF7] border border-[#E5EAE5] rounded text-xs font-mono font-medium">CSS3</span>
</div>
</div>
{/* AI / ML */}
<div className="bg-white p-8 rounded-xl border border-[#E5EAE5] shadow-sm">
<span className="text-xs font-mono font-bold text-[#16A34A] uppercase tracking-wider block mb-4">02 / AI &amp; ML</span>
<h4 className="font-display font-bold text-xl uppercase mb-4 text-[#050505]">INTELLIGENCE</h4>
<div className="flex flex-wrap gap-2">
<span className="px-2.5 py-1 bg-[#FAFAF7] border border-[#E5EAE5] rounded text-xs font-mono font-medium">TensorFlow</span>
<span className="px-2.5 py-1 bg-[#FAFAF7] border border-[#E5EAE5] rounded text-xs font-mono font-medium">PyTorch</span>
<span className="px-2.5 py-1 bg-[#FAFAF7] border border-[#E5EAE5] rounded text-xs font-mono font-medium">Scikit-learn</span>
<span className="px-2.5 py-1 bg-[#FAFAF7] border border-[#E5EAE5] rounded text-xs font-mono font-medium">OpenCV</span>
<span className="px-2.5 py-1 bg-[#FAFAF7] border border-[#E5EAE5] rounded text-xs font-mono font-medium">YOLO</span>
<span className="px-2.5 py-1 bg-[#FAFAF7] border border-[#E5EAE5] rounded text-xs font-mono font-medium">LLMs</span>
</div>
</div>
{/* DATA */}
<div className="bg-white p-8 rounded-xl border border-[#E5EAE5] shadow-sm">
<span className="text-xs font-mono font-bold text-[#16A34A] uppercase tracking-wider block mb-4">03 / DATA INFRA</span>
<h4 className="font-display font-bold text-xl uppercase mb-4 text-[#050505]">TELEMETRY</h4>
<div className="flex flex-wrap gap-2">
<span className="px-2.5 py-1 bg-[#FAFAF7] border border-[#E5EAE5] rounded text-xs font-mono font-medium">Pandas</span>
<span className="px-2.5 py-1 bg-[#FAFAF7] border border-[#E5EAE5] rounded text-xs font-mono font-medium">NumPy</span>
<span className="px-2.5 py-1 bg-[#FAFAF7] border border-[#E5EAE5] rounded text-xs font-mono font-medium">SQL</span>
<span className="px-2.5 py-1 bg-[#FAFAF7] border border-[#E5EAE5] rounded text-xs font-mono font-medium">MySQL</span>
<span className="px-2.5 py-1 bg-[#FAFAF7] border border-[#E5EAE5] rounded text-xs font-mono font-medium">PostgreSQL</span>
<span className="px-2.5 py-1 bg-[#FAFAF7] border border-[#E5EAE5] rounded text-xs font-mono font-medium">MongoDB</span>
<span className="px-2.5 py-1 bg-[#FAFAF7] border border-[#E5EAE5] rounded text-xs font-mono font-medium">Power BI</span>
</div>
</div>
{/* TOOLS & CLOUD */}
<div className="bg-white p-8 rounded-xl border border-[#E5EAE5] shadow-sm">
<span className="text-xs font-mono font-bold text-[#16A34A] uppercase tracking-wider block mb-4">04 / CLOUD &amp; TOOLS</span>
<h4 className="font-display font-bold text-xl uppercase mb-4 text-[#050505]">DEPLOYMENT</h4>
<div className="flex flex-wrap gap-2">
<span className="px-2.5 py-1 bg-[#FAFAF7] border border-[#E5EAE5] rounded text-xs font-mono font-medium">GitHub</span>
<span className="px-2.5 py-1 bg-[#FAFAF7] border border-[#E5EAE5] rounded text-xs font-mono font-medium">Jupyter</span>
<span className="px-2.5 py-1 bg-[#FAFAF7] border border-[#E5EAE5] rounded text-xs font-mono font-medium">Google Colab</span>
<span className="px-2.5 py-1 bg-[#FAFAF7] border border-[#E5EAE5] rounded text-xs font-mono font-medium">VS Code</span>
<span className="px-2.5 py-1 bg-[#FAFAF7] border border-[#E5EAE5] rounded text-xs font-mono font-medium">Cloud Platforms</span>
<span className="px-2.5 py-1 bg-[#FAFAF7] border border-[#E5EAE5] rounded text-xs font-mono font-medium">REST APIs</span>
</div>
</div>
</div>
</div>
</section>
{/* 11. ABOUT VERHOST (50/50 Split) */}
<section className="w-full bg-white px-6 sm:px-10 lg:px-16 py-28 border-b border-[#E5EAE5]" id="about">
<div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
{/* Left 6 cols: Text & Philosophy */}
<div className="lg:col-span-6 space-y-6">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
<span className="text-xs font-mono font-bold uppercase tracking-widest text-[#16A34A]">ABOUT VERHOST</span>
</div>
<h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight uppercase text-[#050505]">
            WE BUILD WHAT BUSINESSES NEED NEXT.
          </h2>
<div className="h-[2px] w-24 bg-[#16A34A]"></div>
<p className="text-base text-black/75 leading-relaxed">
            VERHOST is an enterprise technology and creative partner built for organizations that prioritize operational leverage over superficial novelty. We unite technical architecture with high-impact visual design to build software platforms, automation pipelines, and machine learning models that deliver clear ROI.
          </p>
<div className="grid grid-cols-2 gap-6 pt-4">
<div>
<span className="font-display font-black text-3xl text-[#16A34A]">100%</span>
<p className="text-xs font-mono uppercase text-black/60 mt-1">Sovereign Architecture</p>
</div>
<div>
<span className="font-display font-black text-3xl text-[#050505]">24/7</span>
<p className="text-xs font-mono uppercase text-black/60 mt-1">Monitored Telemetry</p>
</div>
</div>
</div>
{/* Right 6 cols: Sovereign Infrastructure & Brand Shield */}
<div className="lg:col-span-6 flex justify-center">
<div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden border border-[#E5EAE5] shadow-lg bg-[#FAFAF7] p-8 flex flex-col justify-between items-center group">
  <div className="w-full flex justify-between items-center text-[11px] font-mono text-black/50 border-b border-[#E5EAE5] pb-3">
    <span className="font-bold text-[#16A34A] uppercase tracking-wider">SOVEREIGN TECH INFRASTRUCTURE</span>
    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span> ACTIVE</span>
  </div>
  <div className="my-auto py-8 flex flex-col items-center">
    <img alt="VERHOST Brand Mark" className="h-28 sm:h-32 w-auto object-contain transition-transform duration-500 group-hover:scale-105 select-none filter drop-shadow-md" src="/verhost-logo-transparent.png"/>
  </div>
  <div className="w-full bg-white/95 backdrop-blur-md p-4 rounded-xl border border-[#E5EAE5] shadow-sm">
    <span className="text-xs font-mono font-bold uppercase text-[#16A34A] block">EXECUTIVE DIRECTION</span>
    <p className="text-sm font-bold text-[#050505]">Rooted in discipline. Focused on outcome-driven technology.</p>
  </div>
</div>
</div>
</div>
</section>
{/* 12. FINAL CTA & INTERACTIVE CONTACT CONSOLE */}
<section className="w-full bg-[#050505] text-white px-6 sm:px-10 lg:px-16 py-28 relative overflow-hidden" id="contact">
{/* Watermark Monogram Background Logo */}
<div className="absolute -right-20 -bottom-20 opacity-10 pointer-events-none w-[650px] h-[650px] flex items-center justify-center select-none">
<img alt="VH Watermark" className="w-full h-full object-contain filter" src="/verhost-logo-white.png"/>
</div>
{/* Radial Glow */}
<div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-[#16A34A]/15 rounded-full blur-[140px] pointer-events-none"></div>
<div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-14 items-start relative z-10">
{/* Left 6 Cols: Statement and Contact Details */}
<div className="lg:col-span-6 flex flex-col items-start">
<div className="h-1 w-20 bg-[#16A34A] mb-6"></div>
<h2 className="font-display font-extrabold text-4xl sm:text-6xl leading-[1.0] uppercase tracking-tight text-white mb-6">
            HAVE AN IDEA?<br/>
<span className="text-[#16A34A]">LET'S BUILD IT.</span>
</h2>
<p className="text-base sm:text-lg text-white/70 max-w-lg mb-10 leading-relaxed font-normal">
            Tell us what you're trying to achieve. We'll help turn the idea into a practical technology solution.
          </p>
<div className="w-full bg-white/5 border border-white/10 p-8 rounded-2xl space-y-6 mb-8">
<div className="space-y-1">
<span className="text-[11px] font-mono uppercase font-bold text-[#19C763] tracking-widest block">DIRECT INQUIRIES</span>
<a className="font-display font-bold text-xl sm:text-2xl text-white hover:text-[#19C763] transition-colors block" href="mailto:info.verhost@gmail.com">
                info.verhost@gmail.com
              </a>
</div>
<div className="h-px w-full bg-white/10"></div>
<div className="space-y-1">
<span className="text-[11px] font-mono uppercase font-bold text-[#19C763] tracking-widest block">DIRECT TELEPHONY</span>
<a className="font-display font-bold text-xl sm:text-2xl text-white hover:text-[#19C763] transition-colors block" href="tel:+919360171336">
                +91 93601 71336
              </a>
</div>
<div className="pt-2 flex items-center gap-2 text-xs font-mono text-white/60">
<span className="w-2 h-2 rounded-full bg-[#19C763]"></span>
<span>RESPONSE TIME: UNDER 2 HOURS GUARANTEED</span>
</div>
</div>
</div>
{/* Right 6 Cols: Interactive Contact Form */}
<div className="lg:col-span-6 bg-white/[0.04] backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-2xl shadow-2xl">
<h3 className="font-display font-bold text-xl uppercase tracking-wider text-white mb-6 flex items-center gap-2">
<span>PROJECT INQUIRY CONSOLE</span>
<span className="w-2 h-2 rounded-full bg-[#19C763]"></span>
</h3>
{formSubmitted ? (
  <div className="py-12 px-6 bg-white/5 border border-[#16A34A]/40 rounded-xl text-center space-y-4 animate-fade-in">
    <div className="w-14 h-14 rounded-full bg-[#16A34A]/20 border border-[#16A34A] text-[#19C763] flex items-center justify-center mx-auto">
      <span className="material-symbols-outlined text-3xl">task_alt</span>
    </div>
    <h4 className="font-display font-bold text-2xl uppercase tracking-wider text-white">Inquiry Received</h4>
    <p className="text-xs sm:text-sm font-mono text-white/80 max-w-md mx-auto leading-relaxed">
      A VERHOST lead systems architect has received your specifications. We will review your project parameters and contact you within 2 hours.
    </p>
    <button
      type="button"
      onClick={() => setFormSubmitted(false)}
      className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold tracking-wider uppercase rounded-lg transition-colors"
    >
      <span>Submit Another Inquiry</span>
    </button>
  </div>
) : (
  <form className="space-y-4" onSubmit={handleSubmit}>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1">Your Name *</label>
        <input 
          className="w-full bg-black/40 border border-white/15 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#16A34A] transition-colors" 
          placeholder="John Doe" 
          required 
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1">Email Address *</label>
        <input 
          className="w-full bg-black/40 border border-white/15 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#16A34A] transition-colors" 
          placeholder="john@company.com" 
          required 
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1">Company / Organization</label>
        <input 
          className="w-full bg-black/40 border border-white/15 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#16A34A] transition-colors" 
          placeholder="Acme Global" 
          type="text"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1">Service Required</label>
        <select 
          className="w-full bg-black border border-white/15 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#16A34A] transition-colors"
          value={formData.service}
          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
        >
          <option value="web">Web Development &amp; Architecture</option>
          <option value="ads">Promotion Ads Generation</option>
          <option value="posters">Posters &amp; Creative Design</option>
          <option value="analytics">Data Analytics &amp; Reporting</option>
          <option value="ml">Machine Learning Systems</option>
          <option value="chatbot">AI Chatbot Creation</option>
          <option value="full">Full-Stack Enterprise Solution</option>
        </select>
      </div>
    </div>
    <div>
      <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1">Estimated Budget Range</label>
      <select 
        className="w-full bg-black border border-white/15 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#16A34A] transition-colors"
        value={formData.budget}
        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
      >
        <option value="< $5,000 / Starter Project">&lt; $5,000 / Starter Project</option>
        <option value="$5,000 — $15,000 / Growth Solution">$5,000 — $15,000 / Growth Solution</option>
        <option value="$15,000 — $50,000 / Enterprise Scale">$15,000 — $50,000 / Enterprise Scale</option>
        <option value="$50,000+ / Full Sovereign Infrastructure">$50,000+ / Full Sovereign Infrastructure</option>
      </select>
    </div>
    <div>
      <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1">Project Details *</label>
      <textarea 
        className="w-full bg-black/40 border border-white/15 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#16A34A] transition-colors" 
        placeholder="Tell us about the challenge, timeline, and core goals..." 
        required 
        rows={4}
        value={formData.details}
        onChange={(e) => setFormData({ ...formData, details: e.target.value })}
      ></textarea>
    </div>
    <button className="w-full py-4 bg-[#16A34A] hover:bg-[#19C763] text-white font-bold text-xs sm:text-sm font-mono tracking-wider uppercase rounded-lg transition-all duration-300 shadow-[0_10px_25px_rgba(22,163,74,0.35)] flex items-center justify-center gap-2" type="submit">
      <span>SEND INQUIRY</span>
      <span className="material-symbols-outlined text-base">arrow_forward</span>
    </button>
  </form>
)}
</div>
</div>
</section>
</main>
{/* 13. FOOTER */}
<footer className="w-full bg-[#050505] text-white border-t border-white/10">
<div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-20">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
{/* Brand & Tagline */}
<div className="lg:col-span-5 space-y-4">
<a className="inline-block" href="#">
<img alt="VERHOST Logo" className="h-10 w-auto object-contain" src="/verhost-logo-white.png"/>
</a>
<p className="text-xs font-mono font-bold tracking-widest text-[#19C763] uppercase">TECHNOLOGY • CREATIVITY • INTELLIGENCE</p>
<p className="text-xs text-white/60 max-w-sm leading-relaxed">
            Sovereign enterprise infrastructure, generative AI integration, and scalable digital platforms engineered with uncompromising mathematical precision.
          </p>
<p className="text-xs font-mono text-white/40 pt-2">ROOTED IN VALUES. CONNECTED TO POSSIBILITIES.</p>
</div>
{/* Links: Services */}
<div className="lg:col-span-2 space-y-3">
<span className="text-xs font-mono font-bold uppercase tracking-wider text-white/40 block">SERVICES</span>
<ul className="space-y-2 text-xs text-white/75">
<li><a className="hover:text-[#19C763] transition-colors" href="#services">Web Development</a></li>
<li><a className="hover:text-[#19C763] transition-colors" href="#services">Promotion Ads</a></li>
<li><a className="hover:text-[#19C763] transition-colors" href="#services">Creative Design</a></li>
<li><a className="hover:text-[#19C763] transition-colors" href="#services">Data Analytics</a></li>
<li><a className="hover:text-[#19C763] transition-colors" href="#services">Machine Learning</a></li>
<li><a className="hover:text-[#19C763] transition-colors" href="#services">AI Chatbots</a></li>
</ul>
</div>
{/* Links: Navigation */}
<div className="lg:col-span-2 space-y-3">
<span className="text-xs font-mono font-bold uppercase tracking-wider text-white/40 block">NAVIGATION</span>
<ul className="space-y-2 text-xs text-white/75">
<li><a className="hover:text-[#19C763] transition-colors" href="#home">Home</a></li>
<li><a className="hover:text-[#19C763] transition-colors" href="#services">Services</a></li>
<li><a className="hover:text-[#19C763] transition-colors" href="#solutions">Solutions</a></li>
<li><a className="hover:text-[#19C763] transition-colors" href="#work">Selected Work</a></li>
<li><a className="hover:text-[#19C763] transition-colors" href="#about">About Us</a></li>
<li><a className="hover:text-[#19C763] transition-colors" href="#contact">Contact</a></li>
</ul>
</div>
{/* Communications & Social */}
<div className="lg:col-span-3 space-y-3">
<span className="text-xs font-mono font-bold uppercase tracking-wider text-white/40 block">COMMUNICATIONS</span>
<div className="space-y-1 text-xs text-white/80 font-mono">
<p>info.verhost@gmail.com</p>
<p>+91 93601 71336</p>
</div>
<div className="pt-4">
<span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block mb-2">NETWORK</span>
<div className="flex items-center gap-4 text-xs font-mono">
<a className="text-white/70 hover:text-[#19C763] transition-colors" href="#">LINKEDIN</a>
<a className="text-white/70 hover:text-[#19C763] transition-colors" href="#">INSTAGRAM</a>
<a className="text-white/70 hover:text-[#19C763] transition-colors" href="#">GITHUB</a>
</div>
</div>
</div>
</div>
{/* Legal & Copyright */}
<div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/40">
<p>© 2026 VERHOST. ALL RIGHTS RESERVED.</p>
<div className="flex items-center gap-6">
<a className="hover:text-white transition-colors" href="#">PRIVACY POLICY</a>
<a className="hover:text-white transition-colors" href="#">TERMS OF SERVICE</a>
<a className="hover:text-white transition-colors" href="#">SECURITY PROTOCOL</a>
</div>
</div>
</div>
</footer>
    </div>
  );
}
