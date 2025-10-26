import { Request, Response } from 'express';
import { HostawayService } from '../services/hostaway.service';
import { ReviewNormalizerService } from '../services/reviewNormalizer.service';
import { GoogleReviewsService } from '../services/google.service';
import { cacheService } from '../utils/cache';
import { NormalizedReview } from '../models/review.model';
import { logger } from '../utils/logger';

const approvedReviewsStore = new Map<string, boolean>();
const importedGoogleReviews = new Map<string, NormalizedReview[]>();


export class ReviewsController {
  private hostaway = new HostawayService();
  private normalizer = new ReviewNormalizerService();
  private googleService = new GoogleReviewsService();


  async getHostawayReviews(req: Request, res: Response) {
    try {
      logger.info('Fetching Hostaway reviews');
      
      const cacheKey = 'hostaway-reviews';
      const cached = cacheService.get<NormalizedReview[]>(cacheKey);

      if (cached) {
        logger.info('Returning cached reviews', { count: cached.length });
        
        const withApproval = cached.map(review => ({
          ...review,
          submittedAt: review.submittedAt.toString(),
          isApproved: approvedReviewsStore.get(review.id) || false,
        }));

        return res.json({
          success: true,
          data: withApproval,
          cached: true,
        });
      }

      logger.info('Cache miss - fetching from Hostaway API');
      const rawReviews = await this.hostaway.fetchReviews();
      logger.info('Received reviews from Hostaway', { count: rawReviews.length });
      
      const normalized = this.normalizer.normalizeReviews(rawReviews);

      const withApproval = normalized.map(review => ({
        ...review,
        submittedAt: review.submittedAt.toString(),
        isApproved: approvedReviewsStore.get(review.id) || false,
      }));

      cacheService.set(cacheKey, normalized);
      logger.info('Reviews cached successfully');

      res.json({
        success: true,
        data: withApproval,
        cached: false,
      });
    } catch (error: any) {
      logger.error('Error fetching reviews', {
        error: error.message,
        stack: error.stack
      });
      res.status(500).json({
        success: false,
        error: 'Failed to fetch reviews',
      });
    }
  }

  async getReviewStats(req: Request, res: Response) {
    try {
      logger.info('Calculating review statistics');
      
      const cacheKey = 'hostaway-reviews';
      let hostawayReviews = cacheService.get<NormalizedReview[]>(cacheKey);

      if (!hostawayReviews) {
        logger.info('No cached reviews - fetching from API');
        const rawReviews = await this.hostaway.fetchReviews();
        hostawayReviews = this.normalizer.normalizeReviews(rawReviews);
        cacheService.set(cacheKey, hostawayReviews);
      }

      const allImportedGoogleReviews: NormalizedReview[] = [];
      for (const [placeId, reviews] of importedGoogleReviews.entries()) {
        allImportedGoogleReviews.push(...reviews);
      }

      const allReviews = [...hostawayReviews, ...allImportedGoogleReviews];
      
      const stats = this.normalizer.calculateStats(allReviews);
      logger.info('Statistics calculated', { 
        totalReviews: stats.totalReviews,
        hostawayReviews: hostawayReviews.length,
        googleReviews: allImportedGoogleReviews.length
      });

      res.json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      logger.error('Error calculating stats', {
        error: error.message,
        stack: error.stack
      });
      res.status(500).json({
        success: false,
        error: 'Failed to calculate statistics',
      });
    }
  }


  async getReviewsByListing(req: Request, res: Response) {
    try {
      const { id: listingId } = req.params;
      logger.info('Fetching reviews for listing', { listingId });
      
      const rawReviews = await this.hostaway.fetchReviewsByListing(listingId);
      const normalized = this.normalizer.normalizeReviews(rawReviews);

      const withApproval = normalized.map(review => ({
        ...review,
        submittedAt: review.submittedAt.toString(),
        isApproved: approvedReviewsStore.get(review.id) || false,
      }));

      const filtered = withApproval.filter(r => r.listingId === listingId);
      logger.info('Reviews filtered for listing', {
        listingId,
        count: filtered.length
      });

      res.json({
        success: true,
        data: filtered,
      });
    } catch (error: any) {
      logger.error('Error fetching reviews by listing', {
        listingId: req.params.id,
        error: error.message,
        stack: error.stack
      });
      res.status(500).json({
        success: false,
        error: 'Failed to fetch reviews for listing',
      });
    }
  }


