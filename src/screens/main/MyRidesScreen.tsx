import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
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
    try {
      const [rides, bookings] = await Promise.all([
        ridesService.getMyRides(),
        bookingsService.getMyBookings(),
      ]);
      setMyRides(rides);
      setMyBookings(bookings);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRidePress = (ride: Ride) => {
    // Navigate to ride details if needed
    console.log('Ride pressed:', ride.id);
  };

  const renderPublishedRides = () => {
    if (myRides.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun trajet publié</Text>
          <Text style={styles.emptySubtext}>Publiez votre premier trajet!</Text>
        </View>
      );
    }

    return myRides.map((ride) => (
      <RideCard
        key={ride.id}
        ride={ride}
        onPress={() => handleRidePress(ride)}
      />
    ));
  };

  const renderBookedRides = () => {
    if (myBookings.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucune réservation</Text>
          <Text style={styles.emptySubtext}>Trouvez votre premier trajet!</Text>
        </View>
      );
    }

    return myBookings.map((booking) => (
      <RideCard
        key={booking.id}
        ride={booking.ride}
        onPress={() => handleRidePress(booking.ride)}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'published' && styles.activeTab]}
          onPress={() => setActiveTab('published')}
        >
          <Text
            style={[styles.tabText, activeTab === 'published' && styles.activeTabText]}
          >
            Mes trajets
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'booked' && styles.activeTab]}
          onPress={() => setActiveTab('booked')}
        >
          <Text
            style={[styles.tabText, activeTab === 'booked' && styles.activeTabText]}
          >
            Mes réservations
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'published' ? renderPublishedRides() : renderBookedRides()}
      </ScrollView>

      <LoadingSpinner visible={isLoading} message="Chargement..." />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#3B82F6',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default MyRidesScreen;
