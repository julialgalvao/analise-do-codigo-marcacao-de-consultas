// ====== IMPORTAÇÕES DE DEPENDÊNCIAS E COMPONENTES ======
import React, { useState } from 'react'; // React e hook useState para estado local
import styled from 'styled-components/native'; // Estilização via styled-components para React Native
import { ScrollView, ViewStyle, TextStyle } from 'react-native'; // Componentes nativos do React Native
import { Button, ListItem, Text } from 'react-native-elements'; // Componentes UI prontos (botões, lista, texto)
import { useAuth } from '../contexts/AuthContext'; // Contexto customizado para autenticação
import { useNavigation } from '@react-navigation/native'; // Hook para navegação entre telas
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Tipagem para navegação nativa em stack
import { useFocusEffect } from '@react-navigation/native'; // Hook para executar efeito quando a tela ganha foco
import { RootStackParamList } from '../types/navigation'; // Tipagem para rotas da navegação
import theme from '../styles/theme'; // Tema padrão de cores, espaçamentos e tipografia
import Header from '../components/Header'; // Componente Header customizado
import StatisticsCard from '../components/StatisticsCard'; // Cartão para exibir estatísticas
import AppointmentActionModal from '../components/AppointmentActionModal'; // Modal para ações nas consultas
import { statisticsService, Statistics } from '../services/statistics'; // Serviço para pegar estatísticas
import { notificationService } from '../services/notifications'; // Serviço para enviar notificações
import AsyncStorage from '@react-native-async-storage/async-storage'; // Armazenamento local assíncrono

// ====== TIPAGEM DAS PROPS DE NAVEGAÇÃO DA TELA ======
type DoctorDashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DoctorDashboard'>;
};

// ====== TIPAGEM DOS OBJETOS DE CONSULTA ======
interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  specialty: string;
  status: 'pending' | 'confirmed' | 'cancelled'; // Status possível das consultas
}

// ====== TIPAGEM PARA PROPS ESTILIZADAS ======
interface StyledProps {
  status: string;
}

// ====== FUNÇÃO AUXILIAR PARA DEFINIR COR DO STATUS ======
const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return theme.colors.success; // Verde para confirmado
    case 'cancelled':
      return theme.colors.error; // Vermelho para cancelado
    default:
      return theme.colors.warning; // Amarelo para pendente
  }
};

// ====== FUNÇÃO AUXILIAR PARA TEXTO DO STATUS ======
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

