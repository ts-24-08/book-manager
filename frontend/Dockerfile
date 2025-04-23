# Use the official Node.js runtime as the base image
FROM node:current-slim AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the entire application code to the container
COPY . .

ENV VITE_API_URL=/api

# Build the React app for production
RUN npm run build


FROM nginx:alpine


# Copy the built React app to Nginx's web server directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy ssl Certs to nginx
#COPY ./bookmanager.local-key.pem /etc/ssl
#COPY ./bookmanager.local.pem /etc/ssl

# Copy Reverse Proxy configuration file to Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the Nginx server
EXPOSE 80

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]