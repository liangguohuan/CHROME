#!/bin/bash
# vim: fdm=marker ts=2 sw=2 sts=2 expandtab
# websocketd --port=8484 ./ws.sh

while true
do
  if [ -e DATA.ws ] ; then
    cat DATA.ws
    echo -n > DATA.ws
  fi
  sleep 1
done