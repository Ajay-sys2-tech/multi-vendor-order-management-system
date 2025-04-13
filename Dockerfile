
FROM node:22-slim

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install
COPY . .

EXPOSE 4000

# Start the app
CMD ["npm", "start"]
