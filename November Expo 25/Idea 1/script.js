

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

    // --- INITIALIZATION ---
    function init() {
        createNavigationDots();
        setupEventListeners();
        startAutoPlayCycle(); // Start the automatic presentation
    }

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

    // --- START THE SHOW! ---
    init();
});