# Design System & UI Guidelines
## Credit Solutions Goa - Full Stack Project

### 1. Theme & Vibe
*   **Tone:** Professional, Trustworthy, Transparent, and Modern.
*   **Vibe:** Financial institution meets agile tech startup. Clean lines, plenty of whitespace, and clear call-to-actions.

### 2. Color Palette
Since it's a financial service, the colors must evoke trust and clarity.

*   **Primary Brand Color (Trust & Stability):**
    *   `Navy Blue`: `#1E3A8A` (Tailwind `blue-900`) - Used for Navbar, Footer, and primary headings.
*   **Secondary/Action Color (Highlight & Growth):**
    *   `Gold/Amber`: `#F59E0B` (Tailwind `amber-500`) - Used for primary buttons (e.g., "Apply Now"), highlights, and the "0% Commission" badges.
*   **Neutral/Background Colors:**
    *   `Background`: `#F8FAFC` (Tailwind `slate-50`) - A very light off-white/gray for the main body background.
    *   `Surface`: `#FFFFFF` - White for cards and form containers.
    *   `Text Primary`: `#0F172A` (Tailwind `slate-900`) - Dark slate for readable body text.
    *   `Text Muted`: `#64748B` (Tailwind `slate-500`) - For secondary text and placeholders.
*   **Semantic Colors:**
    *   `Success`: `#10B981` (Tailwind `emerald-500`) - Form success messages, approved statuses.
    *   `Error`: `#EF4444` (Tailwind `red-500`) - Validation errors.

### 3. Typography
*   **Font Family:** `Inter` or `Roboto` (Google Fonts). Both are highly readable sans-serif fonts perfect for data-heavy and modern web applications.
*   **Hierarchy:**
    *   `h1`: 48px (Mobile 36px), Bold, Navy Blue.
    *   `h2`: 32px (Mobile 28px), Semi-bold.
    *   `h3`: 24px, Medium.
    *   `Body`: 16px, Regular, Text Primary.
    *   `Small`: 14px, Regular, Text Muted.

### 4. UI Component Styling (Tailwind Approach)
*   **Buttons:**
    *   *Primary:* `bg-amber-500 text-white font-semibold rounded-md px-6 py-2 hover:bg-amber-600 transition-colors`.
    *   *Secondary:* `border border-blue-900 text-blue-900 font-semibold rounded-md px-6 py-2 hover:bg-blue-50 transition-colors`.
*   **Cards (For Services & Form Containers):**
    *   `bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow`.
*   **Inputs:**
    *   `w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`.

### 5. Icons & Imagery
*   **Icons:** Use `lucide-react` for consistent, clean, and stroke-based iconography (e.g., `<Building />` for business loans, `<Car />` for wheels).
*   **Images:** Use high-quality, diverse, and professional stock photos representing business growth, happy homeowners, and smooth transactions. Avoid overly generic clip-art.
