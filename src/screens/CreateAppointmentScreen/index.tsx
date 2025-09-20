import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/Header";
import { AppointmentForm } from "./components/AppointmentForm";
import { useCreateAppointment } from "./hooks/useCreateAppointment";
import { Doctor, CreateAppointmentScreenProps } from "./models/types";
import { availableDoctors } from "./models/mockData";
import { ActionButtons } from './components/ActionButtons';
import {
  Container,
  ScrollContainer,
  Title,
  ErrorText,
} from "./styles";

const CreateAppointmentScreen: React.FC = () => {
  const navigation = useNavigation<CreateAppointmentScreenProps["navigation"]>();
  const { loading, error, createAppointment } = useCreateAppointment();
  
  const [date, setDate] = useState("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const handleCreateAppointment = async () => {
    if (selectedDoctor && await createAppointment(date, selectedTime, selectedDoctor)) {
      alert("Consulta agendada com sucesso!");
      navigation.goBack();
    }
  };

  return (
    <Container>
      <Header />
      <ScrollContainer>
        <Title>Agendar Consulta</Title>

        <AppointmentForm
          date={date}
          setDate={setDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          selectedDoctor={selectedDoctor}
          setSelectedDoctor={setSelectedDoctor}
          availableDoctors={availableDoctors}
        />

        {error ? <ErrorText>{error}</ErrorText> : null}

        <ActionButtons
          loading={loading}
          onSubmit={handleCreateAppointment}
          onCancel={() => navigation.goBack()}
        />
      </ScrollContainer>
    </Container>
  );
};

export default CreateAppointmentScreen;