import OrderModel from "./Order.ts";
import ProductModel from "./Product.ts";
import UserModel from "./User.ts";
import OrderProductsModel from "./OrderProducts.ts";

export function modelRelations() {
    UserModel.orders = () => UserModel.hasMany(OrderModel)
    OrderModel.products = () => OrderModel.hasMany(ProductModel)
    OrderModel.user = () => OrderModel.hasOne(UserModel)
    OrderModel.orderProducts = () => OrderModel.hasMany(OrderProductsModel)
    OrderProductsModel.order = () => OrderProductsModel.hasOne(OrderModel)
    OrderProductsModel.products = () => OrderProductsModel.hasMany(ProductModel)
}
