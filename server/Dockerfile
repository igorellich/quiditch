FROM node:22-alpine

WORKDIR /app
# ADD ./common/ ./common
# ADD ./server/src ./server/src
WORKDIR /app/server
EXPOSE 3000
EXPOSE 9229
COPY server/package.json .
COPY server/package-lock.json .
RUN npm install
COPY server/tsconfig.json .
COPY server/nest-cli.json .


CMD ["npm", "run", "start:debug"]