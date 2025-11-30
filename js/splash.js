document.addEventListener('DOMContentLoaded', () => {
    const splash = document.getElementById('splash-overlay');
    
    // 1. Check if user has already seen the splash screen in this session
    const hasSeenSplash = sessionStorage.getItem('splashShown');

    if (hasSeenSplash) {
        // If yes, hide it IMMEDIATELY (no animation)
        splash.classList.add('splash-hidden-immediate');
    } else {
        // If no, play the animation
        
        // Wait 4 seconds for the CSS animation (zoomAndBreak) to finish
        setTimeout(() => {
            splash.style.opacity = '0'; // Fade out
            
            setTimeout(() => {
                splash.style.display = 'none'; // Remove from layout
            }, 800); // Wait for fade transition
            
            // Mark as seen in session storage
            sessionStorage.setItem('splashShown', 'true');
        }, 4000); 
    }
});