FROM node:20-alpine
WORKDIR /app
COPY packages/shared/ ./packages/shared/
COPY services/payment-service/package.json services/payment-service/package-lock.json* ./
RUN npm install
COPY services/payment-service/ .
RUN npm run prisma:generate
RUN npm run build
EXPOSE 3004
CMD ["npm", "start"]
