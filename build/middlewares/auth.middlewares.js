"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const user_module_1 = __importDefault(require("../modules/user/user.module"));
const JWT_SECRET = process.env.KEY_JWT;
function authMiddleware(req, res, next) {
    const tokenHeaders = req.headers.authorization;
    if (!tokenHeaders) {
        res.status(401).json({ message: "token not informat!" });
        return;
    }
    const divideToken = tokenHeaders === null || tokenHeaders === void 0 ? void 0 : tokenHeaders.split(" ");
    if ((divideToken === null || divideToken === void 0 ? void 0 : divideToken.length) !== 2) {
        res.status(401).json({ message: "token invalido" });
        return;
    }
    const [bearer, token] = divideToken;
    if (!/^Bearer$/i.test(bearer)) {
        res.status(401).send({ message: "Token fora do formato Bearer" });
        return;
    }
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
        if (err) {
            res.status(401).json({ message: "Invalid token!" });
            return;
        }
        if (!decoded || !decoded.id) {
            res.status(401).json({ message: "Invalid token payload!" });
            return;
        }
        const user = yield user_module_1.default
            .findById(decoded.id)
            .lean()
            .select("-password");
        if (!user || !user._id) {
            res.status(401).send({ message: "token invalido" });
            return;
        }
        req.user = user;
        next();
    }));
}
