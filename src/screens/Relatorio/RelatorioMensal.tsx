import React, { useState, useEffect, useCallback } from 'react';
import { View, RefreshControl, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome5';
import { AppDispatch, useAppSelector } from '~/store';
import { Dropdown } from 'react-native-element-dropdown';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CardRelatorio from '~/components/CardRelatorio';
import { useDispatch } from 'react-redux';
import { fetchRelatorios } from '~/store/dashboard/dashboard-slice';
import ItemMembresiaRelatorioMensal from '~/components/ItemMembresiaRelatorioMensal';
import CustomAlertExportFile from '~/components/CustomAlertExportFile';
import api from '~/services/api';
import { Buffer } from 'buffer';

interface MembresiaItem {
  nome: string;
  quantidade: number;
}

interface RelatorioMensalProps {
  navigation: any;
}

const date = new Date();

const mesesData = [
  { label: 'Janeiro', value: '1' },
  { label: 'Fevereiro', value: '2' },
  { label: 'Março', value: '3' },
  { label: 'Abril', value: '4' },
  { label: 'Maio', value: '5' },
  { label: 'Junho', value: '6' },
  { label: 'Julho', value: '7' },
  { label: 'Agosto', value: '8' },
  { label: 'Setembro', value: '9' },
  { label: 'Outubro', value: '10' },
  { label: 'Novembro', value: '11' },
  { label: 'Dezembro', value: '12' },
];

const schema = yup.object().shape({
  mes: yup.number().required('Mês é obrigatório'),
  ano: yup.number().required('Ano é obrigatório'),
});

const RelatorioMensal: React.FC<RelatorioMensalProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const dashboardData = useAppSelector((state) => state.dashboard);

  const currentYear = date.getFullYear();

  const [localRefreshing, setLocalRefreshing] = useState<boolean>(false);
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('info');

  const showAlert = (message: string, type: 'success' | 'error' | 'info') => {
    setAlertMessage(message);
    setAlertType(type);
    setIsAlertVisible(true);
  };

  const hideAlert = () => {
    setIsAlertVisible(false);
    setAlertMessage('');
  };

  const generateYears = useCallback(() => {
    const years: { label: string; value: string }[] = [];
    for (let i = currentYear - 5; i <= currentYear; i++) {
      years.push({ label: String(i), value: String(i) });
    }
    return years;
  }, [currentYear]);
  const yearsData = generateYears();

  const { control, watch, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      mes: dashboardData.mes,
      ano: dashboardData.ano,
    },
  });

  const formMes = watch('mes');
  const formAno = watch('ano');

  useEffect(() => {
    if (formMes && formAno) {
      dispatch(fetchRelatorios({ mes : formMes, ano: formAno}));
    }
  }, [dispatch, formMes, formAno]);

  const onRefresh = useCallback(() => {
      setLocalRefreshing(true);
      dispatch(fetchRelatorios({ mes : formMes, ano: formAno})).finally(() => {
      setLocalRefreshing(false);
    });
  }, [dispatch, formMes, formAno]);

  const obterNomeMes = (numeroMes: string): string => {
    return mesesData.find(m => m.value === numeroMes)?.label || '';
  };

  const exportarRelatorioPDF = useCallback(async () => {
    const mes = String(dashboardData.mes);
    const ano = String(dashboardData.ano);
    const nomeMes = obterNomeMes(mes);
    
    const fileName = `relatorio-pastoral-mensal-${nomeMes}-${ano}.pdf`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    try {
      const response = await api.get(`/relatorio/exportar-pdf?mes=${mes}&ano=${ano}`, {
        responseType: 'arraybuffer' 
      });

      const pdfArrayBuffer = response.data;

      const base64Content = Buffer.from(pdfArrayBuffer).toString('base64');
      
      await FileSystem.writeAsStringAsync(filePath, base64Content, { 
          encoding: FileSystem.EncodingType.Base64
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, { mimeType: 'application/pdf' });
        showAlert('Relatório exportado com sucesso como PDF!', 'success');
      } else {
        showAlert('Compartilhamento de arquivo não disponível neste dispositivo.', 'info');
      }

    } catch (e: any) {
      showAlert(`Erro ao exportar relatório PDF: ${e.message}`, 'error');
    }
  }, [dashboardData.mes, dashboardData.ano, obterNomeMes, showAlert]);

  const exportarRelatorioExcel = useCallback(async () => {
    const mes = String(dashboardData.mes);
    const ano = String(dashboardData.ano);
    const nomeMes = obterNomeMes(mes);
    
    const fileName = `relatorio-pastoral-${nomeMes}-${ano}.xlsx`;
    const excelMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    
    try {
      const response = await api.get(`/relatorio/exportar-excel?mes=${mes}&ano=${ano}`, {
        responseType: 'arraybuffer' 
      });

      const excelArrayBuffer = response.data;

      const filePath = `${FileSystem.documentDirectory}${fileName}`;
      
      const base64Content = Buffer.from(excelArrayBuffer).toString('base64');
      
      await FileSystem.writeAsStringAsync(filePath, base64Content, { 
        encoding: FileSystem.EncodingType.Base64 
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, { 
          mimeType: excelMimeType,
          UTI: 'com.microsoft.excel.xlsx'
        });
        showAlert('Relatório exportado com sucesso como Excel!', 'success');
      } else {
        showAlert('Compartilhamento não disponível.', 'info');
      }
    } catch (e: any) {
      showAlert(`Erro ao exportar relatório Excel: ${e.message}`, 'error');
    }
  }, [dashboardData.mes, dashboardData.ano, obterNomeMes, showAlert]);

  return (
    <View style={styles.container}>
      <CustomAlertExportFile
        isVisible={isAlertVisible}
        message={alertMessage}
        type={alertType}
        onClose={hideAlert}
      />
      <ScrollView refreshControl={<RefreshControl refreshing={localRefreshing} onRefresh={onRefresh} />}>
        <View style={styles.headerButtonsExport}>
          <TouchableOpacity style={styles.buttonOpacityExport} onPress={exportarRelatorioPDF}>
            <View style={styles.containerViewButtonExport}>
              <Icon name="file-pdf" color="white" size={20} />
              <Text style={styles.textButtonExport}>Exportar para PDF</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonOpacityExport} onPress={exportarRelatorioExcel}>
            <View style={styles.containerViewButtonExport}>
              <Icon name="file-excel" color="white" size={20} />
              <Text style={styles.textButtonExport}>Exportar para EXCEL</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.header}>
          <View style={styles.firstSelectButton}>
            <Controller
              control={control}
              name="mes"
              render={({ field: { onChange, value } }) => (
                <Dropdown
                  style={[styles.dropdown2BtnStyle, styles.elevation]}
                  placeholderStyle={styles.dropdown2BtnTxtStyle}
                  selectedTextStyle={styles.dropdown2BtnTxtStyle}
                  data={mesesData}
                  labelField="label"
                  valueField="value"
                  placeholder="Selecione o Mês"
                  value={String(value)}
                  onChange={(item) => {
                    onChange(item.value);
                  }}
                  renderRightIcon={(isOpened) => (
                    <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#fff'} size={18} />
                  )}
                  containerStyle={styles.dropdown2DropdownStyle}
                  itemContainerStyle={styles.dropdown2RowStyle}
                  itemTextStyle={styles.dropdown2RowTxtStyle}
                  activeColor='#093822'
                />
              )}
            />
          </View>
          <View style={styles.secondSelectButton}>
            <Controller
              control={control}
              name="ano"
              render={({ field: { onChange, value } }) => (
                <Dropdown
                  style={[styles.dropdown2BtnStyle, styles.elevation]}
                  placeholderStyle={styles.dropdown2BtnTxtStyle}
                  selectedTextStyle={styles.dropdown2BtnTxtStyle}
                  data={yearsData}
                  labelField="label"
                  valueField="value"
                  placeholder="Selecione o Ano"
                  value={String(value)}
                  onChange={(item) => {
                    onChange(item.value);
                  }}
                  renderRightIcon={(isOpened) => (
                    <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#fff'} size={18} />
                  )}
                  containerStyle={styles.dropdown2DropdownStyle}
                  itemContainerStyle={styles.dropdown2RowStyle}
                  itemTextStyle={styles.dropdown2RowTxtStyle}
                  activeColor='#093822'
                />
              )}
            />
          </View>
        </View>
        <View style={styles.rowCards}>
          <CardRelatorio
            title="Crentes"
            value={dashboardData.crentes}
            isVisita={true}
            iconName="cross"
            iconColor="#f6c23e"
            onPress={() => navigation.navigate('Visitas aos Crentes')}
          />
          <CardRelatorio
            title="Não Crentes"
            value={dashboardData.incredulos}
            isVisita={true}
            iconName="heart-broken"
            iconColor="#f6c23e"
            onPress={() => navigation.navigate('Visitas aos Não Crentes')}
          />
        </View>
        <View style={styles.rowCards}>
          <CardRelatorio
            title="Presídios"
            value={dashboardData.presidios}
            isVisita={true}
            iconName="user-lock"
            iconColor="#f6c23e"
            onPress={() => navigation.navigate('Visitas aos Presídios')}
          />
          <CardRelatorio
            title="Enfermos"
            value={dashboardData.enfermos}
            isVisita={true}
            iconName="syringe"
            iconColor="#f6c23e"
            onPress={() => navigation.navigate('Visitas aos Enfermos')}
          />
        </View>
        <View style={styles.rowCards}>
          <CardRelatorio
            title="Hospitais"
            value={dashboardData.hospitais}
            isVisita={true}
            iconName="hospital"
            iconColor="#f6c23e"
            onPress={() => navigation.navigate('Visitas aos Hospitais')}
          />
          <CardRelatorio
            title="Escolas"
            value={dashboardData.escolas}
            isVisita={true}
            iconName="school"
            iconColor="#f6c23e"
            onPress={() => navigation.navigate('Visitas às Escolas')}
          />
        </View>
        <View style={styles.rowCards}>
          <CardRelatorio
            title="Estudos"
            value={dashboardData.estudos}
            iconName="book"
            iconColor="#4e73df"
            onPress={() => navigation.navigate('Estudos')}
          />
          <CardRelatorio
            title="Sermões"
            value={dashboardData.sermoes}
            iconName="user-tie"
            iconColor="#4e73df"
            onPress={() => navigation.navigate('Sermões')}
          />
        </View>
        <View style={styles.rowCards}>
          <CardRelatorio
            title="Estudos Biblicos"
            value={dashboardData.estudosBiblicos}
            iconName="bible"
            iconColor="#4e73df"
            onPress={() => navigation.navigate('Estudos Biblicos')}
          />
          <CardRelatorio
            title="Discipulados"
            value={dashboardData.discipulados}
            iconName="people-arrows"
            iconColor="#4e73df"
            onPress={() => navigation.navigate('Discipulados')}
          />
        </View>
        <View style={styles.rowCards}>
          <CardRelatorio
            title="Reun. de Oração"
            value={dashboardData.reunioesOracao}
            iconName="pray"
            iconColor="#4e73df"
            onPress={() => navigation.navigate('Reuniões de Oração')}
          />
          <CardRelatorio
            title="Acons. Biblicos"
            value={dashboardData.aconselhamentosBiblicos}
            iconName="comments"
            iconColor="#4e73df"
            onPress={() => navigation.navigate('Aconselhamentos Biblicos')}
          />
        </View>
        <View style={styles.rowCards}>
          <CardRelatorio
            title="Batismos Infantis"
            value={dashboardData.batismosInfantis}
            iconName="child"
            iconColor="#85102f"
            onPress={() => navigation.navigate('Batismos Infantis')}
          />
          <CardRelatorio
            title="Batismos/Prof. Fé"
            value={dashboardData.batismosProfissoes}
            iconName="praying-hands"
            iconColor="#85102f"
            onPress={() => navigation.navigate('Batismos e Profissões de Fé')}
          />
        </View>
        <View style={styles.rowCards}>
          <CardRelatorio
            title="Benções Nupciais"
            value={dashboardData.bencoesNupciais}
            iconName="hand-holding-heart"
            iconColor="#85102f"
            onPress={() => navigation.navigate('Benções Nupciais')}
          />
          <CardRelatorio
            title="Santas Ceias"
            value={dashboardData.santasCeias}
            iconName="wine-glass-alt"
            iconColor="#85102f"
            onPress={() => navigation.navigate('Santas Ceias')}
          />
        </View>
        <View style={styles.rowCards}>
          <CardRelatorio
            title="Comungantes"
            value={dashboardData.comungante}
            iconName="users"
            iconColor="#015b41"
            onPress={() => navigation.navigate('Frequência aos Domingos')}
          />
          <CardRelatorio
            title="Não Comungantes"
            value={dashboardData.naoComungante}
            iconName="user-times"
            iconColor="#015b41"
            onPress={() => navigation.navigate('Frequência aos Domingos')}
          />
        </View>
        <View style={styles.sectionMembresia}>
          <View style={styles.cardMembros}>
            <View style={styles.cardHeader}>
              <Text style={{ color: '#015b41' }}>Membresia aos Domingos</Text>
            </View>
            <View style={styles.cardBody}>
              <View style={{ width: '100%', height: 'auto' }}>
                {dashboardData.loading && <ActivityIndicator style={{ justifyContent: 'center', marginTop: 80 }} size="large" color="#015b41" />}
                {dashboardData.membresias && dashboardData.membresias.length !== 0 ? (
                  Array.from(dashboardData.membresias).map((item:MembresiaItem, index) => (
                    <View key={index}>
                      <ItemMembresiaRelatorioMensal {...item} />
                    </View>
                  ))
                ) : (
                  <Text style={{ fontSize: 16, color: '#585b58', textAlign: 'center', marginTop: 40 }}>Nenhum resultado encontrado!</Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fc',
  },
  dropdown2BtnStyle: {
    width: '100%',
    backgroundColor: '#0f5d39',
    borderRadius: 8,
    height: 45,
    paddingHorizontal: 10,
  },
  dropdown2BtnTxtStyle: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dropdown2DropdownStyle: {
    backgroundColor: '#0f5d39',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12
  },
  rowCards: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 5,
    marginBottom: 10,
  },
  dropdown2RowStyle: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12
  },
  dropdown2RowTxtStyle: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  headerButtonsExport: {
    marginTop: 11,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  buttonOpacityExport: {
    backgroundColor: '#0f5d39',
    padding: 10,
    borderRadius: 8,
    flex: 1
  },
  containerViewButtonExport: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButtonExport: {
    color: 'white',
    marginLeft: 6,
    textAlign: 'center',
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  elevation: {
    elevation: 5,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardHeader: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fc',
    borderBottomColor: '#e3e6f0',
    borderBottomWidth: 1,
  },
  cardMembros: {
    minHeight: 190,
    height: 'auto',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e3e6f0',
    marginTop: 8,
    marginRight: 15,
    marginLeft: 15,
    marginBottom: 25,
    borderRadius: 5,
    flex: 1,
  },
  cardBody: {
    padding: 20,
  },
  firstSelectButton: {
    flex: 1,
    marginRight: 5,
  },
  secondSelectButton: {
    flex: 1,
    marginLeft: 5,
  },
  sectionMembresia: {
    flex: 1,
  },
});

export default RelatorioMensal; 