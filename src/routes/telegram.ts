import Router from 'koa-router';
import CommandTelegramParser from '../utils/commandTelegramParser';
import { UserController } from '../controllers/UserController';
const telegram = new Router();
const userContoller = new UserController();
const parser = new CommandTelegramParser();

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
        
        console.log(text)
        console.log(first_name, id)
        console.log(1, parser.parse(text))
        if (parser.parse(text) === 'start') {
            await userContoller.checkUserOrCreate(id, first_name)
        } else if (parser.parse(text) === 'resp_review') {
            await userContoller.setStateId(id, 1)
        } else if (parser.parse(text) === 'gen_descr') {
            await userContoller.setStateId(id, 2)
        }
        
        ctx.status = 200;
        if (type !== 'private') return;

    } catch(error) {
        console.error(error);
    }
})

export default telegram;