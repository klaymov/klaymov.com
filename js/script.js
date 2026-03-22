document.addEventListener('DOMContentLoaded', async () => {
    const terminals = document.querySelectorAll('.terminal-window');

    terminals.forEach(term => {
        const stackRows = term.querySelectorAll('.stack-row');
        if (stackRows.length > 0) {
            stackRows.forEach(el => el.style.opacity = '0');
        } else {
            term.querySelectorAll('.output').forEach(el => el.style.opacity = '0');
        }
    });

    const typeText = async (element, text, speed = 33) => { // 50 / 1.5 ≈ 33
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

    for (const term of terminals) {
        const typewriter = term.querySelector('.typewriter');
        const text = typewriter.getAttribute('data-text');

        await sleep(200); // 300 / 1.5
        await typeText(typewriter, text, 33);
        await sleep(100); // 150 / 1.5

        const stackRows = term.querySelectorAll('.stack-row');
        if (stackRows.length > 0) {
            for (const row of stackRows) {
                row.style.transition = 'opacity 0.27s ease'; // 0.4s / 1.5
                row.style.opacity = '1';
                await sleep(53); // 80 / 1.5
            }
            continue;
        }

        const outputs = term.querySelectorAll('.output');
        for (const output of outputs) {
            output.style.transition = 'opacity 0.33s ease'; // 0.5s / 1.5
            output.style.opacity = '1';
            await sleep(100); // 150 / 1.5
        }
    }
});