/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Replacing Slate with a cooler, deeper Zinc/Gray blend
                base: {
                    50: '#fafafa',
                    100: '#f4f4f5',
                    200: '#e4e4e7',
                    800: '#27272a',
                    900: '#18181b',
                    950: '#09090b',
                },
                // Primary brand color
                primary: {
                    400: '#a78bfa',
                    500: '#8b5cf6',
                    600: '#7c3aed',
                },
                // Accent color for matches
                accent: {
                    400: '#2dd4bf',
                    500: '#14b8a6',
                }
            },
            fontFamily: {
                // Consider adding a custom font like 'Plus Jakarta Sans' in your HTML
                sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
            }
        },
    },
    plugins: [],
}