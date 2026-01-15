import { Request, Response } from 'express';
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
export declare const getCart: (req: Request, res: Response) => Promise<void>;
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
export declare const addToCart: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
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
export declare const removeFromCart: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
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
export declare const clearCart: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=cartController.d.ts.map