import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SearchStackParamList } from '../../types/navigation';
import { Ride } from '../../types/api';
import ridesService from '../../api/services/rides.service';
import bookingsService from '../../api/services/bookings.service';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

type RideDetailsScreenProps = NativeStackScreenProps<SearchStackParamList, 'RideDetails'>;

const RideDetailsScreen: React.FC<RideDetailsScreenProps> = ({ route, navigation }) => {
  const { rideId } = route.params;
  const [ride, setRide] = useState<Ride | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  const loadRide = async () => {
    try {
      const data = await ridesService.getRideById(rideId);
      setRide(data);
    } catch (error) {
      console.error('Error loading ride:', error);
      Alert.alert('Erreur', 'Impossible de charger les détails du trajet');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRide();
  }, [rideId]);

  const handleBooking = async () => {
    if (!ride) return;

    setIsBooking(true);
    try {
      await bookingsService.createBooking({
        rideId: ride.id,
        passengers: 1,
      });
      Alert.alert('Succès', 'Réservation effectuée avec succès', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.message || 'Échec de la réservation');
    } finally {
      setIsBooking(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return <LoadingSpinner visible message="Chargement..." />;
  }

  if (!ride) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Trajet non trouvé</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.route}>
          <Text style={styles.location}>{ride.departure}</Text>
          <Text style={styles.arrow}>→</Text>
          <Text style={styles.location}>{ride.arrival}</Text>
        </View>
        <Text style={styles.price}>{ride.price} €</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Détails du trajet</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{formatDate(ride.departureDate)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Places disponibles:</Text>
          <Text style={styles.value}>
            {ride.availableSeats}/{ride.totalSeats}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Bagages:</Text>
          <Text style={styles.value}>{ride.luggage ? 'Autorisés' : 'Non autorisés'}</Text>
        </View>
        {ride.description && (
          <View style={styles.detailRow}>
            <Text style={styles.label}>Description:</Text>
            <Text style={styles.value}>{ride.description}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conducteur</Text>
        <View style={styles.driverInfo}>
          <Image
            source={{ uri: 'https://via.placeholder.com/60' }}
            style={styles.avatar}
          />
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>
              {ride.driver.firstName} {ride.driver.lastName}
            </Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {ride.driver.rating.toFixed(1)}</Text>
              {ride.driver.isVerified && (
                <Text style={styles.verified}>✓ Vérifié</Text>
              )}
            </View>
            <Text style={styles.memberSince}>
              Membre depuis{' '}
              {new Date(ride.driver.createdAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
              })}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Réserver"
          onPress={handleBooking}
          size="large"
          loading={isBooking}
          disabled={ride.availableSeats === 0}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  route: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  arrow: {
    fontSize: 28,
    color: '#3B82F6',
    paddingHorizontal: 8,
  },
  price: {
    fontSize: 36,
    fontWeight: '800',
    color: '#10B981',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    width: 120,
  },
  value: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    flex: 1,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 16,
    color: '#F59E0B',
    fontWeight: '600',
  },
  verified: {
    fontSize: 14,
    color: '#10B981',
    marginLeft: 8,
    fontWeight: '600',
  },
  memberSince: {
    fontSize: 12,
    color: '#6B7280',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default RideDetailsScreen;
