// Main JS for CSRGO Services (minimal, no build tools)

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  // Current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  // Mobile navigation toggle
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('scale-y-100');
      if (isOpen) {
        mobileMenu.classList.remove('scale-y-100', 'opacity-100');
        mobileMenu.classList.add('scale-y-0', 'opacity-0', 'pointer-events-none', 'hidden');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.innerHTML = '<i data-lucide="menu" class="w-5 h-5"></i>';
      } else {
        mobileMenu.classList.remove('scale-y-0', 'opacity-0', 'pointer-events-none', 'hidden');
        mobileMenu.classList.add('scale-y-100', 'opacity-100');
        mobileToggle.setAttribute('aria-expanded', 'true');
        mobileToggle.innerHTML = '<i data-lucide="x" class="w-5 h-5"></i>';
      }

      // Re-render icon after changing innerHTML
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    });

    // Close mobile menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('scale-y-100', 'opacity-100');
        mobileMenu.classList.add('scale-y-0', 'opacity-0', 'pointer-events-none', 'hidden');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.innerHTML = '<i data-lucide="menu" class="w-5 h-5"></i>';
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
          window.lucide.createIcons();
        }
      });
    });
  }

  // "Contact for this service" buttons -> pre-fill service field & scroll
  const serviceButtons = document.querySelectorAll('[data-service]');
  const serviceField = document.getElementById('service-field');

  if (serviceButtons.length && serviceField) {
    serviceButtons.forEach((btn) => {
      btn.addEventListener('click', (event) => {
        const serviceName = btn.getAttribute('data-service');
        if (serviceName) {
          serviceField.value = serviceName;
        }

        // Smooth scroll to contact section
        const contact = document.getElementById('contact');
        if (contact) {
          contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Provide subtle visual hint that the form is updated
        const form = document.getElementById('contact-form');
        if (form) {
          form.classList.add('ring-2', 'ring-sky-400', 'ring-offset-2', 'ring-offset-navy');
          setTimeout(() => {
            form.classList.remove('ring-2', 'ring-sky-400', 'ring-offset-2', 'ring-offset-navy');
          }, 900);
        }

        // Prevent button from submitting if it lives inside a form (it doesn't, but safe)
        event.preventDefault();
      });
    });
  }

  // Smooth scroll for in-page anchor links (header/footer/etc.)
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  if (anchorLinks.length) {
    anchorLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#') && targetId.length > 1) {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            event.preventDefault();
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });
  }

  // Contact form submission with success state
  const contactForm = document.getElementById('contact-form');
  const statusBox = document.getElementById('form-status');
  const submitButton = document.getElementById('submit-button');
  const formSuccess = document.getElementById('form-success');

  if (contactForm && statusBox && submitButton && formSuccess) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Show sending state
      statusBox.classList.remove('hidden');
      statusBox.textContent = 'Sending your message securely...';
      statusBox.classList.remove('bg-rose-500/20', 'text-rose-200', 'border-rose-500/60');
      statusBox.classList.add('bg-sky-500/15', 'text-sky-700', 'border', 'border-sky-500/60');

      submitButton.disabled = true;
      submitButton.classList.add('opacity-80');
      submitButton.innerHTML = '<span>Sending...</span><i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i>';

      // Re-render icon
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }

      try {
        // Get form data
        const formData = new FormData(contactForm);
        
        // Submit to FormSubmit
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          // Success - hide form and show success message
          contactForm.style.display = 'none';
          formSuccess.classList.remove('hidden');
          
          // Re-render icons in success message
          if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
          }

          // Scroll to success message
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        // Show error state
        statusBox.classList.remove('bg-sky-500/15', 'text-sky-700', 'border-sky-500/60');
        statusBox.classList.add('bg-rose-500/15', 'text-rose-700', 'border', 'border-rose-500/60');
        statusBox.textContent = 'Something went wrong. Please try again or email contact@csrgo.com directly.';
        
        submitButton.disabled = false;
        submitButton.classList.remove('opacity-80');
        submitButton.innerHTML = '<span>Send Message</span><i data-lucide="send" class="w-4 h-4"></i>';

        // Re-render icon
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
          window.lucide.createIcons();
        }
      }
    });

    // If the page is reloaded back here with ?status=error we can show an error message
    const params = new URLSearchParams(window.location.search);
    if (params.get('status') === 'error') {
      statusBox.classList.remove('hidden');
      statusBox.textContent = 'Something went wrong sending your message. Please try again or email contact@csrgo.com directly.';
      statusBox.classList.remove('bg-sky-500/15', 'text-sky-700', 'border-sky-500/60');
      statusBox.classList.add('bg-rose-500/15', 'text-rose-700', 'border', 'border-rose-500/60');
      submitButton.disabled = false;
      submitButton.classList.remove('opacity-80');
    }

    // Check for success parameter (if redirected back)
    if (params.get('status') === 'success') {
      contactForm.style.display = 'none';
      formSuccess.classList.remove('hidden');
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }
  }

  // Scroll-triggered animations (IntersectionObserver)
  const animated = document.querySelectorAll('[data-animate]');
  if ('IntersectionObserver' in window && animated.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.2
      }
    );

    animated.forEach((el) => observer.observe(el));
  } else {
    // Fallback: show all immediately
    animated.forEach((el) => el.classList.add('is-visible'));
  }
}
);


