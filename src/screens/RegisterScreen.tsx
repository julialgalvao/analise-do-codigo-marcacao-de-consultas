import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Input, Button, Text } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext';
import theme from '../styles/theme';
import { ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// Define o tipo da prop de navegação para a tela de registro
type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

// Componente funcional da tela de registro
const RegisterScreen: React.FC = () => {
  // Extrai a função de registro do contexto de autenticação
  const { register } = useAuth();

  // Hook de navegação tipado para esta tela
  const navigation = useNavigation<RegisterScreenProps['navigation']>();

  // Estados para armazenar os valores dos campos de entrada
  const [name, setName] = useState('');         // Nome do usuário
  const [email, setEmail] = useState('');       // Email do usuário
  const [password, setPassword] = useState(''); // Senha do usuário
  const [loading, setLoading] = useState(false); // Estado de carregamento para o botão
  const [error, setError] = useState('');        // Mensagem de erro exibida na tela

  // Função chamada ao pressionar o botão de cadastrar
  const handleRegister = async () => {
    try {
      setLoading(true);   // Ativa indicador de carregamento
      setError('');       // Limpa mensagens anteriores de erro

      // Validação básica: verifica se todos os campos estão preenchidos
      if (!name || !email || !password) {
        setError('Por favor, preencha todos os campos');
        return;           // Para a execução se algum campo estiver vazio
      }

      // Chama a função de registro passando os dados do usuário
      await register({
        name,
        email,
        password,
      });

      // Após registro bem-sucedido, navega para a tela de login
      navigation.navigate('Login');
    } catch (err) {
      // Caso ocorra erro durante o registro, exibe mensagem genérica
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      // Desativa o indicador de carregamento independente do resultado
      setLoading(false);
    }
  };

  // JSX que representa a UI da tela
  return (
    <Container>
      {/* Título da tela */}
      <Title>Cadastro de Paciente</Title>
      
      {/* Campo de entrada para nome completo */}
      <Input
        placeholder="Nome completo"
        value={name}
        onChangeText={setName}     // Atualiza estado name ao digitar
        autoCapitalize="words"     // Capitaliza a primeira letra de cada palavra
        containerStyle={styles.input}
      />

      {/* Campo de entrada para email */}
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}    // Atualiza estado email ao digitar
        autoCapitalize="none"      // Sem capitalização automática
        keyboardType="email-address" // Teclado otimizado para emails
        containerStyle={styles.input}
      />

      {/* Campo de entrada para senha */}
      <Input
        placeholder="Senha"
        value={password}
        onChangeText={setPassword} // Atualiza estado password ao digitar
        secureTextEntry            // Esconde o texto digitado (senha)
        containerStyle={styles.input}
      />

      {/* Exibe mensagem de erro caso exista */}
      {error ? <ErrorText>{error}</ErrorText> : null}

      {/* Botão para enviar o formulário de cadastro */}
      <Button
        title="Cadastrar"
        onPress={handleRegister}   // Chama função para registrar usuário
        loading={loading}          // Mostra spinner enquanto carrega
        containerStyle={styles.button as ViewStyle}
        buttonStyle={styles.buttonStyle}
      />

      {/* Botão para voltar para a tela de login */}
      <Button
        title="Voltar para Login"
        onPress={() => navigation.navigate('Login')}  // Navega para Login
        containerStyle={styles.backButton as ViewStyle}
        buttonStyle={styles.backButtonStyle}
      />
    </Container>
  );
};

// Estilos específicos para inputs e botões
const styles = {
  input: {
    marginBottom: 15,  // Espaço inferior entre os inputs
  },
  button: {
    marginTop: 10,     // Espaço superior do botão cadastrar
    width: '100%',     // Botão ocupa toda largura disponível
  },
  buttonStyle: {
    backgroundColor: theme.colors.primary, // Cor primária do tema
    paddingVertical: 12,                    // Padding vertical do botão
  },
  backButton: {
    marginTop: 10,
    width: '100%',
  },
  backButtonStyle: {
    backgroundColor: theme.colors.secondary, // Cor secundária do tema
    paddingVertical: 12,
  },
};

// Container principal da tela, com padding e alinhamento centralizado verticalmente
const Container = styled.View`
  flex: 1;
  padding: 20px;
  justify-content: center;
  background-color: ${theme.colors.background};
`;

// Título da tela com fonte maior, negrito e cor do tema
const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  color: ${theme.colors.text};
`;

// Texto para exibir mensagens de erro em vermelho e centralizado
const ErrorText = styled.Text`
  color: ${theme.colors.error};
  text-align: center;
  margin-bottom: 10px;
`;

export default RegisterScreen;
// Exportar o componente da tela de registro