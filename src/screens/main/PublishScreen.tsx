import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Switch,
  TouchableOpacity,
  Image,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
// 🎨 Import des icônes style Instagram
import { Feather, Ionicons } from '@expo/vector-icons';
import { MainTabScreenProps } from '../../types/navigation';
import { CreateRideRequest } from '../../types/api';
import { useAuth } from '../../context/AuthContext';
import ridesService from '../../api/services/rides.service';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PublishScreen: React.FC<MainTabScreenProps<'Publish'>> = ({ navigation }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [carImage, setCarImage] = useState<string | null>(null);

  // Form Statesc
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [price, setPrice] = useState('');
  const [totalSeats, setTotalSeats] = useState('3');
  const [luggage, setLuggage] = useState(false);
  const [description, setDescription] = useState('');
  const [carImageUri, setCarImageUri] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const [carModel, setCarModel] = useState('Véhicule non spécifié');
  const formatDisplayDate = (targetDate: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(targetDate.getDate())}/${pad(targetDate.getMonth() + 1)}/${targetDate.getFullYear()} à ${pad(targetDate.getHours())}:${pad(targetDate.getMinutes())}`;
  };

  const validateStep1 = () => {
    const newErrors: any = {};
    if (!departure) newErrors.departure = 'Départ requis';
    if (!arrival) newErrors.arrival = 'Arrivée requise';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: any = {};
    if (!price) newErrors.price = 'Prix requis';
    else if (parseFloat(price) <= 0) newErrors.price = 'Prix invalide';
    if (!totalSeats) newErrors.totalSeats = 'Nombre de places requis';
    else if (parseInt(totalSeats, 10) < 1) newErrors.totalSeats = 'Minimum 1 place';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep1 = () => {
    if (validateStep1()) setStep(2);
  };

  const handleNextStep2 = () => {
    if (validateStep2()) setStep(3);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSelectCarImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission requise", 
        "Vous devez autoriser l'accès à vos photos pour ajouter l'image du véhicule."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'] as any,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setCarImageUri(result.assets[0].uri);
    }
  };

  const onChangeDateTime = (event: any, selectedDate?: Date) => {
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }
    const currentDate = selectedDate || date;
    if (Platform.OS === 'android') {
      if (pickerMode === 'date') {
        setDate(currentDate);
        setPickerMode('time');
        setShowDatePicker(true);
      } else {
        setDate(currentDate);
        setShowDatePicker(false);
        setPickerMode('date');
      }
    } else {
      setDate(currentDate);
    }
  };

  const handlePublish = async () => {
    if (!user) {
      Alert.alert('SYS_ERROR', 'Identification requise pour publier un transit.');
      return;
    }
    // 🛡️ SÉCURITÉ AJOUTÉE : On vérifie si la date du calendrier est valide avant l'envoi
    if (!date || isNaN(date.getTime())) {
      Alert.alert(
        'Date Invalide', 
        'La date ou l\'heure sélectionnée n\'est pas correcte. Veuillez la modifier.'
      );
      return;
    }

setIsLoading(true);
    try {
      let uploadedImageUrl: string | null = null;
      
      if (carImageUri) {
        try {
          uploadedImageUrl = await ridesService.uploadCarImage(carImageUri);
        } catch (uploadError) {
          console.warn('Upload image échoué (endpoint backend non configuré), poursuite sans image:', uploadError);
          // On continue sans image car le backend endpoint n'existe pas encore
        }
      }

      const rideData = {
        departure,
        arrival,
        departureTime: date.toISOString(),
        pricePerSeat: parseFloat(price) || 0,
        totalSeats: parseInt(totalSeats, 10),
        carModel: typeof carModel !== 'undefined' ? carModel : 'Véhicule non spécifié',
        carImageUri: uploadedImageUrl || undefined,
        
        luggageAllowed: luggage ? 'small' : 'none',
        
        description: description || undefined,
      };

      console.log('Données envoyées à l\'API :', rideData);
      await ridesService.createRide(rideData);

      Alert.alert('SYSTEM_OK', 'Trajet et véhicule synchronisés avec succès.', [
        {
          text: 'OK',
          onPress: () => {
            setDeparture('');
            setArrival('');
            setDate(new Date());
            setPrice('');
            setDescription('');
            setCarImageUri(null);
            setStep(1);
            navigation.navigate('MyRides');
          },
        },
      ]);
    } catch (error: any) {
  const backendMessage = error.response?.data?.message;
  let displayMessage = 'Échec de la liaison.';

  if (backendMessage) {
    // Si NestJS renvoie un tableau d'erreurs (validation class-validator)
    if (Array.isArray(backendMessage)) {
      displayMessage = backendMessage.join('\n'); // Aligne les erreurs ligne par ligne
    } else {
      displayMessage = backendMessage;
    }
  }

  Alert.alert('Erreur de validation', displayMessage);
} finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- Header Style Instagram --- */}
        <View style={styles.header}>
          <Text style={styles.title}>Nouveau trajet</Text>
          <Text style={styles.subtitle}>Étape {step} sur 3</Text>
          
          <View style={styles.progressTrack}>
            <View 
              style={[
                styles.progressFill, 
                { width: step === 1 ? '33.3%' : step === 2 ? '66.6%' : '100%' }
              ]} 
            />
          </View>
        </View>

        <View style={styles.form}>
          {/* --- ÉTAPE 1 : Localisation --- */}
          {step === 1 && (
            <View>
              <View style={styles.instagramInputContainer}>
                <Feather name="map-pin" size={20} color="#262626" style={styles.inputIcon} />
                <View style={styles.inputFlex}>
                  <Input
                    placeholder="Lieu de départ (ex: Antananarivo)"
                    placeholderTextColor="#8e8e8e"
                    value={departure}
                    onChangeText={setDeparture}
                    error={errors.departure}
                    containerStyle={styles.pureInputContainer}
                    style={styles.pureInput}
                  />
                </View>
              </View>

              <View style={styles.instagramInputContainer}>
                <Ionicons name="flag-outline" size={20} color="#262626" style={styles.inputIcon} />
                <View style={styles.inputFlex}>
                  <Input
                    placeholder="Destination (ex: Antsirabe)"
                    placeholderTextColor="#8e8e8e"
                    value={arrival}
                    onChangeText={setArrival}
                    error={errors.arrival}
                    containerStyle={styles.pureInputContainer}
                    style={styles.pureInput}
                  />
                </View>
              </View>

              <View style={styles.buttonWrapper}>
                <Button 
                  title="Suivant" 
                  onPress={handleNextStep1} 
                  style={styles.instagramPrimaryButton}
                  textStyle={styles.instagramButtonText}
                />
              </View>
            </View>
          )}

          {/* --- ÉTAPE 2 : Infos Logistiques --- */}
          {step === 2 && (
            <View>
              {/* Date & Heure */}
              <View style={styles.instagramInputContainer}>
                <Feather name="calendar" size={20} color="#262626" style={styles.inputIcon} />
                <TouchableOpacity style={styles.instagramRowButton} onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.instagramRowButtonText}>{formatDisplayDate(date)}</Text>
                  <Text style={styles.instagramActionText}>Modifier</Text>
                </TouchableOpacity>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode={pickerMode}
                  is24Hour={true}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onChangeDateTime}
                  minimumDate={new Date()}
                />
              )}

              {/* Prix en MGA avec Badge AR localisé */}
              <View style={styles.instagramInputContainer}>
                <View style={styles.malagasyCurrencyBadge}>
                  <Text style={styles.currencyText}>AR</Text>
                </View>
                <View style={styles.inputFlex}>
                  <Input
                    placeholder="Frais par passager"
                    placeholderTextColor="#8e8e8e"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="decimal-pad"
                    error={errors.price}
                    containerStyle={styles.pureInputContainer}
                    style={styles.pureInput}
                  />
                </View>
              </View>

              {/* Places */}
              <View style={styles.instagramInputContainer}>
                <Ionicons name="people-outline" size={20} color="#262626" style={styles.inputIcon} />
                <View style={styles.inputFlex}>
                  <Input
                    placeholder="Nombre de places disponibles"
                    placeholderTextColor="#8e8e8e"
                    value={totalSeats}
                    onChangeText={setTotalSeats}
                    keyboardType="number-pad"
                    error={errors.totalSeats}
                    containerStyle={styles.pureInputContainer}
                    style={styles.pureInput}
                  />
                </View>
              </View>

              {/* Switch Bagages */}
              <View style={styles.instagramSwitchContainer}>
                <View style={styles.switchLeftRow}>
                  <Feather name="briefcase" size={20} color="#262626" style={styles.inputIcon} />
                  <Text style={styles.instagramSwitchLabel}>Compartiment bagages autorisé</Text>
                </View>
                <Switch
                  value={luggage}
                  onValueChange={setLuggage}
                  trackColor={{ false: '#dbdbdb', true: '#0095f6' }}
                  thumbColor={'#ffffff'}
                />
              </View>

              <View style={styles.navigationRow}>
                <View style={styles.flexButton}>
                  <Button 
                    title="Retour" 
                    onPress={handleBack} 
                    style={styles.instagramDangerButton}
                    textStyle={styles.instagramButtonText} 
                  />
                </View>
                <View style={styles.flexButton}>
                  <Button 
                    title="Suivant" 
                    onPress={handleNextStep2} 
                    style={styles.instagramPrimaryButton}
                    textStyle={styles.instagramButtonText}
                  />
                </View>
              </View>
            </View>
          )}

          {/* --- ÉTAPE 3 : Photo du Véhicule & Description --- */}
          {step === 3 && (
            <View>
              <TouchableOpacity style={styles.instagramImageCard} onPress={handleSelectCarImage}>
                {carImageUri ? (
                  <Image source={{ uri: carImageUri }} style={styles.previewImage} />
                ) : (
                  <View style={styles.uploaderPlaceholderContainer}>
                    <Feather name="camera" size={36} color="#dbdbdb" style={{ marginBottom: 8 }} />
                    <Text style={styles.uploaderText}>Ajouter la photo de la voiture</Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={[styles.instagramInputContainer, { alignItems: 'flex-start', paddingTop: 8 }]}>
                <Feather name="align-left" size={20} color="#262626" style={[styles.inputIcon, { marginTop: 4 }]} />
                <View style={styles.inputFlex}>
                  <Input
                    placeholder="Écrire une légende ou ajouter des détails..."
                    placeholderTextColor="#8e8e8e"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={3}
                    containerStyle={styles.pureInputContainer}
                    style={[styles.pureInput, { height: 60, paddingTop: 0 }]}
                  />
                </View>
              </View>

              <View style={styles.navigationRow}>
                <View style={styles.flexButton}>
                  <Button 
                    title="Retour" 
                    onPress={handleBack} 
                    style={styles.instagramDangerButton}
                    textStyle={styles.instagramButtonText} 
                  />
                </View>
                <View style={styles.flexButton}>
                  <Button 
                    title="Partager" 
                    onPress={handlePublish} 
                    loading={isLoading} 
                    style={styles.instagramShareButton}
                    textStyle={styles.instagramButtonText}
                  />
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <LoadingSpinner visible={isLoading} message="Partage en cours..." />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', 
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#262626',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    color: '#8e8e8e',
    marginTop: 2,
  },
  progressTrack: {
    height: 2,
    width: '40%',
    backgroundColor: '#efefef',
    borderRadius: 1,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#262626', 
  },
  form: {
    flex: 1,
  },
  instagramInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb', 
    paddingVertical: 12,
    marginBottom: 8,
  },
  inputIcon: {
    marginRight: 14,
    width: 22,
    textAlign: 'center',
  },
  /* 🇲🇬 Badge Ariary Customisé */
  malagasyCurrencyBadge: {
    marginRight: 14,
    width: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#262626',
    letterSpacing: -0.5,
  },
  inputFlex: {
    flex: 1,
  },
  pureInputContainer: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    marginVertical: 0,
    height: 'auto',
  },
  pureInput: {
    fontSize: 15,
    color: '#262626',
    paddingVertical: 0,
  },
  instagramRowButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  instagramRowButtonText: {
    fontSize: 15,
    color: '#262626',
  },
  instagramActionText: {
    fontSize: 14,
    color: '#0095f6', 
    fontWeight: '600',
  },
  instagramSwitchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
    paddingVertical: 12,
    marginBottom: 24,
  },
  switchLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instagramSwitchLabel: {
    fontSize: 15,
    color: '#262626',
  },
  instagramImageCard: {
    width: '100%',
    aspectRatio: 4 / 3, 
    backgroundColor: '#fafafa',
    borderWidth: 0.5,
    borderColor: '#dbdbdb',
    borderRadius: 3,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  uploaderPlaceholderContainer: {
    alignItems: 'center',
  },
  uploaderText: {
    fontSize: 14,
    color: '#0095f6',
    fontWeight: '600',
  },
  buttonWrapper: {
    marginTop: 20,
  },
  navigationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 30,
    gap: 10,
  },
  flexButton: {
    flex: 1,
  },
  instagramPrimaryButton: {
    backgroundColor: '#0095f6', 
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    borderWidth: 0,
  },
  instagramShareButton: {
    backgroundColor: '#262626', 
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    borderWidth: 0,
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
});

export default PublishScreen;