module.exports = {
    apps: [
        {
            name: "Portfolio",
            script: "./server.js",
            watch: true,
            env: {
                "NODE_ENV": "production",
                "PORT": 3002
            }
        }
    ]
}