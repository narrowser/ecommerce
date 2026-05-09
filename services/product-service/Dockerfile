FROM node:20-alpine
WORKDIR /app
COPY packages/shared/ ./packages/shared/
COPY services/product-service/package.json services/product-service/package-lock.json* ./
RUN npm install
COPY services/product-service/ .
RUN npm run prisma:generate
RUN npm run build
EXPOSE 3002
CMD ["npm", "start"]
