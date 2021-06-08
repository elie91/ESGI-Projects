import type Product from "../interfaces/Product.ts";
import ProductModel from "../models/Product.ts";
import {Status} from "../deps.ts";
import {formatError} from "../helpers/Error.ts";

const getProducts = async ({response}: { response: any }) => {
    response.body = await ProductModel.select().all();
};

const getProduct = async ({params, response}: { params: { id: string }; response: any }) => {
    response.body = await ProductModel.select().find(params.id)
};

const addProduct = async (
    {request, response}: { request: any; response: any },
) => {
    let product: Product = await request.body().value;
    try {
        // @ts-ignore
        response.body = await ProductModel.create([product])
        response.status = Status.Created;
    } catch (e) {
        response.body = {'message': formatError(e)};
        response.status = Status.BadRequest;
    }
};

const updateProduct = async ({params, request, response}: { params: { id: string }; request: any; response: any; }) => {
    let product = await ProductModel.find(params.id);
    if (product) {
        let data = await request.body().value;
        await ProductModel.where('id',params.id).update(data)

        response.body = ProductModel.select().find(params.id);
    } else {
        response.status = Status.NotFound;
    }
};

const deleteProduct = async ({params, response}: { params: { id: string }; response: any },) => {
    response.body = await ProductModel.deleteById(params.id);
    response.status = Status.NoContent;
};

export {getProduct, getProducts, addProduct, updateProduct, deleteProduct};
