# Use an official Node.js runtime as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Bundle app source
COPY *.js ./

# Install dependencies
RUN npm install

# Define the command to run your Node.js application
# CMD ["node", "index.js"]
ENTRYPOINT ["node","."]