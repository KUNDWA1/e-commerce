import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Category from '../models/Categories';

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const newCat = new Category(req.body);
        await newCat.save();
        res.status(201).json(newCat);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

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

export const deleteAllCategories = async (req: Request, res: Response) => {
    try {
        await Category.deleteMany({});
        res.status(200).json({ message: " All Categories deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete all categories" });
    }
};