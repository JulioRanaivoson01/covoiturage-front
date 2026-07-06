import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchStackParamList } from '../types/navigation';
import SearchFormScreen from '../screens/search/SearchFormScreen';
import RideListScreen from '../screens/search/RideListScreen';
import RideDetailsScreen from '../screens/search/RideDetailsScreen';

const Stack = createNativeStackNavigator<SearchStackParamList>();

const SearchNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Retour',
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#1F2937',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="SearchForm"
        component={SearchFormScreen}
        options={{ title: 'Rechercher' }}
      />
      <Stack.Screen
        name="RideList"
        component={RideListScreen}
        options={{ title: 'Résultats' }}
      />
      <Stack.Screen
        name="RideDetails"
        component={RideDetailsScreen}
        options={{ title: 'Détails du trajet' }}
      />
    </Stack.Navigator>
  );
};

export default SearchNavigator;
