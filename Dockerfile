FROM node:14.15

WORKDIR /usr/src/app

RUN  apt update && apt-get install -y zsh  && \
npm install -g typescript && \
npm install -g @aws-amplify/cli && \
npm install -g create-react-app

