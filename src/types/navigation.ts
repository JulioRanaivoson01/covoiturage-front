import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Auth Stack Param List
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  CINUpload: { userId: string };
};

// Main Tabs Param List
export type MainTabsParamList = {
  Search: NavigatorScreenParams<SearchStackParamList>;
  Publish: { rideId?: string } | undefined;
  MyRides: undefined;
  Profile: undefined;
};

// Search Stack Param List
export type SearchStackParamList = {
  SearchForm: undefined;
  RideList: {
    departure: string;
    arrival: string;
    date: string;
    passengers: number;
  };
  RideDetails: { rideId: string };
};

// Type helpers for screen props
export type AuthScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

export type MainTabScreenProps<T extends keyof MainTabsParamList> = BottomTabScreenProps<
  MainTabsParamList,
  T
>;

export type SearchScreenProps<T extends keyof SearchStackParamList> = NativeStackScreenProps<
  SearchStackParamList,
  T
>;
