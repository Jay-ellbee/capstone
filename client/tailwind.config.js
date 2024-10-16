/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'circle-keys': {
  				'0%': {
  					transform: 'scale(1)',
  					opacity: '1'
  				},
  				'50%': {
  					transform: 'scale(1.5)',
  					opacity: '0.5'
  				},
  				'100%': {
  					transform: 'scale(1)',
  					opacity: '1'
  				}
  			},
  			'dot-keys': {
  				'0%': {
  					transform: 'scale(1)'
  				},
  				'50%': {
  					transform: 'scale(0)'
  				},
  				'100%': {
  					transform: 'scale(1)'
  				}
  			},
  			'outline-keys': {
  				'0%': {
  					transform: 'scale(0)',
  					outline: 'solid 20px var(--color)',
  					'outline-offset': '0',
  					opacity: '1'
  				},
  				'100%': {
  					transform: 'scale(1)',
  					outline: 'solid 0 transparent',
  					'outline-offset': '20px',
  					opacity: '0'
  				}
  			},
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
  			'circle-keys': 'circle-keys 2s ease-in-out infinite',
  			'dot-keys': 'dot-keys 2s ease-in-out infinite',
  			'outline-keys': 'outline-keys 2s ease-in-out infinite',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		colors: {
  			custom: 'hsl(0, 0%, 87%)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}