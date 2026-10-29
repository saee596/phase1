var products = [
    { id: 1, name: "Beige Oversized Hoodie", category: "hoodies", brand: "Essentials", price: 45, image: "hoodies/OIP.webp", available: true },
    { id: 2, name: "Winter Sweatshirt", category: "hoodies", brand: "CozyWear", price: 55, image: "hoodies/OIP (1).webp", available: true },
    { id: 3, name: "Classic Beige Winter Jacket", category: "jackets", brand: "Essentials", price: 70, image: "jacket/jacket1.png", available: true },
    { id: 4, name: "Black Puffer Jacket", category: "jackets", brand: "CozyWear", price: 82, image: "jacket/jacket2.png", available: true },
    { id: 5, name: "Straight Beige Pants", category: "pants", brand: "Essentials", price: 40, image: "pants/pant1.png", available: true },
    { id: 6, name: "High Waisted Brown Pants", category: "pants", brand: "CozyWear", price: 47, image: "pants/pant2.png", available: true },
    { id: 7, name: "Chunky White Sneakers", category: "shoes", brand: "Essentials", price: 60, image: "Shoes/sh1.webp", available: true },
    { id: 8, name: "Beige Winter Boots", category: "shoes", brand: "CozyWear", price: 75, image: "Shoes/sh2.webp", available: true },
    { id: 9, name: "Soft Beige Scarf", category: "scarf", brand: "Essentials", price: 25, image: "skarf/sk1.jpg", available: true },
    { id: 10, name: "Cozy Brown Scarf", category: "scarf", brand: "CozyWear", price: 28, image: "skarf/sk2.jpg", available: true }
];


var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
var cartCount = cartItems.length;
var cartTotal = cartItems.reduce(function (sum, item) {
    return sum + item.price;
}, 0);


function updateCartDisplay() {
    var countEl = document.getElementById("cart-count");
    var totalEl = document.getElementById("cart-total");

    if (countEl) countEl.textContent = cartCount;
    if (totalEl) totalEl.textContent = cartTotal.toFixed(2);

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

function addToCart(name, price, size, color) {
    if (isNaN(price)) return;

    cartItems.push({
        name: name,
        price: price,
        size: size || "N/A",
        color: color || "N/A"
    });

    cartCount++;
    cartTotal += price;

    updateCartDisplay();
    alert(name + " added to cart");
}

function setupAddToCartButtons() {
    var buttons = document.querySelectorAll(".add-to-cart");

    buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            var card = btn.closest(".product-card");
            var name = btn.getAttribute("data-name");
            var price = parseFloat(btn.getAttribute("data-price"));

            var selects = card ? card.querySelectorAll("select") : [];
            var size = selects[0] ? selects[0].value : "N/A";
            var color = selects[1] ? selects[1].value : "N/A";

            addToCart(name, price, size, color);
        });
    });
}

function renderCartPage() {
    var tableBody = document.getElementById("cart-items");
    var shippingEl = document.getElementById("shipping-cost");
    var totalEl = document.getElementById("cart-grand-total");
    var messageEl = document.getElementById("free-shipping-message");

    var summaryBox = document.getElementById("cart-summary");
    var emptyMsg = document.getElementById("empty-cart-msg");

    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (cartItems.length === 0) {
        if (summaryBox) summaryBox.style.display = "none";
        if (emptyMsg) emptyMsg.style.display = "block";
        if (messageEl) messageEl.textContent = "";
        return;
    }

    if (summaryBox) summaryBox.style.display = "block";
    if (emptyMsg) emptyMsg.style.display = "none";

    var subtotal = 0;

    cartItems.forEach(function (item) {
        subtotal += item.price;

        var row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.size}</td>
            <td>${item.color}</td>
            <td>$${item.price.toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    });

    var shipping = 0;

    if (subtotal >= 200) {
        shipping = 0;
        if (messageEl) messageEl.textContent = "🎉 You got FREE shipping!";
    } else {
        shipping = 15;
        if (messageEl) {
            messageEl.textContent =
                "Add $" + (200 - subtotal).toFixed(2) + " more for free shipping";
        }
    }

    var grandTotal = subtotal + shipping;

    if (shippingEl) shippingEl.textContent = shipping.toFixed(2);
    if (totalEl) totalEl.textContent = grandTotal.toFixed(2);
}

function clearCart() {
    cartItems = [];
    cartCount = 0;
    cartTotal = 0;

    localStorage.removeItem("cartItems");

    updateCartDisplay();
    renderCartPage();
}

function renderProducts(list) {
    var container = document.getElementById("products-container");
    if (!container) return;

    container.innerHTML = "";

    list.forEach(function (product) {
        var card = document.createElement("article");
        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">$${product.price}</p>
            <button class="add-to-cart"
                data-name="${product.name}"
                data-price="${product.price}">
                Add to Cart
            </button>
        `;

        container.appendChild(card);
    });

    setupAddToCartButtons();
}

function applyFilters() {
    var search = document.getElementById("searchInput")?.value.toLowerCase() || "";
    var category = document.getElementById("categoryFilter")?.value || "all";
    var brand = document.getElementById("brandFilter")?.value || "all";
    var maxPrice = parseFloat(document.getElementById("maxPrice")?.value);

    var filtered = products.filter(function (p) {
        return (
            p.name.toLowerCase().includes(search) &&
            (category === "all" || p.category === category) &&
            (brand === "all" || p.brand === brand) &&
            (isNaN(maxPrice) || p.price <= maxPrice)
        );
    });

    renderProducts(filtered);
}

document.addEventListener("DOMContentLoaded", function () {
    updateCartDisplay();
    setupAddToCartButtons();
    renderCartPage();

    document.getElementById("clear-cart")?.addEventListener("click", clearCart);

    if (document.getElementById("products-container")) {
        renderProducts(products);

        document.getElementById("searchInput")?.addEventListener("input", applyFilters);
        document.getElementById("categoryFilter")?.addEventListener("change", applyFilters);
        document.getElementById("brandFilter")?.addEventListener("change", applyFilters);
        document.getElementById("maxPrice")?.addEventListener("input", applyFilters);
    }
});


var newsletterForm = document.getElementById("newsletter-form");
var messageEl = document.getElementById("newsletter-message");

if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (event) {
        event.preventDefault();

        var emailInput = document.getElementById("newsletter-email");
        var email = emailInput.value;

        localStorage.setItem("newsletterEmail", email);

        messageEl.textContent = "🎉 Thank you for subscribing! ";

        newsletterForm.reset();
    });
}
