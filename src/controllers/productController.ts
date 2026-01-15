import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';
import Category from '../models/Categories';
import { IUser } from '../models/User';

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
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find()
      .populate('category')
      .populate('vendor', 'name email');
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

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
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, category, inStock } = req.body;
    const user = (req as any).user as IUser;

    if (!category || !mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ error: "Category ID is invalid" });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ error: "Category not found" });
    }

    const newProduct = new Product({
      name,
      price,
      category,
      inStock: inStock !== undefined ? inStock : true,
      vendor: user._id
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

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
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const user = (req as any).user as IUser;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (user.role === "vendor" && product.vendor.toString() !== user._id.toString()) {
      return res.status(403).json({ error: "You can only update your own products" });
    }

    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

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
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const user = (req as any).user as IUser;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (user.role === "vendor" && product.vendor.toString() !== user._id.toString()) {
      return res.status(403).json({ error: "You can only delete your own products" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

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
export const deleteAllProducts = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as IUser;

    if (user.role !== "admin") {
      return res.status(403).json({ error: "Only admins can delete all products" });
    }

    await Product.deleteMany({});
    res.status(200).json({ message: "All products deleted successfully!" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
