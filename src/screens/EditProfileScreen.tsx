import React, { useState } from 'react'; // Importa React e hook useState para gerenciar estado local
import styled from 'styled-components/native'; // Importa styled-components para estilização no React Native
import { ScrollView, ViewStyle, Alert } from 'react-native'; // Importa componentes nativos e Alert para mensagens
import { Button, Input } from 'react-native-elements'; // Importa componentes prontos de UI
import { useAuth } from '../../contexts/AuthContext'; // Hook customizado para autenticação e dados do usuário
import { useNavigation } from '@react-navigation/native'; // Hook para navegação entre telas
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Tipagem para navegação stack
import { RootStackParamList } from '../../types/navigation'; // Tipagem das rotas do app
import theme from '../../styles/theme'; // Tema customizado com cores, fontes etc.
import Header from '../../components/Header'; // Componente header da aplicação
import AsyncStorage from '@react-native-async-storage/async-storage'; // Armazenamento local assíncrono

// Define o tipo das props da navegação para esta tela específica
type EditProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;
};

// Componente funcional principal da tela de edição de perfil
const EditProfileScreen: React.FC = () => {
  // Pega o usuário atual e função para atualizar usuário do contexto de autenticação
  const { user, updateUser } = useAuth();

  // Hook de navegação para poder navegar entre telas
  const navigation = useNavigation<EditProfileScreenProps['navigation']>();
  
  // Estados para controlar os campos do formulário, iniciando com dados do usuário atual
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [specialty, setSpecialty] = useState(user?.specialty || '');
  const [loading, setLoading] = useState(false); // Estado para mostrar loading enquanto salva

  // Função que é chamada ao clicar no botão salvar
  const handleSaveProfile = async () => {
    try {
      setLoading(true); // Ativa loading para feedback visual

      // Valida se nome e email foram preenchidos (não podem estar vazios)
      if (!name.trim() || !email.trim()) {
        Alert.alert('Erro', 'Nome e email são obrigatórios'); // Mostra alerta de erro
        return; // Sai da função sem continuar
      }

      // Cria o objeto atualizado do usuário, mantendo os dados existentes e atualizando os novos
      const updatedUser = {
        ...user!,
        name: name.trim(),
        email: email.trim(),
        ...(user?.role === 'doctor' && { specialty: specialty.trim() }), // Só adiciona especialidade se for médico
      };

      // Atualiza o usuário no contexto (estado global da aplicação)
      await updateUser(updatedUser);

      // Salva o usuário atualizado no armazenamento local para persistência
      await AsyncStorage.setItem('@MedicalApp:user', JSON.stringify(updatedUser));

      // Mostra mensagem de sucesso e volta para a tela anterior ao fechar o alerta
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);

    } catch (error) {
      // Em caso de erro, mostra alerta e loga no console para debugging
      Alert.alert('Erro', 'Não foi possível atualizar o perfil');
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setLoading(false); // Desativa loading independente do resultado
    }
  };

  // Renderiza a interface da tela
  return (
    <Container>
      <Header /> {/* Cabeçalho fixo no topo */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Editar Perfil</Title> {/* Título da tela */}

        <ProfileCard>
          {/* Avatar do usuário, se não tiver imagem, mostra placeholder */}
          <Avatar source={{ uri: user?.image || 'https://via.placeholder.com/150' }} />
          
          {/* Input para nome */}
          <Input
            label="Nome"
            value={name}
            onChangeText={setName}
            containerStyle={styles.input}
            placeholder="Digite seu nome"
          />

          {/* Input para email */}
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            containerStyle={styles.input}
            placeholder="Digite seu email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Se o usuário for médico, mostra input para especialidade */}
          {user?.role === 'doctor' && (
            <Input
              label="Especialidade"
              value={specialty}
              onChangeText={setSpecialty}
              containerStyle={styles.input}
              placeholder="Digite sua especialidade"
            />
          )}

          {/* Badge que indica o papel/role do usuário */}
          <RoleBadge role={user?.role || ''}>
            <RoleText>
              {user?.role === 'admin' ? 'Administrador' 
                : user?.role === 'doctor' ? 'Médico' 
                : 'Paciente'}
            </RoleText>
          </RoleBadge>
        </ProfileCard>

        {/* Botão para salvar alterações, desabilitado e mostrando loading enquanto salva */}
        <Button
          title="Salvar Alterações"
          onPress={handleSaveProfile}
          loading={loading}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.saveButton}
        />

        {/* Botão para cancelar e voltar sem salvar */}
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

// Estilos em objeto para usar nos componentes nativos e UI kits
const styles = {
  scrollContent: {
    padding: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginBottom: 15,
    width: '100%',
  },
  saveButton: {
    backgroundColor: theme.colors.success,
    paddingVertical: 12,
  },
  cancelButton: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
  },
};

// Container principal com fundo e flex
const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

// Título principal da tela
const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

// Card que envolve o conteúdo do perfil
const ProfileCard = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  align-items: center;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

// Avatar circular do usuário
const Avatar = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  margin-bottom: 16px;
`;

// Badge que varia a cor conforme o role do usuário
const RoleBadge = styled.View<{ role: string }>`
  background-color: ${(props: { role: string }) => {
    switch (props.role) {
      case 'admin':
        return theme.colors.primary + '20'; // Cor primária com transparência
      case 'doctor':
        return theme.colors.success + '20'; // Verde claro
      default:
        return theme.colors.secondary + '20'; // Outra cor (exemplo: azul claro)
    }
  }};
  padding: 8px 16px;
  border-radius: 4px;
  margin-top: 10px;
`;

// Texto dentro da badge de role
const RoleText = styled.Text`
  color: ${theme.colors.text};
  font-size: 14px;
  font-weight: 500;
`;

export default EditProfileScreen;
// Exporta o componente para uso na aplicação
