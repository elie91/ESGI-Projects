import type User from "../interfaces/User.ts";
import UserModel from "../models/User.ts";
import {Status} from "../deps.ts";
import {formatError} from "../helpers/Error.ts";

const getUsers = async ({response}: { response: any }) => {
    response.body = await UserModel.select().all();
};

const getUser = async ({params, response}: { params: { id: string }; response: any }) => {
    response.body = await UserModel.select().find(params.id)
};

const addUser = async (
    {request, response}: { request: any; response: any },
) => {
    const data = await request.body().value;
    const password = await UserModel.hashPassword(data.password);
    const user: User = {
        email: data.email,
        firstName: data.firstname,
        lastName: data.lastname,
        password,
    };

    try {
        // @ts-ignore
        response.body = await UserModel.create([user])
        response.status = Status.Created;
    } catch (e) {
        response.body = {'message': formatError(e)};
        response.status = Status.BadRequest;
    }
};

const updateUser = async ({params, request, response}: { params: { id: string }; request: any; response: any; }) => {
    let user = await UserModel.find(params.id);
    if (user) {
        let data = await request.body().value;
        await UserModel.where('id',params.id).update(data)

        response.body = UserModel.select().find(params.id);
    } else {
        response.status = Status.NotFound;
    }
};

const deleteUser = async ({params, response}: { params: { id: string }; response: any },) => {
    response.body = await UserModel.deleteById(params.id);
    response.status = Status.NoContent;
};

export {getUser, getUsers, addUser, updateUser, deleteUser};
