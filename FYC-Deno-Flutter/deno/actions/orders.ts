import OrderModel from "../models/Order.ts";
import ProductModel from "../models/Product.ts";
import {Status} from "../deps.ts";
import OrderProductsModel from "../models/OrderProducts.ts";
import UserModel from "../models/User.ts";
import User from "../models/User.ts";

const getOrders = async ({response, state}: { response: any, state: any }) => {
    if (state.userId) {
        response.body = await OrderModel.where('userId', state.userId).get()
    } else {
        response.body = [];
    }
}

const getOrder = async ({params, response}: { params: { id: string }, response: any }) => {
    const order = await OrderModel.select().find(params.id)

    response.body = {
        ...order,
        products: await OrderModel.where('order_id', order.id)
            .join(ProductModel, ProductModel.field('id'), 'product_id')
            .get()
    }
}

const addOrder = async ({request, response, state}: { request: any, response: any, state: any }) => {
    const data = await request.body().value;
    if (data.products.length > 0) {
        const order = await OrderModel.create([{
            userId: state.userId,
            amount: data.products.reduce(function (acc: any, value: any) {
                return acc + (value.quantity * value.product.price);
            }, 0)
        }]);
        for (const item of data.products) {
            await OrderProductsModel.create([{
                // @ts-ignore
                quantity: item.quantity,
                orderId: order.id,
                productId: item.product.id,
            }]);
        }
        response.status = Status.Created;
        response.body = order;

    } else {
        response.status = Status.BadRequest;
        response.body = {
            message: "An order must contain at least one product!"
        }
    }
}

// @ts-ignore
const cancelOrder = async ({params, response, state}: { params: { id: string }; response: any, state: any }) => {
    const order = await OrderModel
        .join(UserModel, UserModel.field('id'), OrderModel.field('user_id'))
        .where(OrderModel.field('user_id'), state.userId)
        .where(OrderModel.field('id'), params.id)
        .get();

    if (!order) {
        response.status = Status.NotFound;
    } else {
        response.body = await OrderModel.deleteById(params.id);
        response.status = Status.NoContent;
    }
}

export {getOrders, getOrder, addOrder, cancelOrder};
