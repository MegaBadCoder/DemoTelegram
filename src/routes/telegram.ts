import Router from 'koa-router';

const telegram = new Router();

function parseCommand(message: any) {
    const regex = /^\/(\w+)/;
    const result = message.math(regex);

    if (result) {
        console.log(result);
    } else {
        console.log('Комманда не ')
    }
}

telegram.post('/telegram', ctx => {
    try {
        const { body } = ctx.request;
        const { message: { text, chat }}: any = body;
        const { type, first_name, id } = chat;
        
        console.log(parseCommand(text))
        console.log(first_name, id)
        
        if (type !== 'private') return;

        
    } catch(error) {
        console.error(error);
    }
    
})

export default telegram;