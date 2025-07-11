# Use Node.js LTS image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of your code
COPY . .

# Expose the port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
