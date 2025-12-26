import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mockHotelRoutes from './routes/mock-hotels.js';
import mockPackageRoutes from './routes/mock-packages.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('Using mock data (MongoDB connection temporarily disabled)');

// Routes - Using mock data
app.use('/api/hotels', mockHotelRoutes);
app.use('/api/packages', mockPackageRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
