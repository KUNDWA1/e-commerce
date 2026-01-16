"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllProducts = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProducts = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Product_1 = __importDefault(require("../models/Product"));
const Categories_1 = __importDefault(require("../models/Categories"));
/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Public endpoint to retrieve all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 */
const getProducts = async (req, res) => {
    try {
        const products = await Product_1.default.find()
            .populate('category')
            .populate('vendor', 'name email');
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getProducts = getProducts;
/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     description: Create a product (Admin or Vendor only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 15
 *               price:
 *                 type: number
 *                 example: 1200
 *               category:
 *                 type: string
 *                 example: 64f1b2c9e8a9c1a123456789
 *               inStock:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 */
const createProduct = async (req, res) => {
    try {
        const { name, price, category, inStock } = req.body;
        const user = req.user;
        if (!category || !mongoose_1.default.Types.ObjectId.isValid(category)) {
            return res.status(400).json({ error: "Category ID is invalid" });
        }
        const categoryExists = await Categories_1.default.findById(category);
        if (!categoryExists) {
            return res.status(404).json({ error: "Category not found" });
        }
        const newProduct = new Product_1.default({
            name,
            price,
            category,
            inStock: inStock !== undefined ? inStock : true,
            vendor: user._id
        });
        await newProduct.save();
        res.status(201).json(newProduct);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.createProduct = createProduct;
/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     description: Update product (Admin or owning Vendor)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid ID
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 */
const updateProduct = async (req, res) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const user = req.user;
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }
        const product = await Product_1.default.findById(id);
        if (!product)
            return res.status(404).json({ error: "Product not found" });
        if (user.role === "vendor" && product.vendor.toString() !== user._id.toString()) {
            return res.status(403).json({ error: "You can only update your own products" });
        }
        const updated = await Product_1.default.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updated);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.updateProduct = updateProduct;
/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Delete product (Admin or owning Vendor)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 */
const deleteProduct = async (req, res) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const user = req.user;
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }
        const product = await Product_1.default.findById(id);
        if (!product)
            return res.status(404).json({ error: "Product not found" });
        if (user.role === "vendor" && product.vendor.toString() !== user._id.toString()) {
            return res.status(403).json({ error: "You can only delete your own products" });
        }
        await product.deleteOne();
        res.json({ message: "Product deleted successfully" });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.deleteProduct = deleteProduct;
/**
 * @swagger
 * /api/products:
 *   delete:
 *     summary: Delete all products
 *     description: Admin only – deletes all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All products deleted
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
const deleteAllProducts = async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== "admin") {
            return res.status(403).json({ error: "Only admins can delete all products" });
        }
        await Product_1.default.deleteMany({});
        res.status(200).json({ message: "All products deleted successfully!" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteAllProducts = deleteAllProducts;
//# sourceMappingURL=productController.js.map