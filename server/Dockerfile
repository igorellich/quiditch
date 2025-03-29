FROM node:16-alpine

WORKDIR /app
# ADD ./common/ ./common
# ADD ./server/src ./server/src
WORKDIR /app/server
EXPOSE 3000
EXPOSE 9229
COPY server/package.json .
COPY server/tsconfig.json .
COPY server/nest-cli.json .
RUN npm install

CMD ["npm", "run", "start"]