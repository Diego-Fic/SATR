#!/usr/bin/env bash

PIROOT=`pwd`/SATR
LIROOT=`pwd`/SATR/Dependencies/licode
ROOT=`pwd`/SATR/Dependencies/licode
BUILD_DIR=$ROOT/build
CURRENT_DIR=`pwd`
EXTRAS=$ROOT/extras

export PATH=$PATH:/usr/local/sbin

if ! pgrep -f rabbitmq; then
  sudo echo
  sudo rabbitmq-server > $BUILD_DIR/rabbit.log &
fi

sleep 5

cd $LIROOT/nuve
./initNuve.sh

sleep 5

export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$ROOT/erizo/build/erizo:$ROOT/erizo:$ROOT/build/libdeps/build/lib
export ERIZO_HOME=/erizo/

cd $LIROOT/erizo_controller
./initErizo_controller.sh
./initErizo_agent.sh

cp -fv $LIROOT/erizo_controller/erizoClient/dist/erizo.js $PIROOT/
cp -fv $LIROOT/nuve/nuveClient/dist/nuve.js $PIROOT/

echo [licode] Done.
