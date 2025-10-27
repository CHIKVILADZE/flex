import { Router } from 'express';
import { ReviewsController } from '../controllers/reviews.controller';
import { validateApproval, validateListingId } from '../middleware/validator';

const router = Router();
const controller = new ReviewsController();

router.get('/all', controller.getAllReviews.bind(controller));
router.get('/hostaway', controller.getHostawayReviews.bind(controller));
router.get('/stats', controller.getReviewStats.bind(controller));
router.get('/listing/:id', validateListingId, controller.getReviewsByListing.bind(controller));
router.get('/approved', controller.getApprovedReviews.bind(controller));
router.patch('/:id/approval', validateApproval, controller.updateReviewApproval.bind(controller));

router.get('/google/search', controller.searchGooglePlaces.bind(controller));
router.get('/google/:placeId', controller.getGoogleReviews.bind(controller));

export default router;