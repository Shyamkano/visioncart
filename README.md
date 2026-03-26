# VisionCart Pro

![VisionCart Banner](https://via.placeholder.com/1200x400/0d1117/3b82f6?text=VisionCart+Pro)

VisionCart Pro is a modern, premium e-commerce platform dedicated to eyewear. Designed with a sleek, dark-themed UI and supercharged with a responsive layout, VisionCart provides a seamless browsing and shopping experience across all devices.

**Live Demo:** [https://visioncart-eta.vercel.app/](https://visioncart-eta.vercel.app/)

## Features

- **Responsive Design**: Intuitive app-like bottom navigation for mobile and a glassmorphic top navigation for desktop.
- **Shopping Cart**: Add items securely to your cart and manage your selection effortlessly.
- **AI Frame Try-on**: (Coming Soon) Virtual try-on for frames using AI technology.
- **Vision Health**: Book appointments with eye care professionals directly from the dashboard.
- **Secure Auth**: Safe passwordless login powered by Supabase magic links.
- **Admin Panel**: Manage inventory, view orders, and organize appointments.

## Tech Stack

- **Frontend:** React 18, Vite
- **Routing:** React Router DOM
- **Styling:** Custom CSS (Grid, Flexbox, Glassmorphism)
- **Icons:** Lucide-React
- **Backend:** Supabase (PostgreSQL, Auth, Storage)

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. **Clone the repo**
   ```sh
   git clone https://github.com/Shyamkano/visioncart.git
   cd visioncart
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```sh
   npm run dev
   ```

5. **Open the app**
   Navigate to `http://localhost:5173` in your browser.

## Contributing

Contributions are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License.

---
*Built for better vision.*

