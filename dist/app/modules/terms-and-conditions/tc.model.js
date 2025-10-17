"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermsAndConditions = void 0;
const mongoose_1 = require("mongoose");
const TCSchema = new mongoose_1.Schema({
    content: { type: String, required: true },
}, { timestamps: true });
exports.TermsAndConditions = (0, mongoose_1.model)('TermsAndConditions', TCSchema);