// ====== COMPONENTE PRINCIPAL DA TELA DO DASHBOARD DO MÉDICO ======
const DoctorDashboardScreen: React.FC = () => {
  const { user, signOut } = useAuth(); // Usuário logado e função para sair
  const navigation = useNavigation<DoctorDashboardScreenProps['navigation']>(); // Hook de navegação tipado

  // Estado para armazenar as consultas do médico
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  // Estado para armazenar estatísticas do médico
  const [statistics, setStatistics] = useState<Partial<Statistics> | null>(null);
  // Estado para controlar loading da tela
  const [loading, setLoading] = useState(true);
  // Estado para controle de visibilidade do modal de ações
  const [modalVisible, setModalVisible] = useState(false);
  // Consulta selecionada para ações (confirmar/cancelar)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  // Tipo da ação a ser realizada no modal ('confirm' ou 'cancel')
  const [actionType, setActionType] = useState<'confirm' | 'cancel'>('confirm');

  // ====== FUNÇÃO PARA CARREGAR CONSULTAS E ESTATÍSTICAS ======
  const loadAppointments = async () => {
    try {
      // Pega as consultas armazenadas localmente
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');

      if (storedAppointments) {
        const allAppointments: Appointment[] = JSON.parse(storedAppointments);
        // Filtra somente consultas do médico logado
        const doctorAppointments = allAppointments.filter(
          (appointment) => appointment.doctorId === user?.id
        );
        setAppointments(doctorAppointments);
      }

      // Carrega estatísticas do médico via serviço externo
      if (user?.id) {
        const stats = await statisticsService.getDoctorStatistics(user.id);
        setStatistics(stats);
      }
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
    } finally {
      setLoading(false); // Termina loading independente do resultado
    }
  };

  // ====== ABRE O MODAL PARA CONFIRMAR OU CANCELAR CONSULTA ======
  const handleOpenModal = (appointment: Appointment, action: 'confirm' | 'cancel') => {
    setSelectedAppointment(appointment);
    setActionType(action);
    setModalVisible(true);
  };

  // ====== FECHA O MODAL E LIMPA A CONSULTA SELECIONADA ======
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedAppointment(null);
  };

  // ====== CONFIRMA A AÇÃO (CONFIRMAR OU CANCELAR) NO MODAL ======
  const handleConfirmAction = async (reason?: string) => {
    if (!selectedAppointment) return;

    try {
      // Pega as consultas armazenadas localmente
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');

      if (storedAppointments) {
        const allAppointments: Appointment[] = JSON.parse(storedAppointments);

        // Atualiza o status da consulta selecionada
        const updatedAppointments = allAppointments.map(appointment => {
          if (appointment.id === selectedAppointment.id) {
            return { 
              ...appointment, 
              status: actionType === 'confirm' ? 'confirmed' : 'cancelled',
              ...(reason && { cancelReason: reason }) // adiciona motivo de cancelamento se houver
            };
          }
          return appointment;
        });

        // Salva as consultas atualizadas localmente
        await AsyncStorage.setItem('@MedicalApp:appointments', JSON.stringify(updatedAppointments));

        // Envia notificação para o paciente conforme a ação realizada
        if (actionType === 'confirm') {
          await notificationService.notifyAppointmentConfirmed(
            selectedAppointment.patientId,
            selectedAppointment
          );
        } else {
          await notificationService.notifyAppointmentCancelled(
            selectedAppointment.patientId,
            selectedAppointment,
            reason
          );
        }

        loadAppointments(); // Recarrega as consultas para refletir mudanças
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  // ====== EXECUTA LOAD DAS CONSULTAS E ESTATÍSTICAS QUANDO A TELA RECEBE FOCO ======
  useFocusEffect(
    React.useCallback(() => {
      loadAppointments();
    }, [])
  );

  // ====== RETORNO DA INTERFACE VISUAL DA TELA ======
  return (
    <Container>
      {/* Cabeçalho fixo da aplicação */}
      <Header />

      {/* Conteúdo principal rolável */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Título da tela */}
        <Title>Minhas Consultas</Title>

        {/* Botão para navegar ao perfil */}
        <Button
          title="Meu Perfil"
          onPress={() => navigation.navigate('Profile')}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        {/* Botão para navegar às configurações */}
        <Button
          title="Configurações"
          onPress={() => navigation.navigate('Settings')}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.settingsButton}
        />

        {/* Seção de estatísticas */}
        <SectionTitle>Minhas Estatísticas</SectionTitle>
        {statistics && (
          <StatisticsGrid>
            {/* Cartões que mostram as estatísticas */}
            <StatisticsCard
              title="Total de Consultas"
              value={statistics.totalAppointments || 0}
              color={theme.colors.primary}
              subtitle="Todas as consultas"
            />
            <StatisticsCard
              title="Consultas Confirmadas"
              value={statistics.confirmedAppointments || 0}
              color={theme.colors.success}
              subtitle={`${(statistics.statusPercentages?.confirmed || 0).toFixed(1)}% do total`}
            />
            <StatisticsCard
              title="Pacientes Atendidos"
              value={statistics.totalPatients || 0}
              color={theme.colors.secondary}
              subtitle="Pacientes únicos"
            />
            <StatisticsCard
              title="Pendentes"
              value={statistics.pendingAppointments || 0}
              color={theme.colors.warning}
              subtitle="Aguardando confirmação"
            />
          </StatisticsGrid>
        )}

        {/* Seção de consultas */}
        <SectionTitle>Minhas Consultas</SectionTitle>
        {loading ? (
          // Mostra texto de carregamento enquanto carrega
          <LoadingText>Carregando consultas...</LoadingText>
        ) : appointments.length === 0 ? (
          // Texto quando não houver consultas
          <EmptyText>Nenhuma consulta agendada</EmptyText>
        ) : (
          // Lista de consultas em formato de cartões
          appointments.map((appointment) => (
            <AppointmentCard key={appointment.id}>
              <ListItem.Content>
                {/* Nome do paciente */}
                <ListItem.Title style={styles.patientName as TextStyle}>
                  Paciente: {appointment.patientName || 'Nome não disponível'}
                </ListItem.Title>
                {/* Data e horário da consulta */}
                <ListItem.Subtitle style={styles.dateTime as TextStyle}>
                  {appointment.date} às {appointment.time}
                </ListItem.Subtitle>
                {/* Especialidade médica */}
                <Text style={styles.specialty as TextStyle}>
                  {appointment.specialty}
                </Text>
                {/* Badge mostrando o status da consulta */}
                <StatusBadge status={appointment.status}>
                  <StatusText status={appointment.status}>
                    {getStatusText(appointment.status)}
                  </StatusText>
                </StatusBadge>
                {/* Botões de ação para consultas pendentes */}
                {appointment.status === 'pending' && (
                  <ButtonContainer>
                    <Button
                      title="Confirmar"
                      onPress={() => handleOpenModal(appointment, 'confirm')}
                      containerStyle={styles.actionButton as ViewStyle}
                      buttonStyle={styles.confirmButton}
                    />
                    <Button
                      title="Cancelar"
                      onPress={() => handleOpenModal(appointment, 'cancel')}
                      containerStyle={styles.actionButton as ViewStyle}
                      buttonStyle={styles.cancelButton}
                    />
                  </ButtonContainer>
                )}
              </ListItem.Content>
            </AppointmentCard>
          ))
        )}

        {/* Botão para sair do aplicativo */}
        <Button
          title="Sair"
          onPress={signOut}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.logoutButton}
        />

        {/* Modal para confirmar ou cancelar a consulta selecionada */}
        {selectedAppointment && (
          <AppointmentActionModal
            visible={modalVisible}
            onClose={handleCloseModal}
            onConfirm={handleConfirmAction}
            actionType={actionType}
            appointmentDetails={{
              patientName: selectedAppointment.patientName,
              doctorName: selectedAppointment.doctorName,
              date: selectedAppointment.date,
              time: selectedAppointment.time,
              specialty: selectedAppointment.specialty,
            }}
          />
        )}
      </ScrollView>
    </Container>
  );
};

