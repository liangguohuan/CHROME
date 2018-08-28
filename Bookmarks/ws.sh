#!/bin/bash
# vim: fdm=marker ts=2 sw=2 sts=2 expandtab
# websocketd --port=8484 ./ws.sh

while true
do
  if [ -e WSDATA.txt ] ; then
    cat WSDATA.txt
    echo -n > WSDATA.txt
  fi
  sleep 1
done