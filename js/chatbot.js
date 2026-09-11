/**
 * VerHost - Interactive AI Chatbot Assistant Widget
 * Simulates VerHost's proprietary AI agent RAG architecture.
 */

document.addEventListener('DOMContentLoaded', () => {
  initChatbot();
});

function initChatbot() {
  const launcher = document.querySelector('#chatbotLauncher');
  const container = document.querySelector('#chatbotContainer');
  const closeBtn = document.querySelector('#chatbotClose');
  const sendBtn = document.querySelector('#chatbotSend');
  const input = document.querySelector('#chatbotInput');
  const body = document.querySelector('#chatbotBody');
  const chips = document.querySelectorAll('.chat-chip');

  if (!launcher || !container) return;

  // Toggle chatbot
  launcher.addEventListener('click', () => {
    container.classList.toggle('open');
    if (container.classList.contains('open')) {
      input?.focus();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      container.classList.remove('open');
    });
  }

  // Quick chips
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.textContent.trim();
      sendMessage(text);
    });
  });

  // Send message
  const handleSend = () => {
    const text = input.value.trim();
    if (!text) return;
    sendMessage(text);
    input.value = '';
  };

  if (sendBtn) sendBtn.addEventListener('click', handleSend);
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }

  function sendMessage(userText) {
    appendBubble(userText, 'user');

    // Simulate agent typing
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chat-bubble chat-bubble-bot';
    typingIndicator.innerHTML = `
      <span style="display:inline-flex; gap:4px; align-items:center;">
        <span class="pulse-dot" style="width:6px; height:6px;"></span>
        <span class="pulse-dot" style="width:6px; height:6px; animation-delay: 0.2s;"></span>
        <span class="pulse-dot" style="width:6px; height:6px; animation-delay: 0.4s;"></span>
        <span style="margin-left:6px; font-size:12px; color:var(--color-primary-light);">VerHost Agent analyzing...</span>
      </span>
    `;
    body.appendChild(typingIndicator);
    body.scrollTop = body.scrollHeight;

    setTimeout(() => {
      typingIndicator.remove();
      const botResponse = generateBotResponse(userText);
      appendBubble(botResponse, 'bot');
    }, 700);
  }

  function appendBubble(text, sender) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble chat-bubble-${sender}`;
    bubble.innerHTML = text;
    body.appendChild(bubble);
    body.scrollTop = body.scrollHeight;
  }

  function generateBotResponse(query) {
    const q = query.toLowerCase();

    if (q.includes('service') || q.includes('what do you do') || q.includes('pillars')) {
      return `VerHost operates across <strong>6 core disciplines</strong> under one roof:<br/>
      1. 🌐 <strong>Web Development</strong> (Scalable Next.js, custom portals, high-converting platforms)<br/>
      2. 🎯 <strong>Promotion Ads Generation</strong> (Targeted ad copy, visual creative pipelines)<br/>
      3. 🎨 <strong>Posters & Visual Design</strong> (Brand identity & print/digital assets)<br/>
      4. 📊 <strong>Data Analytics & KPI Systems</strong> (Real-time dashboards & telemetry)<br/>
      5. 🔮 <strong>ML Future Prediction</strong> (Churn prediction, sales forecasting, risk modeling)<br/>
      6. 🤖 <strong>AI Chatbots & Agents</strong> (Custom LLMs with strict business ground-truth verification).`;
    }

    if (q.includes('price') || q.includes('cost') || q.includes('quote') || q.includes('rate')) {
      return `Our engagements are structured for clear commercial ROI without hidden retainers. You can experiment with our interactive <strong>Project Scope & Cost Estimator</strong> directly on our <a href="contact.html" style="color:#34d399; text-decoration:underline;">Contact Page</a>! For custom enterprise architecture or ML fine-tuning, projects typically start with a technical scoping blueprint.`;
    }

    if (q.includes('tech') || q.includes('stack') || q.includes('tools')) {
      return `Our engineering foundation uses battle-tested enterprise technologies: 
      <strong>TypeScript, React, Next.js, Node.js, Python, PyTorch, LangChain, PostgreSQL, Redis, Docker, and AWS</strong>. Every deployment is configured for 99.98% SLA and zero-downtime rollouts.`;
    }

    if (q.includes('contact') || q.includes('call') || q.includes('email') || q.includes('phone') || q.includes('talk')) {
      return `You can connect directly with our engineering leadership:<br/>
      📧 <strong>info.verhost@gmail.com</strong><br/>
      📞 <strong>+91 93601 71336</strong><br/>
      Or book a session through our <a href="contact.html" style="color:#34d399; text-decoration:underline;">Consultation Form</a>.`;
    }

    if (q.includes('ai') || q.includes('bot') || q.includes('machine learning')) {
      return `We build both customer-facing support bots and internal RAG knowledge engines with enterprise guardrails (HIPAA compliance, zero data egress, and sub-150ms latency).`;
    }

    return `Thank you for asking! VerHost helps businesses solve complex bottlenecks through unified web architecture, applied AI, and creative marketing. Would you like to explore our <a href="services.html" style="color:#34d399; text-decoration:underline;">Services</a> or request an <a href="contact.html" style="color:#34d399; text-decoration:underline;">instant project estimate</a>?`;
  }
}
