var XLSX = require('xlsx');
const NEON = require('@cityofzion/neon-js');
const { api, wallet, u } = NEON;

var net = "MainNet";
var account;
var scriptHash;

// Read addresses and token ammount excel file
function parseExcelFile(excel_path) {
    // Checking for excel path
    if (excel_path === null || excel_path === '') {
        throw new Error('Excel file path is null or epty');
    }
    var workbook = XLSX.readFile(excel_path);
    var sheet_name_list = workbook.SheetNames;
    var data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    return data;
};

// Unlock NEP-6 standart wallet storage
function unlockWallet(nep6_path, pk) {
    // Checking for nep-6 json file
    if (nep6_path === null || nep6_path === '') {
        throw new Error('NEP-6.json file path is null or empty');
    }
    var w = wallet.Wallet.readFile(nep6_path);
    w.decryptAll(pk);
    return w.accounts;
};

// Math selected account address to walet addresses
function matchAccount(accounts, acc) {
    // Checking for address
    var matched = false;
    for (i = 0; i < accounts.length; i++) {
        if (accounts[i].address === acc) {
            return accounts[i];
        }
        if (matched) {
            break;
        }
    }
    if (!matched) {
        throw new Error("Selected account address doen't matched in wallet");
    }
}

// Setup token script hash
function setUpTokenHash(sh) {
    if (sh === null && sh === ''){
        throw new Error();
    }
    scriptHash = sh;
}

function transfer(target) {
    console.log("Starting transfer " + target.Amount + " to " + target.Address);
    NEON.api.doInvoke({
        net: net,
        account: account,
        intents: api.makeIntent({ GAS: 0.00000001 }, account.address),
        script: {
            scriptHash: scriptHash,
            operation: 'transfer',
            args: [
                u.reverseHex(wallet.getScriptHashFromAddress(account.address)),
                u.reverseHex(wallet.getScriptHashFromAddress(target.Address)),
                new u.Fixed8(target.Amount).toReverseHex(),
            ],
        },
    })
    .then(resp => {
        console.log(resp);
    })
    .catch(err => {
        console.log(err);
    });
}

const distibution = (excel_path, nep6_path, acc, pk, sh) => {
    var data = parseExcelFile(excel_path);
    var accounts = unlockWallet(nep6_path, pk);
    account = matchAccount(accounts, acc);
    setUpTokenHash(sh);

    for (var i = 0; i < data.length; i++) {
        transfer(data[i]);
    }
};

module.exports.distibution = distibution;