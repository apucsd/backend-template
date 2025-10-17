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
exports.FAQService = void 0;
const QueryBuilder_1 = __importDefault(require("../../../builder/QueryBuilder"));
const faq_model_1 = require("./faq.model");
const createFAQToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield faq_model_1.FAQ.create(payload);
    if (!result) {
        throw new Error('Failed to create FAQ');
    }
    return result;
});
const getFAQById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield faq_model_1.FAQ.findById(id);
    if (!result) {
        throw new Error('FAQ not found');
    }
    return result;
});
const updateFAQToDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingFAQ = yield faq_model_1.FAQ.findById(id);
    if (!existingFAQ) {
        throw new Error('FAQ not found');
    }
    const result = yield faq_model_1.FAQ.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
});
const getAllFAQsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const faqQuery = yield new QueryBuilder_1.default(faq_model_1.FAQ.find(), query)
        .search(['question', 'answer'])
        .filter()
        .paginate()
        .sort()
        .fields();
    const meta = yield faqQuery.countTotal();
    const result = yield faqQuery.modelQuery;
    if (!result) {
        throw new Error('Failed to get FAQs');
    }
    return { result, meta };
});
const getActiveFAQsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield faq_model_1.FAQ.find({ isActive: true });
    return result;
});
const deleteFAQFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield faq_model_1.FAQ.findByIdAndDelete(id);
    if (!result) {
        throw new Error('This FAQ is not found');
    }
    return result;
});
exports.FAQService = {
    createFAQToDB,
    getFAQById,
    updateFAQToDB,
    getAllFAQsFromDB,
    getActiveFAQsFromDB,
    deleteFAQFromDB,
};
