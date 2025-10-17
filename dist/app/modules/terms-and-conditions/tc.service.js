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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermsAndConditionsService = void 0;
const tc_model_1 = require("./tc.model");
const createTermsAndConditionsToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(payload);
    const result = yield tc_model_1.TermsAndConditions.findOneAndReplace({}, { content: payload.content }, {
        new: true,
        upsert: true,
    });
    return result;
});
const getTermsAndConditionsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tc_model_1.TermsAndConditions.find();
    return result[0];
});
exports.TermsAndConditionsService = {
    createTermsAndConditionsToDB,
    getTermsAndConditionsFromDB,
};
