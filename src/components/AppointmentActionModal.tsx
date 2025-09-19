// ====== IMPORTS DE DEPENDÊNCIAS E TIPOS ======
import React from 'react';
import styled from 'styled-components/native'; // Estilização com styled-components
import { Modal, ViewStyle } from 'react-native'; // Componentes nativos
import { Button, Input } from 'react-native-elements'; // Componentes prontos
import theme from '../styles/theme'; // Tema visual do app

// ====== DEFINIÇÃO DAS PROPRIEDADES DO MODAL ======
interface AppointmentActionModalProps {
  visible: boolean; // Se o modal está visível
  onClose: () => void; // Função para fechar o modal
  onConfirm: (reason?: string) => void; // Ação de confirmação/cancelamento
  actionType: 'confirm' | 'cancel'; // Tipo de ação (confirmar ou cancelar)
  appointmentDetails: {
    patientName: string;
    doctorName: string;
    date: string;
    time: string;
    specialty: string;
  }; // Detalhes da consulta
}

// ====== COMPONENTE DO MODAL DE AÇÃO NA CONSULTA ======
const AppointmentActionModal: React.FC<AppointmentActionModalProps> = ({
  visible,
  onClose,
  onConfirm,
  actionType,
  appointmentDetails,
}) => {
  // Estado para armazenar motivo do cancelamento (opcional)
  const [reason, setReason] = React.useState('');

  // Confirma a ação e reseta o estado
  const handleConfirm = () => {
    onConfirm(reason.trim() || undefined); // Envia razão apenas se não for string vazia
    setReason('');
    onClose();
  };

  // Fecha o modal e limpa o estado
  const handleClose = () => {
    setReason('');
    onClose();
  };

  const isCancel = actionType === 'cancel'; // Verifica se a ação é de cancelamento

  // ====== RENDERIZAÇÃO DO MODAL ======
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <Overlay>
        <ModalContainer>

          {/* ====== CABEÇALHO ====== */}
          <Header>
            <Title>
              {isCancel ? 'Cancelar Consulta' : 'Confirmar Consulta'}
            </Title>
          </Header>

          {/* ====== CONTEÚDO PRINCIPAL ====== */}
          <Content>

            {/* Informações da consulta */}
            <AppointmentInfo>
              <InfoRow>
                <InfoLabel>Paciente:</InfoLabel>
                <InfoValue>{appointmentDetails.patientName}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Médico:</InfoLabel>
                <InfoValue>{appointmentDetails.doctorName}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Especialidade:</InfoLabel>
                <InfoValue>{appointmentDetails.specialty}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Data/Hora:</InfoLabel>
                <InfoValue>{appointmentDetails.date} às {appointmentDetails.time}</InfoValue>
              </InfoRow>
            </AppointmentInfo>

            {/* Campo de motivo para cancelamento (opcional) */}
            {isCancel && (
              <ReasonContainer>
                <Input
                  label="Motivo do cancelamento (opcional)"
                  placeholder="Digite o motivo..."
                  value={reason}
                  onChangeText={setReason}
                  multiline
                  numberOfLines={3}
                  containerStyle={styles.reasonInput}
                />
              </ReasonContainer>
            )}

            {/* Mensagem de confirmação */}
            <ConfirmationText isCancel={isCancel}>
              {isCancel 
                ? 'Tem certeza que deseja cancelar esta consulta?'
                : 'Tem certeza que deseja confirmar esta consulta?'}
            </ConfirmationText>
          </Content>

          {/* ====== BOTÕES DE AÇÃO ====== */}
          <ButtonContainer>
            <Button
              title="Cancelar"
              onPress={handleClose}
              containerStyle={styles.cancelButton as ViewStyle}
              buttonStyle={styles.cancelButtonStyle}
            />
            <Button
              title={isCancel ? 'Confirmar Cancelamento' : 'Confirmar'}
              onPress={handleConfirm}
              containerStyle={styles.confirmButton as ViewStyle}
              buttonStyle={[
                styles.confirmButtonStyle,
                { backgroundColor: isCancel ? theme.colors.error : theme.colors.success }
              ]}
            />
          </ButtonContainer>

        </ModalContainer>
      </Overlay>
    </Modal>
  );
};

// ====== ESTILOS INLINE PARA OS BOTÕES E INPUT ======
const styles = {
  reasonInput: {
    marginBottom: 10,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  confirmButton: {
    flex: 1,
    marginLeft: 8,
  },
  cancelButtonStyle: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
  },
  confirmButtonStyle: {
    paddingVertical: 12,
  },
};

// ====== ESTILIZAÇÃO DOS COMPONENTES VISUAIS ======
const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  padding: 20px;
`;
// Fundo escuro transparente para o modal

const ModalContainer = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  shadow-color: ${theme.colors.text};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 5;
`;
// Container do conteúdo do modal

const Header = styled.View`
  padding: 20px 20px 10px 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;
// Cabeçalho com título

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.text};
  text-align: center;
`;
// Título do modal

const Content = styled.View`
  padding: 20px;
`;
// Conteúdo principal

const AppointmentInfo = styled.View`
  background-color: ${theme.colors.background};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;
// Bloco de informações da consulta

const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;
// Linha com label e valor

const InfoLabel = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  font-weight: 500;
`;

const InfoValue = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  font-weight: 400;
  flex: 1;
  text-align: right;
`;

const ReasonContainer = styled.View`
  margin-bottom: 16px;
`;
// Container do campo de motivo

const ConfirmationText = styled.Text<{ isCancel: boolean }>`
  font-size: 16px;
  color: ${(props) => props.isCancel ? theme.colors.error : theme.colors.success};
  text-align: center;
  margin-bottom: 20px;
  font-weight: 500;
`;
// Texto de confirmação (cancelar ou confirmar)

const ButtonContainer = styled.View`
  flex-direction: row;
  padding: 0 20px 20px 20px;
`;
// Container com os dois botões de ação

// ====== EXPORTAÇÃO DO COMPONENTE ======
export default AppointmentActionModal;
