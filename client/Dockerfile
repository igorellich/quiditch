FROM node:22-alpine


WORKDIR /app
EXPOSE 5173
# EXPOSE 9229
COPY package.json .
COPY tsconfig.json .
COPY vite.config.ts .
COPY index.html .
COPY public/ /app/public/
RUN npm install

CMD ["npm", "run", "dev"]