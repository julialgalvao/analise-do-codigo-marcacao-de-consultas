// ====== IMPORTS DE DEPENDÊNCIAS E COMPONENTES ======
import React, { useState } from 'react'; // React e hook para estado local
import styled from 'styled-components/native'; // Estilização via styled-components
import { ScrollView, ViewStyle } from 'react-native'; // Componentes nativos de scroll e estilo
import { Button, Input } from 'react-native-elements'; // Componentes UI prontos: botão e input
import { useAuth } from '../contexts/AuthContext'; // Contexto para obter dados do usuário logado
import { useNavigation } from '@react-navigation/native'; // Hook para navegação entre telas
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Tipagem da navegação stack
import { RootStackParamList } from '../types/navigation'; // Tipos das rotas de navegação
import theme from '../styles/theme'; // Tema padrão do app com cores e espaçamentos
import Header from '../components/Header'; // Cabeçalho customizado da aplicação
import DoctorList from '../components/DoctorList'; // Componente lista de médicos
import TimeSlotList from '../components/TimeSlotList'; // Componente lista de horários disponíveis
import { notificationService } from '../services/notifications'; // Serviço para notificações
import AsyncStorage from '@react-native-async-storage/async-storage'; // Armazenamento local assíncrono

// ====== TIPAGEM DAS PROPS DA TELA ======
type CreateAppointmentScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreateAppointment'>;
};

// ====== INTERFACES DE DADOS ======
interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  specialty: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

// ====== LISTA MOCKADA DE MÉDICOS DISPONÍVEIS ======
const availableDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. João Silva',
    specialty: 'Cardiologia',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: '2',
    name: 'Dra. Maria Santos',
    specialty: 'Pediatria',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: '3',
    name: 'Dr. Pedro Oliveira',
    specialty: 'Ortopedia',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    id: '4',
    name: 'Dra. Ana Costa',
    specialty: 'Dermatologia',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: '5',
    name: 'Dr. Carlos Mendes',
    specialty: 'Oftalmologia',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
];
// Lista fixa para testes. Futuramente pode vir de backend ou storage

// ====== COMPONENTE PRINCIPAL DA TELA ======
const CreateAppointmentScreen: React.FC = () => {
  // Contexto para obter dados do usuário logado
  const { user } = useAuth();

  // Hook de navegação para controle das telas
  const navigation = useNavigation<CreateAppointmentScreenProps['navigation']>();

  // Estados locais para armazenar entrada do usuário e controlar interface
  const [date, setDate] = useState(''); // Data selecionada
  const [selectedTime, setSelectedTime] = useState<string>(''); // Horário selecionado
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null); // Médico selecionado
  const [loading, setLoading] = useState(false); // Indicador de carregamento da ação
  const [error, setError] = useState(''); // Mensagem de erro para exibir ao usuário

  // ====== FUNÇÃO PARA CRIAR UMA NOVA CONSULTA ======
  const handleCreateAppointment = async () => {
    try {
      setLoading(true); // Ativa indicador de loading
      setError(''); // Limpa erros anteriores

      // Valida se todos os campos obrigatórios estão preenchidos
      if (!date || !selectedTime || !selectedDoctor) {
        setError('Por favor, preencha a data e selecione um médico e horário');
        return;
      }

      // Busca consultas já salvas no AsyncStorage
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
      const appointments: Appointment[] = storedAppointments ? JSON.parse(storedAppointments) : [];

      // Monta objeto da nova consulta
      const newAppointment: Appointment = {
        id: Date.now().toString(), // ID único usando timestamp
        patientId: user?.id || '', // ID do paciente logado
        patientName: user?.name || '',
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        date,
        time: selectedTime,
        specialty: selectedDoctor.specialty,
        status: 'pending', // Status inicial da consulta
      };

      // Adiciona nova consulta à lista existente
      appointments.push(newAppointment);

      // Salva a lista atualizada no AsyncStorage
      await AsyncStorage.setItem('@MedicalApp:appointments', JSON.stringify(appointments));

      // Envia notificação para o médico da nova consulta
      await notificationService.notifyNewAppointment(selectedDoctor.id, newAppointment);

      alert('Consulta agendada com sucesso!'); // Feedback para o usuário
      navigation.goBack(); // Retorna para tela anterior
    } catch (err) {
      setError('Erro ao agendar consulta. Tente novamente.'); // Mensagem de erro genérica
    } finally {
      setLoading(false); // Desativa indicador de loading
    }
  };

  // ====== RETORNO DA INTERFACE VISUAL ======
  return (
    <Container>
      <Header /> {/* Cabeçalho da aplicação */}

      {/* Conteúdo com scroll para acomodar campos */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Agendar Consulta</Title> {/* Título principal */}

        {/* Input para data da consulta */}
        <Input
          placeholder="Data (DD/MM/AAAA)"
          value={date}
          onChangeText={setDate}
          containerStyle={styles.input}
          keyboardType="numeric" // Teclado numérico para facilitar entrada da data
        />

        {/* Seção para selecionar horário */}
        <SectionTitle>Selecione um Horário</SectionTitle>
        <TimeSlotList
          onSelectTime={setSelectedTime} // Callback para atualizar horário selecionado
          selectedTime={selectedTime} // Valor do horário selecionado
        />

        {/* Seção para selecionar médico */}
        <SectionTitle>Selecione um Médico</SectionTitle>
        <DoctorList
          doctors={availableDoctors} // Lista de médicos mockada
          onSelectDoctor={setSelectedDoctor} // Callback para atualizar médico selecionado
          selectedDoctorId={selectedDoctor?.id} // Médico atualmente selecionado
        />

        {/* Exibe mensagem de erro, se houver */}
        {error ? <ErrorText>{error}</ErrorText> : null}

        {/* Botão para confirmar agendamento */}
        <Button
          title="Agendar"
          onPress={handleCreateAppointment}
          loading={loading} // Mostra spinner durante ação assíncrona
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        {/* Botão para cancelar e voltar */}
        <Button
          title="Cancelar"
          onPress={() => navigation.goBack()}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.cancelButton}
        />
      </ScrollView>
    </Container>
  );
};

// ====== ESTILIZAÇÃO INLINE ======
const styles = {
  scrollContent: {
    padding: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
  },
  cancelButton: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
  },
};

// ====== ESTILIZAÇÃO VIA STYLED-COMPONENTS ======
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
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 10px;
  margin-top: 10px;
`;
// Títulos das seções (horário e médico)

const ErrorText = styled.Text`
  color: ${theme.colors.error};
  text-align: center;
  margin-bottom: 10px;
`;
// Texto de erro exibido ao usuário

export default CreateAppointmentScreen;
// Exporta o componente para uso em outras partes do app