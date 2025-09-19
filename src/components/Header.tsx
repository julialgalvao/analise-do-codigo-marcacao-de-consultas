// ====== IMPORTS DE DEPENDÊNCIAS E ESTILOS ======
import React from 'react';
import styled from 'styled-components/native'; // Estilização com tema
import { Avatar } from 'react-native-elements'; // Componente visual de avatar
import { useAuth } from '../contexts/AuthContext'; // Hook de autenticação
import NotificationBell from './NotificationBell'; // Ícone de notificações
import theme from '../styles/theme'; // Tema padrão da aplicação

// ====== COMPONENTE DE CABEÇALHO COM INFORMAÇÕES DO USUÁRIO ======
const Header: React.FC = () => {
  const { user } = useAuth(); // Obtém o usuário autenticado

  // Se o usuário não estiver logado, não exibe o cabeçalho
  if (!user) return null;

  return (
    <Container>
      {/* ====== INFORMAÇÕES DO USUÁRIO ====== */}
      <UserInfo>
        <Avatar
          size="medium"
          rounded
          source={{ uri: user.image }}
          containerStyle={styles.avatar}
        />
        <TextContainer>
          <WelcomeText>Bem-vindo(a),</WelcomeText>
          <UserName>{user.name}</UserName>
        </TextContainer>
      </UserInfo>

      {/* ====== ÍCONE DE NOTIFICAÇÃO ====== */}
      <NotificationBell />
    </Container>
  );
};

// ====== ESTILOS INLINE ======
const styles = {
  avatar: {
    backgroundColor: theme.colors.primary,
  },
};

// ====== ESTILIZAÇÃO DOS COMPONENTES VISUAIS ======

const Container = styled.View`
  background-color: ${theme.colors.primary};
  padding: 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;
// Container do cabeçalho

const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;
// Agrupa avatar e textos

const TextContainer = styled.View`
  margin-left: 12px;
`;
// Espaço entre avatar e textos

const WelcomeText = styled.Text`
  font-size: 14px;
  color: ${theme.colors.white};
  opacity: 0.9;
`;
// Texto de saudação

const UserName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.white};
`;
// Nome do usuário autenticado

// ====== EXPORTAÇÃO DO COMPONENTE ======
export default Header;
