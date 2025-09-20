import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { ViewStyle } from "react-native";
import { Button } from "react-native-elements";
import Header from "../../components/Header";
import { useAuth } from "../../contexts/AuthContext";
import { RootStackParamList } from "../../types/navigation";
import ProfileCard from "./components/ProfileCard";
import { Container, ScrollView, Title, styles } from "./styles";

const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, "Profile">>();
 

  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Meu Perfil</Title>
        {user && <ProfileCard user={user} />}
        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />
        <Button
          title="Editar Perfil"
          onPress={() => navigation.navigate("EditProfile")}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.editButton}
        />
        <Button
          title="Sair"
          onPress={signOut}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.logoutButton}
        />
      </ScrollView>
    </Container>
  );
};

export default ProfileScreen;