// js/animations/animator.js - GSAP & 3D Tilt Companion Engine

export const Animator = {
  // Check if GSAP is available on window
  hasGSAP() {
    return typeof window.gsap !== 'undefined';
  },

  // 3D Card Interactive Tilt on Mouse Move
  attach3DTilt(element, maxAngle = 12) {
    if (!element) return;
    
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -maxAngle;
      const rotateY = ((x - centerX) / centerX) * maxAngle;

      element.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(10px)`;
    });

    element.addEventListener('mouseleave', () => {
      element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  },

  // Splash Screen Intro Animation
  animateSplash(logoEl, textEl, onComplete) {
    if (this.hasGSAP()) {
      const tl = window.gsap.timeline({ onComplete });
      tl.fromTo(logoEl, 
        { scale: 0.4, opacity: 0, rotationY: -180 }, 
        { scale: 1, opacity: 1, rotationY: 0, duration: 1.2, ease: 'back.out(1.7)' }
      )
      .fromTo(textEl, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 
        '-=0.4'
      );
    } else {
      setTimeout(onComplete, 1200);
    }
  },

  // View Transition Animation
  animateViewTransition(containerEl) {
    if (!containerEl) return;
    if (this.hasGSAP()) {
      window.gsap.fromTo(containerEl, 
        { opacity: 0, y: 15 }, 
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    } else {
      containerEl.classList.remove('page-fade-enter-active');
      containerEl.classList.add('page-fade-enter');
      requestAnimationFrame(() => {
        containerEl.classList.add('page-fade-enter-active');
      });
    }
  }
};
