FROM node:14-alpine

RUN mkdir /app
WORKDIR /app

RUN npm install moleculer-cli -g

#use this if you're going to bind mount the host dir on the container workdir
COPY package.json ./

#use this if you're using named, anonymous volumes or not mounting anything
#COPY . .

RUN npm install

#npm i --package-lock-only has to be run here because its after the binding of the volumes
#otherwise, package-lock updates will not persist
CMD npm i --package-lock-only && sleep infinity
