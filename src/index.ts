import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import TelegramBot from 'node-telegram-bot-api';
import logger from 'koa-logger';
import { MrParser } from './models/telegram/mrParser';
import dotenv from 'dotenv';
import sequelize from './config/database';
import gptGenerate from './routes/telegram';
import cors from '@koa/cors';
import { checkOrigins } from './configs/cors';
dotenv.config();

const app = new Koa();
const router = new Router();

console.log(process.env.HOST);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'https://sapienstalk.online';
const MAIN_CHAT_ID = process.env.CHATID || '-1001686079178';
const TELEGRAM_TOKEN = '562967730:AAGUjboO2zrMSGKA-Xd3CEYptTyO1ayiRHI';
const TG_WEBHOOK = `${HOST}/telegram`;

const bot = new TelegramBot(TELEGRAM_TOKEN);
bot.setWebHook(TG_WEBHOOK);

app.use(logger());
app.use(cors({
    origin: checkOrigins,
}));
app.use(bodyParser());
app.use(router.routes());
app.use(gptGenerate.routes());

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
    const parser = new MrParser(mrInfo);
    
    if (mrInfo?.event_type !== 'merge_request') return;
    if (mrInfo?.object_attributes.state !== 'merged') return;
    
    bot.sendMessage(
        MAIN_CHAT_ID, 
        parser.createMessageTelegram(),
        { parse_mode: 'Markdown' }
    );
};

// const 
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
    await sequelize.sync();
    console.log('All models were synchronized successfully.');

    app.listen(PORT, () => {
      console.log('Server is listening on port 3000');
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();