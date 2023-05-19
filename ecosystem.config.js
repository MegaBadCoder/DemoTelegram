module.exports = {
    apps: [
        {
            name: 'Telegram Bot',
            script: 'src/index.ts',
            interpreter: '/root/.nvm/versions/node/v18.16.0/bin/ts-node-dev',
            args: '--transpile-only',
        	    watch: true,
            env: {
                NODE_ENV: 'production'
            }

        }
    ]
}