// ====== ESTILIZAÇÃO VIA STYLEOBJECTS ======
const styles = {
  scrollContent: {
    padding: 20,
  },
  button: {
    marginBottom: 20,
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
  },
  logoutButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: 12,
  },
  settingsButton: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
  },
  actionButton: {
    marginTop: 8,
    width: '48%',
  },
  confirmButton: {
    backgroundColor: theme.colors.success,
    paddingVertical: 8,
  },
  cancelButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: 8,
  },
  dateTime: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  specialty: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
};

// ====== ESTILIZAÇÃO VIA STYLED COMPONENTS ======
const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;
// Container principal da tela

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;
// Título principal da tela

const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 15px;
  margin-top: 10px;
`;
// Título das seções: estatísticas e consultas

const AppointmentCard = styled(ListItem)`
  background-color: ${theme.colors.background};
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 15px;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;
// Cartão que envolve cada consulta na lista

const LoadingText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;
// Texto exibido durante o carregamento

const EmptyText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;
// Texto exibido quando não houver consultas

const StatusBadge = styled.View<StyledProps>`
  background-color: ${(props: StyledProps) => getStatusColor(props.status) + '20'}; 
  /* Cor com transparência para fundo */
  padding: 4px 8px;
  border-radius: 4px;
  align-self: flex-start;
  margin-top: 8px;
`;
// Badge com cor de fundo transparente para status

const StatusText = styled.Text<StyledProps>`
  color: ${(props: StyledProps) => getStatusColor(props.status)};
  font-size: 12px;
  font-weight: 500;
`;
// Texto dentro do badge com cor correspondente ao status

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 8px;
`;
// Container para botões "Confirmar" e "Cancelar" alinhados lado a lado

const StatisticsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 20px;
`;
// Container para organizar os cartões de estatísticas em grade

// ====== EXPORTAÇÃO DO COMPONENTE ======
export default DoctorDashboardScreen;
