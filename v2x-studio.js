/* ==========================================
   V2X STUDIO — JavaScript Premium
   Animations avancées, parallax, scroll effects
   ========================================== */

// UTILITIES
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const byId = (id) => document.getElementById(id);

// DOM READY
const ready = (cb) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cb);
  } else {
    cb();
  }
};

// ==========================================
// INITIALIZATION
// ==========================================

ready(() => {
  console.log('🚀 V2X Studio Premium JS initialized');
  
  initScrollAnimations();
  initNavigation();
  initParallax();
  initFormspree();
  initChatbot();
  initCarousel();
  initConsent();
  initHeaderScroll();
  initYear();
  initButtonRipple();
  initScrollProgress();
});

// ==========================================
// 1. ADVANCED SCROLL ANIMATIONS
// ==========================================

function initScrollAnimations() {
  const revealElements = $$('.reveal');
  
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('show'));
    return;
  }

  const observerOptions = {
    threshold: [0, 0.15, 0.3],
    rootMargin: '0px 0px -80px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger effect avec délai
        const delay = index * 50; // 50ms entre chaque élément
        setTimeout(() => {
          entry.target.classList.add('show');
        }, delay);
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

// ==========================================
// 2. NAVIGATION PREMIUM
// ==========================================

function initNavigation() {
  const navLinks = $$('a[href^="#"]');
  const nav = $('.nav');
  
  // Smooth scroll et active state
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      const target = $(href);
      
      if (target) {
        e.preventDefault();
        
        // Smooth scroll avec offset
        const offsetTop = target.offsetTop - 100;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
        
        updateActiveNav(href);
      }
    });
  });

  // Update active on scroll
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
    const sections = $$('section[id]');
    const scrollPos = window.scrollY + 150;
    
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
// 3. PARALLAX EFFECT (Hero Visual)
// ==========================================

function initParallax() {
  const heroVisual = $('.hero-visual img');
  if (!heroVisual) return;

  let tilt = { x: 0, y: 0 };
  
  // Mouse parallax
  heroVisual.parentElement.addEventListener('mousemove', (e) => {
    const rect = heroVisual.parentElement.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    
    tilt.x = x;
    tilt.y = y;
    
    heroVisual.style.transform = `
      perspective(1000px) 
      rotateX(${y}deg) 
      rotateY(${x}deg) 
      scale(1.02)
    `;
  });

  heroVisual.parentElement.addEventListener('mouseleave', () => {
    tilt = { x: 0, y: 0 };
    heroVisual.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
  });

  // Scroll parallax
  window.addEventListener('scroll', () => {
    const rect = heroVisual.parentElement.getBoundingClientRect();
    const scrollPercent = (window.innerHeight - rect.top) / window.innerHeight;
    
    if (scrollPercent > 0 && scrollPercent < 1) {
      const offset = (scrollPercent - 0.5) * 30;
      heroVisual.style.transform = `
        perspective(1000px) 
        rotateX(${tilt.y}deg) 
        rotateY(${tilt.x}deg) 
        translateZ(${offset}px)
      `;
    }
  }, { passive: true });
}

// ==========================================
// 4. HEADER SCROLL EFFECT
// ==========================================

