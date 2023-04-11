const Koa = require('koa');
const TelegramBot = require('node-telegram-bot-api');
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser');
const fs = require('fs')

const db = 'db.txt';
function readMsdIds() {
    let fc = fs.readFileSync(db, 'utf8');
    return fc.split(',');
};

function writeId(id) {
    fs.appendFile(db, `,${id}`, function(error) { if(error) throw error});
};

function sendMessagesByMergeRequest(mrInfo) {
    // const chatIds = readMsdIds();
    if (mrInfo.event_type !== 'merge_request') return;
    const { object_attributes: { source_branch, merge_status, description, target_branch, state }} = mrInfo
    if (state !== 'merged') return;
    bot.sendMessage('-1001686079178', `${source_branch} в ${target_branch}. Описание: ${description}`);w
    // chatIds.forEach(id => {
    // })
    console.log('Уведомление о MR отправлено')
};

console.log(readMsdIds());

const app = new Koa();

const router = Router();
router.post('/bot', ctx => {
    try {
        const { body } = ctx.request;
        sendMessagesByMergeRequest(body);
    } catch (e) {
        console.log(e)
    }
    ctx.status = 200;
})

router.post('/telegram', ctx => {
    try {
        const { body } = ctx.request;
        bot.processUpdate(body)
        ctx.status = 200;
    } catch (e) {
        console.log(e)
    }
})

app.use(bodyParser())
app.use(router.routes())

const TELEGRAM_TOKEN = '562967730:AAGUjboO2zrMSGKA-Xd3CEYptTyO1ayiRHI';
const TG_WEBHOOK = `https://sapienstalk.online/telegram`;

const bot = new TelegramBot(TELEGRAM_TOKEN)
bot.setWebHook(TG_WEBHOOK)

app.use(ctx => {
    ctx.body = 'Hello World'
})

bot.onText(/\/myid/, (msg, match) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Твой ${chatId}`);
});

bot.onText(/\/subs/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text contentgit
    // of the message
    const chatId = msg.chat.id;
    const ids = readMsdIds() 
    if (!ids.includes(chatId.toString())) {
        writeId(chatId)
        bot.sendMessage(chatId, 'О Чудо братья и сестры, автоматизация пришла и в наш дом, получай теперь уведомления по MR');
    } else {
        bot.sendMessage(chatId, 'Братишка или Сестра, ты уже подписан');
    }
    
    const resp = match[1]; // the captured "whatever"
    // send back the matched "whatever" to the chat
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    // send a message to the chat acknowledging receipt of their message
    // bot.sendMessage(msg.chat.id, "Welcome, CoOK notify warning transmision")
    const ids = readMsdIds() 
    if (!ids.includes(chatId.toString())) {
        bot.sendMessage(chatId, 'Я пока не очень умный робот, но если ты хочешь подписаться на рассылку MR, то напиши /subs');
    }
    
});

app.listen(3000, () => {
    console.log('Listening')
    // const chatIds = readMsdIds();

    // chatIds.forEach(id => {
    //     bot.sendMessage(id, 'Я работаю и снова готов служить вам, люди!');
    // })
})