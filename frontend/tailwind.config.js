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
                    '10%': { transform: 'translateY(-102%)' },
                    '25%': { transform: 'translateY(-100%)' },
                    '35%': { transform: 'translateY(-202%)' },
                    '50%': { transform: 'translateY(-200%)' },
                    '60%': { transform: 'translateY(-302%)' },
                    '75%': { transform: 'translateY(-300%)' },
                    '85%': { transform: 'translateY(-402%)' },
                    '100%': { transform: 'translateY(-400%)' },
                },
            },
            animation: {
                appear: 'appear 0.3s ease forwards',
                swipeLeftOut: 'swipeLeftOut 0.20s ease forwards',
                swipeRightOut: 'swipeRightOut 0.20s ease forwards',
                swipeLeftIn: 'swipeLeftIn 0.20s ease forwards',
                swipeRightIn: 'swipeRightIn 0.20s ease forwards',
                spinCustom: 'spinCustom 10s infinite',
            },
            transformOrigin: {
                'center': 'center',
            },
            scale: {
                '0': '0',
                '100': '1',
            },
        },
    },
    plugins: [daisyui],
    daisyui: {
        themes: ["light"],
        prefix: "dui-",
    },
}
