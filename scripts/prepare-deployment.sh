#!/bin/bash

SCRIPTS_DIR=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
SRC_DIR=$(dirname "$SCRIPTS_DIR")

# Build rest api
cd $SRC_DIR/rest_api
npm run clean && npm run build

# Move to root of repo
cd $SRC_DIR

# Build angular app
cd $SRC_DIR/front_end
npm run clean && npm run build

cd $SRC_DIR
mkdir -p $SRC_DIR/rest_api/build/static
cp -r $SRC_DIR/front_end/dist/front_end/* $SRC_DIR/rest_api/build/static/