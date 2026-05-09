FROM node:20-alpine
WORKDIR /app
COPY packages/shared/ ./packages/shared/
COPY services/notification-service/package.json services/notification-service/package-lock.json* ./
RUN npm install
COPY services/notification-service/ .
RUN npm run prisma:generate
RUN npm run build
EXPOSE 3005
CMD ["npm", "start"]
