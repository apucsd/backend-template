"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../app/modules/auth/auth.route");
const user_route_1 = require("../app/modules/user/user.route");
const faq_route_1 = require("../app/modules/faqs/faq.route");
const pp_route_1 = require("../app/modules/privacy-policy/pp.route");
const tc_route_1 = require("../app/modules/terms-and-conditions/tc.route");
const router = express_1.default.Router();
const apiRoutes = [
    {
        path: '/users',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/faqs',
        route: faq_route_1.FAQRoutes,
    },
    {
        path: '/privacy-policy',
        route: pp_route_1.PrivacyPolicyRoutes,
    },
    {
        path: '/terms-and-conditions',
        route: tc_route_1.TermsAndConditionsRoutes,
    },
];
apiRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
