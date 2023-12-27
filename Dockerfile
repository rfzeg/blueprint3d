# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install npm >= 3 and grunt
RUN npm install -g npm@latest grunt-cli

# Install the dependencies specified in the package.json file
RUN npm install

# Execute TypeScript compilation work defined in Gruntfile
RUN grunt

# Install Python and other required packages
RUN apt-get update && apt-get install -y python3

# Expose the port for the local server
EXPOSE 8000

# Change to the example directory
WORKDIR /app/example

# Set up a local server using Python with custom bind address
CMD [ "python3", "-m", "http.server", "8000", "--bind", "172.17.0.2" ]