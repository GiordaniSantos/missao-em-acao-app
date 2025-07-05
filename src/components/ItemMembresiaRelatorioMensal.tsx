import { StyleSheet, Text, View } from "react-native";

interface ItemMembresiaRelatorioMensalProps {
  nome: string;
  quantidade: number;
}

const ItemMembresiaRelatorioMensal: React.FC<ItemMembresiaRelatorioMensalProps> = ({ nome, quantidade }) => (
  <View style={styles.itemRelatorioContainer}>
    <Text style={[styles.itemRelatorioText, { color: '#015b41' }]}>{nome}</Text>
    <Text style={[styles.itemRelatorioText, { color: '#015b41' }]}>{quantidade}</Text>
  </View>
);

const styles = StyleSheet.create({
  itemRelatorioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemRelatorioText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ItemMembresiaRelatorioMensal; 