import NodeCache from 'node-cache';

export const cacheService = new NodeCache({
  stdTTL: 3600, 
  checkperiod: 600,
});