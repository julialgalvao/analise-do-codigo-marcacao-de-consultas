// ====== IMPORTS DE DEPENDÊNCIAS E TIPOS ======
import { useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../../../contexts/AuthContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types/navigation";
import { Doctor } from "../../../types/doctors";
import { ProfileService } from "../services/profileService";


export const useEditProfileScreen = (navigation: NativeStackNavigationProp<RootStackParamList, "EditProfile">) => {
    const { user, updateUser } = useAuth();
    const doctor = user as Doctor | null

    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [specialty, setSpecialty] = useState(doctor?.specialty || "");
    const [loading, setLoading] = useState(false);

    const handleSaveProfile = async () => {
        try {
            setLoading(true);

            if (!name.trim() || !email.trim()) {
            Alert.alert("Erro", "Nome e email são obrigatórios");
            return;
            }

            const updatedUser = {
            ...user!,
            name: name.trim(),
            email: email.trim(),
            ...(user?.role === "doctor" && { specialty: specialty.trim() }),
            };

            await updateUser(updatedUser);

            ProfileService.saveUser(updatedUser);

            Alert.alert("Sucesso", "Perfil atualizado com sucesso!", [
            { text: "OK", onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            Alert.alert("Erro", "Não foi possível atualizar o perfil");
            console.error("Erro ao atualizar perfil:", error);
        } finally {
            setLoading(false);
        }
    }
    
  return {
    user,
    doctor,
    name,
    email,
    specialty,
    loading,
    setName,
    setEmail,
    setSpecialty,
    handleSaveProfile
  };
}