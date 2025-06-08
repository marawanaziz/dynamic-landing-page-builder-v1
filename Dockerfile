FROM node:18-alpine

WORKDIR /app

# Copy server package files
COPY package*.json ./
RUN npm install

# Copy client package files and install dependencies
COPY client/package*.json ./client/
RUN cd client && npm install

# Copy all files
COPY . .

# Build the React app
RUN cd client && npm run build

# Remove development dependencies from client
RUN cd client && npm prune --production

EXPOSE 3000

CMD ["npm", "start"] 