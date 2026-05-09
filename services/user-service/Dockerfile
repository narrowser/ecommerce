FROM node:20-alpine
WORKDIR /app
COPY packages/shared/ ./packages/shared/
COPY services/user-service/package.json services/user-service/package-lock.json* ./
RUN npm install
COPY services/user-service/ .
RUN npm run prisma:generate
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
