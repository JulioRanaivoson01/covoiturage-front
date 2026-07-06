import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SearchStackParamList } from '../../types/navigation';
import { Ride } from '../../types/api';
import ridesService from '../../api/services/rides.service';
import RideCard from '../../components/rides/RideCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

type RideListScreenProps = NativeStackScreenProps<SearchStackParamList, 'RideList'>;

const RideListScreen: React.FC<RideListScreenProps> = ({ route, navigation }) => {
  const { departure, arrival, date, passengers } = route.params;
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadRides = async () => {
    try {
      const data = await ridesService.searchRides({
        departure,
        arrival,
        date,
        passengers,
      });
      setRides(data);
    } catch (error) {
      console.error('Error loading rides:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadRides();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadRides();
  };

  const handleRidePress = (rideId: string) => {
    navigation.navigate('RideDetails', { rideId });
  };

  const renderRide = ({ item }: { item: Ride }) => (
    <RideCard ride={item} onPress={() => handleRidePress(item.id)} />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Aucun trajet disponible</Text>
      <Text style={styles.emptySubtext}>
        Essayez de modifier vos critères de recherche
      </Text>
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner visible message="Recherche en cours..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={rides}
        renderItem={renderRide}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
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
    textAlign: 'center',
  },
});

export default RideListScreen;
