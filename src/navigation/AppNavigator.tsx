import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainTabsNavigator from './MainTabsNavigator';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner visible message="Chargement..." />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabsNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
