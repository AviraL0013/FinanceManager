// server.js
const app = require('./app'); // Import Express app
const connectToDb = require('./db/db'); // Import database connection
const port = process.env.PORT || 3000;

(async () => {
    
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})();
