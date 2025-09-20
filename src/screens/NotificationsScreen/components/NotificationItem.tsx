import React from "react";
import { ListItem } from "react-native-elements";
import type { Notification } from "../../../services/notifications";
import {
  DateText,
  NotificationCard,
  NotificationHeader,
  NotificationIcon,
  styles,
  UnreadDot,
} from "../styles";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (notificationId: Notification["id"]) => void;
  onDeleteNotification?: (notificationId: Notification["id"]) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDeleteNotification,
}) => {
  const handleMarkAsRead = () => {
    if (onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  const handleDeleteNotification = () => {
    if (onDeleteNotification) {
      onDeleteNotification(notification.id);
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "appointment_confirmed":
        return "✅";
      case "appointment_cancelled":
        return "❌";
      case "appointment_reminder":
        return "⏰";
      default:
        return "📩";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <NotificationCard key={notification.id} isRead={notification.read}>
      <ListItem
        onPress={() => !notification.read && handleMarkAsRead()}
        onLongPress={() => handleDeleteNotification()}
      >
        <NotificationIcon>
          {getNotificationIcon(notification.type)}
        </NotificationIcon>
        <ListItem.Content>
          <NotificationHeader>
            <ListItem.Title style={styles.title}>
              {notification.title}
            </ListItem.Title>
            {!notification.read && <UnreadDot />}
          </NotificationHeader>
          <ListItem.Subtitle style={styles.message}>
            {notification.message}
          </ListItem.Subtitle>
          <DateText>{formatDate(notification.createdAt)}</DateText>
        </ListItem.Content>
      </ListItem>
    </NotificationCard>
  );
};