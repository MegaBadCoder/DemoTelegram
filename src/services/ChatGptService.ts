import axios from 'axios'
import dotenv from 'dotenv';
dotenv.config();

const topic = 'https://api.openai.com/v1/chat/completions'
const GPT_KEY = process.env.GPT_KEY || '';

const config = {
    headers: {
        'Authorization': `Bearer ${GPT_KEY}`,
        'Content-Type': 'application/json',
    },
}

const requestBody = (prompt: string) => ({
    messages: [
        {
            role: "user",
            content: prompt,
        }
    ],
    model: 'gpt-3.5-turbo',
    max_tokens: 150,
    n: 1,
    stop: null,
    temperature: 0.7
})

const reviewPrompt = (text: string) => ({
    target: 'Сделай анализ по отзыву и дай ответ и отвечай строго в рамках заданного формата внутри фигурных скобок {}',
    type_answer_ai_bot: 'Ответ дай строго в формате JSON и следуй инструкция что указаны в свойстве rules',
    review_text: text,
    feedback_mood: 'Описывает настроение отзвап одним словом из трех заданных ["Негативный", "Положительный", "Нейтральный"]',
    reply_to_feedback: 'Как продавец дает ответ пользователю на его отзыв',
    language: "russian",
    reply_to_feedback_property_structure: ['Приветствие клиента', 'Благодарность за отзыв', 'Призыв к покупкам'],
    rules: [
        'Cтрого соблюдай нижеуказанные правила',
        'Избегать при написании текста в поле reply_to_feedback следующих слов - Возврат, Возврата',
        'Использовать для написания ответа в свойстве reply_to_feedback структуру из свойства reply_to_feedback_property_structure',
        'Присылать ответ в формате JSON и указать поля { reply_to_feedback, feedback_mood }',
    ]
})

const reviewDescr = (productName: string, kw: string) => ({
    target: 'Представь что ты лучший копирайтер с большим опытом работы и напиши описание товара с ключевыми словами внутри фигурных скобок {}',
    type_answer_ai_bot: 'Ответ дай строго в формате JSON и следуй инструкция что указаны в свойстве rules',
    productName: productName,
    key_word_list: kw,
    language: "russian",
    rules: [
        'Cтрого соблюдай нижеуказанные правила',
        'Название товара находится в свойстве productName',
        'В сгенерированном описание желательно чтобы находились слова из свойства key_word_list',
        'Максимальное кол-во символов в описание 10000',
        'Присылать только сгенерированный текст описания',
    ]
})
export default class ChatGptService {
    public async generateReview(text: string): Promise<any> {
        try {
            const response = await axios.post(
                topic,
                requestBody(JSON.stringify(reviewPrompt(text))),
                config
            )
            
            return JSON.parse(response.data.choices[0].message.content)
        } catch (error) {
            console.log(error);
            throw error;
        }
    } 
    public async generateDescr(productName: string, kw: string): Promise<any> {
        try {
            const response = await axios.post(
                topic,
                requestBody(JSON.stringify(reviewDescr(productName, kw))),
                config
            )
            
            return JSON.parse(response.data.choices[0].message.content)
        } catch (error) {
            console.log(error);
            throw error;
        }
    } 
}