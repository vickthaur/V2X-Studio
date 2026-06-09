// ==========================================
// V2X STUDIO — JavaScript Complet
// ==========================================

// UTILITY FUNCTIONS
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
const byId = (id) => document.getElementById(id);

// DOM READY
const ready = (callback) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
};

// ==========================================
// 1. INITIALIZATION
// ==========================================

ready(() => {
  initYear();
  initScrollReveal();
  initNavigation();
  initFormspree();
  initChatbot();
  initCarousel();
  initConsent();
  initTilt();
});

// ==========================================
// 2. YEAR UPDATER
// ==========================================

function initYear() {
  const yearEl = byId('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// ==========================================
// 3. SCROLL REVEAL ANIMATION
// ==========================================

function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    $$('.reveal').forEach(el => el.classList.add('show'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  $$('.reveal').forEach(el => observer.observe(el));
}

// ==========================================
// 4. SMOOTH NAVIGATION
// ==========================================

function initNavigation() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      const target = $(href);
      
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        updateActiveNav(href);
      }
    });
  });

  // Update active nav on scroll
  window.addEventListener('scroll', () => {
    updateActiveNav();
  }, { passive: true });
}

function updateActiveNav(href = null) {
  $$('.nav a').forEach(link => link.classList.remove('active'));
  
  if (href) {
    const activeLink = $(`a[href="${href}"]`);
    if (activeLink) activeLink.classList.add('active');
  } else {
    // Auto-detect based on scroll position
    const sections = $$('section[id]');
    const scrollPos = window.scrollY + 100;
    
    let currentSection = null;
    sections.forEach(section => {
      if (section.offsetTop <= scrollPos) {
        currentSection = section.id;
      }
    });
    
    if (currentSection) {
      const activeLink = $(`a[href="#${currentSection}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  }
}

// ==========================================
// 5. FORM HANDLING (FORMSPREE)
// ==========================================

function initFormspree() {
  const form = byId('lead-form');
  const statusEl = byId('form-status');
  
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.checkValidity()) {
      statusEl.textContent = 'Veuillez remplir tous les champs obligatoires.';
      statusEl.classList.add('error');
      return;
    }

    // Get form data
    const formData = new FormData(form);
    const nom = formData.get('nom');
    const email = formData.get('email');
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours…';
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    try {
      const response = await fetch('https://formspree.io/f/mvgwdrqo', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nom: formData.get('nom'),
          email: formData.get('email'),
          service: formData.get('service'),
          telephone: formData.get('telephone'),
          message: formData.get('message'),
          rgpd: formData.get('rgpd')
        })
      });

      if (response.ok) {
        // Redirect to thank you page with params
        const params = new URLSearchParams({
          nom: nom,
          email: email
        });
        window.location.href = `merci.html?${params.toString()}`;
      } else {
        throw new Error('Erreur du serveur');
      }
    } catch (error) {
      statusEl.textContent = '❌ Une erreur est survenue. Veuillez réessayer.';
      statusEl.classList.add('error');
      console.error('Form error:', error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

// ==========================================
// 6. CHATBOT
// ==========================================

function initChatbot() {
  const launcher = byId('vx2ChatLauncher');
  const window_ = byId('vx2ChatWindow');
  const messages = byId('vx2ChatMessages');
  const input = byId('vx2ChatInput');
  const sendBtn = byId('vx2ChatSend');
  const closeBtn = $('.vx2-chat-close');
  const badge = byId('vx2Badge');

  // Canned responses
  const cannedResponses = [
    { keywords: ['tarif', 'prix', 'coût'], response: 'Nos tarifs démarrent à 300€ pour une vitrine HTML et 600€ pour un WordPress complet. Formation IA à 150€/session.' },
    { keywords: ['délai', 'temps', 'combien de temps'], response: 'Pour un site vitrine : 1 à 2 semaines. Pour un WordPress : 2 à 3 semaines. Les délais peuvent varier selon la complexité.' },
    { keywords: ['seo', 'référencement', 'google'], response: 'Je peux vous aider avec l\'optimisation SEO locale pour Cavaillon : audit technique, optimisation on-page, Google Business Profile, et suivi de positions.' },
    { keywords: ['wordpress', 'site dynamique'], response: 'Spécialisé dans WordPress léger et sécurisé. Thèmes personnalisés, Gutenberg, blog complet et formation incluse.' },
    { keywords: ['formation', 'cours', 'ia'], response: 'Je propose des ateliers IA pratiques : prompts efficaces, automatisations, intégration IA dans vos workflows marketing.' }
  ];

  // Toggle chat window
  launcher.addEventListener('click', () => {
    window_.classList.toggle('open');
    badge.classList.remove('show');
    
    if (!messages.children.length) {
      setTimeout(() => addMessage('Bonjour ! Je suis l\'assistant V2X Studio. Comment puis-je vous aider ?', 'bot'), 500);
    }
  });

  closeBtn.addEventListener('click', () => {
    window_.classList.remove('open');
  });

  // Send message
  const send = () => {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';
    input.focus();

    // Find matching response
    setTimeout(() => {
      const response = cannedResponses.find(cr =>
        cr.keywords.some(kw => text.toLowerCase().includes(kw))
      );
      
      if (response) {
        addMessage(response.response, 'bot');
      } else {
        addMessage('Merci pour votre message ! Je transfère votre question à Victor qui vous répondra rapidement.', 'bot');
      }
    }, 600);
  };

  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') send();
  });

  // Add message to chat
  function addMessage(text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `vx2-msg ${type}`;
    msgDiv.innerHTML = `<div class="vx2-bubble">${escapeHtml(text)}</div>`;
    messages.appendChild(msgDiv);
    messages.scrollTop = messages.scrollHeight;
  }

  // Show badge on load (has new message)
  setTimeout(() => {
    badge.classList.add('show');
  }, 2000);
}

// ==========================================
// 7. CAROUSEL MODAL
// ==========================================

function initCarousel() {
  const modal = byId('carouselModal');
  const seoCard = byId('seoCard');
  const imgs = $$('.carousel-img');
  const closeBtn = $('.close', modal);
  const prevBtn = $('.prev', modal);
  const nextBtn = $('.next', modal);

  let current = 0;

  const show = (index) => {
    imgs.forEach((img, idx) => {
      img.style.display = idx === index ? 'block' : 'none';
      img.classList.toggle('active', idx === index);
    });
  };

  seoCard.addEventListener('click', () => {
    modal.style.display = 'flex';
    show(current = 0);
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  prevBtn.addEventListener('click', () => {
    current = (current - 1 + imgs.length) % imgs.length;
    show(current);
  });

  nextBtn.addEventListener('click', () => {
    current = (current + 1) % imgs.length;
    show(current);
  });

  // Close on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (modal.style.display !== 'flex') return;
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
    if (e.key === 'Escape') closeBtn.click();
  });
}

// ==========================================
// 8. CONSENT BANNER (RGPD)
// ==========================================

function initConsent() {
  const banner = byId('consentBanner');
  const allowBtn = byId('consentAllow');
  const denyBtn = byId('consentDeny');

  // Check if user has already decided
  const consent = localStorage.getItem('vx2_consent');
  if (!consent) {
    banner.classList.add('show');
  }

  allowBtn.addEventListener('click', () => {
    localStorage.setItem('vx2_consent', 'yes');
    banner.classList.remove('show');
    // Enable analytics here if needed
  });

  denyBtn.addEventListener('click', () => {
    localStorage.setItem('vx2_consent', 'no');
    banner.classList.remove('show');
  });
}

// ==========================================
// 9. TILT EFFECT (Hero Visual)
// ==========================================

function initTilt() {
  const el = $('.hero-visual img');
  if (!el) return;

  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    el.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg)`;
  });

  el.addEventListener('mouseleave', () => {
    el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
  });
}

// ==========================================
// 10. UTILITY: ESCAPE HTML
// ==========================================

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// ==========================================
// 11. PERFORMANCE OPTIMIZATIONS
// ==========================================

// Intersection Observer for lazy loading
if ('IntersectionObserver' in window) {
  const lazyImages = $$('img[loading="lazy"]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.src = entry.target.src || entry.target.dataset.src;
        observer.unobserve(entry.target);
      }
    });
  });

  lazyImages.forEach(img => imageObserver.observe(img));
}

// Service Worker registration (if available)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service Worker not available or failed to load
    });
  });
}

console.log('🚀 V2X Studio JS initialized');
