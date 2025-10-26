import { Request, Response, NextFunction } from 'express';
import { validationResult, body, param } from 'express-validator';

export const validateApproval = [
  param('id').notEmpty().withMessage('Review ID is required'),
  body('isApproved')
    .isBoolean()
    .withMessage('isApproved must be a boolean'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

export const validateListingId = [
  param('id')
    .notEmpty()
    .withMessage('Listing ID is required')
    .isString()
    .withMessage('Listing ID must be a string'),
    
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];