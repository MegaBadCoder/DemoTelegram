import { MrParser } from '../../models/telegram/mrParser';
import mrTmp from '../../json/mrTmp.json';

console.log(mrTmp)

describe('mrParser', () => {
    const parser = new MrParser(mrTmp);

    test('Получение текста и вставка ссылки на YouTrack', () => {
        expect(parser.pasteYouTrackLink('SE-100')).toBe('[SE-100](https://youtrack.citynature.ru/issue/SE-100)');
        expect(parser.pasteYouTrackLink('В задаче SE-100 все готово, вот результат'))
            .toBe('В задаче [SE-100](https://youtrack.citynature.ru/issue/SE-100) все готово, вот результат');
    });
});