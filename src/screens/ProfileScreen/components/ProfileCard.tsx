import React from "react";
import { User } from "../../../types/auth";
import {
  Avatar,
  Email,
  Name,
  ProfileCardContainer,
  RoleBadge,
  RoleText,
  SpecialtyText,
} from "../styles";

type ProfileCardProps = {
  user: User;
};

const getRoleText = (role: string) => {
  switch (role as User["role"]) {
    case "admin":
      return "Administrador";
    case "doctor":
      return "Médico";
    case "patient":
      return "Paciente";
    default:
      return role;
  }
};

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => (
  <ProfileCardContainer>
    <Avatar source={{ uri: user.image || "https://via.placeholder.com/150" }} />
    <Name>{user.name}</Name>
    <Email>{user.email}</Email>
    <RoleBadge role={user.role}>
      <RoleText>{getRoleText(user.role)}</RoleText>
    </RoleBadge>
    {user.role === "doctor" && (
      <SpecialtyText>Especialidade: {user.specialty}</SpecialtyText>
    )}
  </ProfileCardContainer>
);

export default ProfileCard;