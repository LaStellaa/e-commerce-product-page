"use strict";

document.addEventListener("DOMContentLoaded", function () {
  console.log("Document is ready!");

  // ===== CONSTANTS =====
  const DESKTOP_BREAKPOINT = 1024;
  const IMAGE_COUNT = 4;
  const KEYS = {
    ENTER: "Enter",
    SPACE: " ",
    ESCAPE: "Escape",
    TAB: "Tab",
    ARROW_LEFT: "ArrowLeft",
    ARROW_RIGHT: "ArrowRight",
  };

  // ===== DOM ELEMENTS =====
  // Mobile menu elements
  const mobileMenu = document.querySelector(".menu");
  const mobileMenuOpen = document.querySelector(
    ".menu-toggle, #hamburger-menu"
  );
  const mobileMenuClose = document.querySelector(".menu-close, #closing-icon");
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
  const modalThumbnails = document.querySelectorAll(".modal-thumbnails .thumb");
  const modalCurrentImage = document.querySelector(".modal-current-image");
  const modalPrevBtn = document.querySelector(".modal-previous");
  const modalNextBtn = document.querySelector(".modal-next");

  // Cart elements
  const cartIcon = document.querySelector(".cart-button, #cart-icon");
  const basketCard = document.querySelector(".basket-card");
  const cartCount = document.querySelector(".cart-count, #cart-count");
  const basketEmpty = document.querySelector(".basket-empty");
  const basketFull = document.querySelector(".basket-full");
  const basketProducts = document.querySelector(".basket-products");

  // Product quantity elements
  const decreaseBtn = document.getElementById("decrease");
  const increaseBtn = document.getElementById("increase");
  const quantityInput = document.getElementById("quantity");
  const addToCartBtn = document.getElementById("add-to-cart-button");

  // Store elements that can receive focus for modal
  let focusableElements;
  let firstFocusableElement;
  let lastFocusableElement;

  // ===== STATE VARIABLES =====
  let quantity = 0;
  let cart = [];
  let currentMobileIndex = 0;
  let currentModalIndex = 0;

  // ===== ACCESSIBILITY HELPER FUNCTIONS =====
  function setAriaExpanded(element, expanded) {
    if (element) {
      element.setAttribute("aria-expanded", expanded);
    }
  }

  function setAriaSelected(elements, selectedIndex) {
    elements.forEach((element, index) => {
      element.setAttribute("aria-selected", index === selectedIndex);
      element.setAttribute("tabindex", index === selectedIndex ? "0" : "-1");
    });
  }

  function setAriaHidden(element, hidden) {
    if (element) {
      element.setAttribute("aria-hidden", hidden);
    }
  }

  function announceToScreenReader(message) {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  }

  function trapFocus(event) {
    if (event.key === KEYS.TAB) {
      if (event.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          event.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          event.preventDefault();
        }
      }
    }
  }

  function getFocusableElements(container) {
    return container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
  }

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
    setAriaSelected(thumbnails, activeIndex);
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
    setAriaExpanded(mobileMenuOpen, true);
    setAriaHidden(mobileMenu, false);
    setAriaHidden(mobileOverlay, false);

    // Focus the close button
    if (mobileMenuClose) {
      mobileMenuClose.focus();
    }

    announceToScreenReader("Navigation menu opened");
  }

  function hideMobileMenu() {
    mobileMenu.style.display = "none";
    mobileOverlay.classList.add("hidden");
    setAriaExpanded(mobileMenuOpen, false);
    setAriaHidden(mobileMenu, true);
    setAriaHidden(mobileOverlay, true);

    // Return focus to menu button
    if (mobileMenuOpen) {
      mobileMenuOpen.focus();
    }

    announceToScreenReader("Navigation menu closed");
  }

  // Mobile menu event listeners
  if (mobileMenuOpen) {
    mobileMenuOpen.addEventListener("click", showMobileMenu);
    mobileMenuOpen.addEventListener("keydown", (e) => {
      if (e.key === KEYS.ENTER || e.key === KEYS.SPACE) {
        e.preventDefault();
        showMobileMenu();
      }
    });
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener("click", hideMobileMenu);
    mobileMenuClose.addEventListener("keydown", (e) => {
      if (e.key === KEYS.ENTER || e.key === KEYS.SPACE) {
        e.preventDefault();
        hideMobileMenu();
      }
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", hideMobileMenu);
  }

  // ===== IMAGE NAVIGATION FUNCTIONALITY =====
  // Desktop thumbnail navigation
  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", () => {
      updateThumbnailDisplay(thumbnails, index);
      updateImageDisplay(productImages, index);
      announceToScreenReader(
        `Viewing image ${index + 1} of ${thumbnails.length}`
      );
    });

    thumbnail.addEventListener("keydown", (e) => {
      if (e.key === KEYS.ENTER || e.key === KEYS.SPACE) {
        e.preventDefault();
        thumbnail.click();
      } else if (e.key === KEYS.ARROW_LEFT || e.key === KEYS.ARROW_RIGHT) {
        e.preventDefault();
        const newIndex =
          e.key === KEYS.ARROW_LEFT
            ? getPrevIndex(index, thumbnails.length)
            : getNextIndex(index, thumbnails.length);
        thumbnails[newIndex].focus();
        thumbnails[newIndex].click();
      }
    });
  });

  // Mobile carousel navigation
  function updateMobileImage(index) {
    currentMobileIndex = index;
    updateImageDisplay(mobileImages, index);
    announceToScreenReader(`Image ${index + 1} of ${mobileImages.length}`);
  }

  if (mobileNextBtn) {
    mobileNextBtn.addEventListener("click", () => {
      currentMobileIndex = getNextIndex(
        currentMobileIndex,
        mobileImages.length
      );
      updateMobileImage(currentMobileIndex);
    });
  }

  if (mobilePrevBtn) {
    mobilePrevBtn.addEventListener("click", () => {
      currentMobileIndex = getPrevIndex(
        currentMobileIndex,
        mobileImages.length
      );
      updateMobileImage(currentMobileIndex);
    });
  }

  // ===== MODAL FUNCTIONALITY =====
  function showModal() {
    if (window.innerWidth > DESKTOP_BREAKPOINT) {
      modal.classList.remove("hidden");
      setAriaHidden(modal, false);

      // Set up focus management
      focusableElements = getFocusableElements(modal);
      firstFocusableElement = focusableElements[0];
      lastFocusableElement = focusableElements[focusableElements.length - 1];

      // Focus the close button
      if (modalCloseBtn) {
        modalCloseBtn.focus();
      }

      // Add event listener for focus trapping
      document.addEventListener("keydown", trapFocus);

      announceToScreenReader("Product image lightbox opened");
    }
  }

  function hideModal() {
    modal.classList.add("hidden");
    setAriaHidden(modal, true);

    // Remove focus trap
    document.removeEventListener("keydown", trapFocus);

    // Return focus to the main image that opened the modal
    const activeMainImage = document.querySelector(".product-image.active");
    if (activeMainImage) {
      activeMainImage.focus();
    }

    announceToScreenReader("Product image lightbox closed");
  }

  function updateModalImage(index) {
    currentModalIndex = index;
    const imageAltTexts = [
      "Fall Limited Edition Sneakers - Front view showing white and orange design",
      "Fall Limited Edition Sneakers - Side view showing sole detail",
      "Fall Limited Edition Sneakers - Back view showing heel design",
      "Fall Limited Edition Sneakers - Top view showing laces and tongue",
    ];

    modalCurrentImage.src = `./images/image-product-${index + 1}.jpg`;
    modalCurrentImage.alt = imageAltTexts[index];
    updateThumbnailDisplay(modalThumbnails, index);
    announceToScreenReader(
      `Viewing image ${index + 1} of ${modalThumbnails.length} in lightbox`
    );
  }

  // Modal event listeners
  productImages.forEach((image, index) => {
    image.addEventListener("click", showModal);
    image.addEventListener("keydown", (e) => {
      if (e.key === KEYS.ENTER || e.key === KEYS.SPACE) {
        e.preventDefault();
        showModal();
      }
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", hideModal);
    modalCloseBtn.addEventListener("keydown", (e) => {
      if (e.key === KEYS.ENTER || e.key === KEYS.SPACE) {
        e.preventDefault();
        hideModal();
      }
    });
  }

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === KEYS.ESCAPE && !modal.classList.contains("hidden")) {
      hideModal();
    }
  });

  modalThumbnails.forEach((thumb, index) => {
    thumb.addEventListener("click", () => {
      updateModalImage(index);
    });

    thumb.addEventListener("keydown", (e) => {
      if (e.key === KEYS.ENTER || e.key === KEYS.SPACE) {
        e.preventDefault();
        updateModalImage(index);
      } else if (e.key === KEYS.ARROW_LEFT || e.key === KEYS.ARROW_RIGHT) {
        e.preventDefault();
        const newIndex =
          e.key === KEYS.ARROW_LEFT
            ? getPrevIndex(index, modalThumbnails.length)
            : getNextIndex(index, modalThumbnails.length);
        modalThumbnails[newIndex].focus();
        updateModalImage(newIndex);
      }
    });
  });

  if (modalPrevBtn) {
    modalPrevBtn.addEventListener("click", () => {
      currentModalIndex = getPrevIndex(
        currentModalIndex,
        modalThumbnails.length
      );
      updateModalImage(currentModalIndex);
    });
  }

  if (modalNextBtn) {
    modalNextBtn.addEventListener("click", () => {
      currentModalIndex = getNextIndex(
        currentModalIndex,
        modalThumbnails.length
      );
      updateModalImage(currentModalIndex);
    });
  }

  // ===== QUANTITY CONTROLS =====
  function updateQuantityDisplay() {
    quantityInput.textContent = quantity;
    quantityInput.setAttribute("aria-label", `Quantity: ${quantity}`);
  }

  function increaseQuantity() {
    quantity++;
    updateQuantityDisplay();
    announceToScreenReader(`Quantity increased to ${quantity}`);
  }

  function decreaseQuantity() {
    if (quantity > 0) {
      quantity--;
      updateQuantityDisplay();
      announceToScreenReader(`Quantity decreased to ${quantity}`);
    }
  }

  if (decreaseBtn) {
    decreaseBtn.addEventListener("click", decreaseQuantity);
  }

  if (increaseBtn) {
    increaseBtn.addEventListener("click", increaseQuantity);
  }

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
    if (quantity === 0) {
      announceToScreenReader("Please select a quantity before adding to cart");
      return;
    }

    const product = createProduct();
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push(product);
    }

    const addedQuantity = quantity;
    quantity = 0;
    updateQuantityDisplay();
    updateCartPreview();
    announceToScreenReader(
      `${addedQuantity} item${addedQuantity > 1 ? "s" : ""} added to cart`
    );
  }

  function removeFromCart() {
    cart = [];
    quantity = 0;
    updateQuantityDisplay();
    updateCartPreview();
    announceToScreenReader("All items removed from cart");
  }

  function updateCartPreview() {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Update cart count badge
    if (totalItems > 0) {
      cartCount.textContent = totalItems;
      cartCount.style.display = "block";
      cartCount.setAttribute(
        "aria-label",
        `${totalItems} item${totalItems > 1 ? "s" : ""} in cart`
      );
    } else {
      cartCount.style.display = "none";
      cartCount.setAttribute("aria-label", "Cart is empty");
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
      <img src="${
        item.thumbnail
      }" alt="Fall Limited Edition Sneakers thumbnail" />
      <div class="basket-product-info">
        <p>${item.name}</p>
        <p>$${item.price.toFixed(2)} x <span id="items-number">${
      item.quantity
    }</span>
        <span id="total-price">$${totalPrice.toFixed(2)}</span>
        </p>
      </div>
      <button class="delete-button" type="button" aria-label="Remove Fall Limited Edition Sneakers from cart">
        <img src="./images/icon-delete.svg" alt="" aria-hidden="true" />
      </button>
    `;

    // Add event listener to delete button
    const deleteButton = basketProducts.querySelector(".delete-button");
    if (deleteButton) {
      deleteButton.addEventListener("click", removeFromCart);
    }
  }

  function toggleCartPreview() {
    const isShowing = basketCard.classList.contains("show");
    basketCard.classList.toggle("show");
    setAriaExpanded(cartIcon, !isShowing);
    setAriaHidden(basketCard, isShowing);

    if (!isShowing) {
      announceToScreenReader("Shopping cart opened");
    } else {
      announceToScreenReader("Shopping cart closed");
    }
  }

  // Cart event listeners
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", addToCart);
  }

  if (cartIcon) {
    cartIcon.addEventListener("click", toggleCartPreview);
    cartIcon.addEventListener("keydown", (e) => {
      if (e.key === KEYS.ENTER || e.key === KEYS.SPACE) {
        e.preventDefault();
        toggleCartPreview();
      }
    });
  }

  // ===== INITIALIZATION =====
  // Set initial ARIA states
  setAriaExpanded(mobileMenuOpen, false);
  setAriaExpanded(cartIcon, false);
  setAriaHidden(modal, true);
  setAriaHidden(mobileMenu, true);
  setAriaHidden(mobileOverlay, true);
  setAriaHidden(basketCard, true);

  // Set initial thumbnail states
  if (thumbnails.length > 0) {
    setAriaSelected(thumbnails, 0);
  }
  if (modalThumbnails.length > 0) {
    setAriaSelected(modalThumbnails, 0);
  }

  // Initialize quantity display
  updateQuantityDisplay();
});
