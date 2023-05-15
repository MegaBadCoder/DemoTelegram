import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const topic = 'https://api.openai.com/v1/chat/completions';
const GPT_KEY = process.env.GPT_KEY || '';

const config = {
    headers: {
        'Authorization': `Bearer ${GPT_KEY}`,
        'Content-Type': 'application/json',
    },
};

const requestBody = (prompt: string) => ({
    messages: [
        {
            role: 'user',
            content: prompt,
        }
    ],
    model: 'gpt-3.5-turbo',
    max_tokens: 2500,
    n: 1,
    stop: null,
    temperature: 0.7
});

const reviewPrompt = (text: string) => ({
    target: 'Сделай анализ по отзыву и дай ответ и отвечай строго в рамках заданного формата внутри фигурных скобок {}',
    type_answer_ai_bot: 'Ответ дай строго в формате JSON и следуй инструкция что указаны в свойстве rules',
    review_text: text,
    feedback_mood: 'Описывает настроение отзыва одним словом из трех заданных ["Негативный", "Положительный", "Нейтральный"]',
    reply_to_feedback: 'Как продавец дает ответ пользователю на его отзыв',
    language: 'russian',
    reply_to_feedback_property_structure: ['Приветствие клиента', 'Благодарность за отзыв', 'Призыв к покупкам'],
    rules: [
        'Cтрого соблюдай нижеуказанные правила',
        'Избегать при написании текста в поле reply_to_feedback следующих слов - Возврат, Возврата',
        'Использовать для написания ответа в свойстве reply_to_feedback структуру из свойства reply_to_feedback_property_structure',
        'Присылать ответ в формате JSON и указать поля { reply_to_feedback, feedback_mood }',
    ]
});

const reviewDescr = (productName: string, kw: any, char?: any, meta?: string, density?: number) => {
    const task = {
        product_name: productName,
        product_features: char,
        keywords: kw.map((_: any) => _.title),
        SEO_requirements: {
            keyword_density: density || 0.8,
            meta_description: meta,
        },
        content_length: '2000 символов'
    };

    const formFeatures: string[] = Object.entries(task.product_features).map(([key, value]) => {
        // return acc += `key`
        if (Array.isArray(value)) {
            return `${key}: ${value.join(', ')}`;
        } else {
            return '';
        }
    });

    console.log(formFeatures.join(' ; '));

    return `
    На основе следующих данных, создайте SEO-оптимизированный и продающий текст для товара:

    - Название товара: ${task.product_name}
    - Характеристики товара: ${formFeatures},
    - Ключевые слова: ${task.keywords.join(', ')}
    - Требования SEO: плотность ключевых слов - ${task.SEO_requirements.keyword_density}, мета-описание - ${task.SEO_requirements.meta_description}
    
    Строгие правила:
    
    - В тексте обязательно должны присутствовать характеристики товара
    - В ответе должен быть только продающий и оптимизированный текст
    - Ничего не говори про плотность или длину текста, или ключевые слова
    - Укажи все ключевые слова
    - Текст должен быть больше 2000 символов`;
};
export default class ChatGptService {
    public async generateReview(text: string): Promise<any> {
        try {
            const response = await axios.post(
                topic,
                requestBody(JSON.stringify(reviewPrompt(text))),
                config
            );
            
            return JSON.parse(response.data.choices[0].message.content);
        } catch (error) {
            console.log(error);
            throw error;
        }
    } 
    public async generateDescr(productName: string, kw: string[], chars: any): Promise<any> {
        try {
            const resp = JSON.stringify(reviewDescr(productName, kw, chars));
            const body = requestBody(resp);
            
            // console.log(productName, kw)
            // console.log(JSON.stringify(reviewDescr(productName, kw)));

            const response = await axios.post(
                topic,
                body,
                config
            );
            // return ''
            return {
                text: response.data.choices[0].message.content,
                body: resp,
            };
                
        } catch (error) {
            console.log(error);
            // throw error;
        }
    } 
}