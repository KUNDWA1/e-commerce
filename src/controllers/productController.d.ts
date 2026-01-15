import { Request, Response } from 'express';
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
export declare const getProducts: (req: Request, res: Response) => Promise<void>;
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
export declare const createProduct: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
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
export declare const updateProduct: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
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
export declare const deleteProduct: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
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
export declare const deleteAllProducts: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=productController.d.ts.map