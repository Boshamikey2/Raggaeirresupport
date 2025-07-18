// Global variables
let isScrolled = false
let lastScrollTop = 0
// The following variables are declared globally in components.js and data.js
// and are made available on the window object.
// const gtag = window.gtag; // Removed as gtag is not part of pure HTML/CSS/JS
// const mediaGallery = window.mediaGallery;
// const donationModal = window.donationModal;
// const volunteerModal = window.volunteerModal;

/**
 * Initializes all main functionalities when the DOM is fully loaded.
 * This ensures that all HTML elements are available before scripts try to access them.
 */
document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation()
  initializeScrollEffects()
  initializeAnimations()
  initializeLazyLoading()
  initializePerformanceOptimizations()
  // Modal functions are already globally available via window.donationModal, etc.
})

/**
 * Initializes navigation-related functionalities.
 * - Smooth scrolling for anchor links.
 * - Active navigation link highlighting based on scroll position.
 */
function initializeNavigation() {
  // Smooth scrolling for all anchor links starting with '#'
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault() // Prevent default jump behavior
      const target = document.querySelector(this.getAttribute("href")) // Get target element
      if (target) {
        const header = document.querySelector(".header")
        const headerHeight = header ? header.offsetHeight : 0 // Account for fixed header height
        const targetPosition = target.offsetTop - headerHeight // Adjust scroll position

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth", // Smooth scroll animation
        })
      }
    })
  })

  // Update active navigation link on scroll
  window.addEventListener("scroll", updateActiveNavigation)
  updateActiveNavigation() // Call once on load to set initial active link
}

/**
 * Updates the 'active' class on navigation links based on the current scroll position.
 * This highlights the link corresponding to the section currently in view.
 */
