import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet, TouchableWithoutFeedback, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import moment from 'moment';
import 'moment/locale/pt-br';
import { useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';

interface Item {
  id: string;
  nome: string;
  created_at: Date;
}

interface EditFormData {
  nome: string;
  date: Date;
}

interface EditItem {
  id: string;
  date: Date;
  nome: string;
  id_usuario: string | number;
}

interface UpdateModalProps {
  isVisible: boolean;
  onCancel: () => void;
  onUpdate: (item: EditItem) => void;
  tituloHeader: string;
  loading: boolean;
  withNome?: boolean;
  placeHolderCampoNome?: string;
  itemBuscado: Item;
}

function UpdateModal({ isVisible, onCancel, onUpdate, tituloHeader, loading, withNome, placeHolderCampoNome, itemBuscado}: UpdateModalProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const userId = useSelector((state: any) => state.auth.user.id as string | number);

  const getInitialDate = () => {
    return itemBuscado.created_at instanceof Date ? itemBuscado.created_at : (itemBuscado.created_at ? new Date(itemBuscado.created_at) : new Date());
  };

  const { control, handleSubmit, setValue, watch, reset } = useForm<EditFormData>({
    defaultValues: {
      nome: itemBuscado.nome,
      date: getInitialDate(),
    },
  });

  const formDate = watch('date');

  useEffect(() => {
    reset({
      nome: itemBuscado.nome,
      date: getInitialDate(),
    });
  }, [itemBuscado, reset]);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (event.type === 'set' && selectedDate) {
      const currentFullDate = formDate instanceof Date ? formDate : getInitialDate();
      const newDateWithTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        currentFullDate.getHours(),
        currentFullDate.getMinutes(),
        currentFullDate.getSeconds(),
      );
      setValue('date', newDateWithTime, { shouldDirty: true });
    }
  };

  const onTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (event.type === 'set' && selectedTime) {
      const currentFullDate = formDate instanceof Date ? formDate : getInitialDate();
      const newDateWithTime = new Date(
        currentFullDate.getFullYear(),
        currentFullDate.getMonth(),
        currentFullDate.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes(),
        selectedTime.getSeconds(),
      );
      setValue('date', newDateWithTime, { shouldDirty: true });
    }
  };

  const onSubmit = (data: EditFormData) => {
    const editItem: EditItem = {
      id: itemBuscado.id,
      date: data.date,
      nome: data.nome,
      id_usuario: userId,
    };

    if (onUpdate) {
      onUpdate(editItem);
    }
    onCancel();
  };

  const renderDatePicker = () => {
    const dateToDisplay = formDate instanceof Date ? formDate : getInitialDate();
    const dateString = moment(dateToDisplay).format('dddd, D [de] MMMM [de] YYYY');
    return (
      <View>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={[styles.date, styles.input]}>{dateString}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dateToDisplay}
            onChange={onDateChange}
            mode="date"
            timeZoneName={'America/Sao_Paulo'}
          />
        )}
      </View>
    );
  };

  const renderTimePicker = () => {
    const dateToDisplay = formDate instanceof Date ? formDate : getInitialDate();
    const dateString = moment(dateToDisplay).format('HH:mm');
    return (
      <View>
        <TouchableOpacity onPress={() => setShowTimePicker(true)}>
          <Text style={[styles.date, styles.input]}>{dateString}</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={dateToDisplay}
            onChange={onTimeChange}
            mode="time"
            timeZoneName={'America/Sao_Paulo'}
          />
        )}
      </View>
    );
  };

  return (
    <Modal transparent={true} visible={isVisible} onRequestClose={onCancel} animationType="fade">
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.background}></View>
      </TouchableWithoutFeedback>
      <View style={styles.container}>
        <Text style={styles.header}>{tituloHeader}</Text>
        {loading ? (
          <View>
            <ActivityIndicator
              size="large"
              color="#0f5d39"
              style={[styles.activityIndicator, withNome ? { marginTop: 90, marginBottom: 90 } : { marginTop: 70, marginBottom: 70 }]}
            />
          </View>
        ) : (
          <View>
            {renderDatePicker()}
            {renderTimePicker()}
            {withNome && (
              <Controller
                control={control}
                name="nome"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder={placeHolderCampoNome || 'Nome do Visitado'}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    style={[styles.date, styles.input]}
                  />
                )}
              />
            )}
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
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  button: {
    margin: 20,
    marginRight: 30,
    color: '#0f5d39',
  },
  input: {
    padding: 15,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 6,
    width: 'auto',
  },
  date: {
    fontSize: 20,
    marginLeft: 20,
    marginRight: 20,
    textAlign: 'center',
    marginTop: 15,
  },
});

export default UpdateModal;