import { Router } from "../deps.ts";
import productRoutes from "./products.ts";
import userRoutes from "./users.ts";
import orderRoutes from "./orders.ts";
import securityRoutes from "./security.ts";

const router = new Router();

productRoutes(router);
userRoutes(router);
orderRoutes(router);
securityRoutes(router);

export default router;
