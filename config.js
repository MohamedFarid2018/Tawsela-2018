const config = {
    environment: process.env.NODE_ENV || 'dev',
    server: {
        port: process.env.PORT || 3000
    },
    mongo: {
        url: process.env.MONGO_DB_URI || 'mongodb://localhost:3344/test'
    }
};

module.exports = config;
