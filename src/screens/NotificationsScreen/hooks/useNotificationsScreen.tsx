import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../../../contexts/AuthContext";
import {
  Notification,
  notificationService,
} from "../../../services/notifications";

export const useNotificationsScreen = () => {
  // ====== HOOKS E ESTADOS ======
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    if (!user?.id) return;

    try {
      const userNotifications = await notificationService.getNotifications(
        user.id
      );
      setNotifications(userNotifications);
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadNotifications();
    }, [user?.id])
  );

  const handleMarkAsRead = async (notificationId: Notification["id"]) => {
    try {
      await notificationService.markAsRead(notificationId);
      loadNotifications();
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;

    try {
      await notificationService.markAllAsRead(user.id);
      loadNotifications();
    } catch (error) {
      console.error("Erro ao marcar todas como lidas:", error);
    }
  };

  const handleDeleteNotification = async (
    notificationId: Notification["id"]
  ) => {
    Alert.alert(
      "Excluir Notificação",
      "Tem certeza que deseja excluir esta notificação?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await notificationService.deleteNotification(notificationId);
              loadNotifications();
            } catch (error) {
              console.error("Erro ao excluir notificação:", error);
            }
          },
        },
      ]
    );
  };

  return {
    notifications,
    loading,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDeleteNotification,
  };
};