// ====== IMPORTS DE DEPENDÊNCIAS E ESTILOS ======
import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native'; // Estilização com tema
import { TouchableOpacity } from 'react-native'; // Componente de toque
import { Badge } from 'react-native-elements'; // Componente de badge de notificação
import { useAuth } from '../contexts/AuthContext'; // Hook de autenticação
import { useNavigation } from '@react-navigation/native'; // Hook de navegação
import { notificationService } from '../services/notifications'; // Serviço de notificações
import theme from '../styles/theme'; // Tema visual

// ====== COMPONENTE DO ÍCONE DE NOTIFICAÇÃO ======
const NotificationBell: React.FC = () => {
  const { user } = useAuth(); // Recupera o usuário autenticado
  const navigation = useNavigation(); // Controle de navegação
  const [unreadCount, setUnreadCount] = useState(0); // Contador de notificações não lidas

  // ====== FUNÇÃO PARA CARREGAR CONTADOR DE NOTIFICAÇÕES ======
  const loadUnreadCount = async () => {
    if (!user?.id) return;

    try {
      const count = await notificationService.getUnreadCount(user.id);
      setUnreadCount(count);
    } catch (error) {
      console.error('Erro ao carregar contador de notificações:', error);
    }
  };

  // ====== EFEITO: RECARREGA NOTIFICAÇÕES A CADA 30s ======
  useEffect(() => {
    loadUnreadCount();

    const interval = setInterval(loadUnreadCount, 30000); // Atualiza a cada 30s
    return () => clearInterval(interval); // Limpa intervalo ao desmontar
  }, [user?.id]);

  // ====== EFEITO: ATUALIZA QUANDO A TELA RECEBE FOCO ======
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadUnreadCount);
    return unsubscribe;
  }, [navigation, user?.id]);

  // ====== NAVEGA PARA A TELA DE NOTIFICAÇÕES ======
  const handlePress = () => {
    navigation.navigate('Notifications' as never);
  };

  // ====== INTERFACE VISUAL DO COMPONENTE ======
  return (
    <TouchableOpacity onPress={handlePress}>
      <BellContainer>
        <BellIcon>🔔</BellIcon>
        {unreadCount > 0 && (
          <Badge
            value={unreadCount > 99 ? '99+' : unreadCount.toString()}
            status="error"
            containerStyle={styles.badge}
            textStyle={styles.badgeText}
          />
        )}
      </BellContainer>
    </TouchableOpacity>
  );
};

// ====== ESTILOS INLINE (ESTÁTICOS) ======
const styles = {
  badge: {
    position: 'absolute' as const,
    top: -8,
    right: -8,
  },
  badgeText: {
    fontSize: 10,
  },
};

// ====== ESTILIZAÇÃO DOS COMPONENTES VISUAIS ======

const BellContainer = styled.View`
  position: relative;
  padding: 8px;
`;
// Container do ícone e badge

const BellIcon = styled.Text`
  font-size: 24px;
  color: ${theme.colors.white};
`;
// Ícone do sino (emoji)


// ====== EXPORTAÇÃO DO COMPONENTE ======
export default NotificationBell;
