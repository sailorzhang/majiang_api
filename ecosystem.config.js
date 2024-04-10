module.exports = {
    apps: [
        {
            name: "majiang",
            script: "./bin/www",
            watch: true,
            env: {
                "PORT": 8080,
                "NODE_ENV": "development1",
                "mysql_host": "localhost",
                "mysql_user": "root",
                "mysql_password": "Zxn2482193?",
                "mysql_database": "majiang"
            },
            env_production: {
                "PORT": 8082,
                "NODE_ENV": "production",
                "mysql_host": "localhost",
                "mysql_user": "root",
                "mysql_password": "Xx2482193?",
                "mysql_database": "majiang"
            }
        }
    ]
}