import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Cart from '../models/Cart';
import Product from '../models/Product';

export const getCart = async (req: Request, res: Response) => {
    try {
        const items = await Cart.find().populate('productId');
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: "not found" });
    }
};

export const addToCart = async (req: Request, res: Response) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "ID not found" });
        }

        const productExists = await Product.findById(productId);
        if (!productExists) {
            return res.status(404).json({ error: "Product not found" });
        }

        const newItem = new Cart({ productId, quantity: quantity || 1 });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const removeFromCart = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID of cart is not correct" });
        }

        const deleted = await Cart.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ error: "Item not found in cart" });

        res.status(200).json({ message: "Item removed from cart successfully" });
    } catch (error: any) {
        res.status(400).json({ error: "Item removed failed" });
    }
};

export const clearCart = async (req: Request, res: Response) => {
    try {
        await Cart.deleteMany({});
        res.status(200).json({ message: "Cart cleared successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to clear cart" });
    }
};