document.addEventListener("DOMContentLoaded", function () {
    // navbar
    var navbar = document.getElementById("mainNav");
    var hero = document.querySelector(".hero-section");

    function handleNavbar() {
        if (!hero) return;
        if (window.scrollY > hero.offsetHeight - 70) {
            navbar.classList.add("navbar-scrolled");
        } else {
            navbar.classList.remove("navbar-scrolled");
        }
    }

    window.addEventListener("scroll", handleNavbar);
    window.addEventListener("resize", handleNavbar);
    handleNavbar();

    // scroll
    function scrollToSection(btnId, sectionId) {
        var btn = document.getElementById(btnId);
        var section = document.getElementById(sectionId);
        if (btn && section) {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                section.scrollIntoView({ behavior: "smooth" });
            });
        }
    }
    scrollToSection("scrollDownArrow", "gallery");
    scrollToSection("scrollToGalleryBtn", "gallery");

    var cart = [];



    function generateId() {
        return Date.now() + Math.random().toString(36).substr(2, 5);
    }

    // ajouter un article
    function addToCart(name, type, price, image) {
        var existing = null;
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].name === name && cart[i].type === type) {
                existing = cart[i];
                break;
            }
        }

        if (type === "Destination") {
            if (existing) return; // une seule fois
            cart.push({
                id: generateId(),
                name: name,
                type: type,
                price: price,
                quantity: 1,
                image: image || defaultImages[name] || null
            });
        } else { // Activity
            if (existing) {
                existing.quantity++;
            } else {
                cart.push({
                    id: generateId(),
                    name: name,
                    type: type,
                    price: price,
                    quantity: 1,
                    image: null
                });
            }
        }
        updateCartUI();
        updateCartBadge();
    }

    function removeFromCart(id) {
        var newCart = [];
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].id !== id) newCart.push(cart[i]);
        }
        cart = newCart;
        updateCartUI();
        updateCartBadge();
    }

    function updateQuantity(id, delta) {
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].id === id && cart[i].type === "Activity") {
                cart[i].quantity += delta;
                if (cart[i].quantity <= 0) {
                    removeFromCart(id);
                } else {
                    updateCartUI();
                    updateCartBadge();
                }
                break;
            }
        }
    }

    function updateCartUI() {
        var container = document.getElementById("cartItemsContainer");
        var totalSpan = document.getElementById("totalPrice");
        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = '<div class="empty-cart-msg">Your cart is empty.</div>';
            totalSpan.innerText = "0";
            return;
        }

        var total = 0;
        container.innerHTML = "";

        for (var i = 0; i < cart.length; i++) {
            var item = cart[i];
            var itemTotal = item.price * item.quantity;
            total += itemTotal;

            var div = document.createElement("div");
            div.className = "cart-item";
            div.setAttribute("data-id", item.id);

            var imageHtml = "";
            if (item.type === "Destination" && item.image) {
                imageHtml = '<img src="' + item.image + '" alt="' + item.name + '">';
            }

            var detailsHtml = '<div class="item-details">';
            detailsHtml += '<h4>' + item.name + '</h4>';
            detailsHtml += '<p>' + item.price + ' DT</p>';

            if (item.type === "Activity") {
                detailsHtml += '<div class="quantity-controls">';
                detailsHtml += '<button class="qty-minus">-</button>';
                detailsHtml += '<input type="text" value="' + item.quantity + '" readonly>';
                detailsHtml += '<button class="qty-plus">+</button>';
                detailsHtml += '</div>';
            } else {
                detailsHtml += '<div class="quantity-display">Quantity: 1</div>';
            }
            detailsHtml += '</div>';
            detailsHtml += '<button class="delete-btn"><i class="fas fa-trash-alt"></i></button>';

            div.innerHTML = imageHtml + detailsHtml;

            var deleteBtn = div.querySelector(".delete-btn");
            deleteBtn.onclick = (function (idCopy) {
                return function () { removeFromCart(idCopy); };
            })(item.id);

            if (item.type === "Activity") {
                var minusBtn = div.querySelector(".qty-minus");
                var plusBtn = div.querySelector(".qty-plus");
                minusBtn.onclick = (function (idCopy) {
                    return function () { updateQuantity(idCopy, -1); };
                })(item.id);
                plusBtn.onclick = (function (idCopy) {
                    return function () { updateQuantity(idCopy, 1); };
                })(item.id);
            }

            container.appendChild(div);
        }

        totalSpan.innerText = total;
    }

    function updateCartBadge() {
        var badge = document.getElementById("cartBadge");
        if (!badge) return;
        var totalItems = 0;
        for (var i = 0; i < cart.length; i++) {
            totalItems += cart[i].quantity;
        }
        badge.innerText = totalItems;
    }

    var openBtn = document.getElementById("openCart");
    var closeBtn = document.getElementById("closeCart");
    var drawer = document.getElementById("cartDrawer");
    var cartNavLink = document.getElementById("cartNavLink");

    function openCartDrawer() {
        if (drawer) drawer.classList.add("open");
    }
    function closeCartDrawer() {
        if (drawer) drawer.classList.remove("open");
    }

    if (openBtn) openBtn.addEventListener("click", openCartDrawer);
    if (closeBtn) closeBtn.addEventListener("click", closeCartDrawer);
    if (cartNavLink) {
        cartNavLink.addEventListener("click", function (e) {
            e.preventDefault();
            openCartDrawer();
        });
    }

    var checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", function () {
            if (cart.length > 0) {
                cart = [];
                updateCartUI();
                updateCartBadge();
                closeCartDrawer();
            }
        });
    }

    var destButtons = document.querySelectorAll(".book-destination");
    for (var i = 0; i < destButtons.length; i++) {
        destButtons[i].addEventListener("click", function (e) {
            e.stopPropagation();
            var destName = this.getAttribute("data-dest-name");
            var price = parseInt(this.getAttribute("data-price"));
            var imageUrl = defaultImages[destName] || null;
            addToCart(destName, "Destination", price, imageUrl);
        });
    }

    var activityButtons = document.querySelectorAll(".add-activity-btn");
    for (var i = 0; i < activityButtons.length; i++) {
        activityButtons[i].addEventListener("click", function (e) {
            e.stopPropagation();
            var actName = this.getAttribute("data-activity");
            var price = parseInt(this.getAttribute("data-price"));
            addToCart(actName, "Activity", price, null);
        });
    }

    var navLinks = document.querySelectorAll('#navbarTogglerDemo02 .nav-link:not([href="#"])');
    for (var i = 0; i < navLinks.length; i++) {
        navLinks[i].addEventListener("click", function (e) {
            var targetId = this.getAttribute("href");
            if (targetId && targetId.startsWith("#")) {
                e.preventDefault();
                var targetElem = document.getElementById(targetId.substring(1));
                if (targetElem) {
                    targetElem.scrollIntoView({ behavior: "smooth", block: "start" });
                    var bsCollapse = bootstrap.Collapse.getInstance(document.querySelector(".navbar-collapse"));
                    if (bsCollapse) bsCollapse.hide();
                }
            }
        });
    }

});