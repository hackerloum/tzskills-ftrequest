const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const featuresRouter = require('./routes/features');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

const buildDir = process.env.FRONTEND_BUILD_PATH
  ? path.resolve(process.env.FRONTEND_BUILD_PATH)
  : path.join(__dirname, '..', 'frontend', 'build');
const indexPath = path.join(buildDir, 'index.html');
const hasFrontendBuild = fs.existsSync(indexPath);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'ok', timestamp: new Date() });
});

app.use('/api/features', featuresRouter);

app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

if (hasFrontendBuild) {
  app.use(express.static(buildDir));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    res.sendFile(path.join(buildDir, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      ok: true,
      hint: 'No frontend build — run `npm run build` in frontend, or use `npm start` in frontend for dev.',
      endpoints: ['/api/health', '/api/features'],
    });
  });
}

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`listening ${PORT}`);
  if (hasFrontendBuild) {
    console.log(`serving UI from ${buildDir}`);
  } else {
    console.log(`no UI build at ${indexPath} — set FRONTEND_BUILD_PATH or run npm run build in frontend`);
  }
});