  async getApprovedReviews(req: Request, res: Response) {
    try {
      logger.info('Fetching approved reviews for public display');
      
      const cacheKey = 'hostaway-reviews';
      let reviews = cacheService.get<NormalizedReview[]>(cacheKey);

      if (!reviews) {
        const rawReviews = await this.hostaway.fetchReviews();
        reviews = this.normalizer.normalizeReviews(rawReviews);
        cacheService.set(cacheKey, reviews);
      }

      const approved = reviews
        .filter(review => approvedReviewsStore.get(review.id) === true)
        .map(review => ({
          ...review,
          submittedAt: review.submittedAt.toString(),
          isApproved: true,
        }));

      logger.info('Approved reviews fetched', { count: approved.length });

      res.json({
        success: true,
        data: approved,
      });
    } catch (error: any) {
      logger.error('Error fetching approved reviews', {
        error: error.message,
        stack: error.stack
      });
      res.status(500).json({
        success: false,
        error: 'Failed to fetch approved reviews',
      });
    }
  }


  async updateReviewApproval(req: Request, res: Response) {
    try {
      const { id: reviewId } = req.params;
      const { isApproved } = req.body;

      logger.info('Updating review approval status', {
        reviewId,
        isApproved
      });

      if (typeof isApproved !== 'boolean') {
        logger.warn('Invalid approval request - not boolean', { reviewId });
        return res.status(400).json({
          success: false,
          error: 'isApproved must be a boolean',
        });
      }

      approvedReviewsStore.set(reviewId, isApproved);
      cacheService.del('hostaway-reviews');
      
      logger.info('Review approval updated successfully', {
        reviewId,
        isApproved,
        action: isApproved ? 'approved' : 'rejected'
      });

      res.json({
        success: true,
        data: {
          reviewId,
          isApproved,
        },
      });
    } catch (error: any) {
      logger.error('Error updating review approval', {
        reviewId: req.params.id,
        error: error.message,
        stack: error.stack
      });
      res.status(500).json({
        success: false,
        error: 'Failed to update review approval',
      });
    }
  }

