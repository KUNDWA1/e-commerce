"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeFromCart = exports.addToCart = exports.getCart = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Cart_1 = __importDefault(require("../models/Cart"));
const Product_1 = __importDefault(require("../models/Product"));
/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get all cart items
 *     description: Retrieve all items in the shopping cart with populated product details
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "507f1f77bcf86cd799439011"
 *                   productId:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "507f1f77bcf86cd799439012"
 *                       name:
 *                         type: string
 *                         example: "Chocolate Cake"
 *                       price:
 *                         type: number
 *                         example: 25.99
 *                       description:
 *                         type: string
 *                         example: "Delicious chocolate cake"
 *                   quantity:
 *                     type: number
 *                     example: 2
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "not found"
 */
const getCart = async (req, res) => {
    try {
        const items = await Cart_1.default.find().populate('productId');
        res.json(items);
    }
    catch (error) {
        res.status(500).json({ error: "not found" });
    }
};
exports.getCart = getCart;
/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add item to cart
 *     description: Add a product to the shopping cart with specified quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The ID of the product to add
 *                 example: "507f1f77bcf86cd799439012"
 *               quantity:
 *                 type: number
 *                 description: Quantity of the product (defaults to 1)
 *                 minimum: 1
 *                 example: 2
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "507f1f77bcf86cd799439011"
 *                 productId:
 *                   type: string
 *                   example: "507f1f77bcf86cd799439012"
 *                 quantity:
 *                   type: number
 *                   example: 2
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request - Invalid product ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID not found"
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Product not found"
 */
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        if (!productId || !mongoose_1.default.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "ID not found" });
        }
        const productExists = await Product_1.default.findById(productId);
        if (!productExists) {
            return res.status(404).json({ error: "Product not found" });
        }
        const newItem = new Cart_1.default({ productId, quantity: quantity || 1 });
        await newItem.save();
        res.status(201).json(newItem);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.addToCart = addToCart;
/**
 * @swagger
 * /api/cart/{id}:
 *   delete:
 *     summary: Remove item from cart
 *     description: Remove a specific item from the shopping cart by cart item ID
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The cart item ID to remove
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Item removed from cart successfully"
 *       400:
 *         description: Bad request - Invalid cart item ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID of cart is not correct"
 *       404:
 *         description: Cart item not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Item not found in cart"
 */
const removeFromCart = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID of cart is not correct" });
        }
        const deleted = await Cart_1.default.findByIdAndDelete(id);
        if (!deleted)
            return res.status(404).json({ error: "Item not found in cart" });
        res.status(200).json({ message: "Item removed from cart successfully" });
    }
    catch (error) {
        res.status(400).json({ error: "Item removed failed" });
    }
};
exports.removeFromCart = removeFromCart;
/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Clear entire cart
 *     description: Remove all items from the shopping cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cart cleared successfully!"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to clear cart"
 */
const clearCart = async (req, res) => {
    try {
        await Cart_1.default.deleteMany({});
        res.status(200).json({ message: "Cart cleared successfully!" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to clear cart" });
    }
};
exports.clearCart = clearCart;
//# sourceMappingURL=cartController.js.map