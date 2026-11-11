import React, { useState, useRef, useEffect } from 'react';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
const PRIMARY_MODEL = 'nvidia/nemotron-3.5-lightning:free';
const FALLBACK_MODEL = 'google/gemma-4-31b-it:free';
const WHATSAPP_URL = 'https://wa.me/919360171336?text=Hi%20VERHOST,%20I%20would%20like%20to%20inquire%20about%20your%20services.';

const SYSTEM_PROMPT = `You are the official VERHOST AI Concierge. VERHOST is a premier technology and digital engineering firm that helps businesses build attractive, outcome-driven, and growth-based digital presence.

Our 6 Core Services:
1. DIGITAL PRESENCE: E-commerce stores & marketplaces, high-converting landing pages, custom web applications, SaaS client portals, SEO & mobile optimization.
2. AI CONVERSATIONS: 24/7 autonomous customer support chatbots, company knowledge base assistants (RAG), WhatsApp & multi-channel AI integration.
3. GROWTH CREATIVE: High-converting video ads, Meta & TikTok motion commercials, 3D product teasers, viral reels & explainer content.
4. BRAND COMMUNICATION: Complete brand identity & logo systems, marketing posters, digital banners, social media kits, pitch decks.
5. DIGITAL MARKETING: High-ROI Meta ads (Facebook & Instagram), Social Media Management (SMM), Google Search & YouTube PPC, sales funnels.
6. WHATSAPP AUTOMATION: 24/7 automated query replies, automated client support, lead capture & CRM sync, broadcast follow-up workflows.

Contact & Booking:
- Official WhatsApp: +91 93601 71336
- Official Email: info.verhost@gmail.com
- Response Time: Within 24 hours worldwide

Your Tone & Style:
- Warm, professional, articulate, and executive.
- Keep answers clear, engaging, and relatively concise (2-4 sentences or short bullet points).
- Actively guide prospective clients on which service best fits their business goals.
- Remind them that they can initiate a direct project inquiry or chat with the team on WhatsApp at any time.

CRITICAL FORMATTING GUIDELINE:
- Do NOT output markdown asterisks (such as ** or ***) for bolding.
- Write in clean, elegant prose with natural punctuation.
- For lists, use simple hyphen bullets (- Item title: explanation) without asterisks.`;

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'bot',
    text: 'Welcome to VERHOST! I am your AI Concierge. How can I assist you with your digital presence, custom AI, growth marketing, or automation today?',
    time: 'Just now'
  }
];

const QUICK_PROMPTS = [
  'What services does VERHOST offer?',
  'Tell me about WhatsApp Automation',
  'How do you build custom websites?',
  'Connect with human support on WhatsApp'
];

/**
 * FormattedMessage Component
 * Converts raw markdown/asterisks into clean, executive typography
 * and highlights contact links.
 */
