document.addEventListener('DOMContentLoaded', async () => {
    const terminals = document.querySelectorAll('.terminal-window');

    // Hide all output initially for animation
    terminals.forEach(term => {
        const output = term.querySelector('.output');
        if (output) output.style.opacity = '0';
    });

    const typeText = async (element, text, speed = 50) => {
        element.textContent = '';
        return new Promise(resolve => {
            let i = 0;
            const timer = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(timer);
                    resolve();
                }
            }, speed);
        });
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Sequential animation
    for (const term of terminals) {
        const typewriter = term.querySelector('.typewriter');
        const output = term.querySelector('.output');
        const text = typewriter.getAttribute('data-text');

        // Wait for terminal entrance animation (approx)
        await sleep(300);

        // Type the command
        await typeText(typewriter, text, 50);

        await sleep(200);

        // Show output
        if (output) {
            output.style.transition = 'opacity 0.5s ease';
            output.style.opacity = '1';
        }
    }
});
