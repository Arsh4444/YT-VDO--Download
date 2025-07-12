FROM python:3.11-slim

# Install dependencies
RUN apt-get update && apt-get install -y ffmpeg curl

# Install yt-dlp globally
RUN pip install yt-dlp

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Expose port
EXPOSE 8080

# Start server
CMD ["node", "server.js"]
