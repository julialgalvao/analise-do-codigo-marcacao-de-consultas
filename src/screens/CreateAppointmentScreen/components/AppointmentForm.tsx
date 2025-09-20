import React from "react";
import { Input } from "react-native-elements";
import { Doctor } from "../models/types";
import { FormContainer, SectionTitle } from "../styles";
import DoctorList from "../../../components/DoctorList";
import TimeSlotList from "../../../components/TimeSlotList";

interface AppointmentFormProps {
  date: string;
  setDate: (date: string) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  selectedDoctor: Doctor | null;
  setSelectedDoctor: (doctor: Doctor | null) => void;
  availableDoctors: Doctor[];
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  date,
  setDate,
  selectedTime,
  setSelectedTime,
  selectedDoctor,
  setSelectedDoctor,
  availableDoctors,
}) => (
  <FormContainer>
    <Input
      placeholder="Data (DD/MM/AAAA)"
      value={date}
      onChangeText={setDate}
      keyboardType="numeric"
    />

    <SectionTitle>Selecione um Horário</SectionTitle>
    <TimeSlotList
      onSelectTime={setSelectedTime}
      selectedTime={selectedTime}
    />

    <SectionTitle>Selecione um Médico</SectionTitle>
    <DoctorList
      doctors={availableDoctors}
      onSelectDoctor={setSelectedDoctor}
      selectedDoctorId={selectedDoctor?.id}
    />
  </FormContainer>
);