FROM node:20-alpine

WORKDIR /app

COPY backend/package.json backend/pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod

COPY backend/dist ./dist

EXPOSE 4000
CMD ["node", "dist/index.js"]
