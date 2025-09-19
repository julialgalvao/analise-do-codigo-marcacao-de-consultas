// ====== IMPORTS DE DEPENDÊNCIAS E ESTILOS ======
import React from 'react';
import styled from 'styled-components/native'; // Estilização dos componentes
import { ViewStyle } from 'react-native'; // Tipagem para estilos personalizados
import { ListItem, Avatar } from 'react-native-elements'; // Componentes visuais reutilizáveis
import theme from '../styles/theme'; // Tema visual da aplicação

// ====== TIPAGEM DOS DADOS DO MÉDICO ======
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

// ====== TIPAGEM DAS PROPRIEDADES DO COMPONENTE ======
interface DoctorListProps {
  doctors: Doctor[]; // Lista de médicos
  onSelectDoctor: (doctor: Doctor) => void; // Função executada ao selecionar um médico
  selectedDoctorId?: string; // ID do médico atualmente selecionado
  style?: ViewStyle; // Estilo personalizado opcional
}

// ====== COMPONENTE PRINCIPAL: LISTA DE MÉDICOS ======
const DoctorList: React.FC<DoctorListProps> = ({
  doctors,
  onSelectDoctor,
  selectedDoctorId,
  style,
}) => {
  return (
    <Container style={style}>
      {doctors.map((doctor) => (
        <ListItem
          key={doctor.id}
          onPress={() => onSelectDoctor(doctor)}
          containerStyle={[
            styles.listItem,
            selectedDoctorId === doctor.id && styles.selectedItem,
          ]}
        >
          <Avatar
            size="medium"
            rounded
            source={{ uri: doctor.image }}
            containerStyle={styles.avatar}
          />
          <ListItem.Content>
            <ListItem.Title style={styles.name}>{doctor.name}</ListItem.Title>
            <ListItem.Subtitle style={styles.specialty}>
              {doctor.specialty}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ))}
    </Container>
  );
};

// ====== ESTILOS INLINE ======
const styles = {
  listItem: {
    borderRadius: 8,
    marginVertical: 4,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedItem: {
    backgroundColor: theme.colors.primary + '20', // Cor com transparência
    borderColor: theme.colors.primary,
  },
  avatar: {
    backgroundColor: theme.colors.primary,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  specialty: {
    fontSize: 14,
    color: theme.colors.text,
    opacity: 0.7,
  },
};

// ====== ESTILO DO CONTAINER PRINCIPAL ======
const Container = styled.View`
  margin-bottom: 15px;
`;

// ====== EXPORTAÇÃO DO COMPONENTE ======
export default DoctorList;
