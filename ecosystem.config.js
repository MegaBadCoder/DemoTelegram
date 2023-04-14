module.exports = {
    apps: [
        {
            name: 'Telegram Bot',
            script: './src/index.ts',
            // interpreter: 'ts-node',
            // args: '--transpile-only',
            watch: true,
            env: {
                NODE_ENV: 'production'
            }
        }

    ]
}