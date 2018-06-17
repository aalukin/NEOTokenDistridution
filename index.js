const program = require('commander');
const { prompt } = require('inquirer');
const distributor = require('./logic');

program
    .version('0.0.1')
    .description('NEO token distributor');

program
    .command('transfer <excelPath>, <nep6Path>, <account>, <pk>, <sh>')
    .alias('tr')
    .description('Transfer NEO tokens')
    .action((excelPath, nep6Path, account, pk, sh) => {
        try {
            distributor.distibution(excelPath, nep6Path, account, pk, sh)
        } catch (err) {
            console.log(err);
        }   
    });

program
    .command('s_transfer <excelPath>, <nep6Path>, <pk>, <sh>')
    .alias('st')
    .description('Select account and transfer NEO tokens')
    .action((excelPath, nep6Path, pk, sh) => {
        try {
            var accounts = distributor.readAccounts(nep6Path, pk);
            var mes = 'Select address index:\n';
            for (i = 0; i < accounts.length; i++) {
                mes += i + ' -> ' + accounts[i].address + '\n';
            }
            prompt([
                {
                    type: 'input',
                    name: 'index',
                    message: mes
                }
            ]).then(res => {
                distributor.distibution(excelPath, nep6Path, accounts[res.index].address, pk, sh);
            });
        } catch (err) {
            console.log(err);
        }
    });

program
    .command('pk_transfer <excelPath>, <nep6Path>, <sh>')
    .alias('pkt')
    .description('Select account, enter private key and transfer NEO tokens')
    .action((excelPath, nep6Path, sh) => {
    try {
        prompt([
            {
                type: 'input',
                name: 'pk',
                message: 'Enter private key: '
            }
        ]).then(pkres => {
            var accounts = distributor.readAccounts(nep6Path, pkres.pk);
            var mes = 'Select address index:\n';
            for (i = 0; i < accounts.length; i++) {
                mes += i + ' -> ' + accounts[i].address + '\n';
            }
            prompt([
                {
                    type: 'input',
                    name: 'index',
                    message: mes
                }
            ]).then(res => {
                distributor.distibution(excelPath, nep6Path, accounts[res.index].address, pkres.pk, sh);
            })
        });
    } catch (err) {
        console.log(err);
    }
});

program.parse(process.argv);