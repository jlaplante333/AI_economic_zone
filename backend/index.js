require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');

console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);
console.log('OPENAI_API_KEY starts with sk-:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.startsWith('sk-') : false);

const app = express();
app.use(cors());
app.use(express.json());

const chatRoutes = require('./routes/chatRoutes');
const authRoutes = require('./routes/authRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
}); 