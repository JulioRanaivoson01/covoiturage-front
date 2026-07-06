import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Switch,
} from 'react-native';
import { MainTabScreenProps } from '../../types/navigation';
import { CreateRideRequest } from '../../types/api';
import { useAuth } from '../../context/AuthContext';
import ridesService from '../../api/services/rides.service';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PublishScreen: React.FC<MainTabScreenProps<'Publish'>> = () => {
  const { user } = useAuth();
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [date, setDate] = useState('');
  const [price, setPrice] = useState('');
  const [totalSeats, setTotalSeats] = useState('3');
  const [luggage, setLuggage] = useState(false);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!departure) newErrors.departure = 'Départ requis';
    if (!arrival) newErrors.arrival = 'Arrivée requise';
    if (!date) newErrors.date = 'Date requise';
    if (!price) newErrors.price = 'Prix requis';
    else if (parseFloat(price) <= 0) newErrors.price = 'Prix invalide';
    if (!totalSeats) newErrors.totalSeats = 'Nombre de places requis';
    else if (parseInt(totalSeats, 10) < 1) newErrors.totalSeats = 'Minimum 1 place';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePublish = async () => {
    if (!validateForm()) return;
    if (!user) {
      Alert.alert('Erreur', 'Vous devez être connecté pour publier un trajet');
      return;
    }

    setIsLoading(true);
    try {
      const rideData: CreateRideRequest = {
        departure,
        arrival,
        departureDate: date,
        price: parseFloat(price),
        totalSeats: parseInt(totalSeats, 10),
        luggage,
        description: description || undefined,
      };

      await ridesService.createRide(rideData);
      Alert.alert('Succès', 'Trajet publié avec succès', [
        {
          text: 'OK',
          onPress: () => {
            setDeparture('');
            setArrival('');
            setDate('');
            setPrice('');
            setDescription('');
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.message || 'Échec de la publication');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Publier un trajet</Text>
          <Text style={styles.subtitle}>Partagez votre voyage</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Ville de départ"
            placeholder="Ex: Paris"
            value={departure}
            onChangeText={setDeparture}
            error={errors.departure}
          />

          <Input
            label="Ville d'arrivée"
            placeholder="Ex: Lyon"
            value={arrival}
            onChangeText={setArrival}
            error={errors.arrival}
          />

          <Input
            label="Date et heure"
            placeholder="JJ/MM/AAAA HH:MM"
            value={date}
            onChangeText={setDate}
            error={errors.date}
          />

          <Input
            label="Prix par passager (€)"
            placeholder="25"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
            error={errors.price}
          />

          <Input
            label="Nombre de places"
            placeholder="3"
            value={totalSeats}
            onChangeText={setTotalSeats}
            keyboardType="number-pad"
            error={errors.totalSeats}
          />

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Bagages autorisés</Text>
            <Switch
              value={luggage}
              onValueChange={setLuggage}
              trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
              thumbColor={luggage ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>

          <Input
            label="Description (optionnel)"
            placeholder="Détails supplémentaires..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <Button
            title="Publier le trajet"
            onPress={handlePublish}
            size="large"
            loading={isLoading}
          />
        </View>
      </ScrollView>
      <LoadingSpinner visible={isLoading} message="Publication en cours..." />
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
});

export default PublishScreen;
