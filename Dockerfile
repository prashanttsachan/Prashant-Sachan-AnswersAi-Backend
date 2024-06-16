FROM node:20.14.0-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

ADD package*.json ./
RUN npm install

ENV NODE_ENV dev
ENV APP_URL http://localhost:5011
ENV APP_PORT 5011

# Database credentials
ENV DB_HOST srv685.hstgr.io
ENV DB_USER u157026392_answer_ai
ENV DB_PASS V&4kCO!399a
ENV DB_NAME u157026392_answer_ai

# Logger configuration
ENV LOG_FOLDER logs/
ENV LOG_FILE %DATE%-app-log.log
ENV LOG_LEVEL error

ENV JWT_SECRET hydV3HclOnvLabr7zh9K2pfVCPH5xchF5Wx/CY8t898=
ENV JWT_ACCESS_EXPIRATION_MINUTES 15
ENV JWT_REFRESH_EXPIRATION_DAYS 10
ENV JWT_RESET_PASSWORD_EXPIRATION_MINUTES 10
ENV JWT_VERIFY_EMAIL_EXPIRATION_MINUTES 10

ENV OPEN_API_KEY 

COPY . /usr/src/app

ADD server.js ./
CMD [ "node", "server.js"] bra