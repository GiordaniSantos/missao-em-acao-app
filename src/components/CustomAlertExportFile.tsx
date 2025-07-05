import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from '@expo/vector-icons/FontAwesome5';

interface CustomAlertExportFileProps {
  isVisible: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const CustomAlertExportFile: React.FC<CustomAlertExportFileProps> = ({ isVisible, message, type, onClose }) => {
  const backgroundColor = type === 'error' ? '#dc3545' : type === 'info' ? '#17a2b8' : '#28a745';
  const iconName = type === 'error' ? 'times-circle' : type === 'info' ? 'info-circle' : 'check-circle';

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={[styles.alertContainer, { backgroundColor }]}>
          <Icon name={iconName} size={24} color="#fff" style={styles.alertIcon} />
          <Text style={styles.alertText}>{message}</Text>
          <TouchableOpacity onPress={onClose} style={styles.alertCloseButton}>
            <Icon name="times" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};


const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 20,
    width: '90%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  alertIcon: {
    marginRight: 10,
  },
  alertText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  alertCloseButton: {
    marginLeft: 10,
    padding: 5,
  },
});

export default CustomAlertExportFile; 