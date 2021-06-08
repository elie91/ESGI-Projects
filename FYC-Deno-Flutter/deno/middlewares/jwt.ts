import {Context, Status, verify} from "../deps.ts";

export const JwtConfig = {
    header: "Authorization",
    schema: "Bearer",
    secretKey: "CkL6MPRxdcxhtna7",
    expirationTime: 60000,
    type: "JWT",
    alg: "HS256",
};

export async function jwtAuth(ctx: Context, next: () => Promise<void>) {
    const token = ctx.request.headers.get(JwtConfig.header)?.replace(`${JwtConfig.schema} `, "");
    if (!token) {
        ctx.response.status = Status.Unauthorized;
        ctx.response.body = {message: "Unauthorized"};
        return;
    }

    verify(token, JwtConfig.secretKey, "HS256").then((result: any) => {
        if (!result) {
            ctx.response.status = Status.Unauthorized;
            ctx.response.body = {message: "Wrong Token"};
            return;
        } else {
            ctx.state.userId = result.id
        }
    })

    await next();
}
