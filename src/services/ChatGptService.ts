import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
import { DescrParams } from '../types/description';

const topic = 'https://api.openai.com/v1/chat/completions';
const GPT_KEY = process.env.GPT_KEY || '';

const config = {
    headers: {
        'Authorization': `Bearer ${GPT_KEY}`,
        'Content-Type': 'application/json',
    },
};

function replaceField(text: string, field: string, value: string): string {
    const re = new RegExp(`{${field}}`);
    return text.replace(re, value);
}

const stepwiseAnalysisByCriterion = [
    'Ты маркетолог. Выдели основные сегменты аудитории на основе их потребностей, которые пользуются {name}, в состав которого входит {properties}.',
    'Проанализируйте, пожалуйста, область применения {name}. Какие основные сферы и сегменты рынка могут использовать {name}, и какие преимущества он может предоставить им?',
    'Исследуй отзывы в сети и выпиши, что больше всего не нравится клиентам в использовании {name}, в состав которого входит {properties}. Напиши список того, что больше всего не нравится теми словами, как пишут в отзывах, расположив по популярности от популярных к менее популярным',
    'Исследуй отзывы в сети и выпиши, что больше всего нравится клиентам в использовании {name}, в состав которого входит {properties}. Напиши список того, что больше всего нравится теми словами, как пишут в отзывах, расположив по популярности от популярных к менее популярным.',
    'Какие факторы влияют на принятие решения о покупке {name},? Протестировать еще с таким составом как {properties} , если в названии нет подробностей по товару.'
];

const rules = `
    Строгие правила для твоего ответа.

    Если не можешь придумать или найти ответ. Придумай его

    Ответа выдавай в формате JSON. За пример возьми следующий образец,

    {'Ключ - это Названия сегмента (На русском языке)': 'Свойство это Короткое описание сегмента (На русском языке)','Фанаты видеоигр': 'Люди которые любят играть в игры'}

    -В ключах нельзя использовать SnakeCase или CamelCase - это должен быть обычный текст.
    -Ключ начиначется с заглавной буквы. 
    -Напиши около 7 элементов.
    -Напиши текст без экранирования спецсимволов
    -Необходимо, чтобы текст бы читаем как JSON для JavaScript и в нем не должно быть переноса строк
`;

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
    public async stepwiseAnalysisByCriterion(productName: string, productProperties?: string, prompt_id?: number, srcPrompt?: string): Promise<any> {
        // Мне нужно подготовить Prompt 
        let prompt = replaceField(srcPrompt || stepwiseAnalysisByCriterion[prompt_id || 0], 'name', productName);
        if (productProperties) {
            prompt = replaceField(srcPrompt || stepwiseAnalysisByCriterion[prompt_id || 0], 'name', productProperties);
        }

        const basePrompt = prompt;
        prompt += ` ${rules}`;

        try {
            const response = await axios.post(
                topic,
                requestBody(prompt),
                config
            );
        
            return {
                response_gpt: {
                    text: JSON.parse(response.data.choices[0].message.content),
                },
                prompt: basePrompt,
            };
        } catch(e) {
            throw new Error('Ошибка при обращение на сервер OpenAi');
        }
    }
    public async generateDescr2(params: DescrParams): Promise<any> {
        let prompt: string[] | string = ['На основе следующих данных, создайте продающий и SEO-оптимизированный текст для товара:'];

        const mapKey = {
            name_product: 'Название товара',
            target_audience: 'Целевая аудитория',
            consumer_objections: 'Возражения потребителей, которые встречаются при покупке товара',
            consumer_expectations: 'Ожидания потребителей от покупки товара',
            purchase_triggers: 'Основные факторы для принятия решения о покупке товара',
            product_keywords: 'Ключевые слова',
            product_characteristics: 'Характеристики товара',
            // user_prompt: 'Поль'
        };
        
        Object.entries(mapKey).forEach(([key, value]) => {
            const paramKey = key as keyof DescrParams | 'user_prompt';
            if (Array.isArray(prompt) && params[paramKey]) {
                prompt.push(`${value}: ${params[paramKey]}`);
            }
        });
        
        prompt = prompt.join('\n');
        const response = await axios.post(
            topic,
            requestBody(params.user_prompt || prompt),
            config
        );
        return {
            description: response.data.choices[0].message.content,
            prompt: params.user_prompt || prompt,
        };

    }
}