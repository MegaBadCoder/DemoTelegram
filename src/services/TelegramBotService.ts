// import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import telegramMessages from '../json/telegramMessages.json';
import dotenv from 'dotenv';
dotenv.config();
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || ''


export class TelegramBotService {
    private bot: TelegramBot;

    constructor() {
        this.bot = new TelegramBot(TELEGRAM_TOKEN);
    }
    sendDefaultStart(chatId: number) {
        this.sendMessage(chatId, telegramMessages.defSettings)
    }

    sendStartNewUser(chatId: number) {
        this.sendMessage(chatId, telegramMessages.startNewUser)
    }

    sendSwitchMode(chatId: number, stateId: number) {
        const answer = Object.values(telegramMessages.modeSwitch)
        this.sendMessage(chatId, answer[stateId - 1])
    }

    public sendMessage(chatId: number, text: string) {
        this.bot.sendMessage(chatId, text)
    }
}