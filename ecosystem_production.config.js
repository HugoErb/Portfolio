module.exports = {
    apps: [
        {
            name: "production_portfolio",
            script: "./server.js",
            watch: true,
            env: {
                "NODE_ENV": "production",
                "PORT": 3002
            }
        }
    ]
}