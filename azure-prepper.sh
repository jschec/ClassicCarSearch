#!/bin/bash

SRC_DIR=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
DEST_DIR=/home/site/wwwroot

# Remove unnecessary files
rm -rf $SRC_DIR/data_provider
rm -rf $SRC_DIR/front_end
rm -rf $SRC_DIR/hifi_prototype
rm -rf $SRC_DIR/scripts

rm -v $DEST_DIR/*

cd $SRC_DIR/rest_api
npm install
cp -r ./build/* $DEST_DIR/
mkdir $DEST_DIR/node_modules
cp -r ./node_modules/* $DEST_DIR/node_modules/

rm -rf $SRC_DIR/rest_api