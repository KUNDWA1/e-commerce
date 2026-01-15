import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  category: mongoose.Types.ObjectId;
  inStock: boolean;
  vendor: mongoose.Types.ObjectId; // who created the product
}

const ProductSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: [true, "Product name is required"] 
  },
  price: { 
    type: Number, 
    required: [true, "Product price is required"] 
  },
  category: { 
    type: Schema.Types.ObjectId, 
    ref: 'Category', 
    required: [true, "Category ID is required"] 
  },
  inStock: { 
    type: Boolean, 
    default: true 
  },
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
