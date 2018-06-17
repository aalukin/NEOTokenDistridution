# NEOTokenDistridution

## Installation
1. [Установить LTS версию Node.js](https://nodejs.org/en/)
2. Перейти в командной строке в директорию с проектом
3. Запустить команду **npm install**

## Run
### Запуск с указанием всех параметров
1. Перейти в командной строке в директорию с проектом
2. Запустить команду по шаблону:
...*node index.js tr "путь до файла Excel" "путь до файла nep6.json" "адресс аккаунта" "приватный ключ" "hash контракта nep5"*
...**Все параметры указываеются в кавычках**

### Запуск с выбором аккаунта
1. Перейти в командной строке в директорию с проектом
2. Запустить команду по шаблону:
...*node index.js st "путь до файла Excel" "путь до файла nep6.json" "приватный ключ" "hash контракта nep5"*
...**Все параметры указываеются в кавычках**
3. Выбрать необходимый адресс аккаунта из кошелька

### Запуск с выбором аккаунта и вводом приватного ключа
1. Перейти в командной строке в директорию с проектом
2. Запустить команду по шаблону:
...*node index.js pkt "путь до файла Excel" "путь до файла nep6.json" "hash контракта nep5"*
...**Все параметры указываеются в кавычках**
3. Ввести приватный ключ
4. Выбрать необходимы адресс аккаунта из кошелька