# KETTE asset registry frontend dApp

This repository contains a react app that makes use of [web3.js](https://github.com/ethereum/web3.js/) to directly interact with [KETTE asset registry smart contracts](https://github.com/kette-io/nft-asset-registry-smart-contracts).

## Requirements

##### Meta Mask

This implementation requires the [Meta Mask](https://metamask.io/) plugin in your browser. Alternatively you can use the [Brave](https://brave.com/) browser.

##### NFC

For demonstration purposes, this code relies on a working NFC-Reader. NFC reader capabilites only work in the local development mode.

## Run application
       npm install
       npm run dev

## Architecture Overview

The project comprises of four modules. Each module with its individual repository:

- [fiat frontend](https://github.com/kette-io/nft-asset-registry-fiat-frontend)
- dApp (this repository)
- [backend](https://github.com/kette-io/nft-asset-registry-backend)
- [smart contracts](https://github.com/kette-io/nft-asset-registry-smart-contracts)

![Architecture Overview](https://github.com/kette-io/nft-asset-registry-fiat-frontend/raw/master/readMeImages/architectureOverview.jpg)

## Credits
This dApp is based on [Etherplate by Chuck Bergeron](https://github.com/chuckbergeron/etherplate)