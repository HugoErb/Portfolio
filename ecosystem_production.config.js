module.exports = {
    apps: [
        {
            name: "Portfolio",
            script: "./server.js",
            watch: false,
            env: {
                "NODE_ENV": "production",
                "PORT": 3002
            }
        }
    ]
}