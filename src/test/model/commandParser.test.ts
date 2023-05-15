// import Comma from '../../models/telegram/mrParser';
// import mrTmp from '../../json/mrTmp.json';
import CommandTelegramParser from "../../utils/commandTelegramParser";
import { splitStringAndRemoveFirstElement } from "../../utils/helpers";
describe('Telegram Command Parser', () => {
    const telegramParser = new CommandTelegramParser(); 
    // const parser = new MrParser(mrTmp);

    test('Простой тест на команды /start /get_feedback /get_descr_ozon /get_descr_wb', () => {
        expect(telegramParser.parse('/start')).toBe('start')
        expect(telegramParser.parse('/start test text')).toBe('start')
        expect(telegramParser.parse('/get_feedback')).toBe('get_feedback')
        expect(telegramParser.parse('/Get_feedback')).toBe('get_feedback')

    })

    test('Функция Split', () => {
         expect(splitStringAndRemoveFirstElement('Телевизор Samsung 32, Большой, четкий')).toEqual({
            product: 'телевизор samsung 32',
            keyWords: ['большой', 'четкий']
         })
         expect(splitStringAndRemoveFirstElement('Телевизор Samsung 32')).toBe(false)
    })

    // test('Получение текста и вставка ссылки на YouTrack', () => {
    //     expect(parser.pastTaskLink('SE-100')).toBe('[SE-100](https://youtrack.citynature.ru/issue/SE-100)');
    //     expect(parser.pastTaskLink('В задаче SE-100 все готово, вот результат'))
    //         .toBe('В задаче [SE-100](https://youtrack.citynature.ru/issue/SE-100) все готово, вот результат');
    // });
});