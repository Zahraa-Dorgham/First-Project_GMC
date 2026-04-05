(function () {
    // ----- la navbar au scroll -----
    const navbar = document.getElementById('mainNav');
    const heroSection = document.querySelector('.hero-section');
    function handleNavbarOnScroll() {
        if (!heroSection) return;
        if (window.scrollY > heroSection.offsetHeight - 70) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    }
    window.addEventListener('scroll', handleNavbarOnScroll);
    window.addEventListener('resize', handleNavbarOnScroll);
    handleNavbarOnScroll();

    // ----- Flèche SCROLL DOWN -----
    const scrollArrow = document.getElementById('scrollDownArrow');
    const gallerySection = document.getElementById('gallery');
    if (scrollArrow && gallerySection) {
        scrollArrow.addEventListener('click', function (e) {
            e.preventDefault();
            gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // Bouton "Discover Wonders"
    const discoverBtn = document.getElementById('scrollToGalleryBtn');
    if (discoverBtn && gallerySection) {
        discoverBtn.addEventListener('click', function (e) {
            e.preventDefault();
            gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // ----- Panier -----
    let cart = [];

    const defaultImages = {
        "Tozeur": "https://i.pinimg.com/1200x/66/8e/c8/668ec8ed69051e8245a5df7fd7cf0c2b.jpg",
        "Matmata": "https://i.pinimg.com/1200x/fb/f5/cd/fbf5cdb8ba0b14f99ebcd7279d17257a.jpg",
        "Tataouine": "https://i.pinimg.com/1200x/47/2d/8e/472d8e5fd4cee4ac39a2b7143ae60821.jpg",
        "Douz": "https://i.pinimg.com/1200x/e7/a2/d9/e7a2d90890f0ea1257c86ac4e4efdc8f.jpg"
    };

    function generateId() { return Date.now() + '-' + Math.random().toString(36).substr(2, 6); }

    function addToCart(name, type, price, imageUrl) {
        const existing = cart.find(item => item.name === name && item.type === type);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({
                id: generateId(),
                name: name,
                type: type,
                price: price,
                quantity: 1,
                image: imageUrl || 'https://via.placeholder.com/60'
            });
        }
        updateCartUI();
        updateCartBadge();
        openCartDrawer();
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        updateCartUI();
        updateCartBadge();
    }

    function updateQuantity(id, delta) {
        const item = cart.find(item => item.id === id);
        if (item) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) {
                removeFromCart(id);
            } else {
                item.quantity = newQty;
                updateCartUI();
                updateCartBadge();
            }
        }
    }

    function clearCart() {
        cart = [];
        updateCartUI();
        updateCartBadge();
    }

    function updateCartUI() {
        const container = document.getElementById('cartItemsContainer');
        const totalSpan = document.getElementById('totalPrice');
        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = '<div class="empty-cart-msg">Your cart is empty.</div>';
            totalSpan.innerText = '0';
            return;
        }

        let total = 0;
        let html = '';
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            html += `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p>${item.price} €</p>
                        <div class="quantity-controls">
                            <button class="qty-minus">-</button>
                            <input type="text" value="${item.quantity}" readonly>
                            <button class="qty-plus">+</button>
                        </div>
                    </div>
                    <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
        });
        container.innerHTML = html;
        totalSpan.innerText = total;

        document.querySelectorAll('.cart-item').forEach(cartItem => {
            const id = cartItem.getAttribute('data-id');
            const minusBtn = cartItem.querySelector('.qty-minus');
            const plusBtn = cartItem.querySelector('.qty-plus');
            const deleteBtn = cartItem.querySelector('.delete-btn');

            if (minusBtn) minusBtn.addEventListener('click', () => updateQuantity(id, -1));
            if (plusBtn) plusBtn.addEventListener('click', () => updateQuantity(id, 1));
            if (deleteBtn) deleteBtn.addEventListener('click', () => removeFromCart(id));
        });
    }

    function updateCartBadge() {
        const badge = document.getElementById('cartBadge');
        if (badge) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            badge.innerText = totalItems;
        }
    }

    const openBtn = document.getElementById('openCart');
    const closeBtn = document.getElementById('closeCart');
    const drawer = document.getElementById('cartDrawer');
    const cartNavLink = document.getElementById('cartNavLink');

    function openCartDrawer() { drawer.classList.add('open'); }
    function closeCartDrawer() { drawer.classList.remove('open'); }
    if (openBtn) openBtn.addEventListener('click', openCartDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);
    if (cartNavLink) cartNavLink.addEventListener('click', (e) => {
        e.preventDefault();
        openCartDrawer();
    });

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                clearCart();
                closeCartDrawer();
            }
        });
    }

    document.querySelectorAll('.book-destination').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const destName = btn.getAttribute('data-dest-name');
            const price = parseInt(btn.getAttribute('data-price'));
            const imageUrl = defaultImages[destName] || 'https://via.placeholder.com/60';
            addToCart(destName, 'Destination', price, imageUrl);
        });
    });

    document.querySelectorAll('.add-activity-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const activityName = btn.getAttribute('data-activity');
            const price = parseInt(btn.getAttribute('data-price'));
            const imageUrl = 'https://via.placeholder.com/60';
            addToCart(activityName, 'Activity', price, imageUrl);
        });
    });

    document.addEventListener('click', (e) => {
        if (drawer.classList.contains('open') && !drawer.contains(e.target) && !openBtn.contains(e.target)) {
            closeCartDrawer();
        }
    });

    const navLinks = document.querySelectorAll('#navbarTogglerDemo02 .nav-link:not([href="#"])');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElem = document.querySelector(targetId);
                if (targetElem) {
                    targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    const bsCollapse = bootstrap.Collapse.getInstance(document.querySelector('.navbar-collapse'));
                    if (bsCollapse) bsCollapse.hide();
                }
            }
        });
    });

    console.log("Site ready — Cart system fully functional (no alerts)");
})();