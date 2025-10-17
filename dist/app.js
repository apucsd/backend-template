"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./routes"));
const morgen_1 = require("./shared/morgen");
const app = (0, express_1.default)();
//morgan
app.use(morgen_1.Morgan.successHandler);
app.use(morgen_1.Morgan.errorHandler);
//body parser
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
//file retrieve
app.use(express_1.default.static('uploads'));
//router
app.use('/api/v1', routes_1.default);
//live response
app.get('/', (req, res) => {
    res.send(`
            <div style="display:flex; justify-content:center; align-items:center; height:100vh;">
                  <div style="text-align:center;">
                        <h1 style="color:#A55FEF; font-family:Arial, Helvetica, sans-serif; font-size:3rem;">Welcome to my API</h1>
                        <p style="color:#777; font-size:1.5rem;">I'm happy to help you with anything you need.</p>
                  </div>
            </div>
      `);
});
//global error handle
app.use(globalErrorHandler_1.default);
//handle not found route;
app.use((req, res) => {
    res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Not found',
        errorMessages: [
            {
                path: req.originalUrl,
                message: `The API route ${req.originalUrl} doesn't exist. Please contact the API owner if you need help`,
            },
        ],
    });
});
exports.default = app;
