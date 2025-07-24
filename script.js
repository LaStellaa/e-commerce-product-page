"use strict";

document.addEventListener("DOMContentLoaded", function () {
  console.log("Document is ready!");

  // ===== CONSTANTS =====
  const DESKTOP_BREAKPOINT = 1024;
  const IMAGE_COUNT = 4;

  // ===== DOM ELEMENTS =====
  // Mobile menu elements
  const mobileMenu = document.querySelector(".menu");
  const mobileMenuOpen = document.getElementById("hamburger-menu");
  const mobileMenuClose = document.getElementById("closing-icon");
  const mobileOverlay = document.getElementById("mobile-overlay");

  // Image navigation elements
  const thumbnails = document.querySelectorAll(".thumbnail");
  const productImages = document.querySelectorAll(".product-image");
  const mobileImages = document.querySelectorAll(".carousel .product-image");
  const mobilePrevBtn = document.getElementById("previous");
  const mobileNextBtn = document.getElementById("next");

  // Modal elements
  const modal = document.getElementById("desktop-modal");
  const modalCloseBtn = document.querySelector(".close-button");
  const modalThumbnails = document.querySelectorAll(".modal-thumbnails img");
  const modalCurrentImage = document.querySelector(".modal-current-image");
  const modalPrevBtn = document.querySelector(".modal-previous");
  const modalNextBtn = document.querySelector(".modal-next");

  // Cart elements
  const cartIcon = document.getElementById("cart-icon");
  const basketCard = document.querySelector(".basket-card");
  const cartCount = document.querySelector(".cart-count");
  const basketEmpty = document.querySelector(".basket-empty");
  const basketFull = document.querySelector(".basket-full");
  const basketProducts = document.querySelector(".basket-products");

  // Product quantity elements
  const decreaseBtn = document.getElementById("decrease");
  const increaseBtn = document.getElementById("increase");
  const quantityInput = document.getElementById("quantity");
  const addToCartBtn = document.getElementById("add-to-cart-button");

  // ===== STATE VARIABLES =====
  let quantity = 0;
  let cart = [];
  let currentMobileIndex = 0;
  let currentModalIndex = 0;

  // ===== UTILITY FUNCTIONS =====
  function updateImageDisplay(images, activeIndex) {
    images.forEach((image, index) => {
      image.classList.toggle("active", index === activeIndex);
    });
  }

  function updateThumbnailDisplay(thumbnails, activeIndex) {
    thumbnails.forEach((thumb, index) => {
      thumb.classList.toggle("active", index === activeIndex);
    });
  }

  function getNextIndex(currentIndex, length) {
    return (currentIndex + 1) % length;
  }

  function getPrevIndex(currentIndex, length) {
    return (currentIndex - 1 + length) % length;
  }

  // ===== MOBILE MENU FUNCTIONALITY =====
  function showMobileMenu() {
    mobileMenu.style.display = "block";
    mobileOverlay.classList.remove("hidden");
  }

  function hideMobileMenu() {
    mobileMenu.style.display = "none";
    mobileOverlay.classList.add("hidden");
  }

  mobileMenuOpen.addEventListener("click", showMobileMenu);
  mobileMenuClose.addEventListener("click", hideMobileMenu);
  mobileOverlay.addEventListener("click", hideMobileMenu);

  // ===== IMAGE NAVIGATION FUNCTIONALITY =====
  // Desktop thumbnail navigation
  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", () => {
      updateThumbnailDisplay(thumbnails, index);
      updateImageDisplay(productImages, index);
    });
  });

  // Mobile carousel navigation
  function updateMobileImage(index) {
    currentMobileIndex = index;
    updateImageDisplay(mobileImages, index);
  }

  mobileNextBtn.addEventListener("click", () => {
    currentMobileIndex = getNextIndex(currentMobileIndex, mobileImages.length);
    updateMobileImage(currentMobileIndex);
  });

  mobilePrevBtn.addEventListener("click", () => {
    currentMobileIndex = getPrevIndex(currentMobileIndex, mobileImages.length);
    updateMobileImage(currentMobileIndex);
  });

  // ===== MODAL FUNCTIONALITY =====
  function showModal() {
    if (window.innerWidth > DESKTOP_BREAKPOINT) {
      modal.classList.remove("hidden");
    }
  }

  function hideModal() {
    modal.classList.add("hidden");
  }

  function updateModalImage(index) {
    currentModalIndex = index;
    modalCurrentImage.src = `./images/image-product-${index + 1}.jpg`;
    updateThumbnailDisplay(modalThumbnails, index);
  }

  // Modal event listeners
  productImages.forEach((image) => {
    image.addEventListener("click", showModal);
  });

  modalCloseBtn.addEventListener("click", hideModal);

  modalThumbnails.forEach((thumb, index) => {
    thumb.addEventListener("click", () => {
      updateModalImage(index);
    });
  });

  modalPrevBtn.addEventListener("click", () => {
    currentModalIndex = getPrevIndex(currentModalIndex, modalThumbnails.length);
    updateModalImage(currentModalIndex);
  });

  modalNextBtn.addEventListener("click", () => {
    currentModalIndex = getNextIndex(currentModalIndex, modalThumbnails.length);
    updateModalImage(currentModalIndex);
  });

  // ===== QUANTITY CONTROLS =====
  function updateQuantityDisplay() {
    quantityInput.textContent = quantity;
  }

  function increaseQuantity() {
    quantity++;
    updateQuantityDisplay();
  }

  function decreaseQuantity() {
    if (quantity > 0) {
      quantity--;
      updateQuantityDisplay();
    }
  }

  decreaseBtn.addEventListener("click", decreaseQuantity);
  increaseBtn.addEventListener("click", increaseQuantity);

  // ===== CART FUNCTIONALITY =====
  function createProduct() {
    return {
      id: 1,
      name: "Fall Limited Edition Sneakers",
      price: 125,
      quantity: quantity,
      thumbnail: "./images/image-product-1-thumbnail.jpg",
    };
  }

  function addToCart() {
    if (quantity === 0) return;

    const product = createProduct();
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push(product);
    }

    quantity = 0;
    updateQuantityDisplay();
    updateCartPreview();
  }

  function removeFromCart() {
    cart = [];
    quantity = 0;
    updateQuantityDisplay();
    updateCartPreview();
  }

  function updateCartPreview() {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Update cart count badge
    if (totalItems > 0) {
      cartCount.textContent = totalItems;
      cartCount.style.display = "block";
    } else {
      cartCount.style.display = "none";
    }

    // Show/hide cart content
    if (cart.length === 0 || totalItems === 0) {
      basketEmpty.style.display = "block";
      basketFull.style.display = "none";
      return;
    }

    basketEmpty.style.display = "none";
    basketFull.style.display = "block";

    // Update cart item display
    const item = cart[0];
    const totalPrice = item.price * item.quantity;

    basketProducts.innerHTML = `
      <img src="${item.thumbnail}" alt="${item.name}"/>
      <div class="basket-product-info">
        <p>${item.name}</p>
        <p>$${item.price.toFixed(2)} x <span id="items-number">${
      item.quantity
    }</span>
        <span id="total-price">$${totalPrice.toFixed(2)}</span>
        </p>
      </div>
      <img src="./images/icon-delete.svg" alt="Delete" id="bin-icon"/>
    `;

    // Add event listener to delete button
    const binIcon = document.getElementById("bin-icon");
    binIcon.addEventListener("click", removeFromCart);
  }

  function toggleCartPreview() {
    basketCard.classList.toggle("show");
  }

  // Cart event listeners
  addToCartBtn.addEventListener("click", addToCart);
  cartIcon.addEventListener("click", toggleCartPreview);
});
