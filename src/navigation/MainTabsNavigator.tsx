import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// 🎨 Import des icônes officielles pour le style Instagram
import { Feather, Ionicons } from '@expo/vector-icons';
import { MainTabsParamList } from '../types/navigation';
import SearchNavigator from './SearchNavigator';
import PublishScreen from '../screens/main/PublishScreen';
import MyRidesScreen from '../screens/main/MyRidesScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabsParamList>();

const MainTabsNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        // Couleurs Instagram : Noir pur si actif, gris clair si inactif
        tabBarActiveTintColor: '#262626',
        tabBarInactiveTintColor: '#8e8e8e',
        // Style Instagram : Pas de texte sous les icônes pour un look épuré
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF', // Blanc pur
          borderTopWidth: 0.5,       // Ligne de séparation très fine
          borderTopColor: '#dbdbdb',   // Gris clair Instagram
          height: 54,                 // Plus fin et compact
          paddingBottom: 0,
          paddingTop: 0,
          elevation: 0,               // Supprime l'ombre lourde sur Android
          shadowOpacity: 0,           // Supprime l'ombre lourde sur iOS
        },
      }}
    >
      <Tab.Screen
        name="Search"
        component={SearchNavigator}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Feather 
              name="search" 
              size={24} 
              color={color} 
              style={{ fontWeight: focused ? '700' : '400' }} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="Publish"
        component={PublishScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            // Utilisation du carré "plus" style création de post Instagram
            <Feather 
              name={focused ? "plus-square" : "plus-square"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="MyRides"
        component={MyRidesScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            // L'icône de voiture Feather s'intègre parfaitement au style filaire
            <Feather 
              name="truck" 
              size={24} 
              color={color} 
              style={{ opacity: focused ? 1 : 0.8 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabsNavigator;