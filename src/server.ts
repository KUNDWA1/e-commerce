// src/server.ts
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { swaggerSpec } from './config/swagger';
import swaggerUi from 'swagger-ui-express';

import authRoutes from './routes/auth.routes';
import productRoutes from './routes/productsRoutes';
import categoryRoutes from './routes/categoryRoutes';
import cartRoutes from './routes/cartRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/my_store')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ Connection error:', err));

// Swagger Documentation - Add custom CSS for better UI
const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Store API Documentation',
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'API is running...',
    documentation: `http://localhost:${PORT}/api-docs`,
    endpoints: {
      auth: `http://localhost:${PORT}/api/auth`,
      products: `http://localhost:${PORT}/api/products`,
      categories: `http://localhost:${PORT}/api/categories`,
      cart: `http://localhost:${PORT}/api/cart`,
    },
  });
});

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Endpoint not found' }));

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
  
  // Fixed: Type assertion to access paths
  const spec = swaggerSpec as any;
  const pathCount = spec.paths ? Object.keys(spec.paths).length : 0;
  console.log(`📁 Swagger found ${pathCount} endpoints`);
});