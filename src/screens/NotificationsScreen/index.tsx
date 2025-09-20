// ====== IMPORTS DE DEPENDÊNCIAS E TIPOS ======
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { ScrollView, ViewStyle } from "react-native";
import { Badge, Button } from "react-native-elements";
import Header from "../../components/Header";
import { RootStackParamList } from "../../types/navigation";
import { NotificationItem } from "./components/NotificationItem";
import { useNotificationsScreen } from "./hooks/useNotificationsScreen";
import {
  Container,
  EmptyContainer,
  EmptyText,
  LoadingText,
  styles,
  Title,
  TitleContainer,
} from "./styles";

// ====== TIPAGEM DE PROPS ======
type NotificationsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Notifications">;
};

// ====== COMPONENTE PRINCIPAL ======
const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  navigation,
}) => {
  const {
    notifications,
    loading,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDeleteNotification,
  } = useNotificationsScreen();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TitleContainer>
          <Title>Notificações</Title>
          {unreadCount > 0 && (
            <Badge
              value={unreadCount}
              status="error"
              containerStyle={styles.badge}
            />
          )}
        </TitleContainer>

        {unreadCount > 0 && (
          <Button
            title="Marcar todas como lidas"
            onPress={handleMarkAllAsRead}
            containerStyle={styles.markAllButton as ViewStyle}
            buttonStyle={styles.markAllButtonStyle}
          />
        )}

        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        {loading ? (
          <LoadingText>Carregando notificações...</LoadingText>
        ) : notifications.length === 0 ? (
          <EmptyContainer>
            <EmptyText>Nenhuma notificação encontrada</EmptyText>
          </EmptyContainer>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              notification={notification}
              key={notification.id}
              onDeleteNotification={handleDeleteNotification}
              onMarkAsRead={handleMarkAsRead}
            />
          ))
        )}
      </ScrollView>
    </Container>
  );
};

export default NotificationsScreen;