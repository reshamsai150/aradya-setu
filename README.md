# Aaradhya Setu — Custom Puja Product Page & Sacred Checkout
### Software Engineering Intern Assignment — Option 1 (Shopify Custom Puja Page)

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-35204F?style=for-the-badge&logo=github)](https://github.com/reshamsai150/aradya-setu)
[![Shopify Theme](https://img.shields.io/badge/Shopify-Liquid%202.0-95BF47?style=for-the-badge&logo=shopify)](https://shopify.dev)
[![Playwright QA Tested](https://img.shields.io/badge/Playwright-100%25%20Verified-2EAD33?style=for-the-badge&logo=playwright)](https://playwright.dev)

> A production-ready custom Shopify product page and checkout flow crafted for **[Aaradhya Setu](https://www.aaradhyasetu.com)** under the **Modern Spiritual Luxury** design philosophy. Built with modular Shopify Online Store 2.0 architecture, real-time dynamic calculations, devotee Sankalp capture, persistent cart drawer, and responsive viewports.

---

## 📌 Assignment Selection Notice

Per the Aaradhya Setu assignment instructions:
> *"Important: Complete ANY ONE of the following three tasks. You do not need to complete all three."*

- ✅ **Option 1 — Shopify: Custom Puja Product Page**: **SELECTED & FULLY IMPLEMENTED**
- ❌ **Option 2 — Full-Stack: Puja Booking Dashboard**: *Excluded as instructed*
- ❌ **Option 3 — Full-Stack: Booking Workflow & Notifications**: *Excluded as instructed*

---

## 🏛️ Project Architecture & File Directory

```
aradya-setu/
├── shopify-theme/
│   ├── sections/
│   │   └── custom-puja-product.liquid   # Shopify 2.0 Liquid section with customizable schema
│   ├── templates/
│   │   └── product.puja.json            # Shopify JSON product template linking to section
│   ├── assets/
│   │   ├── custom-puja.css              # Custom styles (Royal Plum, Warm Ivory, Gold accent)
│   │   └── custom-puja.js               # Gallery zoom, Seva tiers, Add-ons, Cart Drawer & in-cart +/- controls
│   ├── checkout.html                    # Dedicated sacred checkout page (HTTP 200, no 404s)
│   └── index.html                       # Standalone live interactive product page
├── test-results/                        # High-resolution Playwright QA test screenshots
│   ├── desktop_product_page.png         # Desktop full view
│   ├── gallery_zoom_modal.png           # Sanctum image lightbox zoom
│   ├── cart_drawer_added.png            # Slide-over cart drawer with line items
│   ├── checkout_page_desktop.png        # Sacred checkout page with summary
│   ├── checkout_order_confirmed.png     # Simulated order confirmation view
│   └── mobile_product_page_390x844.png  # Mobile responsive layout
├── run-audit.js                         # 12-Phase Playwright test suite
├── run-micro-audit.js                   # End-to-end micro-functionality verification script
├── test-checkout.js                     # Checkout flow & information preservation verification
├── server.js                            # Local preview HTTP server with /checkout routing
├── README.md                            # Complete documentation & interview guide
└── .gitignore                           # Repository ignore configuration
```

---

## 🎨 Design System: Modern Spiritual Luxury

The visual identity bridges traditional Indian devotional reverence with high-efficiency enterprise usability:

| Color Token | Hex Code | Purpose |
|---|---|---|
| **Royal Plum (Primary)** | `#35204F` | Brand headers, primary action buttons, active navigation states |
| **Royal Plum (Hover)** | `#493064` | Interactive button hover and focus states |
| **Warm Ivory (Background)** | `#F8F5EF` | Page background providing spiritual warmth |
| **Surface** | `#FFFFFF` | Product cards, form containers, modal content |
| **Gold Accent** | `#B89454` | Section dividers, badges, focus outlines, star ratings |
| **Lavender Accent** | `#EDE5F4` | Subdued tags, borders, subtle highlights |
| **Text (Primary)** | `#292431` | High-contrast body text for readability |
| **Text (Muted)** | `#7E7785` | Supporting labels, timestamps, metadata |
| **Borders** | `#E8E3EB` | Subtle structural borders |

### Typography Hierarchy
- **Brand & Regal Titles**: `Playfair Display` (Serif, Bold)
- **Interface & Form Fields**: `Inter` (Sans-serif, 400/500/600/700)

---

## ✨ Key Functionality & Implemented Features

### 1. Product Imagery & Interactive Gallery
- High-resolution sacred sanctum imagery with multi-angle thumbnail switching.
- **Image Lightbox Zoom**: Clicking the main sanctum view opens a full-screen zoom preview with backdrop blur and keyboard `ESC` dismissal.
- Live Vedic Sanctum indicator with an animated pulsing dot.

### 2. Puja Details, Descriptions & Benefits
- Clear temple sanctum association (*Kashi Vishwanath Jyotirlinga Dham, Varanasi*).
- 4.97-star rating with social proof (*1,482 Devotees Performed this Month*).
- 4-point benefits grid detailing planetary dosha pacification, healing energy, and energized Bhasma/Rudraksha delivery.

### 3. Dynamic Seva Tiers & Pricing Calculations
- Supports package tiers with real-time price and compare-at discount updates:
  - **Individual Seva**: ₹5,100 (Original: ₹6,500 — Save 21%)
  - **Family Seva**: ₹7,500 (Original: ₹9,500)
  - **Royal Heritage**: ₹11,000 (Original: ₹14,000)
- Price display automatically adjusts when selecting package tiers, checkboxes, or quantities.

### 4. Optional Sacred Offerings & Add-On Selector
- Add-on offering options calculated dynamically per unit:
  - *1008 Bilva Patra Archana (+₹750)*
  - *Desi Cow Ghee Akhand Deepam (+₹500)*
  - *Brahmin Bhojan & Gau Seva Donation (+₹1,200)*
- Selection and deselection dynamically update subtotal calculations.

### 5. Devotee Sankalp Capture (Shopify Line Item Properties)
- Gathers required devotional data for the Purohit before cart submission:
  - **Devotee Full Name** *(Mandatory validation)*
  - **Gotra (Clan lineage)**
  - **Preferred Auspicious Muhurta Date**
  - **WhatsApp Number for Personal Sankalp Video Recording** *(Mandatory validation)*
  - **Special Prayer / Sankalp Objective**

### 6. Quantity Selector & Duplicate Submission Prevention
- Custom `+` / `−` quantity buttons strictly clamped between `1` and `10`.
- Manual input filtering rejects negative numbers, zero, and non-numeric characters.
- Add to Cart button displays a loading spinner (*"Consecrating Offering..."*) and is disabled upon click to prevent accidental double-charges.

### 7. Slide-Over Sacred Cart Drawer & In-Cart Modifiers
- Cart drawer slides smoothly from the right without navigating away.
- Displays item thumbnail, title, package tier, devotee name, Gotra, and selected add-ons.
- **In-Cart Quantity Controls**: Features inline `+` and `−` buttons directly within the cart drawer.
- **Item Removal**: One-click deletion with automatic recalculation.
- **Empty State**: Displays an empty sacred vessel icon with a *"Continue Offering Browsing"* button that closes the drawer.
- **Cart Persistence**: Stored via `localStorage` (`as_sacred_cart`), ensuring items remain after page refresh.

### 8. Dedicated Sacred Checkout Flow (`/checkout`)
- **Zero 404 Errors**: Server handles `/checkout` directly, serving a dedicated checkout interface.
- Automatically retrieves items, quantities, add-ons, and devotee information from the cart session.
- Captures delivery address for consecrated prasad courier.
- **Simulation Disclaimer**: Prominently notes that payment is in demonstration mode and no real credit card charges take place.
- Completes with a generated Order ID (e.g. `AS-432056`), clears the cart, and provides a confirmation screen.

---

## 🧪 Automated QA Validation & Verification Summary

The project was audited using an automated **Playwright test suite** covering all viewports and user journeys:

```
=== AARADHYA SETU — FINAL MICRO-FUNCTIONALITY QA AUDIT ===

[1. Product Page Tests]
Thumbnails found: 4
Main image updated from thumbnail: true (PASS)
Product Title: "Maha Rudrabhishekam at Kashi Vishwanath" (PASS)
Description loaded: true (PASS)
Initial quantity: 1 (PASS)
Quantity after minus at 1: 1 (PASS)
Quantity after plus: 2 (PASS)
Price with Qty 2 (Individual): ₹10,200 (PASS)
Price with Family Seva (Qty 2): ₹15,000 (PASS)
Price with Bilva Patra Add-on (+750 * 2): ₹16,500 (PASS)

[2. Add to Cart Tests]
Cart drawer opened automatically? true (PASS)
Cart badge count: 2 (PASS)

[3. Shopping Cart Tests]
Cart item image rendered? true (PASS)
Cart drawer subtotal before in-cart plus: ₹16,500 (PASS)
Cart drawer subtotal after in-cart plus (Qty 3): ₹24,750 (PASS)
Cart drawer subtotal after in-cart minus (Qty 2): ₹16,500 (PASS)

[4. Cart Persistence Test]
Cart badge after page refresh: 2 (PASS)

[5. Checkout Flow Tests]
Navigated to URL: http://localhost:3000/checkout (PASS - 0 errors)
Encountered 404? false (PASS)
Retained Devotee: Aarav Sharma, Phone: +91 98201 44521, Total: ₹16,500 (PASS)
Order confirmation displayed? true, Order ID: AS-371024 (PASS)
Returned to home URL: http://localhost:3000/index.html (PASS)
Cart counter after order completed: 0 (PASS)
Empty cart shows "Continue Offering Browsing" button? true (PASS)
Drawer closed via Continue Shopping button? true (PASS)

[6. Viewport Responsive Tests]
Mobile (375x812): client=375px, scroll=375px, overflow=false (PASS)
Tablet (768x1024): client=768px, scroll=768px, overflow=false (PASS)
Desktop (1440x900): client=1440px, scroll=1440px, overflow=false (PASS)

Browser Console Errors: None (Clean 0 errors)
=== FINAL MICRO-FUNCTIONALITY AUDIT COMPLETE ===
```

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18 or higher)

### Installation & Launch
```bash
# 1. Clone repository
git clone https://github.com/reshamsai150/aradya-setu.git
cd aradya-setu

# 2. Install dependencies (Playwright for automated QA)
npm install

# 3. Start local preview server
node server.js
```

### Accessing the Application
- **Puja Product Page**: [http://localhost:3000](http://localhost:3000)
- **Sacred Checkout**: [http://localhost:3000/checkout](http://localhost:3000/checkout)

### Running Automated QA Tests
```bash
# Run 12-phase audit
node run-audit.js

# Run checkout flow test
node test-checkout.js

# Run final micro-functionality audit
node run-micro-audit.js
```

---

## 🌐 Live Deployment Instructions

### GitHub Pages (Instant)
1. Open your repository on GitHub: **[reshamsai150/aradya-setu](https://github.com/reshamsai150/aradya-setu)**.
2. Go to **Settings** → **Pages**.
3. Under **Branch**, select `main` and set the folder to `/shopify-theme`.
4. Click **Save**. Your site will be live at `https://reshamsai150.github.io/aradya-setu/`.

---

## 🧑‍💻 Technical Interview Talking Points

1. **Shopify Architecture**: Explains how Online Store 2.0 sections (`custom-puja-product.liquid`) decouple presentation from Shopify store data, allowing schema customizations without touching core liquid assets.
2. **State Management**: Shows how the cart leverages pure client-side primitives (`localStorage`) structured identically to Shopify's AJAX Cart API (`/cart/add.js`, line-item properties, and item keys).
3. **Data Integrity & Validation**: Demonstrates how devotee Sankalp data and add-ons are bundled together, preventing orphan orders or mismatched Dakshina sums.
4. **Resilience & UX**: Explains how the checkout 404 issue was resolved via server routing, preventing user drop-off while clearly distinguishing demo environments from real payment gateways.
