const program = require('commander');
const distributor = require('./logic');

program
    .version('0.0.1')
    .description('NEO token distributor');

program
    .command('transfer <excelPath>, <nep6Path>, <account>, <pk>, <sh>')
    .alias('t')
    .description('Transfer NEO tokens')
    .action((excelPath, nep6Path, account, pk, sh) => {
        try {
            distributor.distibution(excelPath, nep6Path, account, pk, sh)
        } catch (err) {
            console.log(err);
        }   
    });

program.parse(process.argv);