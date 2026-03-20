const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const featuresRouter = require('./routes/features');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ ok: true, endpoints: ['/api/health', '/api/features'] });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'ok', timestamp: new Date() });
});

app.use('/api/features', featuresRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`listening ${PORT}`);
});
