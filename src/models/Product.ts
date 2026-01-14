import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  category: mongoose.Types.ObjectId;
}

const ProductSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: [true, "Izina ry'igicuruzwa rirakenewe"] 
  },
  price: { 
    type: Number, 
    required: [true, "price"] 
  },
  category: { 
    type: Schema.Types.ObjectId, 
    ref: 'Category', 
    required: [true, "Category ID is required "] 
  },
  inStock: { 
    type: Boolean, 
    default: true 
  },
  
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);