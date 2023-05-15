import { Context } from 'koa';
const WHITE_LIST_OF_DOMAINS: string[] = [
    'http://localhost:4000', 
    'https://dev.sellerexpert.ru',
    'https://test.sellerexpert.ru',
    'https://lk.sellerexpert.ru',
];

export async function checkOrigins(ctx: Context): Promise<string> {
    const origin = ctx.request.headers.origin || '';
    console.log(origin);
    console.log(WHITE_LIST_OF_DOMAINS.includes(origin));
    if (WHITE_LIST_OF_DOMAINS.includes(origin)) {
        return origin;
    }
    return '';
} 