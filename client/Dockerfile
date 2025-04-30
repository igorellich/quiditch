FROM node:22-alpine


WORKDIR /app/client
EXPOSE 5173
EXPOSE 9229
COPY ./client/package.json .
RUN npm install
COPY ./client/tsconfig.json .
COPY ./client/vite.config.ts .
COPY ./client/index.html .
COPY ./client/public/ /app/client/public/
COPY /app/client/node_modules ./client/node_modules

CMD ["npm", "run", "dev"]