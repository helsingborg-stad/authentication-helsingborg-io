# Use node-alpine as a base (30x smaller size being the major selling point)
FROM node:11.14.0-alpine

# Create the folder for the app and set it as the workplace (commands will be ran from here)
WORKDIR /app

# Copy package.json and package-lock.json to /app
COPY package*.json ./

# Install node modules
RUN npm install

# Copy the rest of the app
COPY . ./

# Start the node server
CMD ["npm", "start"]
