import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ride } from '../../types/api';

interface RideCardProps {
  ride: Ride;
  onPress: () => void;
}

const RideCard: React.FC<RideCardProps> = ({ ride, onPress }) => {
  // 1. Correction : Utiliser departureTime et gérer les dates nulles
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Non définie';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return '#10B981';
      case 'completed': return '#6B7280';
      case 'cancelled': return '#EF4444';
      default: return '#3B82F6';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'En cours';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status || 'Inconnu';
    }
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
        <View style={styles.priceContainer}>
       <Text style={styles.price}>
  {(ride as any).pricePerSeat 
    ? parseFloat((ride as any).pricePerSeat).toLocaleString() 
    : '0'} Ar
</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ride.status) }]}>
            <Text style={styles.statusText}>{getStatusLabel(ride.status)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date:</Text>
          {/* 2. Correction ici : on passe departureTime */}
          <Text style={styles.detailValue}>{formatDate(ride.departureTime)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Places:</Text>
          <Text style={styles.detailValue}>
            {ride.availableSeats}/{ride.totalSeats}
          </Text>
        </View>
        {/* 3. Correction : Vérifier la valeur de luggage (d'après ton log, c'est un string) */}
        {ride.luggageAllowed && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Bagages:</Text>
            <Text style={styles.detailValue}>Autorisés</Text>
          </View>
        )}
      </View>

      <View style={styles.driverInfo}>
        <Image
  source={{ 
    uri: ride.carImageUri || 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png' 
  }}
  style={styles.carImage}/>

        <View style={styles.driverDetails}>
          <Text style={styles.driverName}>
            {ride.driver.firstName} {ride.driver.lastName}
          </Text>
          <View style={styles.ratingContainer}>
            {/* 4. Correction : rating peut être undefined dans l'objet driver */}
            <Text style={styles.rating}>
              ⭐ {typeof ride.driver.rating === 'number' ? ride.driver.rating.toFixed(1) : '0.0'}
            </Text>
            {ride.driver.isVerified && <Text style={styles.verified}>✓</Text>}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ... (le StyleSheet reste identique)
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
  carImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
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
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
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
  borderRadius: 20, // Pour faire un cercle
  backgroundColor: '#E5E7EB', // Ajoute une couleur de fond pour voir l'emplacement si l'image ne charge pas
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
