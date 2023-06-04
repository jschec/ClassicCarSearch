#!/bin/bash

SRC_DIR=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

echo "In the following directory:"
pwd

echo "SCRIPTS_DIR: $SCRIPTS_DIR"
echo "SRC_DIR: $SRC_DIR"

# Remove unnecessary files
rm -rf $SRC_DIR/data_provider
rm -rf $SRC_DIR/front_end
rm -rf $SRC_DIR/hifi_prototype
rm -rf $SRC_DIR/scripts

# Copy build files to root
cp -r $SRC_DIR/rest_api/build/* $SRC_DIR/

rm -rf $SRC_DIR/rest_api