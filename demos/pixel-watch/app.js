/**
 * Google Pixel Watch 3 Landing Page - Interactive Client Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    // Current state configuration
    let currentStyle = 'obsidian';
    let currentPrice = 39900;
    let currentImg = '../../assets/pixel_watch_hero.png';
    let currentCaseName = 'Matte Black Aluminum';
    let currentBandName = 'Obsidian fluoroelastomer';

    // 1. Color Customizer Swatches Logic
    const swatches = document.querySelectorAll('.swatch-btn');
    const mainWatchImg = document.getElementById('main-watch-img');
    const displayPrice = document.getElementById('display-price');
    const specCaseVal = document.getElementById('spec-case-val');
    const specBandVal = document.getElementById('spec-band-val');

    // Mappings for swatch configuration
    const swatchSpecs = {
        obsidian: {
            caseName: 'Matte Black Aluminum',
            bandName: 'Obsidian fluoroelastomer'
        },
        porcelain: {
            caseName: 'Polished Silver Aluminum',
            bandName: 'Porcelain fluoroelastomer'
        },
        hazel: {
            caseName: 'Champagne Gold Aluminum',
            bandName: 'Hazel active band'
        }
    };

    swatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            // Remove active classes
            swatches.forEach(s => {
                s.classList.remove('active');
                s.setAttribute('aria-checked', 'false');
            });

            // Set active class
            swatch.classList.add('active');
            swatch.setAttribute('aria-checked', 'true');

            // Gather attributes
            currentStyle = swatch.getAttribute('data-style');
            currentPrice = parseInt(swatch.getAttribute('data-price'));
            currentImg = swatch.getAttribute('data-img');

            // Map specs
            const specs = swatchSpecs[currentStyle];
            currentCaseName = specs.caseName;
            currentBandName = specs.bandName;

            // Trigger fade transition on watch image
            if (mainWatchImg) {
                mainWatchImg.classList.add('fade-out');
                setTimeout(() => {
                    mainWatchImg.src = currentImg;
                    mainWatchImg.alt = `Google Pixel Watch 3 ${swatch.querySelector('.swatch-label').innerText}`;
                    mainWatchImg.classList.remove('fade-out');
                    mainWatchImg.classList.add('fade-in');
                }, 150);
            }

            // Update display elements
            if (displayPrice) {
                displayPrice.innerText = `₹${currentPrice.toLocaleString()}`;
            }
            if (specCaseVal) {
                specCaseVal.innerText = currentCaseName;
            }
            if (specBandVal) {
                specBandVal.innerText = currentBandName;
            }

            // Sync cart thumb and details immediately
            syncCartDetails();
        });
    });

    // 2. Specifications Accordion Toggles
    const accordionHeaders = document.querySelectorAll('.accordion-header-btn');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.accordion-panel-content');
            const isCurrentlyExpanded = header.getAttribute('aria-expanded') === 'true';

            // Close all accordions first for clean progressive disclosure
            document.querySelectorAll('.specs-accordion-item').forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.accordion-header-btn').setAttribute('aria-expanded', 'false');
                otherItem.querySelector('.accordion-panel-content').setAttribute('aria-hidden', 'true');
            });

            if (!isCurrentlyExpanded) {
                item.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
                content.setAttribute('aria-hidden', 'false');
            }
        });
    });

    // 3. Purchase Sidebar Drawer Logic
    const drawerBackdrop = document.getElementById('checkout-drawer-backdrop');
    const buyTrigger = document.getElementById('floating-buy-trigger');
    const configureTrigger = document.getElementById('add-to-cart-trigger');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    
    const cartView = document.getElementById('cart-content-view');
    const detailsView = document.getElementById('checkout-details-view');
    const successView = document.getElementById('checkout-success-view');

    // Cart layout elements
    const cartProductThumb = document.getElementById('cart-product-thumb');
    const cartItemSpecsLbl = document.getElementById('cart-item-specs-lbl');
    const cartItemPriceLbl = document.getElementById('cart-item-price-lbl');
    const cartCalcSubtotal = document.getElementById('cart-calc-subtotal');
    const cartCalcTax = document.getElementById('cart-calc-tax');
    const cartCalcTotal = document.getElementById('cart-calc-total');

    function syncCartDetails() {
        if (cartProductThumb) cartProductThumb.src = currentImg;
        if (cartItemSpecsLbl) cartItemSpecsLbl.innerText = `${currentCaseName} / ${currentBandName.split(' ')[0]}`;
        
        const priceStr = `₹${currentPrice.toLocaleString()}`;
        if (cartItemPriceLbl) cartItemPriceLbl.innerText = priceStr;
        if (cartCalcSubtotal) cartCalcSubtotal.innerText = priceStr;
        if (cartCalcTotal) cartCalcTotal.innerText = priceStr;

        // Est tax included (approx 18%)
        const taxAmount = Math.round(currentPrice * 0.18);
        if (cartCalcTax) cartCalcTax.innerText = `₹${taxAmount.toLocaleString()}`;
    }

    function openDrawer() {
        syncCartDetails();
        // Reset view visibility
        cartView.classList.remove('form-view-hidden');
        detailsView.classList.add('form-view-hidden');
        successView.classList.add('form-view-hidden');

        drawerBackdrop.classList.add('open');
        drawerBackdrop.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent page scroll
    }

    function closeDrawer() {
        drawerBackdrop.classList.remove('open');
        drawerBackdrop.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Unlock page scroll
    }

    if (buyTrigger) buyTrigger.addEventListener('click', openDrawer);
    if (configureTrigger) configureTrigger.addEventListener('click', openDrawer);
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
    
    // Close on backdrop click
    if (drawerBackdrop) {
        drawerBackdrop.addEventListener('click', (e) => {
            if (e.target === drawerBackdrop) {
                closeDrawer();
            }
        });
    }

    // 4. Cart summary navigation to Details
    const goCheckoutDetailsBtn = document.getElementById('go-checkout-details-btn');
    const backToCartTriggerBtn = document.getElementById('back-to-cart-trigger-btn');

    if (goCheckoutDetailsBtn) {
        goCheckoutDetailsBtn.addEventListener('click', () => {
            cartView.classList.add('form-view-hidden');
            detailsView.classList.remove('form-view-hidden');
        });
    }

    if (backToCartTriggerBtn) {
        backToCartTriggerBtn.addEventListener('click', () => {
            detailsView.classList.add('form-view-hidden');
            cartView.classList.remove('form-view-hidden');
        });
    }

    // 5. Checkout Form validation and submission
    const checkoutForm = document.getElementById('google-checkout-form');
    const checkoutSubmitBtn = document.getElementById('checkout-submit-btn');

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isFormValid = true;
            const nameField = document.getElementById('checkout-name');
            const emailField = document.getElementById('checkout-email');
            const cardField = document.getElementById('checkout-card');
            const expField = document.getElementById('checkout-exp');
            const cvvField = document.getElementById('checkout-cvv');

            // Validate Name
            if (!nameField.value.trim()) {
                setError(nameField);
                isFormValid = false;
            } else {
                clearError(nameField);
            }

            // Validate Email
            if (!validateEmail(emailField.value)) {
                setError(emailField);
                isFormValid = false;
            } else {
                clearError(emailField);
            }

            // Validate Card Number
            const cleanCard = cardField.value.replace(/\s+/g, '');
            if (cleanCard.length < 13 || cleanCard.length > 19 || isNaN(Number(cleanCard))) {
                setError(cardField);
                isFormValid = false;
            } else {
                clearError(cardField);
            }

            // Validate Expiry MM/YY
            const expRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
            if (!expRegex.test(expField.value.trim())) {
                setError(expField);
                isFormValid = false;
            } else {
                clearError(expField);
            }

            // Validate CVV
            const cvvVal = cvvField.value.trim();
            if (cvvVal.length < 3 || cvvVal.length > 4 || isNaN(Number(cvvVal))) {
                setError(cvvField);
                isFormValid = false;
            } else {
                clearError(cvvField);
            }

            if (!isFormValid) return;

            // Submit success view trigger
            detailsView.classList.add('form-view-hidden');
            successView.classList.remove('form-view-hidden');
        });

        // Add real-time inputs event listeners to clear error outlines instantly
        checkoutForm.querySelectorAll('.form-input-field').forEach(field => {
            field.addEventListener('input', () => {
                if (field.value.trim()) {
                    if (field.id === 'checkout-email') {
                        if (validateEmail(field.value)) {
                            clearError(field);
                        }
                    } else {
                        clearError(field);
                    }
                }
            });
        });
    }

    function setError(field) {
        field.parentElement.classList.add('invalid');
        field.setAttribute('aria-invalid', 'true');
    }

    function clearError(field) {
        field.parentElement.classList.remove('invalid');
        field.removeAttribute('aria-invalid');
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Done button close cart modal drawer
    const successDoneBtn = document.getElementById('success-done-btn');
    if (successDoneBtn) {
        successDoneBtn.addEventListener('click', () => {
            closeDrawer();
            if (checkoutForm) checkoutForm.reset();
        });
    }
});