function initHeaderScroll() {
  const header = $('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

// ==========================================
// 5. BUTTON RIPPLE EFFECT
// ==========================================

function initButtonRipple() {
  $$('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('div');
      
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        top: ${y}px;
        left: ${x}px;
        pointer-events: none;
        animation: ripple 0.6s ease-out;
      `;
      
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

// Keyframe d'animation ripple
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ==========================================
// 6. SCROLL PROGRESS BAR
// ==========================================

function initScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #0a4466, #06b6d4);
    width: 0%;
    z-index: 999;
    transition: width 0.1s ease;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = scrollPercent + '%';
  }, { passive: true });
}

// ==========================================
// 7. FORM HANDLING
// ==========================================

function initFormspree() {
  const form = byId('lead-form');
  const statusEl = byId('form-status');
  
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!form.checkValidity()) {
      showStatus('Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours...';

    try {
      const response = await fetch('https://formspree.io/f/mvgwdrqo', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: form.nom.value,
          email: form.email.value,
          service: form.service.value,
          telephone: form.telephone.value,
          message: form.message.value,
          rgpd: form.rgpd.checked
        })
      });

      if (response.ok) {
        const nom = form.nom.value;
        const email = form.email.value;
        window.location.href = `merci.html?nom=${encodeURIComponent(nom)}&email=${encodeURIComponent(email)}`;
      } else {
        throw new Error('Erreur serveur');
      }
    } catch (error) {
      showStatus('Une erreur est survenue. Veuillez réessayer.', 'error');
      console.error('Form error:', error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });

  function showStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = `form-status ${type} show`;
    
    setTimeout(() => {
      statusEl.classList.remove('show');
    }, 4000);
  }
}

// ==========================================
// 8. CHATBOT ADVANCED
// ==========================================

function initChatbot() {
  const launcher = byId('vx2ChatLauncher');
  const window_ = byId('vx2ChatWindow');
  const messages = byId('vx2ChatMessages');
  const input = byId('vx2ChatInput');
  const sendBtn = byId('vx2ChatSend');
  const closeBtn = $('.vx2-chat-close');
  const badge = byId('vx2Badge');

  const responses = [
    { 
      keywords: ['tarif', 'prix', 'coût', 'budget'], 
      response: 'Nos tarifs : Site Vitrine 300€, WordPress Premium 600€, Formation IA 150€/session. Devis personnalisé sur demande.' 
    },
    { 
      keywords: ['délai', 'temps', 'combien', 'semaine'], 
      response: 'Délais standards : Site vitrine 1-2 semaines, WordPress 2-3 semaines, SEO selon ampleur. Nous discutons timeline avant de démarrer.' 
    },
    { 
      keywords: ['seo', 'référencement', 'google', 'classement'], 
      response: 'SEO local pour Cavaillon et Vaucluse. Audit technique complet, optimisation on-page, stratégie contenu et suivi positions.' 
    },
    { 
      keywords: ['wordpress', 'site', 'dynamique', 'blog'], 
      response: 'WordPress sur-mesure : thèmes premium, sécurité renforcée, blog intégré, autonomie totale. Formation incluse.' 
    },
    { 
      keywords: ['ia', 'formation', 'cours', 'ateliers'], 
      response: 'Formations IA pratiques : prompts efficaces, automatisations, intégration dans vos workflows marketing. Sur mesure selon vos besoins.' 
    },
    {
      keywords: ['contact', 'email', 'téléphone'],
      response: 'Contactez-nous : victor.2xstudio@gmail.com ou 07 85 97 71 64. Réponse garantie sous 24h.'
    }
  ];

  // Toggle chat
  launcher.addEventListener('click', () => {
    window_.classList.toggle('open');
    badge.classList.remove('show');
    input.focus();
    
    if (!messages.children.length) {
      setTimeout(() => addMessage('Bonjour ! Comment puis-je vous aider ?', 'bot'), 300);
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

    setTimeout(() => {
      const response = responses.find(r =>
        r.keywords.some(kw => text.toLowerCase().includes(kw))
      );
      
      addMessage(response ? response.response : 'Merci ! Je transfère votre question à Victor.', 'bot');
    }, 500);
  };

  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });

  // Typing indicator
  input.addEventListener('focus', () => {
    input.parentElement.style.boxShadow = '0 0 0 3px rgba(10, 68, 102, 0.1)';
  });

  input.addEventListener('blur', () => {
    input.parentElement.style.boxShadow = 'none';
  });

  function addMessage(text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `vx2-msg ${type}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'vx2-bubble';
    bubble.textContent = text;
    
    msgDiv.appendChild(bubble);
    messages.appendChild(msgDiv);
    messages.scrollTop = messages.scrollHeight;

    // Animation
    setTimeout(() => {
      bubble.style.animation = 'none';
    }, 300);
  }

  // Show badge after delay
  setTimeout(() => {
    badge.classList.add('show');
  }, 2000);
}

// ==========================================
// 9. CAROUSEL ADVANCED
// ==========================================

function initCarousel() {
  const modal = byId('carouselModal');
  const seoCard = byId('seoCard');
  const imgs = $$('.carousel-img');
  const closeBtn = $('.close', modal);
  const prevBtn = $('.prev', modal);
  const nextBtn = $('.next', modal);

  let current = 0;
  let isAnimating = false;

  const show = (index) => {
    if (isAnimating) return;
    isAnimating = true;

    imgs.forEach((img, idx) => {
      img.style.opacity = idx === index ? '1' : '0';
      img.style.transition = 'opacity 0.3s ease';
    });

    setTimeout(() => {
      isAnimating = false;
    }, 300);
  };

  // Open modal
  seoCard.addEventListener('click', () => {
    modal.style.display = 'flex';
    modal.style.animation = 'fadeIn 0.3s ease';
    show(current = 0);
    document.body.style.overflow = 'hidden';
  });

  // Close modal
  const closeModal = () => {
    modal.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }, 300);
  };

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Navigation
  prevBtn.addEventListener('click', () => {
    current = (current - 1 + imgs.length) % imgs.length;
    show(current);
  });

  nextBtn.addEventListener('click', () => {
    current = (current + 1) % imgs.length;
    show(current);
  });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (modal.style.display !== 'flex') return;
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
    if (e.key === 'Escape') closeModal();
  });
}

// Animations CSS
const carouselStyle = document.createElement('style');
carouselStyle.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;
document.head.appendChild(carouselStyle);

// ==========================================
// 10. CONSENT BANNER
// ==========================================

function initConsent() {
  const banner = byId('consentBanner');
  const allowBtn = byId('consentAllow');
  const denyBtn = byId('consentDeny');

  const consent = localStorage.getItem('vx2_consent');
  if (!consent) {
    banner.classList.add('show');
  }

  allowBtn.addEventListener('click', () => {
    localStorage.setItem('vx2_consent', 'yes');
    banner.classList.remove('show');
  });

  denyBtn.addEventListener('click', () => {
    localStorage.setItem('vx2_consent', 'no');
    banner.classList.remove('show');
  });
}

// ==========================================
// 11. UTILITY - YEAR
// ==========================================

function initYear() {
  const yearEl = byId('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// ==========================================
// 12. PERFORMANCE MONITORING
// ==========================================

if (window.PerformanceObserver) {
  try {
    // Web Vitals monitoring
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log(`Performance: ${entry.name} = ${entry.duration.toFixed(2)}ms`);
      }
    });
    observer.observe({ entryTypes: ['measure', 'navigation'] });
  } catch (e) {
    // Silently fail if not supported
  }
}

// ==========================================
// 13. LAZY LOAD IMAGES
// ==========================================

if ('IntersectionObserver' in window) {
  const lazyImages = $$('img[loading="lazy"]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.src || img.dataset.src;
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => imageObserver.observe(img));
}

// Log success
console.log('✅ V2X Studio Premium JS loaded with advanced features');
