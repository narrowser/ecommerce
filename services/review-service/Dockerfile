FROM node:20-alpine
WORKDIR /app
COPY packages/shared/ ./packages/shared/
COPY services/review-service/package.json services/review-service/package-lock.json* ./
RUN npm install
COPY services/review-service/ .
RUN npm run prisma:generate
RUN npm run build
EXPOSE 3006
CMD ["npm", "start"]
