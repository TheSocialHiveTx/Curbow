/**
 * Curbow Construction & Developing, LLC - Main JavaScript
 * Handles responsive navbar, scroll behaviors, portfolio filters,
 * image lightbox, form validation, and animations.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Navigation Menu Logic
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky Navbar class toggle on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile navigation drawer toggle
  hamburger.addEventListener('click', () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
  });

  // Close mobile drawer when clicking navigation link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });

  // Highlight active menu links based on scroll section location
  const sections = document.querySelectorAll('section[id]');
  
  function scrollActiveLinkHighlight() {
    const scrollY = window.pageYOffset + 150; // offset for navbar height
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');
      const activeLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
      
      if (activeLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => link.classList.remove('active'));
          activeLink.classList.add('active');
        }
      }
    });
  }
  
  window.addEventListener('scroll', scrollActiveLinkHighlight);


  /* ==========================================================================
     2. Interactive Portfolio Gallery & Filtering
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const galleryGrid = document.getElementById('galleryGrid');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from other buttons and set on current clicked
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        // Add CSS filter animation transitions
        item.style.opacity = '0';
        item.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
          if (filterValue === 'all' || itemCategory === filterValue) {
            item.classList.remove('hidden');
            // Small timeout to allow browser display state to update
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.classList.add('hidden');
          }
        }, 300);
      });
    });
  });


  /* ==========================================================================
     3. Lightbox Gallery Modal Viewer
     ========================================================================== */
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxCapCategory = document.getElementById('lightboxCapCategory');
  const lightboxCapTitle = document.getElementById('lightboxCapTitle');

  let activeImages = []; // Stores list of currently visible gallery items
  let currentIndex = 0;

  // Open Lightbox
  galleryItems.forEach(item => {
    const clickArea = item.querySelector('.gallery-img-container');
    
    clickArea.addEventListener('click', () => {
      // Rebuild visible images list dynamically based on active filters
      activeImages = Array.from(galleryItems).filter(el => !el.classList.contains('hidden'));
      currentIndex = activeImages.indexOf(item);
      
      openLightbox(item);
    });
  });

  function openLightbox(item) {
    const img = item.querySelector('img');
    const categoryText = item.querySelector('.gallery-item-category').textContent;
    const titleText = item.querySelector('.gallery-item-title').textContent;
    
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCapCategory.textContent = categoryText;
    lightboxCapTitle.textContent = titleText;
    
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  }

  // Close Lightbox
  function closeLightbox() {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto'; // Restore background scroll
    
    // Clear content after animation completes
    setTimeout(() => {
      lightboxImg.src = '';
      lightboxImg.alt = '';
    }, 350);
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxModal.addEventListener('click', (e) => {
    // Close modal if clicking background area, not image or controls
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  // Navigate Lightbox
  function showNextImage() {
    if (activeImages.length <= 1) return;
    currentIndex = (currentIndex + 1) % activeImages.length;
    updateLightboxContent(activeImages[currentIndex]);
  }

  function showPrevImage() {
    if (activeImages.length <= 1) return;
    currentIndex = (currentIndex - 1 + activeImages.length) % activeImages.length;
    updateLightboxContent(activeImages[currentIndex]);
  }

  function updateLightboxContent(item) {
    const img = item.querySelector('img');
    const categoryText = item.querySelector('.gallery-item-category').textContent;
    const titleText = item.querySelector('.gallery-item-title').textContent;
    
    // Fade animation transition inside lightbox
    lightboxImg.style.opacity = '0';
    lightboxImg.style.transform = 'scale(0.98)';
    
    setTimeout(() => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCapCategory.textContent = categoryText;
      lightboxCapTitle.textContent = titleText;
      
      lightboxImg.style.opacity = '1';
      lightboxImg.style.transform = 'scale(1)';
    }, 200);
  }

  lightboxNext.addEventListener('click', showNextImage);
  lightboxPrev.addEventListener('click', showPrevImage);

  // Keyboard navigation listener (Left, Right, Escape)
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNextImage();
    } else if (e.key === 'ArrowLeft') {
      showPrevImage();
    }
  });


  /* ==========================================================================
     4. Contact Form Validation & Submission Mock
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const resetFormBtn = document.getElementById('btnResetForm');

  // Input fields
  const formName = document.getElementById('formName');
  const formPhone = document.getElementById('formPhone');
  const formEmail = document.getElementById('formEmail');
  const formService = document.getElementById('formService');
  const formMessage = document.getElementById('formMessage');

  // Basic regex validators
  const phoneRegex = /^(\+?\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate individual form groups
  function validateField(input, condition, errorElId) {
    const formGroup = input.closest('.form-group');
    if (condition) {
      formGroup.classList.remove('invalid');
      return true;
    } else {
      formGroup.classList.add('invalid');
      return false;
    }
  }

  // Live input validation listeners for key events
  formName.addEventListener('input', () => {
    validateField(formName, formName.value.trim().length > 0);
  });

  formPhone.addEventListener('input', () => {
    validateField(formPhone, phoneRegex.test(formPhone.value.trim()));
  });

  formEmail.addEventListener('input', () => {
    const val = formEmail.value.trim();
    // Email is optional, but if entered it must match the pattern
    const isValid = val === '' || emailRegex.test(val);
    validateField(formEmail, isValid);
  });

  formService.addEventListener('change', () => {
    validateField(formService, formService.value !== '');
  });

  formMessage.addEventListener('input', () => {
    validateField(formMessage, formMessage.value.trim().length > 0);
  });

  // Handle submit form event
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Evaluate all fields
    const isNameValid = validateField(formName, formName.value.trim().length > 0);
    const isPhoneValid = validateField(formPhone, phoneRegex.test(formPhone.value.trim()));
    const isEmailValid = validateField(formEmail, formEmail.value.trim() === '' || emailRegex.test(formEmail.value.trim()));
    const isServiceValid = validateField(formService, formService.value !== '');
    const isMessageValid = validateField(formMessage, formMessage.value.trim().length > 0);
    
    const isFormValid = isNameValid && isPhoneValid && isEmailValid && isServiceValid && isMessageValid;
    
    if (isFormValid) {
      // Simulate API submit latency
      const submitBtn = document.getElementById('formSubmitBtn');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting Request...';
      
      setTimeout(() => {
        // Hide form and show success message
        contactForm.style.display = 'none';
        formSuccess.classList.add('active');
        
        // Reset submit button state
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Estimate Request';
      }, 1200);
    } else {
      // Scroll to the first invalid input element
      const firstInvalid = document.querySelector('.form-group.invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  // Reset form and return to input view
  resetFormBtn.addEventListener('click', () => {
    contactForm.reset();
    
    // Clear validation styling
    document.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('invalid');
    });
    
    formSuccess.classList.remove('active');
    setTimeout(() => {
      contactForm.style.display = 'block';
    }, 300);
  });


  /* ==========================================================================
     5. Scroll-driven Animations (Intersection Observer)
     ========================================================================== */
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15 // Triggers when 15% of element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Check if element is a grid or row to apply staggered delays to children
          if (entry.target.classList.contains('grid') || entry.target.classList.contains('gallery-grid') || entry.target.classList.contains('why-us-grid')) {
            const children = entry.target.children;
            Array.from(children).forEach((child, index) => {
              child.classList.add('animate-on-scroll');
              child.classList.add(`delay-${(index % 3) + 1}`);
              child.classList.add('appear');
            });
          }
          
          entry.target.classList.add('appear');
          observer.unobserve(entry.target); // stop observing once animated
        }
      });
    }, observerOptions);

    animateElements.forEach(el => observer.observe(el));
    
    // Also observe grids where layout rows container needs scroll stagger trigger
    const gridsToObserve = document.querySelectorAll('.services-grid, .gallery-grid, .why-us-grid');
    gridsToObserve.forEach(g => observer.observe(g));
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    animateElements.forEach(el => el.classList.add('appear'));
  }

});
