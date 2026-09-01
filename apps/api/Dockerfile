FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY deploy/ ./
USER node
EXPOSE 3001
CMD ["node", "dist/main.js"]
