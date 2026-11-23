/**
 * AARADHYA SETU — Custom Puja Product Page Logic (Production Ready & Robust)
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'as_sacred_cart';

  // Cart storage helper
  function getCart() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : { items: [], total: 0, count: 0 };
    } catch (e) {
      return { items: [], total: 0, count: 0 };
    }
  }

  function saveCart(cart) {
    try {
      let count = 0;
      let total = 0;
      cart.items.forEach((item) => {
        count += item.quantity;
        total += item.price * item.quantity;
      });
      cart.count = count;
      cart.total = total;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      updateCartBadge(cart);
      renderCartDrawer(cart);
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }

  function updateCartBadge(cart) {
    const badges = document.querySelectorAll('[data-cart-counter], #cart-counter');
    badges.forEach((b) => {
      b.textContent = cart.count;
    });
  }

  function formatINR(val) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Global drawer controls
  function openCartDrawer() {
    const cartDrawer = document.querySelector('[data-cart-drawer]');
    const drawerBackdrop = document.querySelector('[data-drawer-backdrop]');
    if (cartDrawer && drawerBackdrop) {
      cartDrawer.classList.add('is-open');
      drawerBackdrop.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCartDrawer() {
    const cartDrawer = document.querySelector('[data-cart-drawer]');
    const drawerBackdrop = document.querySelector('[data-drawer-backdrop]');
    if (cartDrawer && drawerBackdrop) {
      cartDrawer.classList.remove('is-open');
      drawerBackdrop.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  function renderCartDrawer(cart) {
    const drawerBody = document.querySelector('[data-drawer-body]');
    const subtotalDisplay = document.querySelector('[data-drawer-subtotal]');
    if (!drawerBody || !subtotalDisplay) return;

    if (!cart.items || cart.items.length === 0) {
      drawerBody.innerHTML = `
        <div class="as-drawer-empty">
          <div style="font-size:36px;margin-bottom:12px;">🪔</div>
          <p style="font-weight:600;font-size:14px;color:var(--as-plum-primary);">Your Sacred Cart is Empty</p>
          <p style="font-size:12px;margin-top:4px;color:var(--as-text-muted);">Select a puja and sacred offerings to proceed with the sankalp.</p>
          <button type="button" class="as-continue-shopping-btn" data-continue-shopping style="margin-top:16px;background:none;border:1.5px solid var(--as-plum-primary);color:var(--as-plum-primary);padding:8px 18px;border-radius:var(--as-radius-md);font-weight:600;font-size:13px;cursor:pointer;">
            Continue Offering Browsing
          </button>
        </div>
      `;
      subtotalDisplay.textContent = formatINR(0);
      const continueBtn = drawerBody.querySelector('[data-continue-shopping]');
      if (continueBtn) {
        continueBtn.addEventListener('click', closeCartDrawer);
      }
      return;
    }

    subtotalDisplay.textContent = formatINR(cart.total);

    drawerBody.innerHTML = cart.items.map((item, idx) => `
      <div class="as-cart-item-card" data-cart-index="${idx}">
        <div class="as-cart-item-header">
          <div style="display:flex;gap:12px;align-items:flex-start;">
            <img src="${escapeHtml(item.image || 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?q=80&w=200&auto=format&fit=crop')}" alt="${escapeHtml(item.title)}" style="width:52px;height:52px;border-radius:var(--as-radius-sm);object-fit:cover;border:1px solid var(--as-border);flex-shrink:0;" />
            <div>
              <div class="as-cart-item-title">${escapeHtml(item.title)}</div>
              <div class="as-cart-item-tier">Package: ${escapeHtml(item.packageTier)}</div>
              <div style="font-size:12px;color:var(--as-text-muted);margin-top:2px;">${formatINR(item.price)} each</div>
            </div>
          </div>
          <button type="button" class="as-cart-item-remove" data-remove-index="${idx}" title="Remove offering" style="border:none;background:none;color:#C0392B;font-size:16px;cursor:pointer;padding:0 4px;">&times;</button>
        </div>

        <div class="as-cart-item-meta">
          <div><strong>Devotee:</strong> ${escapeHtml(item.devoteeName)} (Gotra: ${escapeHtml(item.gotra)})</div>
          <div><strong>Date:</strong> ${escapeHtml(item.pujaDate)}</div>
          ${item.addons && item.addons.length > 0 ? `<div><strong>Add-ons:</strong> ${item.addons.map(escapeHtml).join(', ')}</div>` : ''}
        </div>

        <div class="as-cart-item-bottom">
          <!-- In-cart quantity adjustment controls -->
          <div style="display:flex;align-items:center;border:1px solid var(--as-border);border-radius:6px;background:#FFF;overflow:hidden;">
            <button type="button" data-cart-qty-minus="${idx}" style="background:none;border:none;width:28px;height:28px;cursor:pointer;color:var(--as-plum-primary);font-size:15px;display:flex;align-items:center;justify-content:center;">−</button>
            <span style="min-width:24px;text-align:center;font-size:13px;font-weight:700;color:var(--as-plum-primary);">${item.quantity}</span>
            <button type="button" data-cart-qty-plus="${idx}" style="background:none;border:none;width:28px;height:28px;cursor:pointer;color:var(--as-plum-primary);font-size:15px;display:flex;align-items:center;justify-content:center;">+</button>
          </div>
          <div class="as-cart-item-price">${formatINR(item.price * item.quantity)}</div>
        </div>
      </div>
    `).join('');

    // Attach in-cart quantity minus handlers
    drawerBody.querySelectorAll('[data-cart-qty-minus]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.cartQtyMinus, 10);
        const currentCart = getCart();
        if (currentCart.items[index]) {
          if (currentCart.items[index].quantity > 1) {
            currentCart.items[index].quantity -= 1;
            saveCart(currentCart);
          } else {
            currentCart.items.splice(index, 1);
            saveCart(currentCart);
          }
        }
      });
    });

    // Attach in-cart quantity plus handlers
    drawerBody.querySelectorAll('[data-cart-qty-plus]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.cartQtyPlus, 10);
        const currentCart = getCart();
        if (currentCart.items[index] && currentCart.items[index].quantity < 10) {
          currentCart.items[index].quantity += 1;
          saveCart(currentCart);
        }
      });
    });

    // Attach remove handlers
    drawerBody.querySelectorAll('[data-remove-index]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.removeIndex, 10);
        const currentCart = getCart();
        currentCart.items.splice(index, 1);
        saveCart(currentCart);
      });
    });
  }

  function initPujaProduct() {
    const root = document.querySelector('[data-puja-product]');
    if (!root) return;

    // Elements
    const mainImg = root.querySelector('[data-main-image]');
    const mainImgWrap = root.querySelector('.as-main-image-wrap');
    const thumbButtons = root.querySelectorAll('[data-thumb-target]');
    const variantCards = root.querySelectorAll('[data-variant-card]');
    const variantIdInput = root.querySelector('[data-variant-id-input]');
    const addonCheckboxes = root.querySelectorAll('[data-addon-checkbox]');
    const priceDisplay = root.querySelector('[data-price-display]');
    const comparePriceDisplay = root.querySelector('[data-compare-price]');
    const qtyInput = root.querySelector('[data-qty-input]');
    const btnMinus = root.querySelector('[data-qty-minus]');
    const btnPlus = root.querySelector('[data-qty-plus]');
    const form = root.querySelector('[data-puja-form]');
    const addToCartBtn = root.querySelector('[data-add-to-cart-btn]');
    const toast = document.querySelector('[data-puja-toast]');
    const toastMessage = document.querySelector('[data-toast-text]');

    // Image Zoom Modal elements
    const zoomModal = document.querySelector('[data-zoom-modal]');
    const zoomModalImg = document.querySelector('[data-zoom-modal-img]');
    const zoomCloseBtn = document.querySelector('[data-zoom-close]');

    // Cart Drawer elements
    const drawerBackdrop = document.querySelector('[data-drawer-backdrop]');
    const cartDrawer = document.querySelector('[data-cart-drawer]');
    const drawerCloseBtn = document.querySelector('[data-drawer-close]');
    const cartTriggerBtn = document.querySelector('[data-cart-trigger], .as-demo-cart');
    const checkoutBtn = document.querySelector('[data-checkout-btn]');

    let basePrice = parseInt(root.dataset.basePrice || '5100', 10);
    let comparePrice = parseInt(root.dataset.comparePrice || '6500', 10);
    let currentQty = parseInt(qtyInput ? qtyInput.value : '1', 10) || 1;

    // Initialize cart state
    const initialCart = getCart();
    updateCartBadge(initialCart);
    renderCartDrawer(initialCart);

    // 1. Image Thumbnail Switching
    thumbButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const fullSrc = btn.getAttribute('data-full-src');
        if (fullSrc && mainImg) {
          mainImg.src = fullSrc;
        }
        thumbButtons.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
      });
    });

    // 1b. Image Zoom Lightbox
    if (mainImgWrap && zoomModal && zoomModalImg) {
      mainImgWrap.style.cursor = 'zoom-in';
      mainImgWrap.addEventListener('click', () => {
        if (mainImg) {
          zoomModalImg.src = mainImg.src;
          zoomModal.classList.add('is-open');
          document.body.style.overflow = 'hidden';
        }
      });

      if (zoomCloseBtn) {
        zoomCloseBtn.addEventListener('click', closeZoomModal);
      }

      zoomModal.addEventListener('click', (e) => {
        if (e.target === zoomModal) closeZoomModal();
      });

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && zoomModal.classList.contains('is-open')) {
          closeZoomModal();
        }
      });
    }

    function closeZoomModal() {
      if (zoomModal) {
        zoomModal.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    }

    // 2. Package Variant Selection
    variantCards.forEach((card) => {
      card.addEventListener('click', () => {
        variantCards.forEach((c) => {
          c.classList.remove('is-selected');
          c.setAttribute('aria-pressed', 'false');
        });
        card.classList.add('is-selected');
        card.setAttribute('aria-pressed', 'true');

        const cardRadio = card.querySelector('input[type="radio"]');
        if (cardRadio) cardRadio.checked = true;

        const newBasePrice = parseInt(card.dataset.variantPrice, 10);
        const newComparePrice = parseInt(card.dataset.variantCompare, 10);
        const newVariantId = card.dataset.variantId;

        if (!isNaN(newBasePrice)) basePrice = newBasePrice;
        if (!isNaN(newComparePrice)) comparePrice = newComparePrice;
        if (variantIdInput && newVariantId) {
          variantIdInput.value = newVariantId;
        }

        recalculateTotalPrice();
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });

    // 3. Optional Offering Add-ons
    addonCheckboxes.forEach((chk) => {
      chk.addEventListener('change', () => {
        recalculateTotalPrice();
      });
    });

    // 4. Quantity Adjustments with Strict Validation
    function setValidQuantity(val) {
      let num = parseInt(val, 10);
      if (isNaN(num) || num < 1) num = 1;
      if (num > 10) num = 10;
      currentQty = num;
      if (qtyInput) qtyInput.value = num;
      recalculateTotalPrice();
      return num;
    }

    if (btnMinus && btnPlus && qtyInput) {
      btnMinus.addEventListener('click', (e) => {
        e.preventDefault();
        setValidQuantity(currentQty - 1);
      });

      btnPlus.addEventListener('click', (e) => {
        e.preventDefault();
        setValidQuantity(currentQty + 1);
      });

      qtyInput.addEventListener('input', () => {
        let val = qtyInput.value.replace(/[^0-9]/g, '');
        qtyInput.value = val;
      });

      qtyInput.addEventListener('blur', () => {
        setValidQuantity(qtyInput.value);
      });

      qtyInput.addEventListener('change', () => {
        setValidQuantity(qtyInput.value);
      });
    }

    // Helper: Recalculate dynamic total price
    function recalculateTotalPrice() {
      let addonsSum = 0;
      addonCheckboxes.forEach((chk) => {
        if (chk.checked) {
          const addCost = parseInt(chk.dataset.addonPrice || '0', 10);
          addonsSum += addCost;
        }
      });

      const singleUnitTotal = basePrice + addonsSum;
      const grandTotal = singleUnitTotal * currentQty;
      const grandCompareTotal = comparePrice * currentQty;

      if (priceDisplay) {
        priceDisplay.textContent = formatINR(grandTotal);
      }
      if (comparePriceDisplay) {
        comparePriceDisplay.textContent = formatINR(grandCompareTotal);
      }
    }

    // 5. Cart Drawer Open / Close Controls
    if (cartTriggerBtn) {
      cartTriggerBtn.style.cursor = 'pointer';
      cartTriggerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openCartDrawer();
      });
    }

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', closeCartDrawer);
    }

    if (drawerBackdrop) {
      drawerBackdrop.addEventListener('click', closeCartDrawer);
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const cart = getCart();
        if (!cart.items || cart.items.length === 0) {
          alert('Your sacred cart is empty. Please select a puja offering to proceed.');
          return;
        }

        checkoutBtn.disabled = true;
        checkoutBtn.innerHTML = `
          <svg style="width:18px;height:18px;animation:as-spin 0.8s linear infinite;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10"></path>
          </svg>
          <span>Securing Sacred Checkout...</span>
        `;

        setTimeout(() => {
          window.location.href = '/checkout';
        }, 300);
      });
    }

    // 6. Add To Cart Form Handler with Validation and Persistence
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate required fields
        const devoteeNameInput = form.querySelector('[name="properties[Devotee Name]"]');
        const phoneInput = form.querySelector('[name="properties[WhatsApp Number]"]');

        if (!devoteeNameInput || !devoteeNameInput.value.trim()) {
          alert('Please enter Devotee Full Name for the Vedic Sankalp.');
          if (devoteeNameInput) devoteeNameInput.focus();
          return;
        }

        if (!phoneInput || !phoneInput.value.trim()) {
          alert('Please provide a WhatsApp Number to receive your personal Sankalp video recording.');
          if (phoneInput) phoneInput.focus();
          return;
        }

        if (addToCartBtn) {
          addToCartBtn.disabled = true;
          addToCartBtn.innerHTML = `
            <svg style="width:18px;height:18px;animation:as-spin 0.8s linear infinite;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
              <path d="M12 2a10 10 0 0 1 10 10"></path>
            </svg>
            Consecrating Offering...
          `;
        }

        // Package details
        const selectedVariantCard = root.querySelector('.as-variant-card.is-selected');
        const packageName = selectedVariantCard ? selectedVariantCard.querySelector('.as-variant-name').textContent.trim() : 'Standard';
        const currentVariantId = variantIdInput ? variantIdInput.value : 'puja-rudra-ind-001';

        // Add-ons details
        const selectedAddons = [];
        let addonPriceSum = 0;
        addonCheckboxes.forEach((chk) => {
          if (chk.checked) {
            selectedAddons.push(chk.dataset.addonName);
            addonPriceSum += parseInt(chk.dataset.addonPrice || '0', 10);
          }
        });

        const singleItemPrice = basePrice + addonPriceSum;
        const devoteeName = devoteeNameInput.value.trim();
        const gotra = form.querySelector('[name="properties[Gotra]"]')?.value.trim() || 'Kashyapa';
        const pujaDate = form.querySelector('[name="properties[Puja Date]"]')?.value || 'Upcoming auspicious muhurta';
        const phone = phoneInput.value.trim();
        const sankalpIntent = form.querySelector('[name="properties[Sankalp Intent]"]')?.value.trim() || 'Family wellness and prosperity';

        // Add to persistent cart
        const cart = getCart();
        const activeImgSrc = mainImg ? mainImg.src : 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?q=80&w=200&auto=format&fit=crop';
        cart.items.push({
          id: currentVariantId,
          title: 'Maha Rudrabhishekam at Kashi Vishwanath',
          packageTier: packageName,
          price: singleItemPrice,
          quantity: currentQty,
          image: activeImgSrc,
          devoteeName: devoteeName,
          gotra: gotra,
          phone: phone,
          sankalpIntent: sankalpIntent,
          pujaDate: pujaDate,
          addons: selectedAddons,
          timestamp: new Date().toISOString(),
        });

        setTimeout(() => {
          saveCart(cart);

          if (addToCartBtn) {
            addToCartBtn.disabled = false;
            addToCartBtn.innerHTML = `
              <svg style="width:18px;height:18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span>Book Puja & Add to Cart</span>
            `;
          }

          showToast(`Prasad & Puja Booking for ${devoteeName} (${packageName} Package) added!`);
          openCartDrawer();
        }, 400);
      });
    }

    function showToast(msg) {
      if (!toast) return;
      if (toastMessage) toastMessage.textContent = msg;
      toast.classList.add('is-visible');
      setTimeout(() => {
        toast.classList.remove('is-visible');
      }, 4000);
    }

    // Initial total calculation on boot
    recalculateTotalPrice();
  }

  // Initialize on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPujaProduct);
  } else {
    initPujaProduct();
  }
})();
