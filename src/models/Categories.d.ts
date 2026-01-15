import mongoose, { Document } from 'mongoose';
export interface ICategory extends Document {
    name: string;
    description: string;
}
declare const _default: mongoose.Model<ICategory, {}, {}, {}, mongoose.Document<unknown, {}, ICategory, {}, mongoose.DefaultSchemaOptions> & ICategory & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICategory>;
export default _default;
//# sourceMappingURL=Categories.d.ts.map