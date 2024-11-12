const express = require('express');
const { dbConnect } = require('../config/dbConnection');
const router = require('../routes/userRoutes');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const port = process.env.PORT || 4000;
const hostname = process.env.HOST_NAME || 'localhost';

const app = express();

dbConnect();

// Enable CORS for all routes

app.use(cors());

app.use(express.json());
app.use('/api/v1', router);

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});
