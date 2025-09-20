// ====== IMPORTS DE DEPENDÊNCIAS E TIPOS ======
import React from "react";
import { ScrollView, ViewStyle} from "react-native";
import { Button } from "react-native-elements";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import {Container, Title, styles} from "./styles";
import { useEditProfileScreen } from "./hooks/useEditProfileScreen";
import Header from "../../components/Header";
import { ProfileItem } from "./components/ProfileItem";

type EditProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "EditProfile">;
};

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({navigation}) => {

  const {
    user,
    name,
    email,
    specialty,
    loading,
    setName,
    setEmail,
    setSpecialty,
    handleSaveProfile
  } = useEditProfileScreen(navigation);

  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Title>Editar Perfil</Title>

        <ProfileItem 
          user={user}
          name={name}
          email={email}
          specialty={specialty}
          setName={setName}
          setEmail={setEmail}
          setSpecialty={setSpecialty}
        />

        <Button
          title="Salvar Alterações"
          onPress={handleSaveProfile}
          loading={loading}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.saveButton}
        />

        <Button
          title="Cancelar"
          onPress={() => navigation.goBack()}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.cancelButton}
        />
      </ScrollView>
    </Container>
  );
};

export default EditProfileScreen;