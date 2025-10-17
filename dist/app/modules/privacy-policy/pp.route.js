"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivacyPolicyRoutes = void 0;
const express_1 = require("express");
const pp_controller_1 = require("./pp.controller");
const router = (0, express_1.Router)();
router.post('/create-privacy-policy', pp_controller_1.PrivacyPolicyController.createPrivacyPolicy);
router.get('/', pp_controller_1.PrivacyPolicyController.getPrivacyPolicy);
exports.PrivacyPolicyRoutes = router;
