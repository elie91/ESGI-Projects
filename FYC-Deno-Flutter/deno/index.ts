import {Application, Database} from "./deps.ts";
import router from "./routes/index.ts";
import ProductModel from "./models/Product.ts";
import UserModel from "./models/User.ts";
import OrderModel from "./models/Order.ts";
import OrderProductsModel from "./models/OrderProducts.ts";
import {modelRelations} from "./models/relations.ts";

const app = new Application();

const db = new Database({ dialect: 'postgres', debug: true }, {
        database: "deno",
        host: "postgres",
        username: "postgres",
        password: "postgres",
        port: 5432,
    }
);

db.link([
    UserModel,
    OrderModel,
    ProductModel,
    OrderProductsModel,
]);

try {
    await db.sync(/*{drop: true}*/);
    if (db.getConnector()._connected) {
        console.log("Database synced successfully !");
        modelRelations();
    }
} catch (e) {
    console.error("Error database: ", e);
}

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({port: 1337});

await db.close();
