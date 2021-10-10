#!/bin/bash

NETWORK="$1"

echo "Migrating to $NETWORK"
truffle migrate --network $NETWORK -f 2
truffle migrate --network $NETWORK -f 3
truffle migrate --network $NETWORK -f 4

rm ./src/abi.json
cp ./artifacts/OwnedWords.json ./src/abi.json