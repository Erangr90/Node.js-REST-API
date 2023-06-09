FROM node:18-alpine
WORKDIR "/usr/src/app"
COPY ./package.json ./
RUN npm install --only=production
COPY . .
CMD [ "npm","run","start" ]