"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validade = void 0;
const validade = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    }
    catch (err) {
        res.status(400).json({ error: err.errors });
    }
};
exports.validade = validade;
