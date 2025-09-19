import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, ViewStyle, Alert, Share } from 'react-native';
import { Button, ListItem, Switch, Text } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import theme from '../styles/theme';
import Header from '../components/Header';
import { storageService } from '../services/storage';

// Define o tipo para a prop de navegação da tela de configurações
type SettingsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

// Interface que define o formato das configurações do app
interface AppSettings {
  notifications: boolean; // Receber notificações push
  autoBackup: boolean;    // Realizar backup automático
  theme: 'light' | 'dark'; // Tema do app
  language: string;       // Idioma selecionado
}

// Componente funcional da tela de configurações
const SettingsScreen: React.FC = () => {
  // Extrai o usuário autenticado e a função para sair da sessão
  const { user, signOut } = useAuth();

  // Hook para navegação com tipagem para esta tela
  const navigation = useNavigation<SettingsScreenProps['navigation']>();

  // Estado com as configurações do app, valores iniciais padrão
  const [settings, setSettings] = useState<AppSettings>({
    notifications: true,
    autoBackup: true,
    theme: 'light',
    language: 'pt-BR',
  });

  // Estado para indicar carregamento dos dados
  const [loading, setLoading] = useState(true);

  // Estado para armazenar informações sobre o armazenamento/cache
  const [storageInfo, setStorageInfo] = useState<any>(null);

  // Função para carregar as configurações do storage e informações de armazenamento
  const loadSettings = async () => {
    try {
      // Pega as configurações salvas do storage
      const appSettings = await storageService.getAppSettings();
      setSettings(appSettings);
      
      // Pega informações do cache e armazenamento
      const info = await storageService.getStorageInfo();
      setStorageInfo(info);
    } catch (error) {
      // Em caso de erro, loga no console para debugging
      console.error('Erro ao carregar configurações:', error);
    } finally {
      // Finaliza o carregamento, removendo indicador
      setLoading(false);
    }
  };

  // Hook para recarregar as configurações sempre que a tela ganha foco
  useFocusEffect(
    React.useCallback(() => {
      loadSettings();
    }, [])
  );

  // Função para atualizar uma configuração específica
  const updateSetting = async (key: keyof AppSettings, value: any) => {
    try {
      // Cria uma cópia atualizada das configurações
      const updatedSettings = { ...settings, [key]: value };
      // Atualiza estado local para refletir a mudança imediatamente
      setSettings(updatedSettings);
      // Atualiza a configuração no armazenamento persistente
      await storageService.updateAppSettings({ [key]: value });
    } catch (error) {
      // Caso ocorra erro, exibe alerta e loga no console
      console.error('Erro ao atualizar configuração:', error);
      Alert.alert('Erro', 'Não foi possível salvar a configuração');
    }
  };

  // Função para criar um backup dos dados do app e compartilhar
  const handleCreateBackup = async () => {
    try {
      setLoading(true); // Ativa indicador de carregamento
      
      // Gera o backup chamando o serviço
      const backup = await storageService.createBackup();
      
      // Define um nome de arquivo com a data atual
      const fileName = `backup_${new Date().toISOString().split('T')[0]}.json`;
      
      // Usa a API de compartilhamento para enviar o backup
      await Share.share({
        message: backup,
        title: `Backup do App - ${fileName}`,
      });
      
      // Mostra mensagem de sucesso após compartilhar
      Alert.alert('Sucesso', 'Backup criado e compartilhado com sucesso!');
    } catch (error) {
      // Em caso de erro, exibe alerta e loga o erro
      console.error('Erro ao criar backup:', error);
      Alert.alert('Erro', 'Não foi possível criar o backup');
    } finally {
      // Finaliza o carregamento, removendo indicador
      setLoading(false);
    }
  };

  // Função para limpar o cache, com confirmação via Alert
  const handleClearCache = async () => {
    Alert.alert(
      'Limpar Cache',
      'Isso irá limpar o cache da aplicação. Tem certeza?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            try {
              // Limpa o cache via serviço de armazenamento
              storageService.clearCache();
              // Recarrega as configurações para atualizar a UI
              await loadSettings();
              // Informa sucesso ao usuário
              Alert.alert('Sucesso', 'Cache limpo com sucesso!');
            } catch (error) {
              // Alerta se falhar ao limpar cache
              Alert.alert('Erro', 'Não foi possível limpar o cache');
            }
          },
        },
      ]
    );
  };

  // Função para apagar todos os dados do app com múltiplas confirmações
  const handleClearAllData = async () => {
    Alert.alert(
      'Apagar Todos os Dados',
      'ATENÇÃO: Isso irá apagar TODOS os dados da aplicação permanentemente. Esta ação não pode ser desfeita!',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'APAGAR TUDO',
          style: 'destructive',
          onPress: async () => {
            Alert.alert(
              'Confirmação Final',
              'Tem certeza absoluta? Todos os dados serão perdidos!',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'SIM, APAGAR',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      // Limpa todos os dados do armazenamento
                      await storageService.clearAll();
                      // Alerta que a ação foi concluída e força logout
                      Alert.alert('Concluído', 'Todos os dados foram apagados. O app será reiniciado.', [
                        { text: 'OK', onPress: () => signOut() }
                      ]);
                    } catch (error) {
                      Alert.alert('Erro', 'Não foi possível apagar os dados');
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  // Enquanto dados carregam, exibe tela de loading simples
  if (loading) {
    return (
      <Container>
        <Header />
        <LoadingContainer>
          <LoadingText>Carregando configurações...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  // Renderiza a interface principal da tela de configurações
  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Título principal */}
        <Title>Configurações</Title>

        {/* Seção de Preferências */}
        <SectionTitle>Preferências</SectionTitle>
        <SettingsCard>
          {/* Item para controle de notificações */}
          <ListItem>
            <ListItem.Content>
              <ListItem.Title>Notificações</ListItem.Title>
              <ListItem.Subtitle>Receber notificações push</ListItem.Subtitle>
            </ListItem.Content>
            <Switch
              value={settings.notifications} // Estado atual
              onValueChange={(value) => updateSetting('notifications', value)} // Atualiza no storage
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }} // Cores do switch
            />
          </ListItem>

          {/* Item para controle de backup automático */}
          <ListItem>
            <ListItem.Content>
              <ListItem.Title>Backup Automático</ListItem.Title>
              <ListItem.Subtitle>Criar backups automaticamente</ListItem.Subtitle>
            </ListItem.Content>
            <Switch
              value={settings.autoBackup}
              onValueChange={(value) => updateSetting('autoBackup', value)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            />
          </ListItem>
        </SettingsCard>

        {/* Seção para dados e armazenamento */}
        <SectionTitle>Dados e Armazenamento</SectionTitle>
        <SettingsCard>
          {/* Mostra informações do armazenamento se disponíveis */}
          {storageInfo && (
            <>
              <InfoItem>
                <InfoLabel>Itens no Cache:</InfoLabel>
                <InfoValue>{storageInfo.cacheSize}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Total de Chaves:</InfoLabel>
                <InfoValue>{storageInfo.totalKeys}</InfoValue>
              </InfoItem>
            </>
          )}
        </SettingsCard>

        {/* Botão para criar backup manual */}
        <Button
          title="Criar Backup"
          onPress={handleCreateBackup}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.backupButton}
          loading={loading}
        />

        {/* Botão para limpar cache */}
        <Button
          title="Limpar Cache"
          onPress={handleClearCache}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.cacheButton}
        />

        {/* Seção para ações perigosas */}
        <SectionTitle>Ações Perigosas</SectionTitle>
        {/* Botão para apagar todos os dados */}
        <Button
          title="Apagar Todos os Dados"
          onPress={handleClearAllData}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.dangerButton}
        />

        {/* Botão para voltar para a tela anterior */}
        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />
      </ScrollView>
    </Container>
  );
};

