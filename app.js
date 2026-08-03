/**
 * ZENIX Portfolio - Client Interactions & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Enable JS-based styling
    document.documentElement.classList.add('js-enabled');

    // Configuration Data Management
    let configData = null;
    let projectNamesMap = {};

    // Scroll Reveal Intersection Observer variables
    let revealObserver = null;

    function initScrollReveal() {
        const animationTargets = [
            '.section-label',
            '.section-title',
            '.section-subtitle',
            '.grid-card',
            '.portfolio-featured-card',
            '.contact-info',
            '.contact-form-wrapper'
        ];

        animationTargets.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add('reveal');
            });
        });

        const revealObserverOptions = {
            threshold: 0.01,
            rootMargin: '0px 0px -10px 0px'
        };

        if (revealObserver) {
            revealObserver.disconnect();
        }

        revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, revealObserverOptions);

        document.querySelectorAll('.reveal').forEach(el => {
            revealObserver.observe(el);
        });
    }

    function setupPricingCTA() {
        const ctaButtons = document.querySelectorAll('.pricing-card .pricing-cta-button');
        const defaultIds = ['frontend', 'mvp', 'automation'];
        ctaButtons.forEach((button, cardIndex) => {
            button.addEventListener('click', () => {
                let tierId = null;
                if (configData && configData.pricing && configData.pricing[cardIndex]) {
                    tierId = configData.pricing[cardIndex].id;
                } else {
                    tierId = defaultIds[cardIndex];
                }
                if (tierId) {
                    const radio = document.querySelector(`input[name="project_type"][value="${tierId}"]`);
                    if (radio) {
                        radio.checked = true;
                        radio.dispatchEvent(new Event('change'));
                    }
                }
            });
        });
    }

    function setupFormRadioValidation() {
        const groupProjectType = document.getElementById('group-project-type');
        if (!groupProjectType) return;
        document.querySelectorAll('input[name="project_type"]').forEach(radio => {
            // Remove previous event listeners by cloning
            const newRadio = radio.cloneNode(true);
            radio.parentNode.replaceChild(newRadio, radio);
            newRadio.addEventListener('change', () => {
                groupProjectType.classList.remove('invalid');
            });
        });
    }

    function applyConfig(config) {
        if (!config) return;

        // 1. Render Promo Banner
        const promoContainer = document.getElementById('promo-banner-container');
        if (promoContainer) {
            if (config.promoBanner && config.promoBanner.active) {
                const themeClass = config.promoBanner.theme || 'accent';
                promoContainer.innerHTML = `
                    <div class="promo-banner ${themeClass}" id="promo-banner">
                        <div class="promo-content">
                            <span class="promo-text">${config.promoBanner.text}</span>
                        </div>
                        <button class="promo-close" id="promo-close-btn" aria-label="Dismiss banner">&times;</button>
                    </div>
                `;
                
                // Add close listener
                const closeBtn = document.getElementById('promo-close-btn');
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => {
                        const banner = document.getElementById('promo-banner');
                        if (banner) {
                            banner.style.transform = 'translateY(-100%)';
                            banner.style.opacity = '0';
                            setTimeout(() => {
                                banner.style.display = 'none';
                                document.body.classList.remove('has-promo-banner');
                            }, 300);
                        }
                    });
                }
                
                document.body.classList.add('has-promo-banner');
            } else {
                promoContainer.innerHTML = '';
                document.body.classList.remove('has-promo-banner');
            }
        }

        // 2. Render Services
        const servicesGrid = document.getElementById('dynamic-services-grid');
        if (servicesGrid && config.services && config.services.length > 0) {
            servicesGrid.innerHTML = config.services.map(service => `
                <div class="grid-card service-card">
                    <div class="card-num">${service.num}</div>
                    <h3 class="card-title">${service.title}</h3>
                    <p class="card-desc">${service.desc}</p>
                </div>
            `).join('');
        }

        // 3. Render Pricing Tiers
        const pricingGrid = document.getElementById('dynamic-pricing-grid');
        if (pricingGrid && config.pricing && config.pricing.length > 0) {
            pricingGrid.innerHTML = config.pricing.map(tier => {
                const isFeatured = tier.featured ? 'featured' : '';
                const popularBadge = tier.featured && tier.popularTag ? `<div class="popular-tag">${tier.popularTag}</div>` : '';
                const featuresHTML = (tier.features || []).map(f => `<li>${f}</li>`).join('');
                
                return `
                    <div class="grid-card pricing-card ${isFeatured}">
                        ${popularBadge}
                        <h3 class="pricing-tier-title">${tier.title}</h3>
                        <div class="pricing-rate">
                            <span class="currency">${tier.currency || '₹'}</span>
                            <span class="amount">${tier.price}</span>
                            <span class="period">${tier.period || '/ project'}</span>
                        </div>
                        <p class="pricing-desc">${tier.desc}</p>
                        <ul class="pricing-features">
                            ${featuresHTML}
                        </ul>
                        <a href="#contact" class="pricing-cta-button">Select Model</a>
                    </div>
                `;
            }).join('');

            // Setup select model button listeners
            setupPricingCTA();
        }

        // 4. Render Inquiry Form Project Type choice cards
        const choiceGrid = document.getElementById('dynamic-choice-grid');
        if (choiceGrid && config.pricing && config.pricing.length > 0) {
            choiceGrid.innerHTML = config.pricing.map((tier, index) => {
                const requiredAttr = index === 0 ? 'required' : '';
                return `
                    <label class="choice-card">
                        <input type="radio" name="project_type" value="${tier.id}" ${requiredAttr}>
                        <span class="choice-title">${tier.title}</span>
                        <span class="choice-details">Flat Rate ${tier.currency || '₹'}${tier.price}</span>
                    </label>
                `;
            }).join('');

            // Re-setup radio listeners to clear errors on change
            setupFormRadioValidation();
        }

        // 5. Update projectNamesMap for Form submission mapping
        projectNamesMap = {};
        if (config.pricing) {
            config.pricing.forEach(tier => {
                projectNamesMap[tier.id] = `${tier.title} (${tier.currency || '₹'}${tier.price})`;
            });
        }

        // Re-initialize animations for the newly rendered cards
        initScrollReveal();
    }

    function buildProjectNamesMapFromDOM() {
        projectNamesMap = {
            mvp: "Full-Stack MVP (₹9,400)",
            "ai-agents": "Custom AI Agents (Custom Scope)",
            frontend: "Landing Page (₹8,900)",
            automation: "Workflow Automation (₹1,599)"
        };
    }

    async function loadConfig() {
        // Try local storage overrides first
        const localOverride = localStorage.getItem('zenix_config');
        if (localOverride) {
            try {
                configData = JSON.parse(localOverride);
                console.log("Loaded ZENIX configuration from localStorage overrides.");
                applyConfig(configData);
                return;
            } catch (e) {
                console.error("Failed to parse local storage config override, falling back to JSON file.", e);
            }
        }

        // Try fetching the configuration file
        try {
            const response = await fetch('./zenix-config.json');
            if (response.ok) {
                configData = await response.json();
                console.log("Loaded ZENIX configuration from zenix-config.json file.");
                applyConfig(configData);
            } else {
                console.warn("Could not load config file, keeping static SEO fallbacks.");
                buildProjectNamesMapFromDOM();
                initScrollReveal();
                setupPricingCTA();
            }
        } catch (error) {
            console.error("Error fetching zenix-config.json:", error);
            buildProjectNamesMapFromDOM();
            initScrollReveal();
            setupPricingCTA();
        }
    }

    // Trigger config load
    loadConfig();

    // 1. Mobile Menu Drawer Navigation
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-link');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.classList.contains('open');
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close menu when clicking navigation links
        links.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
        
        // Close menu on resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });
    }

    function openMenu() {
        menuToggle.classList.add('open');
        navLinks.classList.add('open');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // Lock background scrolling
    }

    function closeMenu() {
        menuToggle.classList.remove('open');
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = ''; // Unlock scrolling
    }

    // Scroll Reveal & CTA setups are now initialized dynamically inside applyConfig() / loadConfig()

    // 3. Active Link Highlight in Navbar on scroll
    const sections = document.querySelectorAll('section[id]');
    
    const activeObserverOptions = {
        threshold: 0.2,
        rootMargin: '-80px 0px -50% 0px' // Adjust calculations around header height
    };

    const activeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                links.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, activeObserverOptions);

    sections.forEach(section => {
        activeObserver.observe(section);
    });

    // 4. Contact / Intake Form Validation & Processing
    const form = document.getElementById('intake-form');
    const successMsg = document.getElementById('form-success');
    const submitBtn = document.getElementById('submit-btn');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // 1. Honeypot check
            const honeypot = document.getElementById('form-honeypot').value;
            if (honeypot) {
                console.warn('Spam submission detected and blocked.');
                return; // Discard bot submission
            }
            
            // Validate standard text fields
            let isFormValid = true;
            const textFields = form.querySelectorAll('.form-input');
            
            textFields.forEach(field => {
                if (!validateField(field)) {
                    isFormValid = false;
                }
            });

            // Validate Project Type Choice Grid
            const projectTypeSelected = form.querySelector('input[name="project_type"]:checked');
            const groupProjectType = document.getElementById('group-project-type');
            if (!projectTypeSelected) {
                groupProjectType.classList.add('invalid');
                isFormValid = false;
            } else {
                groupProjectType.classList.remove('invalid');
            }

            // Validate Budget Choice Pills
            const budgetSelected = form.querySelector('input[name="budget"]:checked');
            const groupBudget = document.getElementById('group-budget');
            if (!budgetSelected) {
                groupBudget.classList.add('invalid');
                isFormValid = false;
            } else {
                groupBudget.classList.remove('invalid');
            }

            if (!isFormValid) {
                // Scroll to the first invalid section
                const firstInvalid = form.querySelector('.form-group.invalid');
                if (firstInvalid) {
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            // Submit form to Web3Forms
            submitBtn.classList.add('loading');
            
            try {
                // Collect form data
                const formData = new FormData(form);
                const object = Object.fromEntries(formData);
                
                // Add the Web3Forms Access Key
                // CLAIM YOUR FREE KEY AT https://web3forms.com AND REPLACE THE VALUE BELOW
                object.access_key = "ab3c9f3a-3434-4080-b1a5-404a2c453588";
                
                // Convert option values to friendly display names for the email
                const budgetNames = {
                    "under-5000": "Under ₹5,000",
                    "5000-10000": "₹5,000 - ₹10,000",
                    "10000plus": "₹10,000+"
                };
                if (object.project_type) object.project_type = projectNamesMap[object.project_type] || object.project_type;
                if (object.budget) object.budget = budgetNames[object.budget] || object.budget;

                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(object)
                });
                
                const result = await response.json();
                
                if (response.status === 200 && result.success) {
                    // Successful submission handling
                    submitBtn.classList.remove('loading');
                    form.style.opacity = '0';
                    
                    setTimeout(() => {
                        form.style.display = 'none';
                        successMsg.classList.add('visible');
                        successMsg.setAttribute('aria-hidden', 'false');
                        
                        // Smoothly scroll container into view
                        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 400);
                } else {
                    throw new Error(result.message || "Form submission failed");
                }
                
            } catch (error) {
                console.error("Submission failed:", error);
                submitBtn.classList.remove('loading');
                alert("Sorry, there was an issue sending your message. Please try again or email us directly at zenixservices67@gmail.com.");
            }
        });

        // Add real-time text input listeners to instantly clear error messages
        form.querySelectorAll('.form-input').forEach(field => {
            field.addEventListener('input', () => {
                if (field.value.trim()) {
                    if (field.type === 'email') {
                        if (validateEmail(field.value)) {
                            clearError(field);
                        }
                    } else {
                        clearError(field);
                    }
                }
            });
            
            field.addEventListener('blur', () => {
                validateField(field);
            });
        });

        // Clear error highlights for Choice Grids and Pills immediately on click
        setupFormRadioValidation();

        form.querySelectorAll('input[name="budget"]').forEach(radio => {
            radio.addEventListener('change', () => {
                document.getElementById('group-budget').classList.remove('invalid');
            });
        });
    }

    function validateField(field) {
        const value = field.value.trim();
        const group = field.parentElement;
        
        if (!value) {
            setError(field);
            return false;
        }

        // Validate name field format (letters and spaces only, 2 to 50 characters)
        if (field.id === 'form-name') {
            const nameRegex = /^[a-zA-Z\s]{2,50}$/;
            if (!nameRegex.test(value)) {
                setError(field);
                return false;
            }
        }
        
        if (field.type === 'email' && !validateEmail(value)) {
            setError(field);
            return false;
        }
        
        clearError(field);
        return true;
    }

    function setError(field) {
        const group = field.parentElement;
        group.classList.add('invalid');
        field.setAttribute('aria-invalid', 'true');
    }

    function clearError(field) {
        const group = field.parentElement;
        group.classList.remove('invalid');
        field.removeAttribute('aria-invalid');
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // 5. FAQ Accordion Toggle Collapsible Logic
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all active items
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                // Set max-height dynamically to content scrollHeight for CSS smooth animations
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // 6. Futuristic Boot Console Preloader Handler
    const preloader = document.getElementById('zenix-preloader');
    const terminalBody = document.getElementById('preloader-terminal-body');
    const progressBar = document.getElementById('preloader-progress-bar');
    const progressPct = document.getElementById('preloader-progress-pct');
    const statusLbl = document.getElementById('preloader-status-lbl');

    if (preloader && terminalBody) {
        // Lock body scrolling during preload
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';

        const bootSequence = [
            { text: "INITIALIZING SYSTEM BOOT SEQUENCE...", type: "info", delay: 100 },
            { text: "LOADING ZENIX CLIENT KERNEL... [OK]", type: "success", delay: 300 },
            { text: "COMPILING DESIGN SYSTEM VARIABLE SCHEMAS...", type: "cmd-prefix", delay: 550 },
            { text: "RESOLVING STACK COMPILATION PARAMETERS... [OK]", type: "success", delay: 850 },
            { text: "ESTABLISHING HOSTING PIPELINE CORRELATIONS...", type: "cmd-prefix", delay: 1100 },
            { text: "CHECKING SERVERLESS REST API CONNECTIVITY... [OK]", type: "success", delay: 1350 },
            { text: "INTERFACE RENDERING CALIBRATION COMPLETE.", type: "blink", delay: 1550 }
        ];

        // 1. Staggered log printing logic
        bootSequence.forEach(step => {
            setTimeout(() => {
                const line = document.createElement('div');
                line.className = `terminal-log-line ${step.type}`;
                if (step.type === 'cmd-prefix') {
                    line.className += ' cmd-prefix';
                }
                line.textContent = step.text;
                terminalBody.appendChild(line);
                
                // Auto scroll to bottom
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }, step.delay);
        });

        // 2. Linear loading progress bar animation
        let currentPct = 0;
        const totalDuration = 1800; // 1.8 seconds loading screen
        const intervalTime = 20;    // Tick update duration
        const totalSteps = totalDuration / intervalTime;
        const pctIncrement = 100 / totalSteps;

        const hidePreloader = () => {
            if (!preloader.classList.contains('loaded')) {
                preloader.classList.add('loaded');
                document.body.classList.add('loaded');
                document.body.style.overflow = '';
                document.body.style.height = '';

                // Remove preloader from display tree after fade transitions complete
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 1000);
            }
        };

        const progressInterval = setInterval(() => {
            currentPct += pctIncrement;
            if (currentPct >= 100) {
                currentPct = 100;
                clearInterval(progressInterval);
                if (statusLbl) statusLbl.textContent = "Boot Complete";
                
                // Redirection hide preloader trigger
                setTimeout(hidePreloader, 350);
            } else if (currentPct > 80) {
                if (statusLbl) statusLbl.textContent = "Launching Interactive Studio";
            } else if (currentPct > 40) {
                if (statusLbl) statusLbl.textContent = "Compiling Design System CSS";
            }

            const roundedPct = Math.floor(currentPct);
            if (progressPct) progressPct.textContent = `${roundedPct}%`;
            if (progressBar) progressBar.style.width = `${roundedPct}%`;
        }, intervalTime);

        // Safety fallback unlock sequence (max 3.2s)
        setTimeout(hidePreloader, 3200);
    }

});
