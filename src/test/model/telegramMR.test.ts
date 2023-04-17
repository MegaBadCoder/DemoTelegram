import { MrParser } from '../../models/telegram/mrParser';
import mrTmp from '../../json/mrTmp.json';

describe('mrParser', () => {
    const parser = new MrParser(mrTmp);

    test('Получение текста и вставка ссылки на YouTrack', () => {
        expect(parser.pastTaskLink('SE-100')).toBe('[SE-100](https://youtrack.citynature.ru/issue/SE-100)');
        expect(parser.pastTaskLink('В задаче SE-100 все готово, вот результат'))
            .toBe('В задаче [SE-100](https://youtrack.citynature.ru/issue/SE-100) все готово, вот результат');
    });

    test('Получение информации о проекте', () => {
        expect(parser.getMainProjectInfo())
            .toEqual({
                name: 'gitlab-bot',
                url: 'https://gitlab.citynature.ru/citynature/gitlab-bot'
            });
    });

    test('Получение информации о проекте', () => {
        expect(parser.makeTelegramLink('123', '123'))
            .toBe('[123](123)');
    });

    test('Проверка на сообщения', () => {
        expect(parser.createMessageTelegram())
            .toBe('*Выполнен Merge Request*\n\n*Заголовок:* SE-fix\n*Описание:* Отсутствует\nИз test-mr в master\n*Проект:* [gitlab-bot](https://gitlab.citynature.ru/citynature/gitlab-bot)');
    });
});