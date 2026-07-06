import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { MainTabScreenProps } from '../../types/navigation';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

const ProfileScreen: React.FC<MainTabScreenProps<'Profile'>> = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Se déconnecter',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Erreur', 'Échec de la déconnexion');
            }
          },
        },
      ]
    );
  };

  const navigateToChat = () => {
    // Navigate to chat screen
    console.log('Navigate to chat');
  };

  const navigateToReviews = () => {
    // Navigate to reviews screen
    console.log('Navigate to reviews');
  };

  const navigateToSettings = () => {
    // Navigate to settings screen
    console.log('Navigate to settings');
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Non connecté</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>
          {user.firstName} {user.lastName}
        </Text>
        <Text style={styles.email}>{user.email}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {user.rating.toFixed(1)}</Text>
          {user.isVerified && (
            <Text style={styles.verified}>✓ Vérifié</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations personnelles</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Téléphone:</Text>
          <Text style={styles.value}>{user.phone}</Text>
        </View>
        {user.cinNumber && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>CIN:</Text>
            <Text style={styles.value}>{user.cinNumber}</Text>
          </View>
        )}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Membre depuis:</Text>
          <Text style={styles.value}>
            {new Date(user.createdAt).toLocaleDateString('fr-FR')}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <TouchableOpacity style={styles.actionItem} onPress={navigateToChat}>
          <Text style={styles.actionText}>💬 Messagerie</Text>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem} onPress={navigateToReviews}>
          <Text style={styles.actionText}>⭐ Mes avis</Text>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem} onPress={navigateToSettings}>
          <Text style={styles.actionText}>⚙️ Paramètres</Text>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>
        {!user.cinPhoto && (
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              // Navigate to CIN upload - requires proper navigation setup
              console.log('Navigate to CIN upload for user:', user.id);
            }}
          >
            <Text style={styles.actionText}>📷 Vérifier mon identité</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.footer}>
        <Button
          title="Se déconnecter"
          onPress={handleLogout}
          variant="danger"
          size="large"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    color: '#F59E0B',
    fontWeight: '600',
  },
  verified: {
    fontSize: 14,
    color: '#10B981',
    marginLeft: 8,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    width: 120,
  },
  value: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    flex: 1,
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  actionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  actionArrow: {
    fontSize: 20,
    color: '#9CA3AF',
  },
  footer: {
    padding: 16,
    marginTop: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default ProfileScreen;
