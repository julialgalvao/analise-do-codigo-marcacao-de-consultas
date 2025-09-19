import { Button } from "react-native-elements";
import { FontAwesome } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types/navigation";
import theme from "../../../styles/theme"

export const CreateAppointmentButton = (handleCreateAppointment: any) => {
    return (
    <Button
        title="Agendar Nova Consulta"
        icon={
        <FontAwesome
            name="calendar-plus-o"
            size={20}
            color="white"
            style={{ marginRight: 8 }}
        />
        }
        buttonStyle={{
        backgroundColor: theme.colors.primary,
        borderRadius: 8,
        padding: 12,
        marginBottom: theme.spacing.medium,
        }}
        onPress={() => {handleCreateAppointment}}
    />
    )
}

export default CreateAppointmentButton;