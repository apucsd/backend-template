import { Router } from 'express';
import { FAQController } from './faq.controller';

const router = Router();

// Create a new FAQ
router.post('/create-faq', FAQController.createFAQ);

// Get all FAQs
router.get('/', FAQController.getAllFAQs);

// Get active FAQs
router.get('/active', FAQController.getActiveFAQs);

// Get a single FAQ by ID
router.get('/:id', FAQController.getFAQById);

// Update a FAQ
router.patch('/:id', FAQController.updateFAQ);

// Delete a FAQ
router.delete('/:id', FAQController.deleteFAQ);

export const FAQRoutes = router;
