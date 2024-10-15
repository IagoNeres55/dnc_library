"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const JWT_SECRET = process.env.KEY_JWT;
if (!JWT_SECRET) {
    throw new Error("not exist key");
}
function generateToken(user) {
    const id = user;
    return jsonwebtoken_1.default.sign({ id }, JWT_SECRET, {
        expiresIn: "24h",
    });
}
exports.default = generateToken;
