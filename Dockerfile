FROM node:9.8-alpine
MAINTAINER zhyjor

ADD . /app/
WORKDIR /app

CMD ["npm","config","registry","https://registry.npm.taobao.org"]
CMD ["npm","config","disturl","https://npm.taobao.org/dist"]
CMD ["npm","config","puppeteer_download_host","https://npm.taobao.org/mirrors"]

RUN npm install

EXPOSE 3000

CMD ["npm","start"]
