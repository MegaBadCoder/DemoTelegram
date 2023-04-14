function truncateString(str: string): string {
    if (str.length > 120) {
        return str.slice(0, 117) + '...';
    } else {
        return str;
    }
}
export class MrParser {
    mr: any;
    taskManagerLink: string;

    constructor(mr: any) {
        this.mr = mr;
        this.taskManagerLink = 'https://youtrack.citynature.ru/issue';
    }
    getTitle() {
        return this.pastTaskLink(this.mr.object_attributes.title);
    }
    getDescription() {
        return truncateString(this.mr.object_attributes.description);
    }
    getVerifUserName() {
        return this.mr.user.name;
    }
    getSourceAndTargetBranch() {
        const { source_branch, target_branch } = this.mr.object_attributes;

        return this.pastTaskLink(`Из ${source_branch} в ${target_branch}`);
    }
    getMainProjectInfo() {
        const { project: {
            name,
            web_url: url,
        }} = this.mr;
        return {
            name,
            url
        };
    }

    makeTelegramLink(text: string, link: string): string {
        return `[${text}](${link})`;
    }

    createMessageTelegram() {
        const descr = this.pastTaskLink(this.getDescription());
        const {name, url} = this.getMainProjectInfo();
        return [
            '*Выполнен Merge Request*\n',
            `${this.getSourceAndTargetBranch()}\n`,
            `*Заголовок:* ${this.getTitle()}`,
            `*Описание:* ${descr || 'Отсутствует'}`,
            `*Пользователь:* ${this.getVerifUserName() || 'Отсутствует'}`,
            `*Проект:* ${this.makeTelegramLink(name, url)}`,
        ].join('\n');
    }

    pastTaskLink(text: string): string {
        const regex = /(\bSE-\d+\b)/gi;
        return text = text.replace(regex, `[$1](${this.taskManagerLink}/$1)`);
    }
}