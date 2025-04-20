import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
    	extend: {
    		colors: {
    			primary: {
    				DEFAULT: '#2363eb',
    				light: '#4c85f1',
    				dark: '#1a4bb5'
    			},
    			secondary: {
    				DEFAULT: '#f9d13e',
    				light: '#f9db63',
    				dark: '#bfa12f'
    			},
    			dark: {
    				'100': '#999999',
    				'200': '#808080',
    				'300': '#666666',
    				'400': '#4d4d4d',
    				'500': '#333333',
    				'600': '#2b2b2b',
    				'700': '#222222',
    				'800': '#1a1a1a',
    				'900': '#111111'
    			},
    			light: {
    				'100': '#f5f6f7',
    				'200': '#e5e7eb',
    				'300': '#d1d5db'
    			}
    		},
    		fontFamily: {
    			sans: [
    				'Inter',
                    ...defaultTheme.fontFamily.sans
                ]
    		},
    		container: {
    			center: true,
    			padding: '1rem',
    			screens: {
    				sm: '100%',
    				md: '728px',
    				lg: '984px',
    				xl: '1240px',
    				'2xl': '1496px'
    			}
    		},
    		borderRadius: {
    			none: '0',
    			sm: '0.125rem',
    			DEFAULT: '0.25rem',
    			md: '0.375rem',
    			lg: '0.5rem',
    			xl: '0.75rem',
    			'2xl': '1rem',
    			'3xl': '1.5rem',
    			full: '9999px'
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
    		}
    	}
    },
	plugins: [require('tailwindcss-animate')],
};

export default config;
