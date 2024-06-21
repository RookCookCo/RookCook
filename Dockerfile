# Use an official Ubuntu runtime as a parent image
FROM ubuntu:latest

# Install necessary dependencies
RUN apt-get update && \
    apt-get install -y curl && \
    apt-get install -y git

# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs

# Verify installation
RUN node -v
RUN npm -v

# Set the working directory in the container
WORKDIR /app

# Copy your application code to the working directory
COPY . .

# Install npm dependencies if your application requires
RUN npm install

# Expose port 3000 (if your application uses it)
EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]
