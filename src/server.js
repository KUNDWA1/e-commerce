"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_1 = require("./config/swagger");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const productsRoutes_1 = __importDefault(require("./routes/productsRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
// Database Connection
mongoose_1.default.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/my_store')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ Connection error:', err));
// Swagger Documentation - Add custom CSS for better UI
const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Store API Documentation',
};
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec, swaggerOptions));
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/products', productsRoutes_1.default);
app.use('/api/categories', categoryRoutes_1.default);
app.use('/api/cart', cartRoutes_1.default);
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
    const spec = swagger_1.swaggerSpec;
    const pathCount = spec.paths ? Object.keys(spec.paths).length : 0;
    console.log(`📁 Swagger found ${pathCount} endpoints`);
});
//# sourceMappingURL=server.js.map