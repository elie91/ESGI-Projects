import {DataTypes, Model, Relationships} from "../deps.ts";
import User from "./User.ts";

class OrderModel extends Model {

    static table = 'orders';
    static timestamps = true;

    static fields = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        amount: {
            type: DataTypes.FLOAT,
        },
        userId: Relationships.belongsTo(User),
    }


    static products () {}

    static orderProducts() {}

    static user() {}

    id!: number;
    userId!:number;
    amount!:number;
}

export default OrderModel;


