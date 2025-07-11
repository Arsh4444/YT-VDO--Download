FROM python:3.11-slim

# Install yt-dlp and ffmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    pip install yt-dlp

# Install Node.js
RUN apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Set working directory
WORKDIR /app

# Copy Node app files
COPY package.json ./
RUN npm install
COPY . .

# Expose the port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
