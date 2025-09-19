import React from 'react';
import styled from 'styled-components/native';
import { Button, ListItem } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import theme from '../styles/theme';
import Header from '../components/Header';
import { ViewStyle } from 'react-native';

// Define o tipo da prop de navegação para a tela de perfil
type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

// Componente funcional da tela de perfil do usuário
const ProfileScreen: React.FC = () => {
  // Extrai o usuário logado e função de logout do contexto Auth
  const { user, signOut } = useAuth();

  // Hook de navegação tipado para esta tela
  const navigation = useNavigation<ProfileScreenProps['navigation']>();

  // Função para traduzir o papel (role) do usuário para texto em português
  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador'; // Admin traduzido
      case 'doctor':
        return 'Médico'; // Médico traduzido
      case 'patient':
        return 'Paciente'; // Paciente traduzido
      default:
        return role; // Caso não seja nenhum dos anteriores, retorna o texto original
    }
  };

  // JSX da tela
  return (
    <Container>
      {/* Componente Header customizado */}
      <Header />

      {/* ScrollView para permitir rolagem do conteúdo */}
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Título da tela */}
        <Title>Meu Perfil</Title>

        {/* Card que mostra informações do perfil */}
        <ProfileCard>
          {/* Avatar com a imagem do usuário, ou placeholder se não existir */}
          <Avatar source={{ uri: user?.image || 'https://via.placeholder.com/150' }} />

          {/* Nome do usuário */}
          <Name>{user?.name}</Name>

          {/* Email do usuário */}
          <Email>{user?.email}</Email>

          {/* Badge que mostra o papel do usuário (Admin, Médico, Paciente) */}
          <RoleBadge role={user?.role || ''}>
            <RoleText>{getRoleText(user?.role || '')}</RoleText>
          </RoleBadge>

          {/* Se o usuário for médico, mostra a especialidade */}
          {user?.role === 'doctor' && (
            <SpecialtyText>Especialidade: {user?.specialty}</SpecialtyText>
          )}
        </ProfileCard>

        {/* Botão para editar o perfil */}
        <Button
          title="Editar Perfil"
          onPress={() => navigation.navigate('EditProfile' as any)} // Navega para tela de edição
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.editButton}
        />

        {/* Botão para voltar para a tela anterior */}
        <Button
          title="Voltar"
          onPress={() => navigation.goBack()} // Volta para tela anterior
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        {/* Botão para sair (logout) */}
        <Button
          title="Sair"
          onPress={signOut} // Chama função de logout
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.logoutButton}
        />
      </ScrollView>
    </Container>
  );
};

// Estilos de objetos usados no ScrollView e botões
const styles = {
  scrollContent: {
    padding: 20, // Padding para o conteúdo do ScrollView
  },
  button: {
    marginBottom: 20, // Espaço inferior entre botões
    width: '100%', // Botão ocupa toda a largura do container
  },
  buttonStyle: {
    backgroundColor: theme.colors.primary, // Cor primária para botões padrão
    paddingVertical: 12, // Padding vertical para botão
  },
  editButton: {
    backgroundColor: theme.colors.success, // Cor verde para botão de editar
    paddingVertical: 12,
  },
  logoutButton: {
    backgroundColor: theme.colors.error, // Cor vermelha para logout
    paddingVertical: 12,
  },
};

// Container principal da tela, ocupa toda a tela e com fundo definido no tema
const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

// ScrollView com flex para ocupar o espaço disponível
const ScrollView = styled.ScrollView`
  flex: 1;
`;

// Título da tela, centralizado e estilizado
const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

// Card que contém os dados do perfil com borda e padding
const ProfileCard = styled.View`
  background-color: ${theme.colors.background};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  align-items: center; // Centraliza conteúdo horizontalmente
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

// Imagem circular para o avatar do usuário
const Avatar = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 60px; // Circulo perfeito
  margin-bottom: 16px;
`;

// Nome do usuário estilizado
const Name = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 8px;
`;

// Email do usuário estilizado
const Email = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
  margin-bottom: 8px;
`;

// Badge que mostra o papel do usuário, a cor muda de acordo com o papel
const RoleBadge = styled.View<{ role: string }>`
  background-color: ${(props: { role: string }) => {
    switch (props.role) {
      case 'admin':
        return theme.colors.primary + '20'; // Primária com opacidade para admin
      case 'doctor':
        return theme.colors.success + '20'; // Verde claro para médico
      default:
        return theme.colors.secondary + '20'; // Cor secundária para outros
    }
  }};
  padding: 4px 12px;
  border-radius: 4px;
  margin-bottom: 8px;
`;

// Texto dentro do badge de papel do usuário
const RoleText = styled.Text`
  color: ${theme.colors.text};
  font-size: 14px;
  font-weight: 500;
`;

// Texto que mostra especialidade do médico (se aplicável)
const SpecialtyText = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
  margin-top: 8px;
`;

export default ProfileScreen;
// Exporta o componente da tela de perfil