import React, { useState, useEffect, useCallback } from 'react';
import { View, RefreshControl, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Icon from '@expo/vector-icons/FontAwesome5';
import { Dropdown } from 'react-native-element-dropdown';
import CardRelatorio from '~/components/CardRelatorio';
import { showSweetAlert } from '~/components/sweetAlert';
import api from '~/services/api';
import { Buffer } from 'buffer';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

interface ReportData {
    visitaCrente: number;
    visitaNaoCrente: number;
    visitaPresidio: number;
    visitaEnfermo: number;
    visitaHospital: number;
    visitaEscola: number;
    batismosInfantis: number;
    batismosProfissoes: number;
    bencoesNupciais: number;
    reunioesOracao: number;
    aconselhamentosBiblicos: number;
    santasCeias: number;
    estudos: number;
    sermoes: number;
    estudosBiblicos: number;
    discipulados: number;
    membresias: number;
}

interface ReportApiResponse {
    crentes: number;
    incredulos: number;
    presidios: number;
    enfermos: number;
    hospitais: number;
    escolas: number;
    batismosInfantis: number;
    batismosProfissoes: number;
    bencoesNupciais: number;
    reunioesOracao: number;
    aconselhamentosBiblicos: number;
    santasCeias: number;
    estudos: number;
    sermoes: number;
    estudosBiblicos: number;
    discipulados: number;
    membresias: number;
}

interface RelatorioAnualProps {
    navigation: {
        navigate: (screen: string) => void;
    };
}

interface DropdownItem {
    label: string;
    value: string;
}

function RelatorioAnual({ navigation }: RelatorioAnualProps) {
    const currentYear = new Date().getFullYear();
    const [reportData, setReportData] = useState<ReportData>({
        visitaCrente: 0,
        visitaNaoCrente: 0,
        visitaPresidio: 0,
        visitaEnfermo: 0,
        visitaHospital: 0,
        visitaEscola: 0,
        batismosInfantis: 0,
        batismosProfissoes: 0,
        bencoesNupciais: 0,
        reunioesOracao: 0,
        aconselhamentosBiblicos: 0,
        santasCeias: 0,
        estudos: 0,
        sermoes: 0,
        estudosBiblicos: 0,
        discipulados: 0,
        membresias: 0,
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
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

    const generateYears = (): DropdownItem[] => {
        const years: DropdownItem[] = [];
        for (let i = currentYear - 5; i <= currentYear; i++) {
            const yearString = String(i);
            years.push({ label: yearString, value: yearString });
        }
        return years;
    };
    const yearsData: DropdownItem[] = generateYears();

    const loadRelatorios = useCallback(async (year: number) => {
        setLoading(true);
        setRefreshing(true);
        try {
            const res = await api.get<ReportApiResponse>(`/relatorio-anual?ano=${year}`);
            const data = res.data;

            setReportData({
                visitaCrente: data.crentes,
                visitaNaoCrente: data.incredulos,
                visitaPresidio: data.presidios,
                visitaEnfermo: data.enfermos,
                visitaHospital: data.hospitais,
                visitaEscola: data.escolas,
                batismosInfantis: data.batismosInfantis,
                batismosProfissoes: data.batismosProfissoes,
                bencoesNupciais: data.bencoesNupciais,
                reunioesOracao: data.reunioesOracao,
                aconselhamentosBiblicos: data.aconselhamentosBiblicos,
                santasCeias: data.santasCeias,
                estudos: data.estudos,
                sermoes: data.sermoes,
                estudosBiblicos: data.estudosBiblicos,
                discipulados: data.discipulados,
                membresias: data.membresias,
            });
        } catch (error: any) {
            const errorMessage = error.response && error.response.data && error.response.data.message ? error.response.data.message : 'Erro ao carregar relatórios.';
            showSweetAlert({
                title: 'Erro',
                text: errorMessage,
                showCancelButton: false,
                cancelButtonText: 'Cancel',
                confirmButtonText: 'Ok',
                onConfirm: () => {},
                onClose: () => {},
                type: 'danger',
            });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    const exportarRelatorioPDF = useCallback(async () => {
        const ano = String(selectedYear);
        
        const fileName = `relatorio-pastoral-anual-${ano}.pdf`;
        const filePath = `${FileSystem.documentDirectory}${fileName}`;

        try {
            const response = await api.get(`/relatorio/exportar-pdf?ano=${ano}`, {
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
    }, [selectedYear]);

    const exportarRelatorioExcel = useCallback(async () => {
        const ano = String(selectedYear);
        
        const fileName = `relatorio-pastoral-${ano}.xlsx`;
        const excelMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        
        try {
            const response = await api.get(`/relatorio/exportar-excel?ano=${ano}`, {
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
    }, [selectedYear, showAlert]);

    useEffect(() => {
        loadRelatorios(selectedYear);
    }, [selectedYear, loadRelatorios]);

    const handleRefresh = () => {
        loadRelatorios(selectedYear);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0f5d39" />
                <Text style={{ marginTop: 10 }}>Carregando relatórios...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
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
                    <View style={styles.iconBar}>
                        <Dropdown
                            style={[styles.dropdown2BtnStyle, styles.elevation]}
                            placeholderStyle={styles.dropdown2BtnTxtStyle}
                            selectedTextStyle={styles.dropdown2BtnTxtStyle}
                            data={yearsData}
                            labelField="label"
                            valueField="value"
                            placeholder="Selecione"
                            value={String(selectedYear)}
                            onChange={item => {
                                setSelectedYear(Number(item.value));
                            }}
                            renderRightIcon={(isOpened) => {
                                return <FontAwesome5 name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#fff'} size={18} />;
                            }}
                            containerStyle={styles.dropdown2DropdownStyle}
                            itemContainerStyle={styles.dropdown2RowStyle}
                            itemTextStyle={styles.dropdown2RowTxtStyle}
                            activeColor='#093822'
                        />
                    </View>
                </View>
                <View style={styles.rowCards}>
                    <CardRelatorio
                        title="Crentes"
                        value={reportData.visitaCrente}
                        isVisita={true}
                        iconName="cross"
                        iconColor="#f6c23e"
                        onPress={() => navigation.navigate('Visitas aos Crentes')}
                    />
                    <CardRelatorio
                        title="Não Crentes"
                        value={reportData.visitaNaoCrente}
                        isVisita={true}
                        iconName="heart-broken"
                        iconColor="#f6c23e"
                        onPress={() => navigation.navigate('Visitas aos Não Crentes')}
                    />
                </View>
                <View style={styles.rowCards}>
                    <CardRelatorio
                        title="Presídios"
                        value={reportData.visitaPresidio}
                        isVisita={true}
                        iconName="user-lock"
                        iconColor="#f6c23e"
                        onPress={() => navigation.navigate('Visitas aos Presídios')}
                    />
                    <CardRelatorio
                        title="Enfermos"
                        value={reportData.visitaEnfermo}
                        isVisita={true}
                        iconName="syringe"
                        iconColor="#f6c23e"
                        onPress={() => navigation.navigate('Visitas aos Enfermos')}
                    />
                </View>
                <View style={styles.rowCards}>
                    <CardRelatorio
                        title="Hospitais"
                        value={reportData.visitaHospital}
                        isVisita={true}
                        iconName="hospital"
                        iconColor="#f6c23e"
                        onPress={() => navigation.navigate('Visitas aos Hospitais')}
                    />
                    <CardRelatorio
                        title="Escolas"
                        value={reportData.visitaEscola}
                        isVisita={true}
                        iconName="school"
                        iconColor="#f6c23e"
                        onPress={() => navigation.navigate('Visitas às Escolas')}
                    />
                </View>
                <View style={styles.rowCards}>
                    <CardRelatorio
                        title="Estudos"
                        value={reportData.estudos}
                        iconName="book"
                        iconColor="#4e73df"
                        onPress={() => navigation.navigate('Estudos')}
                    />
                    <CardRelatorio
                        title="Sermões"
                        value={reportData.sermoes}
                        iconName="user-tie"
                        iconColor="#4e73df"
                        onPress={() => navigation.navigate('Sermões')}
                    />
                </View>
                <View style={styles.rowCards}>
                    <CardRelatorio
                        title="Estudos Biblicos"
                        value={reportData.estudosBiblicos}
                        iconName="bible"
                        iconColor="#4e73df"
                        onPress={() => navigation.navigate('Estudos Biblicos')}
                    />
                    <CardRelatorio
                        title="Discipulados"
                        value={reportData.discipulados}
                        iconName="people-arrows"
                        iconColor="#4e73df"
                        onPress={() => navigation.navigate('Discipulados')}
                    />
                </View>
                <View style={styles.rowCards}>
                    <CardRelatorio
                        title="Reun. de Oração"
                        value={reportData.reunioesOracao}
                        iconName="pray"
                        iconColor="#4e73df"
                        onPress={() => navigation.navigate('Reuniões de Oração')}
                    />
                    <CardRelatorio
                        title="Acons. Biblicos"
                        value={reportData.aconselhamentosBiblicos}
                        iconName="comments"
                        iconColor="#4e73df"
                        onPress={() => navigation.navigate('Aconselhamentos Biblicos')}
                    />
                </View>
                <View style={styles.rowCards}>
                    <CardRelatorio
                        title="Batismos Infantis"
                        value={reportData.batismosInfantis}
                        iconName="child"
                        iconColor="#85102f"
                        onPress={() => navigation.navigate('Batismos Infantis')}
                    />
                    <CardRelatorio
                        title="Batismos/Prof. Fé"
                        value={reportData.batismosProfissoes}
                        iconName="praying-hands"
                        iconColor="#85102f"
                        onPress={() => navigation.navigate('Batismos e Profissões de Fé')}
                    />
                </View>
                <View style={styles.rowCards}>
                    <CardRelatorio
                        title="Benções Nupciais"
                        value={reportData.bencoesNupciais}
                        iconName="hand-holding-heart"
                        iconColor="#85102f"
                        onPress={() => navigation.navigate('Benções Nupciais')}
                    />
                    <CardRelatorio
                        title="Santas Ceias"
                        value={reportData.santasCeias}
                        iconName="wine-glass-alt"
                        iconColor="#85102f"
                        onPress={() => navigation.navigate('Santas Ceias')}
                    />
                </View>
                <View style={styles.rowCards}>
                    <CardRelatorio
                        title="Média de Membros aos Domingos"
                        value={reportData.membresias}
                        iconName="users"
                        iconColor="#211f11"
                        onPress={() => navigation.navigate('Frequência aos Domingos')}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

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
    headerButtonsExport: {
        marginTop: 11,
        marginBottom: -5,
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
    dropdown2BtnStyle: {
        width: '100%',
        backgroundColor: '#0f5d39',
        borderRadius: 8,
        height: 45,
        paddingHorizontal: 10,
    },
    dropdownItem: {
        height: 45,
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
    dropdown2RowStyle: {
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12
    },
    dropdown2RowTxtStyle: {
        color: '#FFF',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 15,
        marginRight: 10,
        marginLeft: 10,
        marginBottom: 10,
    },
    elevation: {
        elevation: 18,
        shadowColor: 'rgba(58,59,69,0.5)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    rowCards: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingHorizontal: 5,
        marginBottom: 10,
    },
    iconBar: {
        width: '100%',
    },
});

export default RelatorioAnual;