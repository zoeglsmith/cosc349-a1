
FROM arm64v8/node:lts-alpine AS arm-builder
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 5000
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]

# Build stage for Intel
FROM node:lts-alpine AS intel-builder
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 5000
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]

# Final stage
FROM scratch
COPY --from=arm-builder /usr/src/app /usr/src/app
COPY --from=intel-builder /usr/src/app /usr/src/app
WORKDIR /usr/src/app
CMD ["npm", "start"]
