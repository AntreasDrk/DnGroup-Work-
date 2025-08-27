// script.js
document.addEventListener('DOMContentLoaded', () => {
    const scenes = gsap.utils.toArray('.scene');
    const transitionDelay = 5; // Seconds each scene is active
    let currentIndex = 0;

    // Function to animate IN a scene
    function animateIn(scene) {
        // Reset scene to initial state (e.g., hidden off-screen or faded out)
        gsap.set(scene, { opacity: 0, y: 50 });

        // Create the animation timeline for this scene
        let tl = gsap.timeline();
        tl.to(scene, { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" });
        // Animate in child elements sequentially for a polished look
        tl.from(scene.querySelectorAll('h1, h2, li, p'), { opacity: 0, y: 20, stagger: 0.1, duration: 0.8 }, "-=0.5"); // "-=0.5" overlaps the animations

        return tl;
    }

    // Function to animate OUT a scene
    function animateOut(scene) {
        return gsap.to(scene, { opacity: 0, y: -50, duration: 1.5, ease: "power2.in" });
    }

    // Master timeline to rule them all
    let masterTL = gsap.timeline({ repeat: -1 }); // `repeat: -1` loops forever

    // For each scene, add its "in" and "out" animations to the master timeline, with a pause in between
    scenes.forEach((scene, i) => {
        masterTL.add(animateIn(scene), '>'); // '>' adds at the end of the previous animation
        masterTL.add(() => { /* You could highlight a specific product here */ }, `+=${transitionDelay}`); // Pause for `transitionDelay` seconds
        masterTL.add(animateOut(scene));
    });

    // Optional: progress bar
    gsap.to(".progress-bar", {
        duration: masterTL.duration(),
        repeat: -1,
        ease: "none",
        width: "100%"
    });
});