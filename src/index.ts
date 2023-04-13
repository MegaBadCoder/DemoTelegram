import Koa from 'koa'
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import TelegramBot from 'node-telegram-bot-api'
import logger from 'koa-logger'
import { MrParser } from './models/telegram/mrParser';

const app = new Koa();
const router = new Router();

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || 'https://sapienstalk.online'
const MAIN_CHAT_ID = process.env.MAIN_CHAT_ID || '248747115';
const TELEGRAM_TOKEN = '562967730:AAGUjboO2zrMSGKA-Xd3CEYptTyO1ayiRHI';
const TG_WEBHOOK = `${HOST}/telegram`;

const bot = new TelegramBot(TELEGRAM_TOKEN)
bot.setWebHook(TG_WEBHOOK)

app.use(logger());
app.use(bodyParser());
app.use(router.routes())

/* eslint-disable */
router.post('/bot', ctx => {
    try {
        const { body } = ctx.request;
        sendMessagesByMergeRequest(body);
        // ctx.body = {
        //     status: 'success'
        // }
    } catch (e) {
        console.log(e)
    }
    ctx.status = 200;
})

function sendMessagesByMergeRequest(mrInfo: any) {
    const parser = new MrParser('');
    // const chatIds = readMsdIds();
    if (mrInfo?.event_type !== 'merge_request') return;
    const { object_attributes: { source_branch, description, target_branch, state }} = mrInfo
    if (state !== 'merged') return;
    bot.sendMessage(MAIN_CHAT_ID, 
        parser.pasteYouTrackLink(`Выполнен Merge Request\n\n${source_branch} в ${target_branch}. Описание: ${description}`)
    );
    // chatIds.forEach(id => {
    // })
};
// app.use(
//     cors({
//         origin: *
//     })
// )

const server = app
    .listen(PORT, async () => {
        console.log(`Server listening on port: ${PORT}`)
    })
    .on('error', (err: string) => {
        console.error(err);
    })

export default server;