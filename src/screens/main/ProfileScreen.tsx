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
// 🎨 Import des icônes pour le style Instagram
import { Feather, Ionicons } from '@expo/vector-icons';
import { MainTabScreenProps } from '../../types/navigation';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

const ProfileScreen: React.FC<MainTabScreenProps<'Profile'>> = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
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
    console.log('Navigate to chat');
  };

  const navigateToReviews = () => {
    console.log('Navigate to reviews');
  };

  const navigateToSettings = () => {
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* ─── EN-TÊTE STYLE PROFIL INSTAGRAM ─── */}
      <View style={styles.profileHeaderContainer}>
        <View style={styles.profileRow}>
          {/* Photo de profil avec bordure fine */}
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/150' }}
              style={styles.avatar}
            />
          </View>

          {/* Statistiques en ligne (Style Instagram Posts/Followers) */}
          <View style={styles.statsContainer}>
            <TouchableOpacity style={styles.statBox} onPress={navigateToReviews}>
              <Text style={styles.statNumber}>{(user?.rating ?? 0).toFixed(1)}</Text>
              <Text style={styles.statLabel}>Note</Text>
            </TouchableOpacity>
            
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>—</Text>
              <Text style={styles.statLabel}>Trajets</Text>
            </View>

            <View style={styles.statBox}>
              <View style={styles.verifiedRow}>
                {user.isVerified ? (
                  <Ionicons name="checkmark-circle" size={18} color="#0095f6" />
                ) : (
                  <Text style={styles.statNumber}>Actif</Text>
                )}
              </View>
              <Text style={styles.statLabel}>Statut</Text>
            </View>
          </View>
        </View>

        {/* Informations textuelles (Bio du profil) */}
        <View style={styles.bioContainer}>
          <Text style={styles.name}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.bioText}>🇲🇬 Membre depuis le {new Date(user.createdAt).toLocaleDateString('fr-FR')}</Text>
        </View>

        {/* Bouton secondaire gris pour Modifier / Gérer l'identité */}
        {!user.cinPhoto && (
          <TouchableOpacity 
            style={styles.instagramSecondaryButton}
            onPress={() => console.log('Navigate to CIN upload for user:', user.id)}
          >
            <Text style={styles.secondaryButtonText}>Vérifier mon identité (CIN)</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ─── INFOS COMPLÉMENTAIRES DISCRÈTES ─── */}
      <View style={styles.metaInfoSection}>
        <View style={styles.metaRow}>
          <Feather name="phone" size={14} color="#65676B" style={styles.metaIcon} />
          <Text style={styles.metaText}>{user.phone}</Text>
        </View>
        {user.cinNumber && (
          <View style={styles.metaRow}>
            <Feather name="credit-card" size={14} color="#65676B" style={styles.metaIcon} />
            <Text style={styles.metaText}>CIN: {user.cinNumber}</Text>
          </View>
        )}
      </View>

      {/* ─── LISTE D'ACTIONS MODERNES (STYLE RÉGLAGES INSTAGRAM) ─── */}
      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.actionItem} onPress={navigateToChat}>
          <View style={styles.actionLeftRow}>
            <Feather name="message-circle" size={22} color="#262626" style={styles.actionIcon} />
            <Text style={styles.actionText}>Messagerie</Text>
          </View>
          <Feather name="chevron-right" size={18} color="#dbdbdb" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem} onPress={navigateToReviews}>
          <View style={styles.actionLeftRow}>
            <Feather name="star" size={22} color="#262626" style={styles.actionIcon} />
            <Text style={styles.actionText}>Mes avis</Text>
          </View>
          <Feather name="chevron-right" size={18} color="#dbdbdb" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem} onPress={navigateToSettings}>
          <View style={styles.actionLeftRow}>
            <Feather name="settings" size={22} color="#262626" style={styles.actionIcon} />
            <Text style={styles.actionText}>Paramètres de l'application</Text>
          </View>
          <Feather name="chevron-right" size={18} color="#dbdbdb" />
        </TouchableOpacity>
      </View>

      {/* ─── BOUTON ROUGE INSTAGRAM POUR DÉCONNEXION ─── */}
      <View style={styles.footer}>
        <Button
          title="Se déconnecter"
          onPress={handleLogout}
          style={styles.instagramDangerButton}
          textStyle={styles.instagramButtonText}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Blanc pur Instagram
  },
  profileHeaderContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarContainer: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 1,
    borderColor: '#dbdbdb',
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 20,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#262626',
  },
  verifiedRow: {
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#262626',
    marginTop: 2,
  },
  bioContainer: {
    marginTop: 14,
    paddingHorizontal: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#262626',
  },
  email: {
    fontSize: 13,
    color: '#8e8e8e',
    marginTop: 1,
  },
  bioText: {
    fontSize: 13,
    color: '#262626',
    marginTop: 4,
  },
  /* Bouton secondaire gris type Instagram */
  instagramSecondaryButton: {
    backgroundColor: '#efefef',
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  secondaryButtonText: {
    color: '#262626',
    fontSize: 13,
    fontWeight: '600',
  },
  /* Section Meta discrète */
  metaInfoSection: {
    backgroundColor: '#fafafa',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
    flexDirection: 'row',
    gap: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    marginRight: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#65676B',
  },
  /* Liste d'actions */
  actionSection: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#efefef',
  },
  actionLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    marginRight: 14,
    width: 24,
    textAlign: 'center',
  },
  actionText: {
    fontSize: 14,
    color: '#262626',
  },
  /* Pied de page et Bouton Déconnexion */
  footer: {
    paddingHorizontal: 16,
    marginTop: 32,
    marginBottom: 40,
  },
  instagramDangerButton: {
    backgroundColor: '#dc2626',
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    borderWidth: 0,
  },
  instagramButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
    marginTop: 40,
    fontWeight: '600',
  },
});

export default ProfileScreen;