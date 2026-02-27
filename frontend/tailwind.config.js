/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: { 50: '#eef9ff', 100: '#d9f1ff', 200: '#bce8ff', 300: '#8edaff', 400: '#59c3ff', 500: '#33a5ff', 600: '#1b87f5', 700: '#146fe1', 800: '#175ab6', 900: '#194d8f' },
                danger: { 50: '#fff1f1', 100: '#ffe0e0', 200: '#ffc7c7', 300: '#ffa0a0', 400: '#ff6b6b', 500: '#ff3d3d', 600: '#ed1515', 700: '#c80d0d', 800: '#a50f0f', 900: '#881414' },
                safe: { 50: '#edfcf2', 100: '#d4f7e0', 200: '#aceec6', 300: '#76dfa5', 400: '#3ec97f', 500: '#1aaf64', 600: '#0e8d4f', 700: '#0b7141', 800: '#0c5935', 900: '#0a492d' },
                warning: { 50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f' },
                dark: { 800: '#1a1a2e', 900: '#0f0f1a', 950: '#0a0a14' },
                ink: { dark: '#ffffff', muted: '#cbd5e1' },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
