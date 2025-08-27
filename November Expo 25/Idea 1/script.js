

// script.js - MASTER CONTROLLER
document.addEventListener('DOMContentLoaded', () => {
    
    // --- SELECTORS & VARIABLES ---
    const sections = gsap.utils.toArray('.section');
    const progressBar = document.querySelector('.progress-bar');

    const nextButtons = gsap.utils.toArray('.next-section-button');
     console.log(`DEBUG: Found ${nextButtons.length} 'next' buttons.`); // DEBUG: How many next buttons?

    const prevButtons = gsap.utils.toArray('.prev-section-button');
     console.log(`DEBUG: Found ${prevButtons.length} 'prev' buttons.`); // DEBUG: How many prev buttons?

    let dots = [];
    let autoPlayTimeout;
    let isAutoPlaying = true;
    const autoPlayDelay = 8000; // 8 seconds per section
    let currentSectionIndex = 0;
    let masterProgressTween;

    // --- SETUP FUNCTIONS ---
    function createNavigationDots() {
        const dotsContainer = document.querySelector('.navigation-dots');
        sections.forEach((section, i) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                pauseAutoPlay();
                goToSection(i);
            });
            dotsContainer.appendChild(dot);
            dots.push(dot);
        });
    }

    function setupEventListeners() {
        // Listen for clicks on "Next" buttons
        nextButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                pauseAutoPlay();
                nextSection();
            });
        });
        // Listen for clicks on "Prev" buttons
        prevButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                pauseAutoPlay();
                prevSection();
            });
        });
        // Pause autoplay on any user interaction
        document.addEventListener('keydown', pauseAutoPlay);
        document.addEventListener('mousedown', pauseAutoPlay);
        document.addEventListener('touchstart', pauseAutoPlay);
    }

    // --- THE CORE FUNCTION: Animate to a specific section ---
    function goToSection(index) {
        // If target is the same, do nothing
        if (index === currentSectionIndex) return;
        if (index < 0 || index >= sections.length) return; // Safety check

        const currentSection = sections[currentSectionIndex];
        const nextSection = sections[index];

        // Kill any ongoing progress bar animation
        if (masterProgressTween) masterProgressTween.kill();

        // Create a timeline for the section transition
        let transitionTL = gsap.timeline();
        // Animate out the current section
        transitionTL.to(currentSection, { opacity: 0, duration: 0.8, ease: "power2.in" });
        // Animate in the next section
        transitionTL.to(nextSection, { opacity: 1, duration: 0.8, ease: "power2.out" }, "<+=0.2");

        // Update active classes and variables
        transitionTL.add(() => {
            currentSection.classList.remove('active');
            nextSection.classList.add('active');
            updateDots(index);
            currentSectionIndex = index;
        }, "-=0.5");

        // Restart autoplay timer for the new section
        if (isAutoPlaying) {
            startAutoPlayCycle();
        }
    }

    function updateDots(newIndex) {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === newIndex);
        });
    }

    function nextSection() {
        let nextIndex = (currentSectionIndex + 1) % sections.length;
        goToSection(nextIndex);
    }

    function prevSection() {
        let prevIndex = currentSectionIndex - 1;
        if (prevIndex < 0) prevIndex = sections.length - 1;
        goToSection(prevIndex);
    }

    // --- AUTOPLAY FUNCTIONS ---
    function startAutoPlayCycle() {
        pauseAutoPlay(); // Clear any existing timer first

        // Animate the progress bar
        masterProgressTween = gsap.fromTo(progressBar,
            { width: "0%" },
            { width: "100%", duration: autoPlayDelay / 1000, ease: "none" }
        );

        // Set the timeout to go to the next section
        autoPlayTimeout = setTimeout(nextSection, autoPlayDelay);
        isAutoPlaying = true;
    }

    function pauseAutoPlay() {
        clearTimeout(autoPlayTimeout);
        if (masterProgressTween) masterProgressTween.pause(); // Also pause the progress bar animation
        isAutoPlaying = false;
    }

        // --- INTERNAL CAROUSEL FUNCTIONALITY ---
    function setupCarousels() {
        // Find all sections that might have a carousel
        const sectionsWithCarousel = gsap.utils.toArray('.section .image-slide');

        if (sectionsWithCarousel.length > 0) {
            // Setup for each section individually
            sectionsWithCarousel.forEach(section => {
                const container = section.closest('.section');
                const imageSlides = gsap.utils.toArray('.image-slide', container);
                const textSlides = gsap.utils.toArray('.text-slide', container);
                const prevArrow = container.querySelector('.carousel-prev');
                const nextArrow = container.querySelector('.carousel-next');
                let currentSlideIndex = 0;

                // Function to update the carousel display
                function updateCarouselSlide(newIndex) {
                    // Handle wrap-around for infinite loop
                    if (newIndex < 0) newIndex = imageSlides.length - 1;
                    if (newIndex >= imageSlides.length) newIndex = 0;

                    // Animate out the current active slides
                    gsap.to([imageSlides[currentSlideIndex], textSlides[currentSlideIndex]], {
                        opacity: 0,
                        duration: 0.5,
                        onComplete: () => {
                            // Remove active class after fade out
                            imageSlides[currentSlideIndex].classList.remove('active');
                            textSlides[currentSlideIndex].classList.remove('active');
                        }
                    });

                    // Animate in the new active slides
                    gsap.fromTo([imageSlides[newIndex], textSlides[newIndex]], 
                        { opacity: 0 },
                        { 
                            opacity: 1, 
                            duration: 0.5,
                            onStart: () => {
                                // Add active class before fade in
                                imageSlides[newIndex].classList.add('active');
                                textSlides[newIndex].classList.add('active');
                            }
                        }
                    );

                    currentSlideIndex = newIndex;
                }

                // Add event listeners to the arrows
                if (prevArrow && nextArrow) {
                    prevArrow.addEventListener('click', () => updateCarouselSlide(currentSlideIndex - 1));
                    nextArrow.addEventListener('click', () => updateCarouselSlide(currentSlideIndex + 1));
                }
            });
        }
    }

    // --- Initialize everything ---
    function init() {
        createNavigationDots();
        setupEventListeners();
        setupCarousels(); // <- INITIALIZE THE CAROUSELS TOO!
        startAutoPlayCycle();
    }

    // --- START THE SHOW! ---
    init();
});