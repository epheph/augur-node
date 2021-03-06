#!/usr/bin/env node

"use strict";

var WebSocket = require("ws");

// var request = {
//   id: 1,
//   jsonrpc: "2.0",
//   method: "getMarketInfo",
//   params: {
//     market: "0x0000000000000000000000000000000000000001"
//   }
// };

// var request = {
//   id: 2,
//   jsonrpc: "2.0",
//   method: "getAccountTransferHistory",
//   params: {
//     account: "0x0000000000000000000000000000000000000b0b",
//     token: null
//   }
// };

var request = {
  id: 3,
  jsonrpc: "2.0",
  method: "getOpenOrders",
  params: {
    market: "0x0000000000000000000000000000000000000001",
    outcome: null,
    orderType: "buy",
    creator: null
  }
};

var ws = new WebSocket("ws://127.0.0.1:8080");

ws.on("open", function () {
  ws.send(JSON.stringify(request));
});

ws.on("message", function (response) {
  console.log(JSON.stringify(JSON.parse(response), null, 2));
  ws.close();
});
