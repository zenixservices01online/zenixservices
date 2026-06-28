/**
 * Veloce Luxury Watches - E-Commerce Shopping Cart & Interface Controller
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Ticking Watch Hands Simulation for CSS Watch Faces
    const watchDials = document.querySelectorAll(".css-watch");
    
    watchDials.forEach((dial, i) => {
        const hourHand = dial.querySelector(".hand-hour");
        const minuteHand = dial.querySelector(".hand-minute");
        const secondHand = dial.querySelector(".hand-second");

        // Offset initial angles slightly per watch so they don't look identical
        let secondsAngle = 290 + (i * 90);
        let minutesAngle = 160 + (i * 30);
        let hoursAngle = 45 + (i * 15);

        // Continuous sweep interval
        setInterval(() => {
            secondsAngle += 6; // 360 deg / 60 seconds = 6 deg/sec
            
            // Sweep minute/hour hands slightly
            minutesAngle += 0.1;
            hoursAngle += 0.008;

            if (secondHand) secondHand.style.transform = `translateX(-50%) rotate(${secondsAngle}deg)`;
            if (minuteHand) minuteHand.style.transform = `translateX(-50%) rotate(${minutesAngle}deg)`;
            if (hourHand) hourHand.style.transform = `translateX(-50%) rotate(${hoursAngle}deg)`;
        }, 1000);
    });

    // 2. Stateful Shopping Cart Manager
    let cart = [];
    const cartNavBtn = document.getElementById("cart-nav-btn");
    const cartNavBadge = document.getElementById("cart-nav-badge");
    const cartBackdrop = document.getElementById("cart-sidebar-backdrop");
    const cartCloseBtn = document.getElementById("cart-sidebar-close");
    const cartItemsPanel = document.getElementById("cart-items-panel");
    const cartSubtotalVal = document.getElementById("cart-subtotal-val");
    const proceedCheckoutBtn = document.getElementById("proceed-checkout-btn");
    const addCartButtons = document.querySelectorAll(".add-to-cart-btn");

    // Checkout Views
    const checkoutView = document.getElementById("checkout-form-view");
    const checkoutSuccessView = document.getElementById("checkout-success-view");
    const backToCartBtn = document.getElementById("back-to-cart-trigger");
    const checkoutForm = document.getElementById("veloce-checkout-form");
    const successDoneBtn = document.getElementById("success-done-btn");

    // Drawer toggles
    function openCartDrawer() {
        cartBackdrop.classList.add("open");
        document.body.style.overflow = "hidden";
    }

    function closeCartDrawer() {
        cartBackdrop.classList.remove("open");
        document.body.style.overflow = "";
        
        // Reset checkouts views when drawer collapses
        setTimeout(() => {
            checkoutView.classList.remove("open");
            checkoutSuccessView.classList.remove("open");
        }, 400);
    }

    if (cartNavBtn) cartNavBtn.addEventListener("click", openCartDrawer);
    if (cartCloseBtn) cartCloseBtn.addEventListener("click", closeCartDrawer);
    cartBackdrop.addEventListener("click", (e) => {
        if (e.target === cartBackdrop) closeCartDrawer();
    });

    // 3. Add to Cart Actions
    addCartButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const card = btn.closest(".product-card");
            const id = card.getAttribute("data-id");
            const name = card.getAttribute("data-name");
            const price = parseInt(card.getAttribute("data-price"));

            // Check if item already exists
            const existingItem = cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }

            // Pulse button feedback
            btn.textContent = "Added ✓";
            btn.style.borderColor = "#10b981";
            btn.style.color = "#10b981";
            
            setTimeout(() => {
                btn.textContent = "Add to Cart";
                btn.style.borderColor = "";
                btn.style.color = "";
            }, 1200);

            updateCartInterface();
            openCartDrawer();
        });
    });

    // 4. Update Interface (Badge, Lists, subtotal)
    function updateCartInterface() {
        const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartNavBadge.textContent = totalItemsCount;

        if (cart.length === 0) {
            cartItemsPanel.innerHTML = `<div class="cart-empty-text">Your cart is currently empty.</div>`;
            cartSubtotalVal.textContent = "₹0";
            proceedCheckoutBtn.disabled = true;
            return;
        }

        // Render Cart items list
        let itemsHtml = "";
        let subtotal = 0;

        cart.forEach(item => {
            const itemCost = item.price * item.quantity;
            subtotal += itemCost;

            itemsHtml += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-info">
                        <span class="cart-item-name">${item.name}</span>
                        <span class="cart-item-price">₹${itemCost.toLocaleString()}</span>
                    </div>
                    <div class="cart-qty-ctrl">
                        <button class="qty-btn dec-qty">-</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn inc-qty">+</button>
                    </div>
                    <button class="cart-item-delete">&times;</button>
                </div>
            `;
        });

        cartItemsPanel.innerHTML = itemsHtml;
        cartSubtotalVal.textContent = `₹${subtotal.toLocaleString()}`;
        proceedCheckoutBtn.disabled = false;

        // Wire click triggers inside the generated items
        setupCartControls();
    }

    function setupCartControls() {
        const itemRows = cartItemsPanel.querySelectorAll(".cart-item");
        
        itemRows.forEach(row => {
            const id = row.getAttribute("data-id");

            // Increment button
            row.querySelector(".inc-qty").addEventListener("click", () => {
                const item = cart.find(i => i.id === id);
                if (item) {
                    item.quantity += 1;
                    updateCartInterface();
                }
            });

            // Decrement button
            row.querySelector(".dec-qty").addEventListener("click", () => {
                const item = cart.find(i => i.id === id);
                if (item) {
                    item.quantity -= 1;
                    if (item.quantity <= 0) {
                        cart = cart.filter(i => i.id !== id);
                    }
                    updateCartInterface();
                }
            });

            // Remove button
            row.querySelector(".cart-item-delete").addEventListener("click", () => {
                cart = cart.filter(i => i.id !== id);
                updateCartInterface();
            });
        });
    }

    // 5. Checkout Views Routing
    if (proceedCheckoutBtn) {
        proceedCheckoutBtn.addEventListener("click", () => {
            checkoutView.classList.add("open");
        });
    }

    if (backToCartBtn) {
        backToCartBtn.addEventListener("click", () => {
            checkoutView.classList.remove("open");
        });
    }

    // Checkout Form Submit handler
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Simulate loading state on submit button
            const submitBtn = checkoutForm.querySelector("button[type='submit']");
            submitBtn.textContent = "Authorizing...";
            submitBtn.disabled = true;

            setTimeout(() => {
                // Done. Reset cart, transition views
                cart = [];
                updateCartInterface();
                submitBtn.textContent = "Authorize Payment";
                submitBtn.disabled = false;
                checkoutForm.reset();

                // Open Success Seal
                checkoutSuccessView.classList.add("open");
            }, 1500);
        });
    }

    if (successDoneBtn) {
        successDoneBtn.addEventListener("click", () => {
            closeCartDrawer();
        });
    }
});
