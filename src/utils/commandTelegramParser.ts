export default class CommandTelegramParser {
  regexp: RegExp = /^\/(\w+)/;

  public parse(message: string): string | null {
    const result = message.match(this.regexp)

    if (result) {
        return result[0].replace('/', '').toLowerCase();
    }
    return null
  }
}