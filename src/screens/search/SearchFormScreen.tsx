import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SearchStackParamList } from '../../types/navigation';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

type SearchFormScreenProps = NativeStackScreenProps<SearchStackParamList, 'SearchForm'>;

const SearchFormScreen: React.FC<SearchFormScreenProps> = ({ navigation }) => {
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState('1');

  const handleSearch = () => {
    if (!departure || !arrival || !date) {
      return;
    }

    navigation.navigate('RideList', {
      departure,
      arrival,
      date,
      passengers: parseInt(passengers, 10),
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Rechercher un trajet</Text>
          <Text style={styles.subtitle}>Trouvez votre prochain covoiturage</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Départ"
            placeholder="Ville de départ"
            value={departure}
            onChangeText={setDeparture}
          />

          <Input
            label="Arrivée"
            placeholder="Ville d'arrivée"
            value={arrival}
            onChangeText={setArrival}
          />

          <Input
            label="Date"
            placeholder="JJ/MM/AAAA"
            value={date}
            onChangeText={setDate}
          />

          <Input
            label="Nombre de passagers"
            placeholder="1"
            value={passengers}
            onChangeText={setPassengers}
            keyboardType="number-pad"
          />

          <Button
            title="Rechercher"
            onPress={handleSearch}
            size="large"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginTop: 40,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  form: {
    flex: 1,
  },
});

export default SearchFormScreen;
