const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const wrapperRoutes = require('./routes/wrapperRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const tileRoutes = require('./routes/tileRoutes');
const assetRoutes = require('./routes/assetRoutes');


const app = express();

// CORS — must come BEFORE helmet so preflight requests work
app.use(cors({
  origin: true,              // reflect request origin (allows proxy & localhost)
  credentials: true,
}));

// Security — relax policies that block uploaded images & API JSON
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },  // allow /uploads images
  contentSecurityPolicy: false,                            // CRA injects inline scripts
}));

// Serve static uploads (images uploaded via admin dashboard)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logger
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ── API Routes ──────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/wrappers', wrapperRoutes);
app.use('/api/v1/collections', collectionRoutes);
app.use('/api/v1/tiles', tileRoutes);
app.use('/api/v1/assets', assetRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// ── 404 catch-all ───────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ── Global error handler ────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.stack || err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// ── Database Connection ─────────────────────────────────────────
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI ||
        ''
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// ── Start Server ────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
    );
  });
});
