"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const auth_middleware_1 = require("../middleware/auth.middleware");
const authorizeRoles_1 = require("../middleware/authorizeRoles");
const router = (0, express_1.Router)();
// Public route
router.get('/', productController_1.getProducts);
// Protected routes
router.post('/', auth_middleware_1.protect, (0, authorizeRoles_1.authorizeRoles)('admin', 'vendor'), productController_1.createProduct);
router.put('/:id', auth_middleware_1.protect, (0, authorizeRoles_1.authorizeRoles)('admin', 'vendor'), productController_1.updateProduct);
router.delete('/:id', auth_middleware_1.protect, (0, authorizeRoles_1.authorizeRoles)('admin', 'vendor'), productController_1.deleteProduct);
router.delete('/delete-all', auth_middleware_1.protect, (0, authorizeRoles_1.authorizeRoles)('admin'), productController_1.deleteAllProducts);
exports.default = router;
//# sourceMappingURL=productsRoutes.js.map