import { Model, ModelCtor } from 'sequelize-typescript';
import { User } from './User.model';


export const MODELS: ModelCtor<Model<any, any>>[] = [
    User
];
