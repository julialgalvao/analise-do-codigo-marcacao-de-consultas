import React, { Dispatch, SetStateAction } from "react";
import { User } from "../../../types/auth";
import { Avatar, Input } from "react-native-elements";
import { ProfileCard, RoleBadge, RoleText, styles } from "../styles";

interface ProfileItemProps{
    user: User | null;
    name: string;
    email: string;
    specialty: string;
    setName?: Dispatch<SetStateAction<string>>;
    setEmail?: Dispatch<SetStateAction<string>>;
    setSpecialty?: Dispatch<SetStateAction<string>>;
}

export const ProfileItem: React.FC<ProfileItemProps> = ({
    user,
    name,
    email,
    specialty,
    setName,
    setEmail,
    setSpecialty
}) => {
    return(
        <ProfileCard>
            <Avatar
            source={{ uri: user?.image || "https://via.placeholder.com/150" }}
            />

            <Input
                label="Nome"
                value={name}
                onChangeText={setName}
                containerStyle={styles.input}
                placeholder="Digite seu nome"
            />

            <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                containerStyle={styles.input}
                placeholder="Digite seu email"
                keyboardType="email-address"
                autoCapitalize="none"
            />

            {user?.role === "doctor" && (
            <Input
                label="Especialidade"
                value={specialty}
                onChangeText={setSpecialty}
                containerStyle={styles.input}
                placeholder="Digite sua especialidade"
            />
            )}

            <RoleBadge role={user?.role || ""}>
                <RoleText>
                    {user?.role === "admin"
                    ? "Administrador"
                    : user?.role === "doctor"
                    ? "Médico"
                    : "Paciente"}
                </RoleText>
            </RoleBadge>
        </ProfileCard>
)}