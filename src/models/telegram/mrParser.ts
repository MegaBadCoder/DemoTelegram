export class MrParser {
    mr: any 

    constructor(mr: any) {
        this.mr = mr;
    }
    pasteYouTrackLink(text: string): string {
        const regex = /(\bSE-\d+\b)/gi;
        const taskManagerLink = 'https://youtrack.citynature.ru/issue'
        return text = text.replace(regex, `[$1](${taskManagerLink}/$1)`)
    }
}