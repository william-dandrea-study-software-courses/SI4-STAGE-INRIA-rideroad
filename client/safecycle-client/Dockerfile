

### STAGE 1: Build ###

# We label our stage as 'builder'
FROM node:latest as builder
COPY package.json package-lock.json ./
RUN npm set progress=false && npm config set depth 0 && npm cache clean --force

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i --legacy-peer-deps  && mkdir /ng-app && cp -R ./node_modules ./ng-app
WORKDIR /ng-app
COPY . .
## Build the angular app in production mode and store the artifacts in dist folder
RUN npm run build --prod
### STAGE 2: Setup ###
FROM nginx:alpine
## Copy our default nginx config
COPY nginx.conf /etc/nginx/conf.d/
## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*
## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /ng-app/dist/safecycle-client /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]


# # stage 1
# FROM node:latest as node
# WORKDIR /app
# COPY . .
# RUN npm install
# RUN npm run build --prod
# # stage 2
# FROM nginx:alpine
# COPY --from=node /app/dist/angular-app /usr/share/nginx/html



# FROM nginx:alpine
# COPY nginx.conf /etc/nginx/nginx.conf
# COPY /dist/safecycle-client /usr/share/nginx/html

# docker build -t safecycle-client .   
# docker run --name safecycle-client-container -d -p 8080:80 safecycle-client

# docker build -t safecycle-server .
# docker run --name safecycle-server-container -d -p 8000:8000 safecycle-server
