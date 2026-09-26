FROM node:20-bookworm-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN mkdir -p /app/runtime/sessions
ENV NODE_ENV=production
ENV SESSION_DIR=/app/runtime/sessions
ENV DATA_FILE=/app/runtime/nodax.json
EXPOSE 3000
CMD ["npm", "start"]
