import React from 'react';
import { Button } from 'react-native-elements';
import { ButtonContainer } from '../styles';
import theme from '../../../styles/theme';

interface ActionButtonsProps {
  loading: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  loading,
  onSubmit,
  onCancel
}) => {
  return (
    <ButtonContainer>
      <Button
        title="Agendar"
        onPress={onSubmit}
        loading={loading}
        buttonStyle={{
          backgroundColor: theme.colors.primary,
          paddingVertical: 12,
          marginBottom: 10
        }}
      />
      <Button
        title="Cancelar"
        onPress={onCancel}
        buttonStyle={{
          backgroundColor: theme.colors.secondary,
          paddingVertical: 12
        }}
      />
    </ButtonContainer>
  );
};