import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthScreenProps } from '../../types/navigation';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import authService from '../../api/services/auth.service';

const RegisterScreen: React.FC<AuthScreenProps<'Register'>> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [cinNumber, setCinNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const validateForm = () => {
    const newErrors: any = {};
    if (!email) newErrors.email = 'Email est requis';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email invalide';
    if (!password) newErrors.password = 'Mot de passe est requis';
    else if (password.length < 6) newErrors.password = 'Au moins 6 caractères';
    if (!firstName) newErrors.firstName = 'Prénom est requis';
    if (!lastName) newErrors.lastName = 'Nom est requis';
    if (!phone || !/^[0-9]{10}$/.test(phone)) newErrors.phoneNumber = 'Téléphone invalide';
    if (!cinNumber || !/^[0-9]{12}$/.test(cinNumber)) newErrors.cinNumber = 'CIN invalide (12 chiffres)';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    try {
      setIsLoading(true);
      await authService.register({ email, password, firstName, lastName, phoneNumber: phone, cinNumber });
      Alert.alert('Succès', 'Compte créé avec succès !', [{ text: 'OK', onPress: () => navigation.navigate('Login') }]);
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="car-sport" size={60} color="#0095F6" style={{ marginBottom: 16 }} />
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>Rejoignez la communauté</Text>
        </View>

        <View style={styles.form}>
          <Input label="Prénom" placeholder="Jean" value={firstName} onChangeText={setFirstName} error={errors.firstName} />
          <Input label="Nom" placeholder="Dupont" value={lastName} onChangeText={setLastName} error={errors.lastName} />
          <Input label="Email" placeholder="votre@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" error={errors.email} />
          <Input label="Téléphone" placeholder="0341234567" value={phone} onChangeText={setPhone} keyboardType="phone-pad" error={errors.phoneNumber} />
          <Input label="Numéro CIN" placeholder="12 chiffres" value={cinNumber} onChangeText={setCinNumber} keyboardType="numeric" error={errors.cinNumber} />
          
          <Input
            label="Mot de passe"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            error={errors.password}
            rightIcon={
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                <Ionicons name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} size={22} color="#6B7280" />
              </TouchableOpacity>
            }
          />

          <Button title="S'inscrire" onPress={handleRegister} size="large" loading={isLoading} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Déjà un compte? </Text>
            <Text style={styles.link} onPress={() => navigation.navigate('Login')}>Se connecter</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '800', color: '#000000' },
  subtitle: { fontSize: 15, color: '#8E8E93', marginTop: 8 },
  form: { width: '100%' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32, borderTopWidth: 1, borderTopColor: '#DBDBDB', paddingTop: 24 },
  footerText: { fontSize: 14, color: '#8E8E93' },
  link: { fontSize: 14, color: '#0095F6', fontWeight: '700' },
});

export default RegisterScreen;