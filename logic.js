var XLSX = require('xlsx');
const NEON = require('@cityofzion/neon-js');
const { api, wallet, u } = NEON;

var account;
var scriptHash;
var timeout = 5000;

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

// Transfer token to address
async function transfer(targets, excel_path) {
    var promises = [];
    var flag = false;
    var balance;
    const balancePromise = api.neonDB.getBalance('MainNet', account.address)
        .then(e => {
            balance = e;
        });
    await balancePromise;
    for (i = 0; i < targets.length; i++) {
        var target = targets[i];
        console.log("Starting transfer " + target.Amount + " to " + target.Address);
        promises[i] = NEON.api.doInvoke({
            net: 'MainNet',
            account: account,
            intents: api.makeIntent({ GAS: 0.00000001 }, account.address),
            gas: 0,
            balance: balance,
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
            if (resp.response.txid === undefined) {
                console.log('Error: transfer rejected ' + u.fixed82num(resp.script.args[2]) + 
                ' to ' + targets[i].Address + ' TRANSACTION RESTART in ' + timeout + ' ms');
                console.log('Progress: ' + i + '/' + targets.length);
                i = i - 1;
                flag = true;
                return;
            }
            console.log('Succsess: transfer ' + u.fixed82num(resp.script.args[2]) + 
            ' to ' + targets[i].Address + ' TX: ' + resp.response.txid + ' Progress: ' + (i + 1) + '/' + targets.length);
            var tx = resp.tx;
            balance.applyTx(tx);
            return resp.response.txid;
        })
        .catch(err => {
            console.log('Error: transfer rejected ' + targets[i].Amount + 
            ' to ' + targets[i].Address + ' TRANSACTION RESTART in ' + timeout + ' ms');
            console.log('Progress: ' + i + '/' + targets.length);
            i = i - 1;
            flag = true;
        });
        await promises[i];
        if (flag) {
            const balanceP = api.neonDB.getBalance('MainNet', account.address)
            .then(e => {
                balance = e;
            });
            await balancePromise;
            await new Promise(resolve => setTimeout(resolve, timeout));
            flag = false;
        }
    };
    Promise.all(promises).then(values => {
        var res = {};
        for (i = 0; i < values.length; i++) {
            targets[i].TX = values[i];
        }
        var workbook = XLSX.readFile(excel_path);
        var result_sheet = XLSX.utils.json_to_sheet(targets);
        var resBook = XLSX.utils.book_new();
        var sheets_names = workbook.SheetNames;
        XLSX.utils.book_append_sheet(resBook, workbook.Sheets[sheets_names[0]]);
        XLSX.utils.book_append_sheet(resBook, result_sheet, 'Result');
        XLSX.writeFile(resBook, excel_path);
    });
};

const distibution = (excel_path, nep6_path, acc, pk, sh) => {
    var data = parseExcelFile(excel_path);
    var accounts = unlockWallet(nep6_path, pk);
    account = matchAccount(accounts, acc);
    setUpTokenHash(sh);
    transfer(data, excel_path);
};

module.exports.distibution = distibution;
module.exports.readAccounts = unlockWallet;