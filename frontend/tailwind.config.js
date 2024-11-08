import daisyui from "daisyui"

module.exports = {
    content: [
        "./src/**/*.{html,ts,scss}",
    ],
    theme: {
        screens: {
            sm: '640px',
            md: '768px',
            md2: '1080px',
            lg: '1024px',
            xl: '1280px'
        },
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            keyframes: {
                appear: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(5px)', opacity: '1' },
                },
                swipeLeftOut: {
                    '0%': { opacity: '1', transform: 'translateX(0)' },
                    '100%': { opacity: '0', transform: 'translateX(-10px)' },
                },
                swipeRightOut: {
                    '0%': { opacity: '1', transform: 'translateX(0)' },
                    '100%': { opacity: '0', transform: 'translateX(10px)' },
                },
                swipeLeftIn: {
                    '0%': { opacity: '0', transform: 'translateX(10px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                swipeRightIn: {
                    '0%': { opacity: '0', transform: 'translateX(-10px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                spinCustom: {
                    '0%': { transform: 'translateY(10%)' },
                    '10%': { transform: 'translateY(-90%)' },
                    '25%': { transform: 'translateY(-90%)' },
                    '35%': { transform: 'translateY(-190%)' },
                    '50%': { transform: 'translateY(-190%)' },
                    '60%': { transform: 'translateY(-290%)' },
                    '75%': { transform: 'translateY(-290%)' },
                    '85%': { transform: 'translateY(-390%)' },
                    '100%': { transform: 'translateY(-390%)' },
                },
                underline: {
                    '0%': { width: '0%' },
                    '100%': { width: '100%' },
                },
            },
            animation: {
                appear: 'appear 0.3s ease forwards',
                swipeLeftOut: 'swipeLeftOut 0.20s ease forwards',
                swipeRightOut: 'swipeRightOut 0.20s ease forwards',
                swipeLeftIn: 'swipeLeftIn 0.20s ease forwards',
                swipeRightIn: 'swipeRightIn 0.20s ease forwards',
                spinCustom: 'spinCustom 15s infinite',
                'underline-grow': 'underline 0.2s ease-out forwards',
            },
            transformOrigin: {
                'center': 'center',
            },
            scale: {
                '0': '0',
                '100': '1',
            },
            backgroundImage: {
                'custom-gradient': 'linear-gradient(to bottom, white 0%, transparent 20%, transparent 80%, white 100%)',
            }
        },
    },
    plugins: [
        function ({ addUtilities }) {
            addUtilities({
                '.underline-animation': {
                    position: 'relative',
                },
                '.underline-animation::before': {
                    content: '""',
                    position: 'absolute',
                    bottom: '0',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '0',
                    height: '0.125rem',
                    backgroundColor: '#2d3748',
                    transformOrigin: 'center',
                    transition: 'width 0.2s ease',
                },
                '.underline-animation:hover::before': {
                    width: '100%',
                },
            });
        },
        daisyui
    ],
    daisyui: {
        themes: ["light"],
        prefix: "dui-",
    },
}
