import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Doctor, Appointment } from "../models/types";
import { useAuth } from "../../../contexts/AuthContext";
import { notificationService } from "../../../services/notifications";

export const useCreateAppointment = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createAppointment = async (
    date: string,
    time: string,
    doctor: Doctor
  ) => {
    try {
      setLoading(true);
      setError("");

      if (!date || !time || !doctor) {
        setError("Por favor, preencha todos os campos");
        return false;
      }

      // Criando o objeto Appointment com a tipagem correta
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        patientId: user?.id || "",
        patientName: user?.name || "",
        doctorId: doctor.id,
        doctorName: doctor.name,
        date,
        time,
        specialty: doctor.specialty,
        status: "pending" as const, // Usando tipo literal
      };

      // Salvando no AsyncStorage
      const storedAppointments = await AsyncStorage.getItem(
        "@MedicalApp:appointments"
      );
      const appointments: Appointment[] = storedAppointments
        ? JSON.parse(storedAppointments)
        : [];

      appointments.push(newAppointment);

      await AsyncStorage.setItem(
        "@MedicalApp:appointments",
        JSON.stringify(appointments)
      );

      // Enviando notificação
      await notificationService.notifyNewAppointment(doctor.id, newAppointment);

      return true;
    } catch (err) {
      setError("Erro ao agendar consulta. Tente novamente.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, createAppointment };
};