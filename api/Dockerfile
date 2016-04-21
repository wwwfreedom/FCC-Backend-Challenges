FROM node:5-onbuild

EXPOSE 3000

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ONBUILD COPY package.json /usr/src/app/
ONBUILD RUN npm install
ONBUILD COPY . /usr/src/app
# ONBUILD RUN npm run deploy:prod

CMD [ "npm", "start" ]