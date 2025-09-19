import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, ViewStyle, TextStyle } from 'react-native';
import { Button, ListItem, Text } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import theme from '../styles/theme';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define o tipo da prop de navegação para esta tela, tipada pelo stack de navegação
type PatientDashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PatientDashboard'>;
};

// Interface para descrever os dados de uma consulta (appointment)
interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  specialty: string;
  status: 'pending' | 'confirmed' | 'cancelled'; // status pode ser um destes três
}

// Interface para as props estilizadas que utilizam o status da consulta
interface StyledProps {
  status: string;
}

// Função para retornar a cor baseada no status da consulta, usando o tema
const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return theme.colors.success; // verde para confirmada
    case 'cancelled':
      return theme.colors.error; // vermelho para cancelada
    default:
      return theme.colors.warning; // amarelo para pendente ou outros status
  }
};

// Função para retornar o texto em português do status da consulta
const getStatusText = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'Confirmada';
    case 'cancelled':
      return 'Cancelada';
    default:
      return 'Pendente';
  }
};

// Componente funcional da tela de dashboard do paciente
const PatientDashboardScreen: React.FC = () => {
  // Obtém o usuário autenticado e a função de logout do contexto Auth
  const { user, signOut } = useAuth();

  // Hook de navegação tipado para esta tela
  const navigation = useNavigation<PatientDashboardScreenProps['navigation']>();

  // Estado que guarda as consultas do paciente
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Estado para controle de loading (carregamento)
  const [loading, setLoading] = useState(true);

  // Função para carregar consultas do AsyncStorage
  const loadAppointments = async () => {
    try {
      // Recupera as consultas armazenadas no AsyncStorage (localStorage do React Native)
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');

      if (storedAppointments) {
        // Converte a string JSON para array de objetos Appointment
        const allAppointments: Appointment[] = JSON.parse(storedAppointments);

        // Filtra apenas as consultas do paciente logado
        const userAppointments = allAppointments.filter(
          (appointment) => appointment.patientId === user?.id
        );

        // Atualiza o estado com as consultas filtradas
        setAppointments(userAppointments);
      }
    } catch (error) {
      // Loga erro caso falhe ao carregar
      console.error('Erro ao carregar consultas:', error);
    } finally {
      // Independentemente do resultado, desativa loading
      setLoading(false);
    }
  };

  // Hook que executa efeito sempre que a tela ganha foco (quando usuário volta para ela)
  useFocusEffect(
    React.useCallback(() => {
      loadAppointments(); // Carrega as consultas sempre que a tela estiver em foco
    }, []) // Array vazio para executar apenas na montagem e foco
  );

  // JSX renderizado pelo componente
  return (
    <Container>
      {/* Header customizado */}
      <Header />

      {/* ScrollView com padding para rolagem das consultas e botões */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Título da tela */}
        <Title>Minhas Consultas</Title>

        {/* Botão para agendar nova consulta */}
        <Button
          title="Agendar Nova Consulta"
          onPress={() => navigation.navigate('CreateAppointment')} // Navega para tela de criação
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        {/* Botão para acessar perfil do usuário */}
        <Button
          title="Meu Perfil"
          onPress={() => navigation.navigate('Profile')} // Navega para perfil
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        {/* Botão para acessar configurações do app */}
        <Button
          title="Configurações"
          onPress={() => navigation.navigate('Settings')} // Navega para configurações
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.settingsButton}
        />

        {/* Se estiver carregando, mostra texto de loading */}
        {loading ? (
          <LoadingText>Carregando consultas...</LoadingText>

          // Se não estiver carregando, mas não houver consultas, mostra mensagem vazia
        ) : appointments.length === 0 ? (
          <EmptyText>Nenhuma consulta agendada</EmptyText>

          // Se houver consultas, mapeia e renderiza cada uma
        ) : (
          appointments.map((appointment) => (
            // Card estilizado para cada consulta
            <AppointmentCard key={appointment.id}>
              <ListItem.Content>
                {/* Nome do paciente */}
                <ListItem.Title style={styles.patientName as TextStyle}>
                  Paciente: {appointment.patientName}
                </ListItem.Title>

                {/* Data e hora da consulta */}
                <ListItem.Subtitle style={styles.dateTime as TextStyle}>
                  {appointment.date} às {appointment.time}
                </ListItem.Subtitle>

                {/* Nome do médico */}
                <Text style={styles.doctorName as TextStyle}>
                  {appointment.doctorName}
                </Text>

                {/* Especialidade médica */}
                <Text style={styles.specialty as TextStyle}>
                  {appointment.specialty}
                </Text>

                {/* Badge com o status da consulta (Confirmada, Cancelada, etc) */}
                <StatusBadge status={appointment.status}>
                  <StatusText status={appointment.status}>
                    {getStatusText(appointment.status)}
                  </StatusText>
                </StatusBadge>
              </ListItem.Content>
            </AppointmentCard>
          ))
        )}

        {/* Botão para sair (logout) */}
        <Button
          title="Sair"
          onPress={signOut} // Chama função de logout do contexto Auth
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.logoutButton}
        />
      </ScrollView>
    </Container>
  );
};

// Objeto com estilos para alguns componentes
const styles = {
  scrollContent: {
    padding: 20, // padding para o conteúdo do ScrollView
  },
  button: {
    marginBottom: 20, // margem inferior para espaçamento
    width: '100%', // largura total do container
  },
  buttonStyle: {
    backgroundColor: theme.colors.primary, // cor primária do tema
    paddingVertical: 12, // padding vertical interno do botão
  },
  logoutButton: {
    backgroundColor: theme.colors.error, // cor de erro (vermelho) para botão de logout
    paddingVertical: 12,
  },
  settingsButton: {
    backgroundColor: theme.colors.secondary, // cor secundária para botão de configurações
    paddingVertical: 12,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  specialty: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 4,
  },
  dateTime: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 4,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
};

// Container principal da tela, ocupa toda a tela e com fundo definido no tema
const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

// Título da tela, centralizado e estilizado
const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

// Card para cada consulta usando o componente ListItem estilizado
const AppointmentCard = styled(ListItem)`
  background-color: ${theme.colors.background};
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 15px;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

// Texto exibido durante o carregamento das consultas
const LoadingText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

// Texto exibido quando não há consultas agendadas
const EmptyText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

// Badge colorida que indica o status da consulta, a cor muda de acordo com o status
const StatusBadge = styled.View<StyledProps>`
  background-color: ${(props: StyledProps) => getStatusColor(props.status) + '20'}; // 20 = 12% de opacidade
  padding: 4px 8px;
  border-radius: 4px;
  align-self: flex-start; // fica alinhado à esquerda do container
  margin-top: 8px;
`;

// Texto dentro do badge, com a cor também dinâmica pelo status
const StatusText = styled.Text<StyledProps>`
  color: ${(props: StyledProps) => getStatusColor(props.status)};
  font-size: 12px;
  font-weight: 500;
`;

export default PatientDashboardScreen;
// Exporta o componente da tela do paciente