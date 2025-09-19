import React, { useState } from 'react'; // React e useState para estado local
import styled from 'styled-components/native'; // styled-components para estilização no React Native
import { Input, Button, Text } from 'react-native-elements'; // Componentes UI prontos
import { useAuth } from '../contexts/AuthContext'; // Contexto de autenticação customizado
import theme from '../styles/theme'; // Tema com cores e estilos globais
import { ViewStyle } from 'react-native'; // Tipagem para estilos de view
import { useNavigation } from '@react-navigation/native'; // Hook para navegação
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Tipagem para navegação stack
import { RootStackParamList } from '../types/navigation'; // Tipagem das rotas

// Define o tipo para as props da navegação desta tela
type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen: React.FC = () => {
  const { signIn } = useAuth(); // Função signIn do contexto para autenticar usuário
  const navigation = useNavigation<LoginScreenProps['navigation']>(); // Navegação para outras telas

  // Estados para armazenar email e senha digitados
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estado para controlar loading do botão e erro de login
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Função chamada ao clicar no botão "Entrar"
  const handleLogin = async () => {
    try {
      setLoading(true); // Ativa loading para indicar processo em andamento
      setError(''); // Limpa erros anteriores
      await signIn({ email, password }); // Tenta autenticar com credenciais
    } catch (err) {
      // Caso haja erro, seta mensagem de erro para usuário
      setError('Email ou senha inválidos');
    } finally {
      setLoading(false); // Para loading independente do resultado
    }
  };

  return (
    <Container>
      <Title>App Marcação de Consultas</Title> {/* Título principal da tela */}
      
      {/* Campo para email */}
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none" // Não deixa auto maiúscula
        keyboardType="email-address" // Teclado apropriado para email
        containerStyle={styles.input}
      />

      {/* Campo para senha */}
      <Input
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry // Oculta o texto digitado
        containerStyle={styles.input}
      />

      {/* Se houver erro, exibe mensagem abaixo dos inputs */}
      {error ? <ErrorText>{error}</ErrorText> : null}

      {/* Botão para tentar login */}
      <Button
        title="Entrar"
        onPress={handleLogin}
        loading={loading} // Mostra spinner quando estiver carregando
        containerStyle={styles.button as ViewStyle}
        buttonStyle={styles.buttonStyle}
      />

      {/* Botão para navegar para a tela de cadastro */}
      <Button
        title="Cadastrar Novo Paciente"
        onPress={() => navigation.navigate('Register')}
        containerStyle={styles.registerButton as ViewStyle}
        buttonStyle={styles.registerButtonStyle}
      />

      {/* Texto com dicas e credenciais de teste */}
      <Text style={styles.hint}>
        Use as credenciais de exemplo:
      </Text>
      <Text style={styles.credentials}>
        Admin: admin@example.com / 123456{'\n'}
        Médicos: joao@example.com, maria@example.com, pedro@example.com / 123456
      </Text>
    </Container>
  );
};

// Estilos básicos usados nos inputs, botões e textos
const styles = {
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
  },
  registerButton: {
    marginTop: 10,
    width: '100%',
  },
  registerButtonStyle: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
  },
  hint: {
    marginTop: 20,
    textAlign: 'center' as const,
    color: theme.colors.text,
  },
  credentials: {
    marginTop: 10,
    textAlign: 'center' as const,
    color: theme.colors.text,
    fontSize: 12,
  },
};

// Container geral da tela, com padding e background
const Container = styled.View`
  flex: 1;
  padding: 20px;
  justify-content: center;
  background-color: ${theme.colors.background};
`;

// Título principal estilizado
const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  color: ${theme.colors.text};
`;

// Texto para mensagens de erro (em vermelho)
const ErrorText = styled.Text`
  color: ${theme.colors.error};
  text-align: center;
  margin-bottom: 10px;
`;

export default LoginScreen;
// Exporta o componente da tela de login