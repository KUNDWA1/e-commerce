import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';
import Category from '../models/Categories';

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find().populate('category');
        res.json(products);
    } catch (error: any) {
        res.status(500).json({ error: "Server error" });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, price, category, inStock } = req.body;

        if (!category || !mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({ error: "Category ID is invalid" });
        }

        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(404).json({ error: "Category not found in database" });
        }

        const newProduct = new Product({ 
            name, 
            price, 
            category, 
            inStock: inStock !== undefined ? inStock : true 
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Product ID is invalid" });
        }

        const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: "Product not found in database" });
        
        res.json(updated);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Product ID is invalid" });
        }

        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ error: "Product not found in database" });
        res.json({ message: "Product deleted successfully" });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteAllProducts = async (req: Request, res: Response) => {
    try {
        await Product.deleteMany({});
        res.status(200).json({ message: "All products deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete all products" });
    }
};