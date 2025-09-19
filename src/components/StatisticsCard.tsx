// ====== IMPORTS DE DEPENDÊNCIAS E TEMA ======
import React from 'react';
import styled from 'styled-components/native'; // Estilização baseada em tema
import { ViewStyle } from 'react-native'; // Tipagem para estilos externos
import theme from '../styles/theme'; // Tema visual da aplicação

// ====== DEFINIÇÃO DE TIPOS DAS PROPRIEDADES ======
interface StatisticsCardProps {
  title: string; // Título da estatística (ex: "Consultas do Dia")
  value: string | number; // Valor principal (ex: 12 ou "100%")
  subtitle?: string; // Texto auxiliar abaixo do valor
  color?: string; // Cor personalizada (ex: para diferenciar tipos de estatísticas)
  icon?: React.ReactNode; // Ícone opcional no cabeçalho
  style?: ViewStyle; // Estilo externo customizável
}

// ====== COMPONENTE PRINCIPAL DO CARTÃO DE ESTATÍSTICA ======
const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  subtitle,
  color = theme.colors.primary, // Cor padrão do tema
  icon,
  style,
}) => {
  return (
    <Container style={style} color={color}>
      <Header>
        {icon && <IconContainer>{icon}</IconContainer>}
        <Title>{title}</Title>
      </Header>
      <Value color={color}>{value}</Value>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </Container>
  );
};

// ====== ESTILIZAÇÃO DOS COMPONENTES VISUAIS ======

const Container = styled.View<{ color: string }>`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  padding: 16px;
  margin: 8px;
  min-height: 120px;
  justify-content: space-between;

  border-left-width: 4px;
  border-left-color: ${(props) => props.color};

  shadow-color: ${theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;
// Container geral do card com borda lateral colorida e sombra

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;
// Cabeçalho do card (título + ícone)

const IconContainer = styled.View`
  margin-right: 8px;
`;
// Espaçamento para o ícone opcional

const Title = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  font-weight: 500;
  opacity: 0.8;
`;
// Título da estatística

const Value = styled.Text<{ color: string }>`
  font-size: 28px;
  font-weight: bold;
  color: ${(props) => props.color};
  margin-bottom: 4px;
`;
// Valor principal com destaque na cor

const Subtitle = styled.Text`
  font-size: 12px;
  color: ${theme.colors.text};
  opacity: 0.6;
`;
// Texto auxiliar abaixo do valor (se fornecido)


// ====== EXPORTAÇÃO DO COMPONENTE ======
export default StatisticsCard;
