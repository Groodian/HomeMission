#!/bin/sh

docker login registry.code.fbi.h-da.de
docker build -t registry.code.fbi.h-da.de/isttomare/wg-organisierspiel .
docker push registry.code.fbi.h-da.de/isttomare/wg-organisierspiel
