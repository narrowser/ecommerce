export const config = {
  port: parseInt(process.env.PORT || '3003', 10),
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
};