  async searchGooglePlaces(req: Request, res: Response) {
    try {
      const { query } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Query parameter is required',
        });
      }

      logger.info('Searching Google Places', { query });
      const places = await this.googleService.searchPlaces(query);
      
      res.json({
        success: true,
        data: places,
      });
    } catch (error: any) {
      logger.error('Error searching Google Places', { 
        error: error.message,
        stack: error.stack 
      });
      res.status(500).json({
        success: false,
        error: 'Failed to search Google Places',
      });
    }
  }


  async getGoogleReviews(req: Request, res: Response) {
  try {
    const { placeId } = req.params;
    
    if (!placeId) {
      return res.status(400).json({
        success: false,
        error: 'Place ID is required',
      });
    }

    logger.info('Fetching Google reviews for place', { placeId });
    
    const reviews = await this.googleService.getReviewsForProperty(placeId);
    
    importedGoogleReviews.set(placeId, reviews);
    
    logger.info('Google reviews imported and stored', { 
      placeId, 
      count: reviews.length 
    });

    res.json({
      success: true,
      data: reviews,
      message: `Imported ${reviews.length} reviews successfully`,
    });
  } catch (error: any) {
    logger.error('Error fetching Google reviews', {
      placeId: req.params.placeId,
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Google reviews',
    });
   }
 }

  async searchGoogleProperties(req: Request, res: Response) {
    try {
      logger.info('Searching for Flex Living properties on Google');
      
      const properties = await this.googleService.searchFlexLivingProperties();
      
      logger.info('Found Google properties', { count: properties.length });
      
      res.json({ 
        success: true, 
        data: properties,
        totalFound: properties.length
      });
    } catch (error: any) {
      logger.error('Error searching Google properties', { 
        error: error.message, 
        stack: error.stack 
      });
      res.status(500).json({ 
        success: false, 
        error: 'Failed to search Google properties',
        details: error.message
      });
    }
  }


  async getAllReviews(req: Request, res: Response) {
    try {
      logger.info('Fetching all reviews from all sources');
      
      const hostawayReviews = await this.getHostawayReviewsData();
      
      const allImportedGoogleReviews: NormalizedReview[] = [];
      for (const [placeId, reviews] of importedGoogleReviews.entries()) {
        allImportedGoogleReviews.push(...reviews);
      }
      
      const allReviews = [...hostawayReviews, ...allImportedGoogleReviews];
      
      const withApproval = allReviews.map(review => ({
        ...review,
        submittedAt: review.submittedAt.toString(),
        isApproved: approvedReviewsStore.get(review.id) || false,
      }));

      res.json({
        success: true,
        data: withApproval,
      });
    } catch (error: any) {
      logger.error('Error fetching all reviews', {
        error: error.message,
        stack: error.stack
      });
      res.status(500).json({
        success: false,
        error: 'Failed to fetch all reviews',
      });
    }
  }
  


  async getGoogleIntegrationStatus(req: Request, res: Response) {
    try {
      const hasApiKey = !!process.env.GOOGLE_PLACES_API_KEY;
      
      if (!hasApiKey) {
        return res.json({
          success: true,
          data: {
            enabled: false,
            reason: 'Google Places API key not configured',
            findings: {
              feasibility: 'High - Google Places API supports review fetching',
              limitations: [
                'Requires Google Places API key',
                'Limited to 5 reviews per place (Google API limitation)',
                'Requires Google Business Profile for properties',
                'Rate limits apply (1000 requests/day for free tier)'
              ],
              recommendations: [
                'Obtain Google Places API key',
                'Create Google Business Profiles for Flex Living properties',
                'Implement rate limiting and caching',
                'Consider Google My Business API for more comprehensive data'
              ]
            }
          }
        });
      }

      const testSearch = await this.googleService.searchPlaces('Flex Living London');
      
      res.json({
        success: true,
        data: {
          enabled: true,
          apiKeyConfigured: true,
          testResults: {
            searchResults: testSearch.length,
            connectivity: 'OK'
          },
          findings: {
            feasibility: 'High - Successfully integrated with Google Places API',
            capabilities: [
              'Search for Flex Living properties',
              'Fetch property details and reviews',
              'Normalize Google reviews to match Hostaway format',
              'Extract categories from review text using keyword analysis'
            ],
            limitations: [
              'Limited to 5 reviews per place (Google API limitation)',
              'Requires Google Business Profile for properties',
              'Rate limits apply (1000 requests/day for free tier)',
              'Reviews may be limited or filtered by Google'
            ],
            recommendations: [
              'Create Google Business Profiles for all Flex Living properties',
              'Implement comprehensive caching to minimize API calls',
              'Consider upgrading to Google My Business API for more data',
              'Monitor API usage and implement rate limiting'
            ]
          }
        }
      });
    } catch (error: any) {
      logger.error('Error checking Google integration status', { 
        error: error.message, 
        stack: error.stack 
      });
      res.status(500).json({ 
        success: false, 
        error: 'Failed to check Google integration status',
        details: error.message
      });
    }
  }

  


  private async getHostawayReviewsData(): Promise<NormalizedReview[]> {
    try {
      const rawReviews = await this.hostaway.fetchReviews();
      return this.normalizer.normalizeReviews(rawReviews);
    } catch (error) {
      logger.error('Error fetching Hostaway reviews for combined endpoint', error);
      return [];
    }
  }
}