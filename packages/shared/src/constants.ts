export const SERVICE_URLS = {
  USER: process.env.USER_SERVICE_URL || 'http://user-service:3001',
  PRODUCT: process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002',
  ORDER: process.env.ORDER_SERVICE_URL || 'http://order-service:3003',
  PAYMENT: process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3004',
  NOTIFICATION: process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3005',
  REVIEW: process.env.REVIEW_SERVICE_URL || 'http://review-service:3006',
} as const;

export const REDIS_CHANNELS = {
  PAYMENT_SUCCESS: 'payment:success',
  ORDER_SHIPPED: 'order:shipped',
  ORDER_CANCELLED: 'order:cancelled',
  REVIEW_CREATED: 'review:created',
} as const;

export const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret';
export const ACCESS_TOKEN_EXPIRY = '15m';
export const REFRESH_TOKEN_EXPIRY = '7d';
