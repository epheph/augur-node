"use strict";

const unlink = require("fs").unlink;
const join = require("path").join;
const assert = require("chai").assert;
const sqlite3 = require("sqlite3").verbose();
const { checkAugurDbSetup } = require("../../../build/setup/check-augur-db-setup");
const { getAccountTransferHistory } = require("../../../build/server/getters/get-account-transfer-history");

const augurDbPath = join(__dirname, "augur.db");

describe("server/getters/get-account-transfer-history", () => {
  const test = (t) => {
    it(t.description, (done) => {
      const db = new sqlite3.Database(augurDbPath);
      checkAugurDbSetup(db, (err) => {
        getAccountTransferHistory(db, t.params.account, t.params.token, (err, accountTransferHistory) => {
          t.assertions(err, accountTransferHistory);
          unlink(augurDbPath, done);
        });
      });
    });
  };
  test({
    description: "get account transfer history for all tokens",
    params: {
      account: "0x0000000000000000000000000000000000000b0b",
      token: null
    },
    assertions: (err, accountTransferHistory) => {
      assert.isNull(err);
      assert.deepEqual(accountTransferHistory, [{
        transactionHash: "0x00000000000000000000000000000000000000000000000000000000deadbeef",
        logIndex: 0,
        sender: "0x0000000000000000000000000000000000000b0b",
        recipient: "0x000000000000000000000000000000000000d00d",
        token: "0x1000000000000000000000000000000000000000",
        value: 10,
        blockNumber: 1400000
      }, {
        transactionHash: "0x00000000000000000000000000000000000000000000000000000000d3adb33f",
        logIndex: 0,
        sender: "0x000000000000000000000000000000000000d00d",
        recipient: "0x0000000000000000000000000000000000000b0b",
        token: "0x1000000000000000000000000000000000000000",
        value: 2,
        blockNumber: 1400001
      }, {
        transactionHash: "0x00000000000000000000000000000000000000000000000000000000deadb33f",
        logIndex: 1,
        sender: "0x0000000000000000000000000000000000000b0b",
        recipient: "0x000000000000000000000000000000000000d00d",
        token: "0x7a305d9b681fb164dc5ad628b5992177dc66aec8",
        value: 47,
        blockNumber: 1400001
      }]);
    }
  });
  test({
    description: "get account transfer history for REP tokens only",
    params: {
      account: "0x0000000000000000000000000000000000000b0b",
      token: "0x7a305d9b681fb164dc5ad628b5992177dc66aec8"
    },
    assertions: (err, accountTransferHistory) => {
      assert.isNull(err);
      assert.deepEqual(accountTransferHistory, [{
        transactionHash: "0x00000000000000000000000000000000000000000000000000000000deadb33f",
        logIndex: 1,
        sender: "0x0000000000000000000000000000000000000b0b",
        recipient: "0x000000000000000000000000000000000000d00d",
        token: "0x7a305d9b681fb164dc5ad628b5992177dc66aec8",
        value: 47,
        blockNumber: 1400001
      }]);
    }
  });
  test({
    description: "get account transfer history for nonexistent token",
    params: {
      account: "0x0000000000000000000000000000000000000b0b",
      token: "0x000000000000000000000000000000000000000e"
    },
    assertions: (err, accountTransferHistory) => {
      assert.isNull(err);
      assert.deepEqual(accountTransferHistory, []);
    }
  });
  test({
    description: "get account transfer history for nonexistent account",
    params: {
      account: "0x0000000000000000000000000000000000000bbb",
      token: null
    },
    assertions: (err, accountTransferHistory) => {
      assert.isNull(err);
      assert.deepEqual(accountTransferHistory, []);
    }
  });
});
