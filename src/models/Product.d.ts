import mongoose, { Document } from 'mongoose';
export interface IProduct extends Document {
    name: string;
    price: number;
    category: mongoose.Types.ObjectId;
    inStock: boolean;
    vendor: mongoose.Types.ObjectId;
}
declare const _default: mongoose.Model<any, {}, {}, {}, any, any, any>;
export default _default;
//# sourceMappingURL=Product.d.ts.map