function FormattedMessage({ text }) {
  if (!text) return null;

  const rawLines = text.split('\n');
  const blocks = [];
  let currentBulletList = [];

  const flushBullets = () => {
    if (currentBulletList.length > 0) {
      blocks.push({ type: 'bullets', items: [...currentBulletList] });
      currentBulletList = [];
    }
  };

  rawLines.forEach((rawLine) => {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      flushBullets();
      blocks.push({ type: 'spacer' });
      return;
    }

    // Check if bullet point
    const isBullet = /^[\*\-•]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed) || /^[\*\-]\s*\*\*/.test(trimmed);

    if (isBullet) {
      const cleanBullet = trimmed
        .replace(/^[\*\-•]\s+/, '')
        .replace(/^\d+\.\s+/, '')
        .replace(/^[\*\-]\s*/, '');
      currentBulletList.push(cleanBullet);
    } else {
      flushBullets();
      blocks.push({ type: 'paragraph', text: trimmed });
    }
  });

  flushBullets();

  const renderInline = (str) => {
    // Match **bold** patterns
    const parts = [];
    const regex = /\*\*(.*?)\*\*/g;
    let lastIdx = 0;
    let match;

    while ((match = regex.exec(str)) !== null) {
      if (match.index > lastIdx) {
        parts.push(str.substring(lastIdx, match.index));
      }
      parts.push({ bold: match[1] });
      lastIdx = regex.lastIndex;
    }
    if (lastIdx < str.length) {
      parts.push(str.substring(lastIdx));
    }

    return parts.map((part, idx) => {
      if (typeof part === 'object' && part.bold) {
        const cleanBold = part.bold.replace(/\*+/g, '').trim();
        return (
          <strong key={idx} className="font-bold text-white tracking-wide">
            {cleanBold}
          </strong>
        );
      }

      // Clean any loose asterisks
      const cleanStr = String(part).replace(/\*+/g, '');

      // Check for phone number to link directly to WhatsApp
      if (cleanStr.includes('+91 93601 71336') || cleanStr.includes('+919360171336')) {
        const subParts = cleanStr.split(/(\+91\s?93601\s?71336)/g);
        return subParts.map((sp, sIdx) => {
          if (/(\+91\s?93601\s?71336)/.test(sp)) {
            return (
              <a
                key={`${idx}-${sIdx}`}
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#25D366] hover:underline font-bold inline-flex items-center gap-0.5 mx-0.5"
              >
                <span>{sp}</span>
                <span className="text-[10px]">↗</span>
              </a>
            );
          }
          return <span key={`${idx}-${sIdx}`}>{sp}</span>;
        });
      }

      // Check for email to link
      if (cleanStr.includes('info.verhost@gmail.com')) {
        const subParts = cleanStr.split(/(info\.verhost@gmail\.com)/g);
        return subParts.map((sp, sIdx) => {
          if (sp === 'info.verhost@gmail.com') {
            return (
              <a
                key={`${idx}-${sIdx}`}
                href="mailto:info.verhost@gmail.com"
                className="text-[#19C763] hover:underline font-semibold mx-0.5"
              >
                {sp}
              </a>
            );
          }
          return <span key={`${idx}-${sIdx}`}>{sp}</span>;
        });
      }

      return <span key={idx}>{cleanStr}</span>;
    });
  };

  return (
    <div className="space-y-2 leading-relaxed text-[12px] sm:text-[12.5px]">
      {blocks.map((block, bIdx) => {
        if (block.type === 'spacer') {
          return <div key={bIdx} className="h-1" />;
        }
        if (block.type === 'bullets') {
          return (
            <ul key={bIdx} className="space-y-1.5 my-1.5 pl-0.5">
              {block.items.map((item, iIdx) => (
                <li key={iIdx} className="flex items-start gap-2 text-left">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#19C763] flex-shrink-0 mt-1.5 shadow-[0_0_6px_#19C763]" />
                  <span className="flex-1 text-white/95">{renderInline(item)}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={bIdx} className="text-white/95">
            {renderInline(block.text)}
          </p>
        );
      })}
    </div>
  );
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const msgCounterRef = useRef(10);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const sendMessageToOpenRouter = async (conversationHistory, userText) => {
    const formattedMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      })),
      { role: 'user', content: userText }
    ];

    const callApi = async (modelName) => {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: modelName,
          messages: formattedMessages,
          reasoning: { effort: 'none' },
          temperature: 0.7,
          max_tokens: 650
        })
      });

      if (!res.ok) {
        throw new Error(`API responded with ${res.status}`);
      }
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content || !content.trim()) {
        throw new Error('Empty response content');
      }
      return content.trim();
    };

    try {
      return await callApi(PRIMARY_MODEL);
    } catch {
      try {
        return await callApi(FALLBACK_MODEL);
      } catch {
        const lower = userText.toLowerCase();
        if (lower.includes('whatsapp') || lower.includes('automation')) {
          return "WhatsApp Automation by VERHOST enables 24/7 automated query replies, automated client support, lead capture & CRM synchronization, and broadcast messaging.\n\nWould you like to connect directly with our engineering team on WhatsApp at +91 93601 71336 to set this up for your business?";
        }
        if (lower.includes('web') || lower.includes('site') || lower.includes('digital presence')) {
          return "Our Digital Presence practice engineers high-converting landing pages, e-commerce stores, scalable web applications, and client portals optimized for speed and SEO.\n\nYou can initiate an engagement directly or reach us on WhatsApp (+91 93601 71336)!";
        }
        if (lower.includes('marketing') || lower.includes('ads') || lower.includes('meta')) {
          return "Our Digital Marketing practice manages high-ROI Meta ads (Facebook & Instagram), Social Media Management (SMM), and Google PPC search campaigns.\n\nFeel free to chat directly with us on WhatsApp (+91 93601 71336) for a tailored growth strategy!";
        }
        if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
          return "Hello! Welcome to VERHOST. How can I assist you with your digital presence, custom AI, growth marketing, or automation today?";
        }
        return "Thank you for reaching out to VERHOST! We build attractive, outcome-driven, and growth-focused digital presence across Web Development, AI Chatbots, Growth Ads, Brand Identity, Digital Marketing, and WhatsApp Automation.\n\nYou can chat directly with our team on WhatsApp at +91 93601 71336 for an immediate consultation!";
      }
    }
  };

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    if (query.toLowerCase().includes('whatsapp') && query.toLowerCase().includes('connect')) {
      window.open(WHATSAPP_URL, '_blank');
    }

    const userMsg = {
      id: ++msgCounterRef.current,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const botResponse = await sendMessageToOpenRouter(messages, query);
      const botMsg = {
        id: ++msgCounterRef.current,
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg = {
        id: ++msgCounterRef.current,
        sender: 'bot',
        text: 'Sorry, I encountered an issue. You can connect with our team directly on WhatsApp (+91 93601 71336) for immediate assistance.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* ─── FLOATING ACTION BUTTONS (BOTTOM RIGHT) ─── */}
      <div className="fixed bottom-5 sm:bottom-6 right-5 sm:right-6 z-50 flex flex-col items-end gap-3 select-none">
        
        {/* WhatsApp Direct Action Button */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with VERHOST on WhatsApp"
          className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] text-white shadow-[0_6px_20px_rgba(37,211,102,0.45)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.7)] hover:scale-110 active:scale-95 transition-all duration-300"
        >
          {/* WhatsApp SVG Icon */}
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>

          {/* Hover Tooltip */}
          <span className="absolute right-14 bg-black/90 text-white font-mono text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap border border-white/10">
            WhatsApp
          </span>
        </a>

        {/* AI Chatbot Launcher Button (With VH Logo) */}
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            setHasUnread(false);
          }}
          aria-label={isOpen ? 'Close VERHOST AI Chatbot' : 'Open VERHOST AI Chatbot'}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#050505] border-2 border-[#16A34A] text-white shadow-[0_10px_35px_rgba(22,163,74,0.4)] hover:shadow-[0_12px_45px_rgba(25,199,99,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
        >
          {/* Active online pulse dot */}
          <span className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full bg-[#19C763] border-2 border-[#050505] animate-pulse z-10" />

          {isOpen ? (
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <div className="flex items-center justify-center w-full h-full p-2.5">
              <img
                src="/verhost-logo-white.webp"
                alt="VERHOST Logo"
                className="w-full h-full object-contain filter drop-shadow group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="hidden font-display font-extrabold text-sm tracking-tight text-[#19C763]">
                VH
              </span>
            </div>
          )}

          {/* Hover Tooltip */}
          {!isOpen && (
            <span className="absolute right-16 bg-black/90 text-white font-mono text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap border border-white/10 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#19C763]"></span>
              VERHOST AI
            </span>
          )}

          {/* Unread Message Pill Indicator */}
          {hasUnread && !isOpen && (
            <span className="absolute -top-1 -left-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#19C763] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-[#16A34A] text-[9px] font-bold text-white items-center justify-center">1</span>
            </span>
          )}
        </button>
      </div>

      {/* ─── CHATBOT WINDOW DIALOG (LENIS SCROLL PREVENTED) ─── */}
      {isOpen && (
        <div 
          role="dialog"
          aria-label="VERHOST AI Concierge"
          data-lenis-prevent="true"
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[410px] h-[560px] max-h-[82vh] bg-[#0A0D0A]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 overscroll-contain select-text"
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-black/70 border-b border-white/10 flex items-center justify-between select-none">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full bg-black/80 border border-[#16A34A]/50 flex items-center justify-center p-1.5 overflow-hidden">
                <img
                  src="/verhost-logo-white.webp"
                  alt="VERHOST"
                  className="w-full h-full object-contain"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#19C763] border-2 border-black"></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-sm text-white tracking-tight">VERHOST AI</h3>
                  <span className="text-[9px] font-mono uppercase bg-[#16A34A]/20 text-[#19C763] px-1.5 py-0.5 rounded border border-[#16A34A]/30">
                    ONLINE
                  </span>
                </div>
                <p className="text-[10px] font-mono text-white/50">Sovereign Intelligence Concierge</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMessages(INITIAL_MESSAGES)}
                title="Clear conversation"
                className="w-8 h-8 rounded-full text-white/60 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors text-xs"
              >
                ↺
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="w-8 h-8 rounded-full text-white/60 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Stream (Independent Smooth Scrolling) */}
          <div 
            data-lenis-prevent="true"
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-3.5 chat-scrollbar font-sans"
          >
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div key={m.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-2.5 ${
                      isUser
                        ? 'bg-[#16A34A] text-white rounded-br-sm shadow-md text-xs sm:text-[13px] leading-relaxed'
                        : 'bg-white/10 text-white/95 border border-white/10 rounded-bl-sm backdrop-blur-md'
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{m.text}</p>
                    ) : (
                      <FormattedMessage text={m.text} />
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-white/40 mt-1 px-1">{m.time}</span>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-white/50 text-xs px-2 py-1">
                <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center p-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#19C763] animate-ping" />
                </div>
                <span className="font-mono text-[10px] text-[#19C763]">Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Suggestions */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 border-t border-white/5 bg-black/30 select-none">
              <div className="text-[10px] font-mono text-white/40 uppercase mb-1.5 tracking-wider">Suggested Queries:</div>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    className="text-[10px] bg-white/5 hover:bg-[#16A34A]/20 hover:text-[#19C763] hover:border-[#16A34A]/40 border border-white/10 text-white/70 px-2.5 py-1 rounded-full transition-all text-left cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 bg-black/80 border-t border-white/10 select-none">
            <div className="relative flex items-center">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about VERHOST services..."
                className="w-full bg-white/5 border border-white/15 focus:border-[#16A34A] focus:outline-none rounded-xl pl-3.5 pr-11 py-2.5 text-xs text-white placeholder-white/40 resize-none font-sans"
              />
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                className="absolute right-2 w-8 h-8 rounded-lg bg-[#16A34A] hover:bg-[#19C763] disabled:opacity-40 disabled:hover:bg-[#16A34A] text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-[2.5]" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-white/40 px-1">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#19C763] animate-pulse"></span>
                <span>Active Concierge</span>
              </span>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#25D366] hover:underline flex items-center gap-1"
              >
                <span>WhatsApp Human Desk</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
