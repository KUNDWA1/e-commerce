import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';
import Category from '../models/Categories';
import { IUser } from '../models/User';

// Get all products (public)
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().populate('category').populate('vendor', 'name email');
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Create product (Admin & Vendor)
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

// Update product (Admin or owning Vendor)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const user = (req as any).user as IUser;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // Vendors can only update their own product
    if (user.role === "vendor" && product.vendor.toString() !== user._id.toString()) {
      return res.status(403).json({ error: "You can only update your own products" });
    }

    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Delete product (Admin or owning Vendor)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const user = (req as any).user as IUser;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // Vendors can only delete their own product
    if (user.role === "vendor" && product.vendor.toString() !== user._id.toString()) {
      return res.status(403).json({ error: "You can only delete your own products" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Delete all products (Admin only)
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
