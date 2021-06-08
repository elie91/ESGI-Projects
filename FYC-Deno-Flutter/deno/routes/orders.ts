import { Router } from "../deps.ts";
import { addOrder, getOrder, getOrders, cancelOrder } from "../actions/orders.ts";
import { jwtAuth } from "../middlewares/jwt.ts";

export default function orderRoutes(router: Router) {
    return router
        .post('/orders', jwtAuth, addOrder)
        .get('/orders/:id', jwtAuth, getOrder)
        .get('/orders', jwtAuth, getOrders)
        .delete('/orders/:id', jwtAuth, cancelOrder)
}

