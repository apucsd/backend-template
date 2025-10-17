"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermsAndConditionsRoutes = void 0;
const express_1 = require("express");
const tc_controller_1 = require("./tc.controller");
const router = (0, express_1.Router)();
router.post('/create-terms-and-conditions', tc_controller_1.TermsAndConditionsController.createTermsAndConditions);
router.get('/', tc_controller_1.TermsAndConditionsController.getTermsAndConditions);
exports.TermsAndConditionsRoutes = router;
