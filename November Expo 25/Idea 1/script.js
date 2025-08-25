document.addEventListener('DOMContentLoaded', () => {
    // Select elements
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const ctaButton = document.querySelector('.cta-button');
    const video = document.querySelector('.background-video');

    // Create a master timeline for the hero scene animations
    let heroTL = gsap.timeline();

    // Optional: Fade in the video slightly if it starts black
    heroTL.fromTo(video, { opacity: 0 }, { opacity: 1, duration: 2 }, 0);

    // Animate the title lines in sequentially
    heroTL.fromTo(heroTitle.children, 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.3, ease: "power3.out" }, 
        0.5 // start 0.5 seconds after the timeline begins
    );

    // Bring in the subtitle
    heroTL.fromTo(heroSubtitle,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
        ">-0.5" // start 0.5 seconds before the previous animation ends
    );

    // Finally, fade in the CTA button
    heroTL.fromTo(ctaButton,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        ">0.3" // start 0.3 seconds after the previous animation ends
    );

    // This timeline will play automatically when the page loads.
});