// Estilos para componentes e botões
const styles = {
  scrollContent: {
    padding: 20, // Padding interno do ScrollView
  },
  button: {
    marginBottom: 15, // Espaçamento inferior para os botões
    width: '100%',    // Botões com largura total do container
  },
  buttonStyle: {
    backgroundColor: theme.colors.primary, // Cor primária para botão padrão
    paddingVertical: 12,                    // Padding vertical para o toque confortável
  },
  backupButton: {
    backgroundColor: theme.colors.success, // Cor verde para ações de sucesso
    paddingVertical: 12,
  },
  cacheButton: {
    backgroundColor: theme.colors.warning, // Cor amarela para alerta leve
    paddingVertical: 12,
  },
  dangerButton: {
    backgroundColor: theme.colors.error,   // Cor vermelha para ações perigosas
    paddingVertical: 12,
  },
};

// Container principal com background
const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

// Container centralizado para tela de loading
const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

// Texto do loading
const LoadingText = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
`;

// Título principal da tela
const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

// Título das seções
const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 10px;
  margin-top: 20px;
`;

// Card para agrupar configurações
const SettingsCard = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 8px;
  margin-bottom: 15px;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

// Linha de informação (label e valor)
const InfoItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;

// Label da informação
const InfoLabel = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
`;

// Valor da informação com destaque
const InfoValue = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${theme.colors.primary};
`;

export default SettingsScreen;
// Exporta o componente da tela de configurações