import Router from 'koa-router';
import CommandTelegramParser from '../utils/commandTelegramParser';
import { UserController } from '../controllers/UserController';
import ChatGptService from '../services/ChatGptService';
import { TelegramBotService } from '../services/TelegramBotService';
const telegram = new Router();
const userContoller = new UserController();
const parser = new CommandTelegramParser();
const gpt = new ChatGptService();
const bot = new TelegramBotService();
// const cmdMap = {
//     start: await () => {}
//     resp_review:  await () => {  }
//     gen_descr: await () => { }
// }

telegram.post('/telegram', async ctx => {
    try {
        const { body } = ctx.request;
        const { message: { text, chat }}: any = body;
        const { type, first_name, id } = chat;
        
        if (parser.parse(text) === 'start') {
            await userContoller.checkUserOrCreate(id, first_name)
            return;
        } else if (parser.parse(text) === 'resp_review') {
            await userContoller.setStateId(id, 1)
            return;
        } else if (parser.parse(text) === 'gen_descr') {
            await userContoller.setStateId(id, 2)
            return;
        }

        const user = await userContoller.getUserInfoByChatId(id);
        if (user && user.stateId === 1) {
            bot.sendMessage(id, 'Отзыв генерируется')
            const result = await gpt.generateReview(text);
            const answer = `*Настроение отзыва*: ${result.feedback_mood}\n\n*Текст:* ${result.reply_to_feedback}`
            bot.sendMessage(id, answer)
        } else if (user && user.stateId === 2) {
            bot.sendMessage(id, 'Скоро будет в работе')
            // const text.
        }

        
        
        
        ctx.status = 200;
        if (type !== 'private') return;

    } catch(error) {
        ctx.status = 500;
        console.error(error);
    }
})

export default telegram;