import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface MembresiaItem {
    nome: string;
    quantidade: number;
}

interface MembresiaCardProps {
  data: MembresiaItem[] | null;
  loading: boolean;
}

const MembresiaCard: React.FC<MembresiaCardProps> = ({ data, loading }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Membresia aos Domingos</Text>
      
      <View style={styles.card}>
        {loading ? (
          <ActivityIndicator 
            style={{ paddingVertical: 40 }} 
            size="large" 
            color="#0f5d39" 
          />
        ) : data && data.length > 0 ? (
          data.map((item, index) => (
            <View key={index}>
              <View style={styles.listItem}>
                <View style={styles.itemInfo}>
                  <View style={styles.indicator} /> 
                  <Text style={styles.itemText}>{item.nome}</Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.quantidade}</Text>
                </View>
              </View>
              {index < data.length - 1 && <View style={styles.divider} />}
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhum resultado encontrado!</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f5d39',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 4,
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  indicator: {
    width: 3,
    height: 18,
    backgroundColor: '#0f5d39',
    borderRadius: 10,
    marginRight: 12,
  },
  itemText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  badge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 35,
    alignItems: 'center',
  },
  badgeText: {
    color: '#0f5d39',
    fontWeight: 'bold',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F1F1',
    marginHorizontal: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    paddingVertical: 30,
  }
});

export default MembresiaCard;