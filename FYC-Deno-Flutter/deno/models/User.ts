import {DataTypes, Model, bcrypt, create} from "../deps.ts";
import {JwtConfig} from "../middlewares/jwt.ts";

class UserModel extends Model {

    static table = 'users';
    static timestamps = true;

    static fields = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        password: DataTypes.STRING
    }

    static async hashPassword(password: string) {
        const salt = await bcrypt.genSalt(12);
        return bcrypt.hash(password, salt);
    }

    static generateJwt(id: string) {
        return create({alg: "HS256", typ: "JWT"}, {id, exp: Date.now() / 1000 + (3600 * 24)}, JwtConfig.secretKey)
    }

    static orders() {}

    id!: number;
    email!: string;
    lastName!: string;
    firstName!: string;
}

export default UserModel;
