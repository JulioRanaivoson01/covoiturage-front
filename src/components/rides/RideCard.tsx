import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ride } from '../../types/api';

interface RideCardProps {
  ride: Ride;
  onPress: () => void;
}

const RideCard: React.FC<RideCardProps> = ({ ride, onPress }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.routeInfo}>
          <Text style={styles.location}>{ride.departure}</Text>
          <View style={styles.arrowContainer}>
            <Text style={styles.arrow}>→</Text>
          </View>
          <Text style={styles.location}>{ride.arrival}</Text>
        </View>
        <Text style={styles.price}>{ride.price} €</Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>{formatDate(ride.departureDate)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Places:</Text>
          <Text style={styles.detailValue}>
            {ride.availableSeats}/{ride.totalSeats}
          </Text>
        </View>
        {ride.luggage && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Bagages:</Text>
            <Text style={styles.detailValue}>Autorisés</Text>
          </View>
        )}
      </View>

      <View style={styles.driverInfo}>
        <Image
          source={{ uri: 'https://via.placeholder.com/40' }}
          style={styles.avatar}
        />
        <View style={styles.driverDetails}>
          <Text style={styles.driverName}>
            {ride.driver.firstName} {ride.driver.lastName}
          </Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {ride.driver.rating.toFixed(1)}</Text>
            {ride.driver.isVerified && <Text style={styles.verified}>✓</Text>}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  location: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  arrowContainer: {
    paddingHorizontal: 8,
  },
  arrow: {
    fontSize: 20,
    color: '#3B82F6',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10B981',
    marginLeft: 12,
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    color: '#F59E0B',
  },
  verified: {
    fontSize: 12,
    color: '#10B981',
    marginLeft: 4,
    fontWeight: 'bold',
  },
});

export default RideCard;
