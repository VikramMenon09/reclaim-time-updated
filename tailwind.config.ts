import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		fontFamily: {
			sans: ["Sora", "Quicksand", "ui-sans-serif", "system-ui"],
			sora: ["Sora", "sans-serif"],
			quicksand: ["Quicksand", "sans-serif"],
		},
		extend: {
			colors: {
				border: '#E0E0E0',
				input: '#E0E0E0',
				ring: '#5D83E3',
				background: '#D3E6FD',
				foreground: '#121212',
				primary: {
					DEFAULT: '#4C6EDC',
					foreground: '#fff',
				},
				secondary: {
					DEFAULT: '#5D83E3',
					foreground: '#fff',
				},
				highlight: {
					DEFAULT: '#8BBEF3',
					foreground: '#121212',
				},
				card: '#D3E6FD',
				tab: {
					active: '#4C6EDC',
					inactive: '#D3E6FD',
				},
				dark: {
					DEFAULT: '#121212',
					alt: '#1A1A1A',
					foreground: '#fff',
					border: '#E0E0E0',
				},
				white: '#fff',
				muted: '#8BBEF3',
				accent: '#5D83E3',
				destructive: {
					DEFAULT: '#ef4444',
					foreground: '#fff',
				},
				blue: {
					50: '#eaf6ff',
					100: '#d0eaff',
					200: '#a6d8ff',
					300: '#7cc6ff',
					400: '#4db5ff',
					500: '#2196f3',
					600: '#1e88e5',
					700: '#1976d2',
					800: '#1565c0',
					900: '#0d47a1',
				},
				lavender: {
					50: '#f5f3ff',
					100: '#ede9fe',
					200: '#ddd6fe',
					300: '#c4b5fd',
					400: '#a78bfa',
					500: '#8b5cf6',
					600: '#7c3aed',
					700: '#6d28d9',
					800: '#5b21b6',
					900: '#4c1d95',
				},
			},
			borderRadius: {
				lg: '1.5rem',
				md: '1rem',
				sm: '0.5rem'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			transitionProperty: {
				'smooth': 'all 0.2s ease-in-out'
			}
		}
	},
	plugins: [animate],
} satisfies Config;
