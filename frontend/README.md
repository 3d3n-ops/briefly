# Briefly Frontend

A sleek, modern blog aggregator built with Next.js, Tailwind CSS, and shadcn/ui components.

## Features

- **Dark Theme**: Clean white-on-black design with monospace typography
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Built with shadcn/ui components for a polished look
- **Blog Grid**: Beautiful card-based layout for blog posts
- **Individual Post Pages**: Dedicated pages for reading blog content
- **Smooth Navigation**: Seamless transitions between pages

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **Lucide React** - Icon library

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── blog/
│       └── [slug]/
│           └── page.tsx   # Dynamic blog post pages
├── components/
│   └── ui/                # shadcn/ui components
│       ├── button.tsx
│       └── card.tsx
├── lib/
│   └── utils.ts           # Utility functions
├── main.css               # Global styles with Tailwind
└── tailwind.config.js     # Tailwind configuration
```

## Design System

### Colors
- **Background**: Pure black (#000000)
- **Text**: White (#FFFFFF)
- **Secondary Text**: Light gray (#9CA3AF)
- **Borders**: Dark gray (#374151)
- **Cards**: Dark gray (#111827)

### Typography
- **Font Family**: JetBrains Mono (monospace)
- **Headings**: Bold, large sizes
- **Body Text**: Regular weight, readable line height

### Components
- **Cards**: Rounded corners, subtle borders, hover effects
- **Buttons**: Outline style with hover states
- **Layout**: Clean grid system with proper spacing

## Customization

### Adding New Blog Posts
Edit the `blogPosts` array in `app/page.tsx` and add corresponding content in `app/blog/[slug]/page.tsx`.

### Styling
Modify `main.css` for global styles or update Tailwind classes in components.

### Components
Add new shadcn/ui components using the CLI:
```bash
npx shadcn-ui@latest add [component-name]
```

## Deployment

The app is ready for deployment on Vercel, Netlify, or any other Next.js-compatible platform.

```bash
npm run build
npm start
```

## License

MIT License - feel free to use this project as a starting point for your own blog aggregator!
