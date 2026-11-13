# ShopSphere — E-Commerce Multi-Filter & Sorting Catalog

A responsive e-commerce product browsing application engineered with **React 18**, **JavaScript (ES6+)**, **Vite**, and **Tailwind CSS**. It replicates the core filtering and catalog experience of platforms like Amazon and Flipkart, featuring multi-criteria combinatorial filtering, a genuine dual-thumb price slider, dynamic sorting pipelines, instant client-side updates, and an interactive shopping cart.

---

## 🌟 Key Features

### 1. Independent Combinatorial Filtering
- **Multi-Category Selection**: Select multiple categories simultaneously using checkboxes (`Electronics`, `Apparel`, `Footwear`, `Home & Kitchen`, `Accessories`). Operates with boolean **OR** logic across selected categories, or includes all categories when none are selected. Includes real-time category product counts.
- **Dual-Thumb Price Range Slider**: Genuine two-handle range slider with independent min and max endpoints. Dynamic lower and upper boundaries calculated from the inventory, non-crossing constraints (`min <= max - gap`), live Indian Rupee currency formatting (`₹2,499`), and full keyboard accessibility.
- **Customer Rating Filter**: Accessible radio-group filter selecting minimum rating thresholds (All, ≥3.0, ≥3.5, ≥4.0, ≥4.5 stars) with visual star indicators and matching count tags.
- **Live Search**: Instant keyword search matching product names case-insensitively, debounced across other active filters, with a quick-clear button.

### 2. Sorting Pipeline
- **Featured / Default**: Preserves original inventory order.
- **Price: Low to High**: Ascending order by price.
- **Price: High to Low**: Descending order by price.
- **Top Rated First**: Descending order by customer rating.
- **Name: A to Z**: Alphabetical order by product title.
- *Strict immutability*: The original inventory is never mutated in-place (`[...filteredProducts].sort(...)`).

### 3. Responsive UI & Accessibility
- **Two-Column Desktop Layout**: Sticky filter sidebar (`sticky top-24`) that stays anchored as users scroll the product grid.
- **Mobile Collapsible Drawer**: Responsive slide-over filter panel accessible via a floating filter trigger button with an active filter badge counter.
- **Active Filter Chips**: Interactive tags above the product catalog allowing users to inspect and dismiss individual filters with one click.
- **Empty State**: Clear feedback illustration, helpful guidance, and a prominent "Reset Filters" action when zero products match the active combination.
- **Meaningful Shopping Cart**: Live cart counter badge in the header, slide-over cart drawer with quantity adjustment (`+` / `-`), subtotal calculations, and product removal.
- **Image Fallback**: Handled with SVG placeholders to prevent broken layouts if remote URLs fail.

---

## 🏗️ Architecture & Project Structure

```
c:/Users/PRAMOD KUMAR/Desktop/QuantiphiVC/
├── dist/                     # Optimized production bundle
├── src/
│   ├── components/
│   │   ├── Header.jsx        # Brand, live search bar, mobile toggle & cart badge
│   │   ├── FilterSidebar.jsx # Sticky sidebar & mobile slide-over container
│   │   ├── CategoryFilter.jsx# Checkboxes with counts & multi-select logic
│   │   ├── PriceRangeFilter.jsx # Dual-thumb range slider with highlight track
│   │   ├── RatingFilter.jsx  # Accessible radio group with star icons
│   │   ├── SortDropdown.jsx  # Sort selector (Featured, Price, Rating, Name)
│   │   ├── ProductCard.jsx   # Product card with image fallback, stars, and cart
│   │   ├── ProductGrid.jsx   # Responsive grid, active filter chips & toolbar
│   │   ├── EmptyState.jsx    # Empty state illustration and reset trigger
│   │   └── CartDrawer.jsx    # Slide-over cart with quantity & checkout preview
│   ├── data/
│   │   └── products.js       # 24 realistic products across 5 categories
│   ├── utils/
│   │   ├── filterProducts.js # Pure combinatorial filtering function
│   │   ├── sortProducts.js   # Pure sorting function
│   │   └── formatPrice.js    # Currency formatter for Indian Rupees (₹)
│   ├── tests/
│   │   ├── filterProducts.test.js # Vitest suite covering all filter scenarios
│   │   ├── sortProducts.test.js   # Vitest suite covering sorting & immutability
│   │   └── formatPrice.test.js    # Vitest suite covering currency formatting
│   ├── App.jsx               # Root state coordinator with memoized pipeline
│   ├── main.jsx              # React DOM entry point
│   └── index.css             # Tailwind base & custom range slider styles
├── index.html                # HTML5 template with Google Fonts
├── package.json              # Dependencies and test/build scripts
├── tailwind.config.js        # Tailwind design tokens
├── postcss.config.js         # PostCSS configuration
└── vite.config.js            # Vite & Vitest configuration
```

