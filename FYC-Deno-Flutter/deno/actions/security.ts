import User from "../models/User.ts";
import {bcrypt, Status} from "../deps.ts";

const generateJwt = async (email: string, password: string) => {
    const user = await User.where("email", email).first();
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return false;
    }
    return User.generateJwt(user.id);
}

const login =  async ({request, response}: {request: any, response: any}) => {
    const result = await request.body().value;
    const jwt = await generateJwt(result.email, result.password);
    if (!jwt) {
        response.status = Status.Forbidden;
    } else {
        response.status = Status.OK;
        response.body = { jwt };
    }

}

export {login};
