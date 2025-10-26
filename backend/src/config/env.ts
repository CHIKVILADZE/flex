import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  hostaway: {
    accountId: process.env.HOSTAWAY_ACCOUNT_ID || '',
    apiKey: process.env.HOSTAWAY_API_KEY || '',
    baseUrl: process.env.HOSTAWAY_BASE_URL || 'https://api.hostaway.com/v1',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL || '3600000'),
  },
  google: {
    placesApiKey: process.env.GOOGLE_PLACES_API_KEY || '',
    placeIds: process.env.GOOGLE_PLACE_IDS?.split(',') || [],
  },
};