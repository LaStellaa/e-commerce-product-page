"use strict";

document.addEventListener("DOMContentLoaded", function () {
  console.log("Document is ready!");

  // Mobile menu logic

  const mobileMenu = document.querySelector(".menu");
  const mobileMenuOpen = document.getElementById("hamburger-menu");
  const mobileMenuClose = document.getElementById("closing-icon");
  const mobileOverlay = document.getElementById("mobile-overlay");

  mobileMenuOpen.addEventListener("click", () => {
    mobileMenu.style.display = "block";
    mobileOverlay.classList.remove("hidden");
  });

  mobileMenuClose.addEventListener("click", () => {
    mobileMenu.style.display = "none";
    mobileOverlay.classList.add("hidden");
  });

  mobileOverlay.addEventListener("click", () => {
    mobileMenu.style.display = "none";
    mobileOverlay.classList.add("hidden");
  });

  //Images home page logic

  const thumbnails = document.querySelectorAll(".thumbnail");
  const productImages = document.querySelectorAll(".product-image");

  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", () => {
      //Remove active class from all images
      thumbnails.forEach((thumb) => thumb.classList.remove("active"));
      productImages.forEach((image) => image.classList.remove("active"));

      //Add active class to the clicked thumbnail and image
      thumbnail.classList.add("active");
      productImages[index].classList.add("active");
    });
  });

  // Modal desktop logic

  const modal = document.getElementById("desktop-modal");
  const modalCloseBtn = document.querySelector(".close-button");
  const mainImages = document.querySelectorAll(".product-image");

  mainImages.forEach((image) => {
    image.addEventListener("click", () => {
      if (window.innerWidth > 1024) {
        modal.classList.remove("hidden");
      }
    });
  });

  modalCloseBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Modal thumbnail nav + next/prev arrows

  const modalThumbnails = document.querySelectorAll(".modal-thumbnails img");
  const modalCurrentImage = document.querySelector(".modal-current-image");
  const modalPrevBtn = document.querySelector(".modal-previous");
  const modalNextBtn = document.querySelector(".modal-next");

  let currentModalIndex = 0;

  function updateModalIndex(index) {
    currentModalIndex = index;
    modalCurrentImage.src = `./images/image-product-${index + 1}.jpg`;

    modalThumbnails.forEach((thumb) => thumb.classList.remove("active"));
    modalThumbnails[index].classList.add("active");
  }

  modalThumbnails.forEach((thumb, index) => {
    thumb.addEventListener("click", () => {
      updateModalIndex(index);
    });
  });

  modalPrevBtn.addEventListener("click", () => {
    currentModalIndex =
      (currentModalIndex - 1 + modalThumbnails.length) % modalThumbnails.length;

    updateModalIndex(currentModalIndex);
  });

  modalNextBtn.addEventListener("click", () => {
    currentModalIndex = (currentModalIndex + 1) % modalThumbnails.length;

    updateModalIndex(currentModalIndex);
  });

  // Buttons logic

  const decreaseBtn = document.getElementById("decrease");
  const increaseBtn = document.getElementById("increase");
  const quantityInput = document.getElementById("quantity");

  let quantity = 0;

  decreaseBtn.addEventListener("click", () => {
    if (quantity > 0) {
      quantity--;
      quantityInput.textContent = quantity;
    }
  });

  increaseBtn.addEventListener("click", () => {
    quantity++;
    quantityInput.textContent = quantity;
  });

  const addToCartBtn = document.getElementById("add-to-cart-button");
  let cart = [];

  addToCartBtn.addEventListener("click", () => {
    const product = {
      id: 1,
      name: "Fall Limited Edition Sneakers",
      price: 125,
      quantity: quantity,
      thumbnail: "./images/image-product-1-thumbnail.jpg",
    };

    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push(product);
    }

    quantity = 0;
    quantityInput.textContent = quantity;

    updateCartPreview();
  });

  function updateCartPreview() {
    const cartCount = document.querySelector(".cart-count");
    const basketEmpty = document.querySelector(".basket-empty");
    const basketFull = document.querySelector(".basket-full");
    const basketProducts = document.querySelector(".basket-products");

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    if (totalItems > 0) {
      cartCount.textContent = totalItems;
      cartCount.style.display = "block";
    } else {
      cartCount.style.display = "none";
    }

    if (cart.length === 0 || totalItems === 0) {
      basketEmpty.style.display = "block";
      basketFull.style.display = "none";
      return;
    }

    basketEmpty.style.display = "none";
    basketFull.style.display = "block";

    const item = cart[0];
    const totalPrice = item.price * item.quantity;

    basketProducts.innerHTML = `
    <img src="${item.thumbnail}" alt="${item.name}"/>
    <div class="basket-product-infos">
      <p>${item.name}</p>
      <p>$${item.price.toFixed(2)} x <span id="items-number">${
      item.quantity
    }</span>
    <span id="total-price">$${totalPrice.toFixed(2)}</span>
    </p>
    </div>
    <img src="./images/icon-delete.svg" alt="Delete" id="bin-icon"/>
    `;

    const binIcon = document.getElementById("bin-icon");
    binIcon.addEventListener("click", () => {
      cart = [];
      quantity = 0;
      quantityInput.textContent = quantity;
      updateCartPreview();
    });
  }

  //Cart preview logic
  const cartIcon = document.getElementById("cart-icon");
  const basketCard = document.querySelector(".basket-card");

  cartIcon.addEventListener("click", () => {
    basketCard.classList.toggle("show");
  });

  // Mobile carousel logic
  const mobileImages = document.querySelectorAll(".carousel .product-image");
  const mobilePrevBtn = document.getElementById("previous");
  const mobileNextBtn = document.getElementById("next");

  console.log(mobileNextBtn);

  let currentMobileIndex = 0;

  function updateMobileImage(index) {
    mobileImages.forEach((image) => {
      image.classList.remove("active");
    });
    mobileImages[index].classList.add("active");
  }

  mobileNextBtn.addEventListener("click", () => {
    console.log("Next button clicked");
    currentMobileIndex = (currentMobileIndex + 1) % mobileImages.length;
    updateMobileImage(currentMobileIndex);
  });

  mobilePrevBtn.addEventListener("click", () => {
    currentMobileIndex =
      (currentMobileIndex - 1 + mobileImages.length) % mobileImages.length;
    updateMobileImage(currentMobileIndex);
  });
});
