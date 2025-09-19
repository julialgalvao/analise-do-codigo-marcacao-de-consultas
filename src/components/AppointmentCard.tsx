// ====== IMPORTS DE DEPENDÊNCIAS E ESTILOS ======
import React from 'react';
import styled from 'styled-components/native'; // Estilização dos componentes
import { ViewStyle } from 'react-native'; // Tipo para estilização externa
import { Card, Text, Avatar } from 'react-native-elements'; // Componentes visuais prontos
import theme from '../styles/theme'; // Tema padronizado da aplicação

// ====== TIPAGEM DAS PROPRIEDADES DO COMPONENTE ======
interface AppointmentCardProps {
  doctorName: string; // Nome do médico
  date: string;       // Data da consulta
  time: string;       // Horário da consulta
  specialty: string;  // Especialidade médica
  status: 'pending' | 'confirmed' | 'cancelled'; // Status atual da consulta
  onPress?: () => void; // Ação ao pressionar (opcional)
  style?: ViewStyle;     // Estilo customizado (opcional)
}

// ====== COMPONENTE DE CARTÃO DE CONSULTA ======
const AppointmentCard: React.FC<AppointmentCardProps> = ({
  doctorName,
  date,
  time,
  specialty,
  status,
  onPress,
  style,
}) => {

  // Define a cor do status com base no tipo
  const getStatusColor = () => {
    switch (status) {
      case 'confirmed':
        return theme.colors.success;
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  // ====== RENDERIZAÇÃO DO CARTÃO ======
  return (
    <Card containerStyle={[styles.card, style]}>
      <CardContent>

        {/* ====== INFORMAÇÕES DO MÉDICO ====== */}
        <DoctorInfo>
          <Avatar
            size="medium"
            rounded
            source={{
              uri: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 10)}.jpg`,
            }}
            containerStyle={styles.avatar}
          />
          <TextContainer>
            <DoctorName>{doctorName}</DoctorName>
            <Specialty>{specialty}</Specialty>
          </TextContainer>
        </DoctorInfo>

        {/* ====== INFORMAÇÕES DA CONSULTA ====== */}
        <AppointmentInfo>
          <InfoRow>
            <InfoLabel>Data:</InfoLabel>
            <InfoValue>{date}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Horário:</InfoLabel>
            <InfoValue>{time}</InfoValue>
          </InfoRow>
        </AppointmentInfo>

        {/* ====== STATUS DA CONSULTA ====== */}
        <StatusContainer>
          <StatusDot color={getStatusColor()} />
          <StatusText color={getStatusColor()}>
            {status === 'confirmed'
              ? 'Confirmada'
              : status === 'cancelled'
              ? 'Cancelada'
              : 'Pendente'}
          </StatusText>
        </StatusContainer>

      </CardContent>
    </Card>
  );
};

// ====== ESTILOS INLINE DO CARD ======
const styles = {
  card: {
    borderRadius: 10,
    marginHorizontal: 0,
    marginVertical: 8,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  avatar: {
    backgroundColor: theme.colors.primary,
  },
};

// ====== ESTILIZAÇÃO DOS COMPONENTES ======

const CardContent = styled.View`
  padding: 10px;
`;
// Container interno do card

const DoctorInfo = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;
// Linha com avatar e nome do médico

const TextContainer = styled.View`
  margin-left: 15px;
`;
// Espaço entre avatar e texto

const DoctorName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text};
`;
// Nome do médico

const Specialty = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  opacity: 0.7;
`;
// Especialidade do médico

const AppointmentInfo = styled.View`
  margin-bottom: 15px;
`;
// Container das infos da consulta

const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;
`;
// Linha de label e valor (data/hora)

const InfoLabel = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  opacity: 0.7;
`;
// Label da info

const InfoValue = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  font-weight: 500;
`;
// Valor da info (data ou hora)

const StatusContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;
// Container do status

const StatusDot = styled.View<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${props => props.color};
  margin-right: 8px;
`;
// Bolinha colorida do status

const StatusText = styled.Text<{ color: string }>`
  font-size: 14px;
  color: ${props => props.color};
  font-weight: 500;
`;
// Texto com status da consulta

// ====== EXPORTAÇÃO DO COMPONENTE ======
export default AppointmentCard;
