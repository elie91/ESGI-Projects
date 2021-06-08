import {Router} from "../deps.ts";
import {login} from "../actions/security.ts";

export default function securityRoutes(router: Router) {
    return router
        .post('/login', login)
}
