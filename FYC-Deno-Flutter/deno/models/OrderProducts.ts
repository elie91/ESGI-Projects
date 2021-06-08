import {Model, DataTypes, Relationships} from '../deps.ts';
import Order from "./Order.ts";
import Product from "./Product.ts";

class OrderProductsModel extends Model {

    static table = 'order_products';

    static fields = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        quantity: DataTypes.INTEGER,
        orderId: Relationships.belongsTo(Order),
        productId: Relationships.belongsTo(Product),
    }

    id!: number;
    quantity!: number;
    static products () {}
    static order() {}
}

export default OrderProductsModel;

