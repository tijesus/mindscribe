#!/bin/env bash

npm run build && scp -i /home/praise-afk/Desktop/mindscribe.pem -r ./build/ ubuntu@mindscribeclient.praiseafk.tech:/var/www/mindscribe.praiseafk.tech/


