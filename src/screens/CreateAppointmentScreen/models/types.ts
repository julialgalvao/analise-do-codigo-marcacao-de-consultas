import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types/navigation";

export type CreateAppointmentScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "CreateAppointment">;
};

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  specialty: string;
  status: "pending" | "confirmed" | "cancelled";
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
}