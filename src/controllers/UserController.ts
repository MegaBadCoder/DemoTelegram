import User from "../sqlz/models/user";
import { TelegramBotService } from "../services/TelegramBotService";

const bot = new TelegramBotService();

export class UserController {
    async getUserInfoByChatId(chatId: number): Promise<User | null> {
        const user = await User.findOne({ where: { chatId }});

        if (user) return user;
        else return null;
    }

    async checkUserOrCreate(chatId: number, name: string): Promise<Boolean> {
       
        if (await this.getUserInfoByChatId(chatId)) {
            return false;
        }
        
        try {
            await User.create({
                name,
                stateId: 0,
                chatId: chatId,
            })
            
            bot.sendStartNewUser(chatId);
            console.log(`Пользователь ${chatId} создан`)
            return true;
        } catch(error) {
            throw error;
        }
    
    }

    async setStateId(chatId: number, stateId: number): Promise<User | null> {
        const user = await User.findOne({ where: { chatId }});

        if (user) {
            user.name = 'Илюшкин';
            user.stateId = stateId;
            console.log(123, user.stateId)
            bot.sendSwitchMode(chatId, stateId);
            try {
                await user.save();
            } catch (error) {
                console.log(error);;
            }
        }

        
        return user;
    }
}