---

## 🧮 Algorithm & Complexity Analysis

### 1. Combinatorial Filtering Algorithm (`src/utils/filterProducts.js`)

For a product $p$ to be included in the output set, it must satisfy all 4 boolean criteria simultaneously (**AND** logic):

$$\text{include}(p) = \text{categoryMatch}(p) \land \text{priceMatch}(p) \land \text{ratingMatch}(p) \land \text{searchMatch}(p)$$

Where:
- $\text{categoryMatch}(p) = (\text{selectedCategories.length} = 0) \lor (p.\text{category} \in \text{selectedCategories})$
- $\text{priceMatch}(p) = (p.\text{price} \ge \text{minPrice}) \land (p.\text{price} \le \text{maxPrice})$
- $\text{ratingMatch}(p) = (\text{minRating} = 0) \lor (p.\text{rating} \ge \text{minRating})$
- $\text{searchMatch}(p) = (\text{query} = '') \lor (p.\text{name}.\text{toLowerCase}().\text{includes}(\text{query}))$

### 2. Time and Space Complexity

| Operation | Time Complexity | Auxiliary Space Complexity | Explanation |
| :--- | :--- | :--- | :--- |
| **Filter Pipeline** | $\mathcal{O}(N \cdot K)$ | $\mathcal{O}(M)$ | $N$ is total products, $K$ is average length of selected categories check ($\mathcal{O}(1)$ for small sets). $M$ is number of matching products ($M \le N$). |
| **Sorting Pipeline** | $\mathcal{O}(M \log M)$ | $\mathcal{O}(M)$ | JavaScript V8 TimSort on a shallow copy of filtered products. Never mutates input array. |
| **End-to-End Pipeline** | $\mathcal{O}(N + M \log M)$ | $\mathcal{O}(M)$ | Filtering takes $\mathcal{O}(N)$; sorting the filtered subset takes $\mathcal{O}(M \log M)$. |
| **Memoization Overhead** | $\mathcal{O}(1)$ | $\mathcal{O}(1)$ | `useMemo` caches references until dependency values change. |

---

## 🧪 Testing Suite & Results

The project uses **Vitest** for automated unit testing. All 23 tests execute and pass:

```
 RUN  v3.2.7 C:/Users/PRAMOD KUMAR/Desktop/QuantiphiVC

 ✓ src/tests/sortProducts.test.js (7 tests)
 ✓ src/tests/filterProducts.test.js (12 tests)
 ✓ src/tests/formatPrice.test.js (4 tests)

 Test Files  3 passed (3)
      Tests  23 passed (23)
   Duration  3.07s
```

### Verified Scenarios:
1. ✅ **Initial load**: All products appear in featured order.
2. ✅ **Single category**: Selecting *Electronics* displays only electronics.
3. ✅ **Multi-category**: Selecting *Electronics* and *Apparel* displays items from either category (OR logic).
4. ✅ **Min price adjustment**: Restricts products with prices below minimum threshold.
5. ✅ **Max price adjustment**: Restricts products with prices above maximum threshold.
6. ✅ **Rating filter**: Selecting 4-star minimum excludes items with rating < 4.0.
7. ✅ **Combinatorial criteria**: Category, price boundaries, rating, and search query work simultaneously (AND logic).
8. ✅ **Category clear**: Clearing categories restores all categories while retaining active price and rating filters.
9. ✅ **Price sorting**: Ascending and descending price ordering.
10. ✅ **Rating sorting**: Descending star rating ordering.
11. ✅ **Filter invariance**: Changing sort order never modifies the set of products passing the filter.
12. ✅ **Keyword search**: Case-insensitive substring matching against product names.
13. ✅ **Empty state**: Returns 0 items gracefully when boundaries exclude all products.
14. ✅ **Reset Filters**: Restores full inventory, default price limits, rating 0, empty search, and 'featured' sort.
15. ✅ **Array Immutability**: Neither filtering nor sorting mutates the original `products` array.
16. ✅ **Reversed bounds prevention**: Price slider constraints prevent min thumb from exceeding max thumb.

---

## 🚀 Setup & Execution Guide

### Prerequisites
- Node.js v18.0.0 or higher
- npm v9.0.0 or higher

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The application will launch locally at `http://localhost:5173/`.

### 3. Run Test Suite
```bash
npm test
```

### 4. Build Production Bundle
```bash
npm run build
```

