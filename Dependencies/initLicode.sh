#!/usr/bin/env bash

PIPROOT=`pwd`/SATR
LICODEROOT=`pwd`/licode
ROOT=`pwd`/licode
BUILD_DIR=$ROOT/build
CURRENT_DIR=`pwd`
EXTRAS=$ROOT/extras

export PATH=$PATH:/usr/local/sbin

if ! pgrep -f rabbitmq; then
  sudo echo
  sudo rabbitmq-server > $BUILD_DIR/rabbit.log &
fi

sleep 5

cd $LICODEROOT/nuve
./initNuve.sh

sleep 5

export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$ROOT/erizo/build/erizo:$ROOT/erizo:$ROOT/build/libdeps/build/lib
export ERIZO_HOME=/erizo/

cd $LICODEROOT/erizo_controller
./initErizo_controller.sh
./initErizo_agent.sh

cp -fv $LICODEROOT/erizo_controller/erizoClient/dist/erizo.js $APPROOT/
cp -fv $LICODEROOT/nuve/nuveClient/dist/nuve.js $APPROOT/

echo [licode] Done.
