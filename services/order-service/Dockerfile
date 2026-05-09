FROM node:20-alpine
WORKDIR /app
COPY packages/shared/ ./packages/shared/
COPY services/order-service/package.json services/order-service/package-lock.json* ./
RUN npm install
COPY services/order-service/ .
RUN npm run prisma:generate
RUN npm run build
EXPOSE 3003
CMD ["npm", "start"]
