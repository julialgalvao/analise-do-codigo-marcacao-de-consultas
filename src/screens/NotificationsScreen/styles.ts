import { StyleProp, TextStyle } from "react-native";
import styled from "styled-components/native";
import theme from "../../styles/theme";

// === Styles ===
export const styles = {
  scrollContent: {
    padding: 20,
  },
  badge: {
    marginLeft: 8,
  },
  markAllButton: {
    marginBottom: 15,
    width: "100%",
  },
  markAllButtonStyle: {
    backgroundColor: theme.colors.success,
    paddingVertical: 10,
  },
  button: {
    marginBottom: 20,
    width: "100%",
  },
  buttonStyle: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
  } as StyleProp<TextStyle>,
  message: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 4,
    lineHeight: 20,
  },
};

// === Styled Components ===
export const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

export const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  text-align: center;
`;

export const LoadingText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

export const EmptyContainer = styled.View`
  align-items: center;
  margin-top: 40px;
`;

export const EmptyText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  opacity: 0.7;
`;

export const NotificationCard = styled.View<{ isRead: boolean }>`
  background-color: ${(props: { isRead: boolean }) =>
    props.isRead ? theme.colors.white : theme.colors.primary + "10"};
  border-radius: 8px;
  margin-bottom: 8px;
  border-width: 1px;
  border-color: ${(props: { isRead: boolean }) =>
    props.isRead ? theme.colors.border : theme.colors.primary + "30"};
`;

export const NotificationIcon = styled.Text`
  font-size: 20px;
  margin-right: 8px;
`;

export const NotificationHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const UnreadDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${theme.colors.error};
  margin-left: 8px;
`;

export const DateText = styled.Text`
  font-size: 12px;
  color: ${theme.colors.text};
  opacity: 0.6;
  margin-top: 4px;
`;