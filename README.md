# Aaradhya Setu — Software Engineering Intern Assignment
## Selected Task: Option 1 — Shopify: Custom Puja Product Page

> **Assignment Choice Notice**:
> Per the instructions: *"Complete ANY ONE of the following three tasks. You do not need to complete all three."*
> - ✅ **Option 1 (Shopify: Custom Puja Product Page)**: **SELECTED & FULLY IMPLEMENTED.**
> - ❌ **Option 2 (Full-Stack: Puja Booking Dashboard)**: *Excluded as instructed.*
> - ❌ **Option 3 (Booking Workflow & Notifications)**: *Excluded as instructed.*

---

## 🌸 Overview: Option 1 Implementation

This project implements a custom Shopify theme product page for sacred puja offerings, visually and functionally tailored to **[Aaradhya Setu](https://www.aaradhyasetu.com)** under the **Modern Spiritual Luxury** design philosophy.

### 📁 Theme Structure
```
aradya setu/
├── shopify-theme/
│   ├── sections/
│   │   └── custom-puja-product.liquid   # Shopify 2.0 Liquid section with customizable schema
│   ├── templates/
│   │   └── product.puja.json            # Shopify JSON product template linking to the section
│   ├── assets/
│   │   ├── custom-puja.css              # Bespoke CSS (Royal Plum, Warm Ivory, Gold accent)
│   │   └── custom-puja.js               # Gallery switching, dynamic pricing, add-ons & cart logic
│   └── index.html                       # Standalone live interactive preview
├── server.js                            # Local preview server
└── README.md
```

---

## 🎯 Verification of Option 1 Criteria

| Criterion | Implementation | Verified |
|---|---|:---:|
| **Shopify Liquid, HTML, CSS & JS** | Section written in Shopify Liquid (`custom-puja-product.liquid`), CSS (`custom-puja.css`), and JS (`custom-puja.js`) with schema settings | ✅ |
| **Product Imagery & Gallery** | Multi-angle sanctum imagery with thumbnail switching, live badge, and hover zoom | ✅ |
| **Description & Temple Details** | Authentic spiritual description with temple sanctum tag (*Kashi Vishwanath Jyotirlinga*) | ✅ |
| **Price & Dynamic Calculations** | Real-time calculation supporting tier selections, compare-at pricing, and unit quantity | ✅ |
| **Spiritual Benefits Checklist** | Clear checkmarks highlighting astrological pacification, longevity, and Bhasma prasad | ✅ |
| **Quantity Selector** | Custom `+` / `−` quantity controls with real-time recalculation | ✅ |
| **Add to Cart & Devotee Sankalp** | Devotee Name, Gotra, Puja Date, WhatsApp number, and intention recorded as line-item properties | ✅ |
| **Optional Offering Add-on Selector** | Bilva Patra Archana (+₹750), Akhand Deepam (+₹500), and Gau Seva (+₹1,200) checkboxes | ✅ |
| **Proceed to Checkout Navigation** | Functional checkout flow preserving items, devotee particulars, add-ons, with simulation disclaimer | ✅ |

---

## 🔒 Checkout Flow Implementation & Fix Report

### Root Cause of the Previous 404 Error
When clicking the "Proceed to Checkout" button, the client requested `/checkout`. Because the project runs in a local development environment rather than on an active Shopify production store (`*.myshopify.com`), the local preview server (`server.js`) had only a static file handler for `/index.html` and returned a raw `404 Not Found` for any unknown route.

### What Was Fixed
1. **Server Routing ([server.js](file:///c:/Users/heman/Downloads/aradya%20setu/server.js))**: Added explicit routing mapping requests for `/checkout` and `/checkout/` directly to [checkout.html](file:///c:/Users/heman/Downloads/aradya%20setu/shopify-theme/checkout.html).
2. **Dedicated Sacred Checkout Page ([checkout.html](file:///c:/Users/heman/Downloads/aradya%20setu/shopify-theme/checkout.html))**: Created a complete checkout view styled in the **Modern Spiritual Luxury** design system.
   - Accurately renders cart line items, package tiers, selected add-ons, and total Dakshina.
   - Pre-fills devotee name, Gotra, WhatsApp number, and Sankalp intention from the active cart session.
   - Displays a prominent notice: *"Demonstration Checkout Mode: No real payment transaction or credit card charge will take place."*
   - Generates simulated order confirmations (e.g. `AS-432056`) and resets the cart.
3. **Cart Drawer Checkout UX ([custom-puja.js](file:///c:/Users/heman/Downloads/aradya%20setu/shopify-theme/assets/custom-puja.js))**:
   - Added loading feedback (`Securing Sacred Checkout...`).
   - Prevents duplicate clicks by disabling the button on click.
   - Directs to `/checkout` cleanly with zero console or network errors.

---

## 🚀 Running the Live Preview

The local preview server is running on **port 3000**:

```bash
# Product Page
http://localhost:3000

# Checkout Page
http://localhost:3000/checkout
```

### To Restart Manually:
```bash
node server.js
```
