import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Ride } from '../../types/api';

interface RideCardProps {
  ride: Ride;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const RideCard: React.FC<RideCardProps> = ({ ride, onPress, onEdit, onDelete }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.244:3000';

  const getFullImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('/')) {
      return `${API_BASE_URL}${imageUrl}`;
    }
    return imageUrl;
  };

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

  const imageUrl = getFullImageUrl(ride.carImageUri);

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
        {/* Image principale - 50% de la hauteur */}
        <View style={styles.imageContainer}>
          <Image
            source={{ 
              uri: imageUrl || 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80' 
            }}
            style={styles.mainImage}
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
            onError={() => {
              setImageLoading(false);
              setImageError(true);
            }}
            resizeMode="cover"
          />
          {imageLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#262626" />
            </View>
          )}
          {/* Badge de statut sur l'image */}
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ride.status) }]}>
            <Text style={styles.statusText}>{getStatusLabel(ride.status)}</Text>
          </View>
          {/* Bouton options */}
          <TouchableOpacity 
            style={styles.optionsButton}
            onPress={() => setShowOptions(true)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="ellipsis-vertical" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Section détails */}
        <View style={styles.detailsSection}>
          {/* Header avec lieu et prix */}
          <View style={styles.headerRow}>
            <View style={styles.routeInfo}>
              <Text style={styles.location}>{ride.departure}</Text>
              <Ionicons name="arrow-forward" size={16} color="#8e8e8e" style={styles.arrowIcon} />
              <Text style={styles.location}>{ride.arrival}</Text>
            </View>
            <Text style={styles.price}>
              {(ride as any).pricePerSeat 
                ? parseFloat((ride as any).pricePerSeat).toLocaleString() 
                : '0'} Ar
            </Text>
          </View>

          {/* Date et places */}
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={16} color="#8e8e8e" />
              <Text style={styles.infoText}>{formatDate(ride.departureTime)}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="people-outline" size={16} color="#8e8e8e" />
              <Text style={styles.infoText}>{ride.availableSeats}/{ride.totalSeats} places</Text>
            </View>
          </View>

          {/* Info conducteur */}
          <View style={styles.driverRow}>
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>
                {ride.driver?.firstName} {ride.driver?.lastName}
              </Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>
                  ⭐ {typeof ride.driver?.rating === 'number' ? ride.driver.rating.toFixed(1) : '0.0'}
                </Text>
                {ride.driver?.isVerified && <Ionicons name="checkmark-circle" size={14} color="#10B981" />}
              </View>
            </View>
            {ride.luggageAllowed && (
              <View style={styles.luggageBadge}>
                <Ionicons name="briefcase-outline" size={14} color="#262626" />
                <Text style={styles.luggageText}>Bagages</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Bottom Sheet Options */}
      <Modal
        visible={showOptions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowOptions(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setShowOptions(false)}
        >
          <Pressable style={styles.bottomSheet} onPress={() => {}}>
            <View style={styles.bottomSheetHandle} />
            <Text style={styles.bottomSheetTitle}>Options du trajet</Text>
            
            <TouchableOpacity 
              style={styles.optionButton}
              onPress={() => {
                setShowOptions(false);
                onEdit?.();
              }}
            >
              <Ionicons name="create-outline" size={24} color="#262626" />
              <Text style={styles.optionText}>Modifier</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.optionButton, styles.deleteButton]}
              onPress={() => {
                setShowOptions(false);
                onDelete?.();
              }}
            >
              <Ionicons name="trash-outline" size={24} color="#EF4444" />
              <Text style={[styles.optionText, styles.deleteText]}>Supprimer</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowOptions(false)}
            >
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imageContainer: {
    height: 200,
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  optionsButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsSection: {
    padding: 16,
  },
  headerRow: {
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
    fontSize: 15,
    fontWeight: '600',
    color: '#262626',
  },
  arrowIcon: {
    marginHorizontal: 6,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#262626',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    fontSize: 13,
    color: '#8e8e8e',
    marginLeft: 6,
  },
  driverRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#dbdbdb',
    paddingTop: 12,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    color: '#F59E0B',
    marginRight: 4,
  },
  luggageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  luggageText: {
    fontSize: 12,
    color: '#262626',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#dbdbdb',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#262626',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
  },
  optionText: {
    fontSize: 16,
    color: '#262626',
    marginLeft: 16,
  },
  deleteButton: {
    // Style spécifique pour le bouton supprimer si nécessaire
  },
  deleteText: {
    color: '#EF4444',
  },
  cancelButton: {
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelText: {
    fontSize: 16,
    color: '#0095f6',
    fontWeight: '600',
  },
});

export default RideCard;
