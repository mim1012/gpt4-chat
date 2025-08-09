# Use Node.js 18
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies using npm install
RUN npm install --legacy-peer-deps

# Copy all files
COPY . .

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]