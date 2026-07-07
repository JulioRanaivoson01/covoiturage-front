import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
// 🎨 Import des icônes style Instagram
import { Feather, Ionicons } from '@expo/vector-icons';
import { SearchStackParamList } from '../../types/navigation';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

type SearchFormScreenProps = NativeStackScreenProps<SearchStackParamList, 'SearchForm'>;

const SearchFormScreen: React.FC<SearchFormScreenProps> = ({ navigation }) => {
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [passengers, setPassengers] = useState('1');

  const formatDisplayDate = (targetDate: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(targetDate.getDate())}/${pad(targetDate.getMonth() + 1)}/${targetDate.getFullYear()}`;
  };

  const handleSearch = () => {
    if (!departure || !arrival || !date) {
      return;
    }

    navigation.navigate('RideList', {
      departure,
      arrival,
      date: date.toISOString(), // Envoi au format ISO propre pour l'API
      passengers: parseInt(passengers, 10),
    });
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- Header Style Instagram (Minimaliste & Centré) --- */}
        <View style={styles.header}>
          <Text style={styles.title}>Rechercher un trajet</Text>
          <Text style={styles.subtitle}>Trouvez votre prochain covoiturage</Text>
          
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>

        <View style={styles.form}>
          {/* --- Départ --- */}
          <View style={styles.instagramInputContainer}>
            <Feather name="map-pin" size={20} color="#262626" style={styles.inputIcon} />
            <View style={styles.inputFlex}>
              <Input
                placeholder="Lieu de départ (ex: Antananarivo)"
                placeholderTextColor="#8e8e8e"
                value={departure}
                onChangeText={setDeparture}
                containerStyle={styles.pureInputContainer}
                style={styles.pureInput}
              />
            </View>
          </View>

          {/* --- Arrivée --- */}
          <View style={styles.instagramInputContainer}>
            <Ionicons name="flag-outline" size={20} color="#262626" style={styles.inputIcon} />
            <View style={styles.inputFlex}>
              <Input
                placeholder="Destination (ex: Antsirabe)"
                placeholderTextColor="#8e8e8e"
                value={arrival}
                onChangeText={setArrival}
                containerStyle={styles.pureInputContainer}
                style={styles.pureInput}
              />
            </View>
          </View>

          {/* --- Date (Sélecteur de calendrier moderne) --- */}
          <View style={styles.instagramInputContainer}>
            <Feather name="calendar" size={20} color="#262626" style={styles.inputIcon} />
            <TouchableOpacity style={styles.instagramRowButton} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.instagramRowButtonText}>{formatDisplayDate(date)}</Text>
              <Text style={styles.instagramActionText}>Changer</Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeDate}
              minimumDate={new Date()}
            />
          )}

          {/* --- Passagers --- */}
          <View style={styles.instagramInputContainer}>
            <Ionicons name="people-outline" size={20} color="#262626" style={styles.inputIcon} />
            <View style={styles.inputFlex}>
              <Input
                placeholder="Nombre de passagers"
                placeholderTextColor="#8e8e8e"
                value={passengers}
                onChangeText={setPassengers}
                keyboardType="number-pad"
                containerStyle={styles.pureInputContainer}
                style={styles.pureInput}
              />
            </View>
          </View>

          {/* --- Bouton Rechercher --- */}
          <View style={styles.buttonWrapper}>
            <Button
              title="Rechercher"
              onPress={handleSearch}
              style={styles.instagramPrimaryButton}
              textStyle={styles.instagramButtonText}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Blanc pur Instagram
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
    width: '100%',
    backgroundColor: '#262626', // Ligne noire minimaliste sous le titre
  },
  form: {
    flex: 1,
  },
  /* ─── ENTRÉES STYLE INSTAGRAM ─── */
  instagramInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb', // Ligne fine grise
    paddingVertical: 12,
    marginBottom: 8,
  },
  inputIcon: {
    marginRight: 14,
    width: 22,
    textAlign: 'center',
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
    color: '#0095f6', // Bleu Instagram
    fontWeight: '600',
  },
  /* ─── BOUTON RECHERCHER ─── */
  buttonWrapper: {
    marginTop: 28,
  },
  instagramPrimaryButton: {
    backgroundColor: '#0095f6', // Bleu d'action principal
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

export default SearchFormScreen;