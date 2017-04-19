#!/usr/bin/env bash

set -e

SCRIPT=`pwd`/$0
FILENAME=`basename $SCRIPT`
PATHNAME=`dirname $SCRIPT`
ROOT=$PATHNAME/..
BUILD_DIR=$ROOT/build
CURRENT_DIR=`pwd`
LIB_DIR=$BUILD_DIR/libdeps
PREFIX_DIR=$LIB_DIR/build/
NVM_CHECK="$PATHNAME"/checkNvm.sh


export ERIZO_HOME=$ROOT/erizo

usage()
{
cat << EOF
usage: $0 options

Compile erizo libraries:
- Erizo is the C++ core
- Erizo API is the Javascript layer of Erizo (require Erizo to be compiled)
- Erizo Controller implements the signaling, communication with clients and room management
- Spine is a node.js based Erizo client

OPTIONS:
   -h      Show this message
   -e      Compile Erizo
   -a      Compile Erizo API
   -c      Install Erizo node modules
   -s      Install Spine
   -t      Run Tests
EOF
}

pause() {
  read -p "$*"
}

check_result() {
  if [ "$1" -ne 0 ]
  then
    exit $1
  fi
}

install_erizo(){
  echo 'Installing erizo...'
  cd $ROOT/erizo
  ./generateProject.sh
  ./buildProject.sh
  check_result $?
  cd $CURRENT_DIR
}

install_erizo_api(){
  echo 'Installing erizoAPI...'
  cd $ROOT/erizoAPI
  . $NVM_CHECK
  nvm use
  npm install nan@2.3.2
  ./build.sh
  check_result $?
  cd $CURRENT_DIR
}

install_erizo_controller(){
  echo 'Installing erizoController...'
  cp $PATHNAME/rtp_media_config_default.js $ROOT/rtp_media_config.js
  cd $ROOT/erizo_controller
  ./installErizo_controller.sh
  check_result $?
  cd $CURRENT_DIR
}

install_spine(){
  echo 'Installing erizo_native_client...'
  cd $ROOT/spine
  ./installSpine.sh
  check_result $?
  cd $CURRENT_DIR
}

execute_tests(){
  echo 'Testing erizo...'
  cd $ROOT/erizo
  ./runTests.sh
  check_result $?
  cd $CURRENT_DIR
}

if [ "$#" -eq 0 ]
then
  install_erizo
  install_erizo_api
  install_erizo_controller
  install_spine
else
  while getopts “heacst” OPTION
  do
    case $OPTION in
      h)
        usage
        exit 1
        ;;
      e)
        install_erizo
        ;;
      a)
        install_erizo_api
        ;;
      c)
        install_erizo_controller
        ;;
      s)
        install_spine
        ;;
      t)
        execute_tests
        ;;
      ?)
        usage
        exit
        ;;
    esac
  done
fi
