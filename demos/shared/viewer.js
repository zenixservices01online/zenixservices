/**
 * ZENIX Interactive Demo Console & Client Feedback Script
 * Auto-injects a premium glassmorphic controller on all client demos.
 */

(function () {
    // 1. Identify the current demo page based on the pathname
    const path = window.location.pathname;
    let currentDemoKey = "unknown";
    let currentDemoName = "Demo Page";

    if (path.includes("aether-ai")) {
        currentDemoKey = "aether-ai";
        currentDemoName = "Aether AI (SaaS)";
    } else if (path.includes("nova-fit")) {
        currentDemoKey = "nova-fit";
        currentDemoName = "Nova Fit (Wellness)";
    } else if (path.includes("zenith")) {
        currentDemoKey = "zenith";
        currentDemoName = "Zenith Workspace (Productivity)";
    } else if (path.includes("veloce-watch")) {
        currentDemoKey = "veloce-watch";
        currentDemoName = "Veloce Watch (E-Commerce)";
    } else if (path.includes("pixel-watch")) {
        currentDemoKey = "pixel-watch";
        currentDemoName = "Pixel Watch (Google)";
    }

    // 2. Auto-load the viewer CSS relative to the current script location
    const cssPath = "../shared/viewer.css";
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = cssPath;
    document.head.appendChild(linkElement);

    // 3. Inject markup once DOM is fully interactive
    document.addEventListener("DOMContentLoaded", () => {
        setupConsoleMarkup();
        setupTransitionMarkup();
        setupEventListeners();
        updateFeedbackCountBadge();
    });

    function setupTransitionMarkup() {
        const transitionOverlay = document.createElement("div");
        transitionOverlay.className = "zenix-page-transition-overlay";
        transitionOverlay.id = "zenix-transition-overlay";
        transitionOverlay.setAttribute("aria-hidden", "true");
        transitionOverlay.innerHTML = `
            <div class="transition-content">
                <div class="transition-logo-wrapper">
                    <svg class="transition-logo-svg spin-logo" width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="11" stroke="#0055cc" stroke-width="1.5" />
                        <polygon points="6,8 15,8 13,11 4,11" fill="#0055cc" />
                        <polygon points="15,8 18,8 9,16 6,16" fill="#ffffff" />
                        <polygon points="11,13 20,13 18,16 9,16" fill="#0055cc" />
                    </svg>
                </div>
                <p class="transition-message" id="zenix-transition-message">Launching Demo Workspace...</p>
                <div class="transition-progress-container">
                    <div class="transition-progress-bar" id="zenix-transition-bar"></div>
                </div>
            </div>
        `;
        document.body.appendChild(transitionOverlay);
    }

    function setupConsoleMarkup() {
        // Create Console Wrapper
        const consoleContainer = document.createElement("div");
        consoleContainer.className = "zenix-console-container";
        consoleContainer.id = "zenix-console-container";

        // Generate the options list. Mark current demo as selected.
        const options = [
            { key: "aether-ai", name: "1. Aether AI (SaaS)", path: "../aether-ai/index.html" },
            { key: "nova-fit", name: "2. Nova Fit (Wellness)", path: "../nova-fit/index.html" },
            { key: "zenith", name: "3. Zenith Workspace", path: "../zenith/index.html" },
            { key: "veloce-watch", name: "4. Veloce Watch (Shop)", path: "../veloce-watch/index.html" },
            { key: "pixel-watch", name: "5. Pixel Watch (Google)", path: "../pixel-watch/index.html" },
            { key: "home", name: "← Back to Zenix Home", path: "../../index.html" }
        ];

        let selectOptionsHtml = `<option value="" disabled selected>Switch Demo...</option>`;
        options.forEach(opt => {
            const isSel = opt.key === currentDemoKey ? "selected" : "";
            selectOptionsHtml += `<option value="${opt.path}" ${isSel}>${opt.name}</option>`;
        });

        // Console Bar HTML
        consoleContainer.innerHTML = `
            <div class="zenix-console">
                <a href="../../index.html" class="zenix-console-brand">
                    <svg class="zenix-console-logo" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="6,8 15,8 13,11 4,11" fill="currentColor"/>
                        <polygon points="15,8 18,8 9,16 6,16" fill="#ffffff"/>
                        <polygon points="11,13 20,13 18,16 9,16" fill="currentColor"/>
                    </svg>
                    <span>ZENIX</span>
                </a>
                <div class="zenix-console-divider"></div>
                <div class="zenix-console-select-wrapper">
                    <select class="zenix-console-select" id="zenix-demo-selector">
                        ${selectOptionsHtml}
                    </select>
                </div>
                <div class="zenix-console-divider"></div>
                <button class="zenix-console-btn" id="zenix-trigger-feedback">
                    <span>Feedback</span>
                </button>
                <button class="zenix-console-btn zenix-console-btn-secondary" id="zenix-trigger-history" title="View Submitted Feedbacks">
                    <span>History</span>
                    <span class="zenix-badge" id="zenix-history-badge">0</span>
                </button>
            </div>
        `;

        document.body.appendChild(consoleContainer);

        // Feedback Dialog Backdrop & Modal HTML
        const modalBackdrop = document.createElement("div");
        modalBackdrop.className = "zenix-modal-backdrop";
        modalBackdrop.id = "zenix-feedback-modal";
        modalBackdrop.innerHTML = `
            <div class="zenix-modal">
                <div class="zenix-modal-header">
                    <h3 class="zenix-modal-title" id="zenix-modal-title-text">Feedback: ${currentDemoName}</h3>
                    <button class="zenix-modal-close" id="zenix-close-modal">&times;</button>
                </div>
                <div class="zenix-modal-body" id="zenix-modal-body-content">
                    <form id="zenix-feedback-form">
                        <!-- Star Rating -->
                        <div class="zenix-form-group">
                            <label class="zenix-label">Overall Rating *</label>
                            <div class="zenix-stars-container">
                                <button type="button" class="zenix-star-btn" data-value="1">★</button>
                                <button type="button" class="zenix-star-btn" data-value="2">★</button>
                                <button type="button" class="zenix-star-btn" data-value="3">★</button>
                                <button type="button" class="zenix-star-btn" data-value="4">★</button>
                                <button type="button" class="zenix-star-btn" data-value="5">★</button>
                            </div>
                            <input type="hidden" id="zenix-rating-val" name="rating" required value="">
                        </div>

                        <!-- Feedback Category Tags -->
                        <div class="zenix-form-group">
                            <label class="zenix-label">Feedback Focus (Select tags)</label>
                            <div class="zenix-category-grid">
                                <span class="zenix-cat-pill" data-cat="Visual Design">🎨 Visual Design</span>
                                <span class="zenix-cat-pill" data-cat="Layout & UI">📐 Layout & UI</span>
                                <span class="zenix-cat-pill" data-cat="Speed & Motion">⚡ Speed & Motion</span>
                                <span class="zenix-cat-pill" data-cat="Copywriting">✏️ Copy & Content</span>
                                <span class="zenix-cat-pill" data-cat="Mobile Usability">📱 Mobile view</span>
                                <span class="zenix-cat-pill" data-cat="Bugs/Issues">⚠️ Bugs / Fixes</span>
                            </div>
                        </div>

                        <!-- User Info -->
                        <div class="zenix-form-group">
                            <label class="zenix-label" for="zenix-client-name">Your Name</label>
                            <input type="text" class="zenix-input" id="zenix-client-name" placeholder="John Doe">
                        </div>

                        <!-- Comments Textarea -->
                        <div class="zenix-form-group">
                            <label class="zenix-label" for="zenix-comments">Comments / Suggestions *</label>
                            <textarea class="zenix-textarea" id="zenix-comments" placeholder="Describe what you liked, what can be improved, or any adjustments you require..." required></textarea>
                        </div>
                    </form>
                </div>
                <div class="zenix-modal-footer" id="zenix-modal-footer-btns">
                    <button class="zenix-console-btn zenix-console-btn-secondary" id="zenix-cancel-modal">Cancel</button>
                    <button type="submit" form="zenix-feedback-form" class="zenix-console-btn" id="zenix-submit-feedback">Submit Feedback</button>
                </div>
            </div>
        `;

        document.body.appendChild(modalBackdrop);
    }

    function setupEventListeners() {
        // Dropdown page redirects with animated transition screen
        const selector = document.getElementById("zenix-demo-selector");
        if (selector) {
            selector.addEventListener("change", (e) => {
                const targetPath = e.target.value;
                if (targetPath) {
                    e.preventDefault();

                    let msg = "Launching Demo Workspace...";
                    const selectedOpt = selector.options[selector.selectedIndex];
                    const selectedName = selectedOpt ? selectedOpt.text.replace(/^\d+\.\s*/, '') : 'Demo Workspace';

                    if (targetPath.includes("index.html") && targetPath.includes("../../")) {
                        msg = "Returning to Zenix Home...";
                    } else {
                        msg = `Launching ${selectedName}...`;
                    }

                    triggerTransition(targetPath, msg);
                }
            });
        }

        // Home brand link click redirect transition
        const brandLink = document.querySelector(".zenix-console-brand");
        if (brandLink) {
            brandLink.addEventListener("click", (e) => {
                e.preventDefault();
                triggerTransition("../../index.html", "Returning to Zenix Home...");
            });
        }

        function triggerTransition(url, message) {
            const transitionOverlay = document.getElementById('zenix-transition-overlay');
            if (transitionOverlay) {
                const messageEl = document.getElementById('zenix-transition-message');
                if (messageEl) {
                    messageEl.textContent = message;
                }

                transitionOverlay.classList.add('active');
                transitionOverlay.setAttribute('aria-hidden', 'false');

                // Wait for transition bar to fill (800ms)
                setTimeout(() => {
                    window.location.href = url;
                }, 900);
            } else {
                window.location.href = url;
            }
        }

        // Modal triggers
        const triggerBtn = document.getElementById("zenix-trigger-feedback");
        const triggerHistoryBtn = document.getElementById("zenix-trigger-history");
        const modal = document.getElementById("zenix-feedback-modal");
        const closeBtn = document.getElementById("zenix-close-modal");
        const cancelBtn = document.getElementById("zenix-cancel-modal");

        function openModalView(viewType) {
            modal.classList.add("open");
            document.body.style.overflow = "hidden"; // Lock page scroll

            if (viewType === 'history') {
                renderHistoryView();
            } else {
                renderFormView();
            }
        }

        function closeModalView() {
            modal.classList.remove("open");
            document.body.style.overflow = ""; // Restore page scroll
        }

        if (triggerBtn) triggerBtn.addEventListener("click", () => openModalView('form'));
        if (triggerHistoryBtn) triggerHistoryBtn.addEventListener("click", () => openModalView('history'));
        if (closeBtn) closeBtn.addEventListener("click", closeModalView);
        if (cancelBtn) cancelBtn.addEventListener("click", closeModalView);

        // Click outside modal to close
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                closeModalView();
            }
        });

        // Initialize Star rating system
        const stars = modal.querySelectorAll(".zenix-star-btn");
        const ratingInput = modal.querySelector("#zenix-rating-val");

        stars.forEach(star => {
            star.addEventListener("click", () => {
                const rating = parseInt(star.getAttribute("data-value"));
                ratingInput.value = rating;

                // Update stars CSS classes
                stars.forEach(s => {
                    const val = parseInt(s.getAttribute("data-value"));
                    if (val <= rating) {
                        s.classList.add("active");
                    } else {
                        s.classList.remove("active");
                    }
                });
            });
        });

        // Category pills click toggle
        const pills = modal.querySelectorAll(".zenix-cat-pill");
        pills.forEach(pill => {
            pill.addEventListener("click", () => {
                pill.classList.toggle("selected");
            });
        });

        // Form Submit
        const form = modal.querySelector("#zenix-feedback-form");
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const rating = ratingInput.value;
            const comments = modal.querySelector("#zenix-comments").value;
            const name = modal.querySelector("#zenix-client-name").value || "Anonymous Client";

            if (!rating) {
                alert("Please select a star rating.");
                return;
            }

            // Gather selected categories
            const selectedCats = [];
            modal.querySelectorAll(".zenix-cat-pill.selected").forEach(p => {
                selectedCats.push(p.getAttribute("data-cat"));
            });

            // Package feedback object
            const feedbackItem = {
                id: Date.now(),
                demoKey: currentDemoKey,
                demoName: currentDemoName,
                rating: parseInt(rating),
                categories: selectedCats,
                comments: comments,
                userName: name,
                timestamp: new Date().toLocaleString()
            };

            // Save to localStorage
            const localKey = "zenix_demo_feedbacks";
            const feedbacks = JSON.parse(localStorage.getItem(localKey) || "[]");
            feedbacks.unshift(feedbackItem); // Prepends to keep newest first
            localStorage.setItem(localKey, JSON.stringify(feedbacks));

            // Sync badges
            updateFeedbackCountBadge();

            // Render Success view inside Modal body
            renderSuccessView();
        });
    }

    function renderFormView() {
        const title = document.getElementById("zenix-modal-title-text");
        title.innerText = `Feedback: ${currentDemoName}`;

        const body = document.getElementById("zenix-modal-body-content");
        body.innerHTML = `
            <form id="zenix-feedback-form">
                <div class="zenix-form-group">
                    <label class="zenix-label">Overall Rating *</label>
                    <div class="zenix-stars-container">
                        <button type="button" class="zenix-star-btn" data-value="1">★</button>
                        <button type="button" class="zenix-star-btn" data-value="2">★</button>
                        <button type="button" class="zenix-star-btn" data-value="3">★</button>
                        <button type="button" class="zenix-star-btn" data-value="4">★</button>
                        <button type="button" class="zenix-star-btn" data-value="5">★</button>
                    </div>
                    <input type="hidden" id="zenix-rating-val" name="rating" required value="">
                </div>

                <div class="zenix-form-group">
                    <label class="zenix-label">Feedback Focus (Select tags)</label>
                    <div class="zenix-category-grid">
                        <span class="zenix-cat-pill" data-cat="Visual Design">🎨 Visual Design</span>
                        <span class="zenix-cat-pill" data-cat="Layout & UI">📐 Layout & UI</span>
                        <span class="zenix-cat-pill" data-cat="Speed & Motion">⚡ Speed & Motion</span>
                        <span class="zenix-cat-pill" data-cat="Copywriting">✏️ Copy & Content</span>
                        <span class="zenix-cat-pill" data-cat="Mobile Usability">📱 Mobile view</span>
                        <span class="zenix-cat-pill" data-cat="Bugs/Issues">⚠️ Bugs / Fixes</span>
                    </div>
                </div>

                <div class="zenix-form-group">
                    <label class="zenix-label" for="zenix-client-name">Your Name</label>
                    <input type="text" class="zenix-input" id="zenix-client-name" placeholder="John Doe">
                </div>

                <div class="zenix-form-group">
                    <label class="zenix-label" for="zenix-comments">Comments / Suggestions *</label>
                    <textarea class="zenix-textarea" id="zenix-comments" placeholder="Describe what you liked, what can be improved, or any adjustments you require..." required></textarea>
                </div>
            </form>
        `;

        const footer = document.getElementById("zenix-modal-footer-btns");
        footer.style.display = "flex";
        footer.innerHTML = `
            <button class="zenix-console-btn zenix-console-btn-secondary" id="zenix-cancel-modal">Cancel</button>
            <button type="submit" form="zenix-feedback-form" class="zenix-console-btn" id="zenix-submit-feedback">Submit Feedback</button>
        `;

        // Re-attach stars, pills & cancel event listeners for new markup
        setupDynamicFormListeners();
    }

    function setupDynamicFormListeners() {
        const modal = document.getElementById("zenix-feedback-modal");
        const cancelBtn = document.getElementById("zenix-cancel-modal");
        cancelBtn.addEventListener("click", () => {
            modal.classList.remove("open");
            document.body.style.overflow = "";
        });

        const stars = modal.querySelectorAll(".zenix-star-btn");
        const ratingInput = modal.querySelector("#zenix-rating-val");

        stars.forEach(star => {
            star.addEventListener("click", () => {
                const rating = parseInt(star.getAttribute("data-value"));
                ratingInput.value = rating;

                stars.forEach(s => {
                    const val = parseInt(s.getAttribute("data-value"));
                    if (val <= rating) {
                        s.classList.add("active");
                    } else {
                        s.classList.remove("active");
                    }
                });
            });
        });

        const pills = modal.querySelectorAll(".zenix-cat-pill");
        pills.forEach(pill => {
            pill.addEventListener("click", () => {
                pill.classList.toggle("selected");
            });
        });
    }

    function renderSuccessView() {
        const body = document.getElementById("zenix-modal-body-content");
        const footer = document.getElementById("zenix-modal-footer-btns");
        
        footer.style.display = "none";

        body.innerHTML = `
            <div class="zenix-success-overlay">
                <div class="zenix-success-icon">✓</div>
                <h4 class="zenix-success-title">Feedback Submitted!</h4>
                <p class="zenix-success-desc">Thank you for helping us refine this project. Your review has been saved in your browser history log.</p>
            </div>
        `;

        // Auto close modal after 2.5 seconds
        setTimeout(() => {
            const modal = document.getElementById("zenix-feedback-modal");
            modal.classList.remove("open");
            document.body.style.overflow = "";
        }, 2500);
    }

    function renderHistoryView() {
        const title = document.getElementById("zenix-modal-title-text");
        title.innerText = "Submitted Reviews Log";

        const footer = document.getElementById("zenix-modal-footer-btns");
        footer.style.display = "flex";
        footer.innerHTML = `
            <button class="zenix-console-btn zenix-console-btn-secondary" id="zenix-clear-history-btn">Clear History</button>
            <button class="zenix-console-btn" id="zenix-export-history-btn">Export JSON</button>
        `;

        const body = document.getElementById("zenix-modal-body-content");
        const localKey = "zenix_demo_feedbacks";
        const feedbacks = JSON.parse(localStorage.getItem(localKey) || "[]");

        if (feedbacks.length === 0) {
            body.innerHTML = `
                <div class="zenix-history-empty">
                    <p>No feedback entries found. Leave a review to log item entries.</p>
                </div>
            `;
            const clearBtn = document.getElementById("zenix-clear-history-btn");
            if (clearBtn) clearBtn.style.display = "none";
            return;
        }

        let historyHtml = `<div class="zenix-history-list">`;
        feedbacks.forEach(item => {
            const starText = "★".repeat(item.rating) + "☆".repeat(5 - item.rating);
            
            let badgesHtml = "";
            if (item.categories && item.categories.length > 0) {
                item.categories.forEach(cat => {
                    badgesHtml += `<span class="zenix-history-cat-badge">${cat}</span>`;
                });
            }

            historyHtml += `
                <div class="zenix-history-card">
                    <div class="zenix-history-meta">
                        <span class="zenix-history-demo-name">${item.demoName}</span>
                        <span class="zenix-history-rating">${starText}</span>
                    </div>
                    <p class="zenix-history-comment">"${item.comments}"</p>
                    <div class="zenix-history-meta" style="margin-top:0.5rem; margin-bottom:0;">
                        <span>By: ${item.userName}</span>
                        <span>${item.timestamp}</span>
                    </div>
                    ${badgesHtml ? `<div class="zenix-history-cats">${badgesHtml}</div>` : ''}
                </div>
            `;
        });
        historyHtml += `</div>`;

        body.innerHTML = historyHtml;

        // Wire up clear and export actions
        document.getElementById("zenix-clear-history-btn").addEventListener("click", () => {
            if (confirm("Are you sure you want to delete all stored feedback comments from your browser?")) {
                localStorage.removeItem(localKey);
                updateFeedbackCountBadge();
                renderHistoryView();
            }
        });

        document.getElementById("zenix-export-history-btn").addEventListener("click", () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(feedbacks, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", "zenix_client_feedback.json");
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
        });
    }

    function updateFeedbackCountBadge() {
        const localKey = "zenix_demo_feedbacks";
        const feedbacks = JSON.parse(localStorage.getItem(localKey) || "[]");
        const badge = document.getElementById("zenix-history-badge");
        if (badge) {
            badge.innerText = feedbacks.length;
        }
    }
})();
