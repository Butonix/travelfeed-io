FROM node:10-alpine

# Setting working directory. All the paths will be relative to WORKDIR
WORKDIR /usr/src/app

# Installing dependencies
COPY package*.json ./
RUN npm install

# Copying source files
COPY . .

# Set build args
ARG MAPBOX_TOKEN
ARG GMAPS_API_KEY
ARG RECAPTCHA_SITE_KEY
ARG CLOUDINARY_CLOUD_NAME
ARG ROOTURL
ARG GRAPHQL_URL

# Building the app
RUN npm run build

# Exposing default port
EXPOSE 3000

# Running the app
CMD [ "npm", "start" ]
