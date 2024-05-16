module.exports = {
    apps: [
        {
            name: 'nodeserver',
            script: 'npm',
            args: 'run pro',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'production'
            },
            env_production: {
                NODE_ENV: 'production'
            }
        }
    ]
}
