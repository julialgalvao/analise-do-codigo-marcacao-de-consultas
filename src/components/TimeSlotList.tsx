// ====== IMPORTS DE DEPENDÊNCIAS E ESTILOS ======
import React from 'react';
import styled from 'styled-components/native';
import { ViewStyle, TouchableOpacity } from 'react-native';
import theme from '../styles/theme';

// ====== DEFINIÇÃO DE TIPOS DAS PROPRIEDADES ======
interface TimeSlotListProps {
  onSelectTime: (time: string) => void;  // Callback ao selecionar horário
  selectedTime?: string;                 // Horário atualmente selecionado
  style?: ViewStyle;                     // Estilo externo opcional
}

interface StyledProps {
  isSelected: boolean; // Usado para aplicar estilo condicional
}

// ====== COMPONENTE PRINCIPAL DA LISTA DE HORÁRIOS ======
const TimeSlotList: React.FC<TimeSlotListProps> = ({
  onSelectTime,
  selectedTime,
  style,
}) => {

  // Gera horários em intervalos de 30 minutos das 09:00 até 17:30
  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 9; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <Container style={style}>
      <TimeGrid>
        {timeSlots.map((time) => (
          <TimeCard
            key={time}
            onPress={() => onSelectTime(time)}
            isSelected={selectedTime === time}
          >
            <TimeText isSelected={selectedTime === time}>{time}</TimeText>
          </TimeCard>
        ))}
      </TimeGrid>
    </Container>
  );
};

// ====== ESTILIZAÇÃO DOS COMPONENTES VISUAIS ======

const Container = styled.View`
  margin-bottom: 15px;
`;
// Container externo com margem inferior

const TimeGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 6px;
`;
// Grid flexível para exibir os horários lado a lado

const TimeCard = styled(TouchableOpacity)<StyledProps>`
  width: 23%;
  padding: 8px;
  border-radius: 6px;
  background-color: ${(props) =>
    props.isSelected ? theme.colors.primary + '20' : theme.colors.background};
  border-width: 1px;
  border-color: ${(props) =>
    props.isSelected ? theme.colors.primary : theme.colors.border};
  align-items: center;
  justify-content: center;
`;
// Cartão individual de horário, com estilo condicional baseado na seleção

const TimeText = styled.Text<StyledProps>`
  font-size: 12px;
  font-weight: 500;
  color: ${(props) =>
    props.isSelected ? theme.colors.primary : theme.colors.text};
`;
// Texto do horário, com destaque se estiver selecionado

// ====== EXPORTAÇÃO DO COMPONENTE ======
export default TimeSlotList;
