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
const express_1 = require("express");
const user_module_1 = __importDefault(require("../modules/user/user.module"));
const user_schema_1 = require("../schema/user.schema");
const validation_middlewares_1 = require("../middlewares/validation.middlewares");
const user_schema_2 = require("../schema/user.schema");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_service_1 = __importDefault(require("../service/auth.service"));
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const router = (0, express_1.Router)();
// login
router.post("/login", (0, validation_middlewares_1.validade)(user_schema_1.loginSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const lowCaseEmail = email.toLowerCase();
    if (!email || !password) {
        res.status(403).json({
            message: "erro informe as credenciais",
        });
        return;
    }
    try {
        const user = (yield user_module_1.default.findOne({ email: lowCaseEmail }));
        if (!(user === null || user === void 0 ? void 0 : user.password)) {
            res.status(400).json({ message: "user not exists" });
            return;
        }
        const userSenha = bcryptjs_1.default.compareSync(password, user === null || user === void 0 ? void 0 : user.password);
        if (!userSenha) {
            res.status(400).json({ message: "Senha ou email estão incorretos" });
            return;
        }
        res.status(200).json({
            message: "Sucesso!",
            token: (0, auth_service_1.default)(user._id),
            expiresIn: 86400,
        });
    }
    catch (err) {
        res.status(500).json({ message: "Error creating user", err });
        return;
    }
}));
// criar usuario
router.post("/user", (0, validation_middlewares_1.validade)(user_schema_2.userSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(403).json({
            message: `${!name ? "Name" : !email ? "Email" : "Password"} is not found!`,
        });
        return;
    }
    const lowCaseEmail = email.toLowerCase();
    try {
        const validaEmail = yield user_module_1.default.findOne({ email: lowCaseEmail });
        //valida se o email cadastrado já esta em uso
        if (validaEmail) {
            res.status(400).json({ message: "email already used!" });
            return;
        }
        // faz a criptografia da senha
        const passHash = bcryptjs_1.default.hashSync(password, 10);
        const newUser = {
            name: name,
            email: lowCaseEmail,
            password: passHash,
        };
        // insere os dados no banco
        const user = yield user_module_1.default.create(newUser);
        res.status(201).json({
            message: "User created!",
            id: user._id,
            createdAt: user.createdAt,
        });
    }
    catch (err) {
        res.status(500).json({ message: "Error creating user", err });
        return;
    }
}));
router.get("/users", auth_middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const user = req.user;
    try {
        const users = yield user_module_1.default.find().lean().select("-password -__v");
        res.status(200).json({ users });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}));
router.get("/users/:id", auth_middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        // populate tras os dados que estao vinculados por id
        // posso passar argumentos dentro do populate(
        // path: "books",
        // select: "title isbn publishedDate",)
        const user = yield user_module_1.default
            .findById(userId)
            .populate({
            path: "books",
            select: "-author -__v",
        })
            .select("-password -__v");
        if (!user) {
            res.status(404).json({
                message: "user not found",
            });
            return;
        }
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching user", err });
    }
}));
exports.default = router;
