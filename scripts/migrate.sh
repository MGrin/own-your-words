#!/bin/bash

NETWORK="$1"

echo "Migrating to $NETWORK"
echo "Enter the existing contract address:"
read EXISTING_CONTRACT
sed -i '' -e "s/{{EXISITING_ADDRESS}}/$EXISTING_CONTRACT/" "./migrations/4_upgrade.js"

truffle migrate --reset --network $NETWORK -f 4

sed -i '' -e "s/$EXISTING_CONTRACT/{{EXISITING_ADDRESS}}/" "./migrations/4_upgrade.js"

rm ./src/abi.json
cp ./artifacts/OwnedWords.json ./src/abi.json