function updateActiveNavigation() {
  const sections = document.querySelectorAll("section[id]") // All sections with an ID
  const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link") // All navigation links
  const header = document.querySelector(".header")
  const headerHeight = header ? header.offsetHeight : 0

  let currentSectionId = ""

  // Determine which section is currently in view
  sections.forEach((section) => {
    // Adjust sectionTop to account for fixed header
    const sectionTop = section.offsetTop - headerHeight - 100 // Add buffer for better UX
    const sectionHeight = section.offsetHeight

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSectionId = section.getAttribute("id")
    }
  })

  // Add/remove 'active' class from navigation links
  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${currentSectionId}`) {
      link.classList.add("active")
    }
  })
}

/**
 * Toggles the visibility of the mobile navigation menu.
 * Also prevents/restores body scrolling when the menu is open/closed.
 */
function toggleMobileMenu() {
  const mobileNav = document.getElementById("mobileNav")
  if (mobileNav) {
    mobileNav.classList.toggle("active")

    // Prevent body scrolling when menu is open
    if (mobileNav.classList.contains("active")) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  }
}

/**
 * Closes the mobile navigation menu.
 */
function closeMobileMenu() {
  const mobileNav = document.getElementById("mobileNav")
  if (mobileNav) {
    mobileNav.classList.remove("active")
    document.body.style.overflow = ""
  }
}

/**
 * Initializes scroll-related visual effects.
 * - Header background change on scroll.
 * - Show/hide scroll-to-top button.
 * - Parallax effect for the hero section.
 */
function initializeScrollEffects() {
  window.addEventListener("scroll", handleScroll)
  handleScroll() // Initial call to set states based on page load scroll position
}

/**
 * Handles all scroll-dependent visual updates.
 * This function is throttled for performance in `optimizeScrollPerformance`.
 */
function handleScroll() {
  try {
    // Prevent scroll handler from firing too often
    if (!isScrolled) {
      isScrolled = true;
      requestAnimationFrame(() => {
        updateActiveNavigation();
        updateHeaderBackground();
        updateScrollToTopButton();
        updateParallaxEffects();
        isScrolled = false;
      });
    }
  } catch (error) {
    console.error('Error in scroll handler:', error);
  }
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop

  // Header background change effect
  const header = document.querySelector(".header")
  if (header) {
    if (scrollTop > 50) {
      header.style.background = "rgba(255, 255, 255, 0.98)";
      header.style.backdropFilter = "blur(20px)";
      header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
    } else {
      header.style.background = "rgba(255, 255, 255, 1)"; // Fully opaque at the top
      header.style.backdropFilter = "blur(10px)";
      header.style.boxShadow = "none";
    }
  }

  // Show/hide scroll to top button
  const scrollToTopBtn = document.getElementById("scrollToTop")
  if (scrollToTopBtn) {
    if (scrollTop > 300) {
      // Show button after scrolling 300px down
      scrollToTopBtn.classList.add("visible")
    } else {
      scrollToTopBtn.classList.remove("visible")
    }
  }

  // Parallax effect for hero section - REMOVED to prevent overlap issues
  // const heroSection = document.querySelector(".hero-section")
  // if (heroSection) {
  //   const heroOffset = scrollTop * 0.5 // Scroll at half speed
  //   heroSection.style.transform = `translateY(${heroOffset}px)`
  // }

  lastScrollTop = scrollTop // Update last scroll position
}

/**
 * Scrolls the window smoothly to the top of the page.
 */
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

/**
 * Initializes various animations on the page.
 * - Intersection Observer for fade-in animations on elements.
 * - Counter animation for statistics.
 */
function initializeAnimations() {
  // Intersection Observer for elements that fade in when they become visible
  const observerOptions = {
    threshold: 0.1, // Trigger when 10% of the element is visible
    rootMargin: "0px 0px -50px 0px", // Shrink the viewport bottom by 50px
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible") // Add 'visible' class to trigger animation
        // observer.unobserve(entry.target); // Uncomment to animate only once
      }
    })
  }, observerOptions)

  // Observe elements that should have fade-in animations
  document.querySelectorAll(".fade-in, .mission-card, .program-item, .story-card, .student-card").forEach((el) => {
    el.classList.add("fade-in") // Ensure base fade-in styles are applied
    observer.observe(el)
  })

  // Initialize counter animations for statistics
  animateCounters()
}

/**
 * Animates numerical counters in the "Our Impact in Numbers" section.
 * Uses Intersection Observer to start animation when counters come into view.
 */
function animateCounters() {
  const counters = document.querySelectorAll(".stat-number")
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target) // Start animation for the visible counter
        counterObserver.unobserve(entry.target) // Stop observing after animation starts
      }
    })
  })

  counters.forEach((counter) => {
    counterObserver.observe(counter)
  })
}

/**
 * Performs a single counter animation for a given element.
 * @param {HTMLElement} element - The HTML element containing the number to animate.
 */
function animateCounter(element) {
  // Extract the target number, removing non-digit characters (like '+' or '%')
  const target = Number.parseInt(element.textContent.replace(/[^\d]/g, "")) || 0
  const duration = 2000 // Animation duration in milliseconds
  const step = target / (duration / 16) // Calculate increment step for ~60fps
  let current = 0

  const timer = setInterval(() => {
    current += step
    if (current >= target) {
      current = target // Ensure it stops exactly at the target
      clearInterval(timer) // Stop the animation
    }

    // Update text content, preserving original suffixes like '%' or '+'
    if (element.textContent.includes("%")) {
      element.textContent = Math.floor(current) + "%"
    } else if (element.textContent.includes("+")) {
      element.textContent = Math.floor(current) + "+"
    } else {
      element.textContent = Math.floor(current)
    }
  }, 16) // Update approximately every 16ms for 60fps
}

/**
 * Initializes lazy loading for images.
 * Images with `data-src` attribute will only load when they enter the viewport.
 */
function initializeLazyLoading() {
  const images = document.querySelectorAll("img[data-src]") // Select images marked for lazy loading

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src // Set src from data-src
        img.classList.remove("lazy") // Remove lazy class if any
        imageObserver.unobserve(img) // Stop observing once loaded
      }
    })
  })

  images.forEach((img) => {
    imageObserver.observe(img)
  })
}

/**
 * Initializes various performance optimizations for the website.
 * - Preloads critical images.
 * - Optimizes scroll event handling.
 * - Prefetches resources (placeholder).
 */
function initializePerformanceOptimizations() {
  try {
    // Preload critical images
    preloadCriticalImages();
    
    // Optimize scroll performance
    optimizeScrollPerformance();
    
    // Add error handling for images
    document.querySelectorAll('img').forEach(img => {
      img.onerror = function() {
        this.onerror = null;
        this.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
      };
    });
    
    // Add ARIA labels to navigation
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
      link.setAttribute('aria-label', `Navigate to ${link.textContent}`);
    });
    
    // Add ARIA labels to buttons
    document.querySelectorAll('button').forEach(button => {
      if (!button.getAttribute('aria-label')) {
        button.setAttribute('aria-label', button.textContent || 'Action button');
      }
    });
  } catch (error) {
    console.error('Error initializing performance optimizations:', error);
  }
  preloadCriticalImages()
  optimizeScrollPerformance()
  prefetchResources()
}

/**
 * Preloads critical images to improve Largest Contentful Paint (LCP).
 * These images are essential for the initial page load experience.
 */
function preloadCriticalImages() {
  const criticalImages = ["images/classroom-learning.jpg", "images/raggaeirre-logo.jpg"]

  criticalImages.forEach((src) => {
    const link = document.createElement("link")
    link.rel = "preload"
    link.as = "image"
    link.href = src
    document.head.appendChild(link)
  })
}

/**
 * Optimizes scroll event performance using `requestAnimationFrame`.
 * This prevents `handleScroll` from firing too rapidly, improving smoothness.
 */
function optimizeScrollPerformance() {
  let ticking = false // Flag to throttle scroll events

  function updateScroll() {
    handleScroll() // Call the main scroll handler
    ticking = false
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateScroll) // Request next animation frame
      ticking = true
    }
  })
}

/**
 * Placeholder for prefetching resources.
 * In a larger site, this could prefetch CSS, JS, or data for upcoming sections.
 */
function prefetchResources() {
  const links = document.querySelectorAll('a[href^="#"]')

  links.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      const targetId = link.getAttribute("href").substring(1)
      // In a real application, you might dynamically load resources here
      // based on the `targetId` (e.g., fetch data for that section).
      console.log(`Prefetching resources for section: ${targetId}`)
    })
  })
}

// --- Global Modal Functions ---
// These functions are exposed globally so they can be called directly from HTML `onclick` attributes.
// They act as wrappers around the methods of the initialized modal classes (from components.js).

function openDonationModal() {
  if (window.donationModal) {
    window.donationModal.open()
  }
}

function closeDonationModal() {
  if (window.donationModal) {
    window.donationModal.close()
  }
}

function openVolunteerModal() {
  if (window.volunteerModal) {
    window.volunteerModal.open()
  }
}

function closeVolunteerModal() {
  if (window.volunteerModal) {
    window.volunteerModal.close()
  }
}

function openMediaModal(index) {
  if (window.mediaGallery) {
    window.mediaGallery.openModal(index)
  }
}

function closeMediaModal() {
  if (window.mediaGallery) {
    window.mediaGallery.closeModal()
  }
}

function openBankInfoModal() {
  const modal = document.getElementById("bankInfoModal")
  if (modal) {
    modal.classList.add("active")
  }
}

function closeBankInfoModal() {
  const modal = document.getElementById("bankInfoModal")
  if (modal) {
    modal.classList.remove("active")
  }
}

// --- Global Donation Modal Specific Functions ---
function selectAmount(amount) {
  if (window.donationModal) {
    window.donationModal.selectAmount(amount)
  }
}

function proceedToPayment() {
  if (window.donationModal) {
    window.donationModal.proceedToPayment()
  }
}

function goBackToAmount() {
  if (window.donationModal) {
    window.donationModal.goBackToAmount()
  }
}

function selectPaymentMethod(method) {
  if (window.donationModal) {
    window.donationModal.selectPaymentMethod(method)
  }
}

function proceedToDetails() {
  if (window.donationModal) {
    window.donationModal.proceedToDetails()
  }
}

function goBackToPayment() {
  if (window.donationModal) {
    window.donationModal.goBackToPayment()
  }
}

// --- Global Media Gallery Specific Functions ---
function previousMedia() {
  if (window.mediaGallery) {
    window.mediaGallery.previousMedia()
  }
}

function nextMedia() {
  if (window.mediaGallery) {
    window.mediaGallery.nextMedia()
  }
}

// --- General Utility Functions ---

/**
 * Debounce function: Ensures a function is not called too frequently.
 * Useful for events like resizing or typing.
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The delay in milliseconds before the function is executed.
 * @returns {Function} The debounced function.
 */
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function: Ensures a function is called at most once within a given time frame.
 * Useful for events like scrolling or mouse movement.
 * @param {Function} func - The function to throttle.
 * @param {number} limit - The time limit in milliseconds.
 * @returns {Function} The throttled function.
 */
function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments
    
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// --- Error Handling ---
// Basic global error listener for client-side JavaScript errors.
window.addEventListener("error", (e) => {
  console.error("JavaScript Error:", e.error)
  // In a production environment, you might send this to an error tracking service
})

// --- Service Worker Registration (for PWA capabilities) ---
// This section is for Progressive Web App (PWA) features like offline support.
// A `sw.js` file would be needed in the root for this to fully function.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js") // Register the service worker script
      .then((registration) => {
        console.log("Service Worker registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("Service Worker registration failed: ", registrationError)
      })
  })
}

// --- Analytics (Placeholder) ---
// This function serves as a placeholder for integrating with an analytics service
// like Google Analytics, Matomo, or a custom solution.
function trackEvent(eventName, eventData) {
  console.log("Event tracked:", eventName, eventData)
  // Example: if using Google Analytics (gtag.js)
  // if (typeof gtag !== "undefined") {
  //   gtag("event", eventName, eventData)
  // }
}

// Example: Track clicks on primary buttons
document.addEventListener("click", (e) => {
  if (e.target.matches(".btn-primary")) {
    trackEvent("button_click", {
      button_text: e.target.textContent.trim(),
      page_location: window.location.href,
    })
  }
})

// --- Performance Monitoring (Placeholder) ---
// Tracks basic page load performance metrics.
window.addEventListener("load", () => {
  if (performance.getEntriesByType) {
    const perfData = performance.getEntriesByType("navigation")[0]
    if (perfData) {
      trackEvent("page_performance", {
        load_time: perfData.loadEventEnd - perfData.loadEventStart,
        dom_content_loaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
      })
    }
  }
})

// --- Accessibility Enhancements ---
// Adds a "Skip to main content" link for keyboard users.
document.addEventListener("keydown", (e) => {
  // This is a simplified example. A real skip link would be in HTML and managed via CSS.
  // This dynamically creates one if the user tabs to the body.
  if (e.key === "Tab" && e.target === document.body) {
    const skipLink = document.createElement("a")
    skipLink.href = "#main" // Link to the main content area
    skipLink.textContent = "Skip to main content"
    skipLink.className = "sr-only focus:not-sr-only" // Hidden by default, visible on focus
    document.body.insertBefore(skipLink, document.body.firstChild)
  }
})

// --- Print Optimization ---
// Adjusts page display specifically for printing.
window.addEventListener("beforeprint", () => {
  // Expand all collapsed sections (if any) for printing
  document.querySelectorAll(".hidden").forEach((el) => {
    el.style.display = "block"
  })
})

window.addEventListener("afterprint", () => {
  // Restore original state after printing (e.g., by reloading the page)
  location.reload()
})
