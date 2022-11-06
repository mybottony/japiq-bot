const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')

const token = '5359553125:AAE0T0h7vyChvU1EbGCMEyjWlGzwYJL7f1k'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Я обираю цифру від 0 до 5, а ти відгадуєш');
    const randomNumber = Math.floor(Math.random() * 6);
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Відгадуй', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Привітання'},
        {command: '/info', description: 'Підпал'},
        {command: '/game', description: 'Зіграємо у гру'},
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/1b5/0ab/1b50abf8-8451-40ca-be37-ffd7aa74ec4d/192/5.webp');
            return bot.sendMessage(chatId, 'На районі тебе кличуть ' + msg.from.first_name + ', але я зватиму тебе "Курва".');
            return bot.sendMessage(chatId, 'Готовий до нового підпалу?');
        }

        if (text === '/info') {
            return bot.sendMessage(chatId, 'Готовий до нового підпалу?');
        }

        if (text === '/game') {
            return startGame(chatId);
        }
    
        return bot.sendMessage(chatId, 'Ти довбойоб? Використовуй кнопки з меню')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatId);
        }
        if (data == chats[chatId]) {
            return bot.sendMessage(chatId, 'Вгадав, бляха муха.', againOptions)
        } else {
            return bot.sendMessage(chatId, 'ХА-ХА! НІХУЯ! ---> ' + chats[chatId], againOptions);
        }
    })
}

start()