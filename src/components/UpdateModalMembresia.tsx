import React, { useState, useEffect, useCallback } from 'react';
import { Modal, View, StyleSheet, TouchableWithoutFeedback, Text, TouchableOpacity, TextInput, ActivityIndicator, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import moment from 'moment';
import 'moment/locale/pt-br';
import { useAppSelector } from '~/store';

interface MembresiaItem {
  id: string;
  nome: string;
  quantidade: number;
  created_at: string;
  id_usuario: string | number;
}

interface UpdateModalMembresiaProps {
  isVisible: boolean;
  loading: boolean;
  itemBuscado: MembresiaItem | null;
  dataSelect: string[];
  tituloHeader: string;
  onCancel: () => void;
  onUpdate: (data: MembresiaItem) => void;
}

interface FormData {
  nome: string;
  quantidade: string;
  date: Date;
}

function UpdateModalMembresia({ isVisible, loading, itemBuscado, dataSelect, tituloHeader, onCancel, onUpdate,}: UpdateModalMembresiaProps) {
  const userId = useAppSelector((state: any) => state.auth.user.id as string | number);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      nome: '',
      quantidade: '',
      date: new Date(),
    },
  });

  useEffect(() => {
    if (isVisible && itemBuscado) {
      setValue('nome', itemBuscado.nome);
      setValue('quantidade', itemBuscado.quantidade.toString());
      setValue('date', new Date(itemBuscado.created_at));
    } else if (!isVisible) {
      reset();
    }
  }, [isVisible, itemBuscado, reset, setValue]);

  const onDateChange = useCallback(
    (event: any, selectedDate?: Date) => {
      setShowDatePicker(Platform.OS === 'ios');
      if (event.type === 'set' && selectedDate) {
        setValue('date', selectedDate);
      }
    },
    [setValue]
  );

  const getDatePicker = (currentDateValue: Date) => {
    const dateString = moment(currentDateValue).format('dddd, D [de] MMMM [de] YYYY');

    return (
      <View>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={[styles.dateInput, styles.input]}>
            {dateString}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={currentDateValue}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
            timeZoneName={'America/Sao_Paulo'}
          />
        )}
      </View>
    );
  };

  const onSubmit = (data: FormData) => {
    if (!itemBuscado) return;

    const editedItem: MembresiaItem = {
      id: itemBuscado.id,
      nome: data.nome,
      quantidade: Number(data.quantidade),
      created_at: data.date.toISOString(),
      id_usuario: userId,
    };

    if (onUpdate) {
      onUpdate(editedItem);
    }
  };

  return (
    <Modal transparent={true} visible={isVisible} onRequestClose={onCancel} animationType='fade'>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.background}></View>
      </TouchableWithoutFeedback>

      <View style={styles.container}>
        <Text style={styles.header}>{tituloHeader}</Text>

        {loading ? (
          <View>
            <ActivityIndicator size="large" color="#0f5d39" style={styles.activityIndicator} />
          </View>
        ) : (
          <View>
            <Controller
              control={control}
              name="nome"
              render={({ field: { onChange, value } }) => (
                <Dropdown
                  style={styles.input}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={dataSelect.map(item => ({ label: item, value: item }))}
                  labelField="label"
                  valueField="value"
                  placeholder="Selecione uma Opção"
                  value={value}
                  onChange={item => {
                    onChange(item.value);
                  }}
                />
              )}
            />
            {errors.nome && <Text style={styles.errorText}>{errors.nome.message}</Text>}

            <Controller
              control={control}
              name="quantidade"
              rules={{ required: 'A quantidade é obrigatória.', pattern: { value: /^\d+$/, message: 'A quantidade deve ser um número.' } }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.quantidade && styles.inputError]}
                  keyboardType="numeric"
                  placeholder='Informe a quantidade...'
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.quantidade && <Text style={styles.errorText}>{errors.quantidade.message}</Text>}

            <Controller
              control={control}
              name="date"
              render={({ field: { value } }) => (
                getDatePicker(value)
              )}
            />
            {errors.date && <Text style={styles.errorText}>{errors.date.message}</Text>}
          </View>
        )}

        <View style={styles.buttons}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.button}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSubmit(onSubmit)}>
            <Text style={styles.button}>Editar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.background}></View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  activityIndicator: {
    marginTop: 100,
    marginBottom: 100,
    transform: [{ scaleX: 2 }, { scaleY: 2 }],
  },
  background: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  container: {
    backgroundColor: '#FFF',
  },
  header: {
    backgroundColor: '#0f5d39',
    color: '#FFF',
    textAlign: 'center',
    padding: 15,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
    padding: 10,
  },
  button: {
    margin: 10,
    marginRight: 20,
    color: '#0f5d39',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 60,
    margin: 8,
    padding: 15,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 6,
    textAlign: 'center',
    fontSize: 18,
    width: 'auto',
    color: '#222',
  },
  dateInput: {
    textAlign: 'center',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    marginLeft: 15,
    marginTop: -5,
    marginBottom: 5,
    fontSize: 12,
  },
  placeholderStyle: {
    fontSize: 18,
    color: '#A9A9A9',
    textAlign: 'center'
  },
  selectedTextStyle: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center'
  },
});

export default UpdateModalMembresia;