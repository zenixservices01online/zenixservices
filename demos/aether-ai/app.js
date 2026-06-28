/**
 * Aether AI Interactive Script
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Live Playground Console Typewriter Simulation
    const promptButtons = document.querySelectorAll(".prompt-opt-btn");
    const promptDisplay = document.getElementById("active-prompt-display");
    const responseDisplay = document.getElementById("ai-response-text");
    const generateBtn = document.getElementById("trigger-generation-btn");
    const consoleStatus = document.querySelector(".console-status");

    // Copy scenarios data
    const copyScenarios = {
        ad: {
            prompt: "Generate Facebook Ad Copy for a luxury coffee subscription box called 'Roast & Co'...",
            response: `☕️ Tired of stale, grocery-store coffee? Meet Roast & Co.

We curate single-origin, specialty beans roasted weekly and deliver them straight to your door. Freshness guaranteed.

💥 Claim 20% off your first curation using code BREW20.
👉 www.roastco.com/start`
        },
        email: {
            prompt: "Draft a welcome email for new signups on a designer mockup tool called 'Mockly'...",
            response: `Subject: Welcome to Mockly - Design at the speed of thought!

Hey there,

Thanks for signing up for Mockly. We built this platform to take the friction out of creating high-fidelity prototypes.

Here is how to launch your first design in under 3 minutes:
1. Upload your Figma file or image assets.
2. Add hot-linked connection nodes.
3. Click 'Share Mockup' to receive a custom web URL.

Happy designing,
The Mockly Crew`
        },
        headline: {
            prompt: "Create a high-converting hero headline for a virtual event platform called 'HoloStage'...",
            response: `🏆 HoloStage: Bring immersive, holographic-quality webinars to any screen.

No headsets required. Host up to 50,000 attendees in gorgeous, virtual layouts with zero lag. Build connections that matter.`
        }
    };

    let activeType = "ad";
    let isGenerating = false;

    promptButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            if (isGenerating) return;
            
            // Toggle active buttons
            promptButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            activeType = btn.getAttribute("data-type");
            promptDisplay.textContent = copyScenarios[activeType].prompt;
            responseDisplay.innerHTML = `Click "Generate Copy" below to start the copywriting engine...`;
        });
    });

    generateBtn.addEventListener("click", () => {
        if (isGenerating) return;
        runGenerativeSimulation();
    });

    async function runGenerativeSimulation() {
        isGenerating = true;
        generateBtn.classList.add("generating");
        generateBtn.textContent = "Writing...";
        consoleStatus.textContent = "aether-engine v3.0.4 - status: writing...";
        responseDisplay.innerHTML = "";

        const textToType = copyScenarios[activeType].response;
        let index = 0;

        // Injects typing simulator with cursor blink
        const cursor = document.createElement("span");
        cursor.className = "type-cursor";
        responseDisplay.appendChild(cursor);

        // Word-by-word or character-by-character typing speed
        function typeChar() {
            if (index < textToType.length) {
                const char = textToType.charAt(index);
                if (char === "\n") {
                    responseDisplay.insertBefore(document.createElement("br"), cursor);
                } else {
                    responseDisplay.insertBefore(document.createTextNode(char), cursor);
                }
                index++;
                
                // Slightly randomized typing speed to feel human-generated
                const speed = char === "." || char === "?" || char === "\n" ? 200 : 15;
                setTimeout(typeChar, speed);
            } else {
                // Done writing
                cursor.remove();
                isGenerating = false;
                generateBtn.classList.remove("generating");
                generateBtn.textContent = "Generate Copy";
                consoleStatus.textContent = "aether-engine v3.0.4 - status: idle";
            }
        }

        // Start typewriter
        setTimeout(typeChar, 400);
    }


    // 2. Monthly / Annual Billing Toggle Switch
    const billingToggle = document.getElementById("billing-toggle-btn");
    const monthlyLabel = document.getElementById("monthly-label");
    const annualLabel = document.getElementById("annual-label");

    // Price fields
    const starterPrice = document.getElementById("price-starter");
    const proPrice = document.getElementById("price-pro");
    const enterprisePrice = document.getElementById("price-enterprise");

    const starterPeriod = document.getElementById("starter-period");
    const proPeriod = document.getElementById("pro-period");

    let isYearly = false;

    billingToggle.addEventListener("click", () => {
        isYearly = !isYearly;
        billingToggle.classList.toggle("yearly", isYearly);
        monthlyLabel.classList.toggle("active", !isYearly);
        annualLabel.classList.toggle("active", isYearly);

        if (isYearly) {
            // Apply 20% discount on prices
            // ₹1900 -> ₹1520, ₹4900 -> ₹3920
            animatePriceChange(starterPrice, "₹1,520");
            animatePriceChange(proPrice, "₹3,920");
            starterPeriod.textContent = "/ month, billed annually";
            proPeriod.textContent = "/ month, billed annually";
        } else {
            animatePriceChange(starterPrice, "₹1,900");
            animatePriceChange(proPrice, "₹4,900");
            starterPeriod.textContent = "/ month";
            proPeriod.textContent = "/ month";
        }
    });

    function animatePriceChange(element, newText) {
        element.style.opacity = 0;
        element.style.transform = "translateY(-5px)";
        setTimeout(() => {
            element.textContent = newText;
            element.style.opacity = 1;
            element.style.transform = "translateY(0)";
        }, 150);
    }
});
