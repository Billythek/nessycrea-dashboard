import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Primitive colors from main site
          teal: {
            300: 'rgba(50, 184, 198, 1)',
            400: 'rgba(45, 166, 178, 1)',
            500: 'rgba(33, 128, 141, 1)',
            600: 'rgba(29, 116, 128, 1)',
            700: 'rgba(26, 104, 115, 1)',
            800: 'rgba(41, 150, 161, 1)',
          },
          brown: {
            600: 'rgba(94, 82, 64, 1)',
          },
          slate: {
            500: 'rgba(98, 108, 113, 1)',
            900: 'rgba(19, 52, 59, 1)',
          },
          cream: {
            50: 'rgba(252, 252, 249, 1)',
            100: 'rgba(255, 255, 253, 1)',
          },
          gray: {
            200: 'rgba(245, 245, 245, 1)',
            300: 'rgba(167, 169, 169, 1)',
            400: 'rgba(119, 124, 124, 1)',
          },
          charcoal: {
            700: 'rgba(31, 33, 33, 1)',
            800: 'rgba(38, 40, 40, 1)',
          },
          red: {
            400: 'rgba(255, 84, 89, 1)',
            500: 'rgba(192, 21, 47, 1)',
          },
          orange: {
            400: 'rgba(230, 129, 97, 1)',
            500: 'rgba(168, 75, 47, 1)',
          },
        },
        dashboard: {
          // Order status colors - palette marron/orange chaud
          delivered: 'rgba(107, 83, 68, 1)',    // Marron
          shipped: 'rgba(168, 75, 47, 1)',      // Orange
          processing: 'rgba(230, 129, 97, 1)',  // Orange clair
          pending: 'rgba(212, 197, 169, 1)',    // Beige
          cancelled: 'rgba(192, 21, 47, 1)',    // Rouge
          failed: 'rgba(192, 21, 47, 1)',       // Rouge

          // Chart colors - orange/marron
          revenue: 'rgba(168, 75, 47, 1)',
          grid: 'rgba(245, 245, 245, 1)',

          // Product colors - tons chauds
          stockHigh: 'rgba(107, 83, 68, 1)',    // Marron (bon stock)
          stockMedium: 'rgba(168, 75, 47, 1)',  // Orange (moyen)
          stockLow: 'rgba(192, 21, 47, 1)',     // Rouge (bas)

          // Trend colors - orange/marron
          up: 'rgba(107, 83, 68, 1)',
          down: 'rgba(192, 21, 47, 1)',
          neutral: 'rgba(155, 138, 122, 1)',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(155, 138, 122, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(155, 138, 122, 0.4)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-in-up': 'fade-in-up 0.4s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'bounce-soft': 'bounce-soft 1s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
