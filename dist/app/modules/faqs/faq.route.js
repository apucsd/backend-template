"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FAQRoutes = void 0;
const express_1 = require("express");
const faq_controller_1 = require("./faq.controller");
const router = (0, express_1.Router)();
// Create a new FAQ
router.post('/create-faq', faq_controller_1.FAQController.createFAQ);
// Get all FAQs
router.get('/', faq_controller_1.FAQController.getAllFAQs);
// Get active FAQs
router.get('/active', faq_controller_1.FAQController.getActiveFAQs);
// Get a single FAQ by ID
router.get('/:id', faq_controller_1.FAQController.getFAQById);
// Update a FAQ
router.patch('/:id', faq_controller_1.FAQController.updateFAQ);
// Delete a FAQ
router.delete('/:id', faq_controller_1.FAQController.deleteFAQ);
exports.FAQRoutes = router;
