import mongoose, { Document } from 'mongoose';
export interface ICart extends Document {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    addedAt: Date;
}
declare const _default: mongoose.Model<ICart, {}, {}, {}, mongoose.Document<unknown, {}, ICart, {}, mongoose.DefaultSchemaOptions> & ICart & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICart>;
export default _default;
//# sourceMappingURL=Cart.d.ts.map