# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /home/node/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN yarn config set registry https://registry.npmjs.org/ && yarn install --production=false --network-concurrency 1 --network-timeout 1000000

# Copy the rest of the application code
COPY . .

RUN yarn dev

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["yarn", "dev"]