const dotenv = require('dotenv');
const path = require('path');

// Load .env from the project root (two levels up from config)
dotenv.config({ path: path.join(__dirname, '../../.env') }); 