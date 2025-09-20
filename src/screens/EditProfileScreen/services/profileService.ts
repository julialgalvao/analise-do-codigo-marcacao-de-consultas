import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../../types/auth';

export class ProfileService {
    static async saveUser(user: User | null): Promise<void> {
        await AsyncStorage.setItem(
        "@MedicalApp:user",
        JSON.stringify(user)
        );
    }
}