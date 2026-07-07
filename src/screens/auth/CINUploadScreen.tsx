import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AuthScreenProps } from '../../types/navigation';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import authService from '../../api/services/auth.service';

const CINUploadScreen: React.FC<AuthScreenProps<'CINUpload'>> = ({ route, navigation }) => {
  const { userId } = route.params;
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  
const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'] as any,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    setPhotoUri(result.assets[0].uri);
    console.log("Image sélectionnée :", result.assets[0].uri);
  }
};
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Accès à la caméra nécessaire');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 2],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!photoUri) {
      Alert.alert('Erreur', 'Veuillez sélectionner une photo');
      return;
    }

    setIsLoading(true);
    try {
      await authService.uploadCIN(userId, photoUri);
      Alert.alert('Succès', 'Photo CIN téléchargée avec succès', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.message || 'Échec du téléchargement');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* ... (Le reste du JSX reste identique) */}
      <View style={styles.header}>
        <Text style={styles.title}>Vérification d'identité</Text>
        <Text style={styles.subtitle}>Téléchargez une photo de votre carte d'identité nationale</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>+</Text>
              <Text style={styles.placeholderSubtext}>Appuyez pour sélectionner</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.buttonGroup}>
          <Button title="Prendre une photo" onPress={takePhoto} variant="secondary" size="medium" />
          <Button title="Choisir dans la galerie" onPress={pickImage} variant="outline" size="medium" />
        </View>

        <Button title="Télécharger" onPress={handleUpload} size="large" disabled={!photoUri} loading={isLoading} />
      </View>
      <LoadingSpinner visible={isLoading} message="Téléchargement en cours..." />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    height: 200,
    marginBottom: 24,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
    color: '#9CA3AF',
    fontWeight: '300',
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1E40AF',
    marginBottom: 4,
  },
});

export default CINUploadScreen;

