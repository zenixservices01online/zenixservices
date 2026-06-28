/**
 * Nova Fit - Biometrics Interactive Controller
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Live Hero Biometric Heart Rate Simulation
    const hrDisplay = document.getElementById("vital-heartrate");
    if (hrDisplay) {
        let lastHr = 72;
        setInterval(() => {
            // Add slight random fluctuation (+/- 2 bpm)
            const delta = Math.floor(Math.random() * 5) - 2;
            lastHr = Math.max(62, Math.min(88, lastHr + delta));
            
            // Fade effect
            hrDisplay.style.opacity = 0.5;
            setTimeout(() => {
                hrDisplay.textContent = lastHr;
                hrDisplay.style.opacity = 1;
            }, 200);
        }, 3000);
    }

    // 2. Form Sliders Real-time displays
    const durationSlider = document.getElementById("active-minutes");
    const weightSlider = document.getElementById("body-weight");
    const durationLabel = document.getElementById("minutes-val");
    const weightLabel = document.getElementById("weight-val");

    if (durationSlider && durationLabel) {
        durationSlider.addEventListener("input", (e) => {
            durationLabel.textContent = `${e.target.value} mins`;
        });
    }

    if (weightSlider && weightLabel) {
        weightSlider.addEventListener("input", (e) => {
            weightLabel.textContent = `${e.target.value} kg`;
        });
    }

    // 3. Wellness Burn Calculator Logic
    const calcForm = document.getElementById("burn-calc-form");
    const resCalories = document.getElementById("res-calories");
    const resHydration = document.getElementById("res-hydration");
    const resHR = document.getElementById("res-heartrate");
    const resRecovery = document.getElementById("res-recovery");
    const resCoachText = document.getElementById("res-coach-text");

    // MET (Metabolic Equivalent of Task) values
    const MET_VALUES = {
        running: 9.8,
        cycling: 7.5,
        yoga: 3.0,
        hiit: 11.5
    };

    const HR_ZONES = {
        running: "135 - 165",
        cycling: "120 - 150",
        yoga: "85 - 110",
        hiit: "145 - 175"
    };

    const RECOVERY_TIMES = {
        running: 25,
        cycling: 20,
        yoga: 10,
        hiit: 30
    };

    const COACH_ADVICE = {
        running: "Running develops high aerobic efficiency. Aim to keep your steps around 160-180 strides per minute. Drink water containing electrolytes to offset sweat sodium depletion.",
        cycling: "Cycling builds lower body power endurance. Aim for cadences of 80-90 RPM on flat trails. Maintain your posture to relieve lower spine stress.",
        yoga: "Yoga facilitates high parasympathetic recovery (decreases stress cortisol). Focus on deep nasal breathing to optimize heart rate variability alignment.",
        hiit: "HIIT spikes your metabolic rate for up to 24 hours post-exercise (EPOC effect). Limit sessions to 3 times a week to avoid fatigue build-up."
    };

    if (calcForm) {
        calcForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const workout = document.getElementById("workout-type").value;
            const minutes = parseInt(durationSlider.value);
            const weight = parseInt(weightSlider.value);

            // Compute active metrics
            const met = MET_VALUES[workout];
            
            // Formula: Calories burned = (MET * 3.5 * weight / 200) * minutes
            const caloriesCount = Math.round((met * 3.5 * weight / 200) * minutes);
            
            // Hydration: ~0.015 Liters per active minute
            const hydrationCount = parseFloat((minutes * 0.015).toFixed(2));
            
            const hrZone = HR_ZONES[workout];
            const recovery = RECOVERY_TIMES[workout];
            const coachText = COACH_ADVICE[workout];

            // Render Output values with smooth text animations
            animateValueUpdate(resCalories, `${caloriesCount} <span class="res-unit">kCal</span>`);
            animateValueUpdate(resHydration, `${hydrationCount} <span class="res-unit">Liters</span>`);
            animateValueUpdate(resHR, `${hrZone} <span class="res-unit">BPM</span>`);
            animateValueUpdate(resRecovery, `${recovery} <span class="res-unit">Minutes</span>`);

            // Coach advice box fade-in
            resCoachText.style.opacity = 0;
            setTimeout(() => {
                resCoachText.textContent = coachText;
                resCoachText.style.opacity = 1;
            }, 200);
        });
    }

    function animateValueUpdate(element, newHtml) {
        element.style.transform = "scale(0.95)";
        element.style.opacity = 0;
        setTimeout(() => {
            element.innerHTML = newHtml;
            element.style.transform = "scale(1)";
            element.style.opacity = 1;
        }, 150);
    }
});
