const NEON = require('@cityofzion/neon-js');
const { api, wallet, u} = NEON;

const account = new wallet.Account('123');
const ontTokenScriptHash = 'ceab719b8baa2310f232ee0d277c061704541cfb';

function unlockAccount(nep6FilePath, pKey) {
    if (nep6FilePath == null || pKey == null || pKey.isEmpty()) {
        // TODO: Exception
    }
    const wallet = wallet.Wallet.readFile(nep6FilePath);
    wallet.decryptAll(pKey);
    let accounts = wallet.accounts;
    accounts.forEach(function (e) {
        console.info(e.address);
    });
    return accounts[0];
}

function distribute(nep6FilePath, pKey) {
    const account = unlockAccount(nep6FilePath, pKey);

    Neon.api.doInvoke({
        net: "MainNet",
        account: account,
        intents: api.makeIntent({GAS: 0.00000001}, account.address);
    });
}