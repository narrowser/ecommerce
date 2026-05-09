export const config = {
  port: parseInt(process.env.PORT || '3005', 10),
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
};
