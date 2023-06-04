#!/bin/bash

SRC_DIR=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

rm -v /home/site/wwwroot/*

cp -r $SRC_DIR/rest_api/build/* /home/site/wwwroot/