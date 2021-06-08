import {DataTypes, Model} from "../deps.ts";

class ProductModel extends Model {

    static table = 'products';
    static timestamps = true;

    static fields = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: DataTypes.string(50),
        price: DataTypes.FLOAT,
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }

    id!: string;
    name!: string;
    price!: number;
    description!: string;
    image!: string;
}

export default ProductModel;
