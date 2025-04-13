
FROM node:22.14.0

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install
COPY . .

# Expose the port your app runs on (default is 3000)
EXPOSE 4000

# Start the app
CMD ["npm", "start"]
