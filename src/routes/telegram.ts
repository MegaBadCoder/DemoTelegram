import Router from 'koa-router';
import ChatGptService from '../services/ChatGptService';
const gptGenerate = new Router();
const gpt = new ChatGptService();
import Koa from 'koa';
import { DescrParams } from '../types/description';
interface RequestBody {
    params: {
        productName: string;
        keywords: string[];
        chars: number;
    }
}

interface DescReqBody {
    params: DescrParams
}

interface StepwiseAnalysisByCriterion {
    name_product?: string;
    product_properties?: string;
    prompt_id?: number,
    prompt?: string,
}

gptGenerate.post('/getText', async (ctx: Koa.Context) => {
    try {
        // TODO: Написать валидацию для фронта
        const { body } = ctx.request as Koa.Request & { body: RequestBody };
        const { productName, keywords, chars } = body.params;
    
        const result = await gpt.generateDescr(productName, keywords, chars);
        ctx.body = {
            description: result.text,
            body: JSON.parse(result.body),
        };
        ctx.status = 200;
    } catch(e) {
        ctx.status = 500;
        console.log(e);
    }
});

gptGenerate.get('/stepwise_analysis_by_criterion', async (ctx: Koa.Context) => {
    try {
        // TODO: Написать валидацию для фронта
        // const { body } = ctx.request as Koa.Request & { body: StepwiseAnalysisByCriterion };
        const query: StepwiseAnalysisByCriterion = ctx.query; 
        // TODO  Поискать информацию как нормально типизировать эту информацию 
        const { name_product, product_properties, prompt_id, prompt } = query ;
        
        console.log(name_product);
        const result = await gpt.stepwiseAnalysisByCriterion(name_product || '', product_properties, prompt_id, prompt);
        ctx.body = result;
        ctx.status = 200;
    } catch(e) {
        console.log('Ошибка в запросе');
        ctx.status = 500;
        console.log(e);
    }
});

gptGenerate.post('/generate_product_description', async (ctx: Koa.Context) => {
    try {
        // TODO: Написать валидацию для фронта
        // const { body } = ctx.request as Koa.Request & { body: StepwiseAnalysisByCriterion };
        const { body } = ctx.request as Koa.Request & { body: DescReqBody };
        
        // console.log(body);
        const result = await gpt.generateDescr2(body.params);
        ctx.body = result;
        
        ctx.status = 200;
    } catch(e) {
        console.log('Ошибка в запросе');
        ctx.status = 500;
        console.log(e);
    }
});

export default gptGenerate;