#!/bin/bash

SCRIPTS_DIR=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
SRC_DIR=$(dirname "$SCRIPTS_DIR")

cd $SRC_DIR/rest_api
npm run start