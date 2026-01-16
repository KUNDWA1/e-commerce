"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
// src/config/swagger.ts
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Store API',
            version: '1.0.0',
            description: 'Complete REST API documentation for Store Management System',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439011',
                        },
                        name: {
                            type: 'string',
                            example: 'John Doe',
                        },
                        email: {
                            type: 'string',
                            example: 'john@example.com',
                        },
                        role: {
                            type: 'string',
                            enum: ['user', 'admin'],
                            example: 'user',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                        },
                        error: {
                            type: 'object',
                        },
                    },
                },
            },
        },
        tags: [
            {
                name: 'Users',
                description: 'User authentication and management',
            },
            {
                name: 'User Profile',
                description: 'User profile operations',
            },
            {
                name: 'Password Reset',
                description: 'Password reset and recovery',
            },
            {
                name: 'Products',
                description: 'Product management',
            },
            {
                name: 'Categories',
                description: 'Category management',
            },
            {
                name: 'Cart',
                description: 'Shopping cart operations',
            },
        ],
    },
    // FIXED: Updated paths to match your project structure
    apis: [
        './src/routes/*.ts',
        './src/controllers/*.ts',
        './routes/*.ts',
        './controllers/*.ts',
    ],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
// Debug: Check if swagger is finding your endpoints
const spec = exports.swaggerSpec;
const pathCount = spec.paths ? Object.keys(spec.paths).length : 0;
console.log('📚 Swagger paths found:', pathCount);
if (pathCount === 0) {
    console.warn('⚠️  No API paths found! Check your apis configuration in swagger.ts');
    console.warn('Current working directory:', process.cwd());
}
//# sourceMappingURL=swagger.js.map