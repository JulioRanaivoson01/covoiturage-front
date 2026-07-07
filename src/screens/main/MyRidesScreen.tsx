import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { MainTabScreenProps } from '../../types/navigation';
import { Ride, Booking } from '../../types/api';
import ridesService from '../../api/services/rides.service';
import bookingsService from '../../api/services/bookings.service';
import RideCard from '../../components/rides/RideCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MyRidesScreen: React.FC<MainTabScreenProps<'MyRides'>> = () => {
  const [myRides, setMyRides] = useState<Ride[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'published' | 'booked'>('published');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    
    // 🛡️ Exécution découplée pour éviter qu'un seul 404 ne bloque tout l'écran
    await Promise.all([
      (async () => {
        try {
          const rides = await ridesService.getMyRides();
          setMyRides(rides || []);
        } catch (error) {
          console.error('Erreur lors du chargement des trajets publiés (404 ou autre):', error);
          setMyRides([]);
        }
      })(),
      (async () => {
        try {
          const bookings = await bookingsService.getMyBookings();
          setMyBookings(bookings || []);
        } catch (error) {
          console.error('Erreur lors du chargement des réservations (404 ou autre):', error);
          setMyBookings([]);
        }
      })()
    ]);

    setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleRidePress = (ride: Ride) => {
    console.log('Ride pressed:', ride.id);
  };

  const renderPublishedRides = () => {
    if (myRides.length === 0) {
      return (
        <View style={styles.instagramEmptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Feather name="plus" size={28} color="#262626" />
          </View>
          <Text style={styles.instagramEmptyText}>Aucun trajet publié</Text>
          <Text style={styles.instagramEmptySubtext}>Les trajets que vous partagez apparaîtront ici.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={myRides}
        keyExtractor={(item) => `ride-${item.id}`}
        renderItem={({ item }) => (
          <RideCard
            ride={item}
            onPress={() => handleRidePress(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    );
  };

  const renderBookedRides = () => {
    if (myBookings.length === 0) {
      return (
        <View style={styles.instagramEmptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Feather name="bookmark" size={26} color="#262626" />
          </View>
          <Text style={styles.instagramEmptyText}>Aucune réservation</Text>
          <Text style={styles.instagramEmptySubtext}>Les trajets que vous réservez apparaîtront ici.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={myBookings}
        keyExtractor={(item) => `booking-${item.id}`}
        renderItem={({ item }) => (
          <RideCard
            ride={item.ride}
            onPress={() => handleRidePress(item.ride)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* ─── ONGLETS STYLE GRILLE PROFIL INSTAGRAM ─── */}
      <View style={styles.instagramTabs}>
        <TouchableOpacity
          style={[styles.instagramTab, activeTab === 'published' && styles.instagramActiveTab]}
          onPress={() => setActiveTab('published')}
        >
          <Feather 
            name="grid" 
            size={22} 
            color={activeTab === 'published' ? '#262626' : '#8e8e8e'} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.instagramTab, activeTab === 'booked' && styles.instagramActiveTab]}
          onPress={() => setActiveTab('booked')}
        >
          <Feather 
            name="bookmark" 
            size={22} 
            color={activeTab === 'booked' ? '#262626' : '#8e8e8e'} 
          />
        </TouchableOpacity>
      </View>

      {/* Contenu principal flexible */}
      <View style={styles.content}>
        {activeTab === 'published' ? renderPublishedRides() : renderBookedRides()}
      </View>

      <LoadingSpinner visible={isLoading} message="Chargement..." />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  instagramTabs: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
  },
  instagramTab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: 'transparent',
  },
  instagramActiveTab: {
    borderBottomColor: '#262626',
  },
  content: {
    flex: 1, // Permet à la liste d'occuper tout l'espace disponible sans figer
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 20,
  },
  instagramEmptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  instagramEmptyText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#262626',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  instagramEmptySubtext: {
    fontSize: 13,
    color: '#8e8e8e',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default MyRidesScreen;