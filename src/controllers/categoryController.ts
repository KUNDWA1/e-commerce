import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Category from '../models/Categories';

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     description: Retrieve a list of all product categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
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
 *                   name:
 *                     type: string
 *                     example: "Desserts"
 *                   description:
 *                     type: string
 *                     example: "Sweet treats and desserts"
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
 *                   example: "Server error"
 */
export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     description: Add a new product category to the database
 *     tags: [Categories]
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
 *             properties:
 *               name:
 *                 type: string
 *                 description: Category name
 *                 example: "Cakes"
 *               description:
 *                 type: string
 *                 description: Category description
 *                 example: "All types of cakes and pastries"
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "507f1f77bcf86cd799439011"
 *                 name:
 *                   type: string
 *                   example: "Cakes"
 *                 description:
 *                   type: string
 *                   example: "All types of cakes and pastries"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request - Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Category validation failed"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
export const createCategory = async (req: Request, res: Response) => {
    try {
        const newCat = new Category(req.body);
        await newCat.save();
        res.status(201).json(newCat);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     description: Remove a specific category from the database by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The category ID to delete
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category deleted"
 *       400:
 *         description: Bad request - Invalid category ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Category ID is invalid"
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Category not found"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "deleted failed"
 */
export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Category ID is invalid" });
        }
        
        const deleted = await Category.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ error: "Category not found" });
        
        res.json({ message: "Category deleted" });
    } catch (error) {
        res.status(500).json({ error: "deleted failed" });
    }
};

/**
 * @swagger
 * /api/categories/clear:
 *   delete:
 *     summary: Delete all categories
 *     description: Remove all categories from the database (Use with caution!)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All categories deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All Categories deleted successfully!"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to delete all categories"
 */
export const deleteAllCategories = async (req: Request, res: Response) => {
    try {
        await Category.deleteMany({});
        res.status(200).json({ message: " All Categories deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete all categories" });
    }
};