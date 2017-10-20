import { Model, Document } from 'mongoose';
export interface IDBBaseAPI<doc extends Document> {
   _model: Model<doc>;
}
