module.exports = {
    apps: [
        {
            name: 'Telegram Bot',
            script: 'src/index.ts',
            interpreter: '/root/.nvm/versions/node/v18.16.0/bin/ts-node',
            //node_args: '-r/ tsconfig-paths/register',
	    interpreter_args: '--project ./tsconfig.json',
	    args: '--transpile-only',
        	    watch: true,
            env: {
                NODE_ENV: 'production',
		//TS_NODE_PROJECT: './tsconfig.json'
            }

        }
    ]
}
