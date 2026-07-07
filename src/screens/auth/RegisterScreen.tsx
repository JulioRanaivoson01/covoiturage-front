import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
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
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    cinNumber?: string;
  }>({});

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!email) {
      newErrors.email = 'Email est requis';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (!password) {
      newErrors.password = 'Mot de passe est requis';
    } else if (password.length < 6) {
      newErrors.password = 'Mot de passe doit contenir au moins 6 caractères';
    }
    
    if (!firstName) {
      newErrors.firstName = 'Prénom est requis';
    }
    
    if (!lastName) {
      newErrors.lastName = 'Nom est requis';
    }
    
    if (!phone) {
      newErrors.phoneNumber = 'Téléphone est requis';
    } else if (!/^[0-9]{10}$/.test(phone)) {
      newErrors.phoneNumber = 'Numéro de téléphone invalide (10 chiffres)';
    }

    if (!cinNumber) {
      newErrors.cinNumber = 'Numéro CIN est requis';
    } else if (!/^[0-9]{12}$/.test(cinNumber)) {
      newErrors.cinNumber = 'Numéro CIN invalide (12 chiffres)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setErrors({});

      // Appel direct au service d'inscription sans connexion automatique
      await authService.register({
        email,
        password,
        firstName,
        lastName,
        phoneNumber: phone,
        cinNumber,
      });

      console.log('Inscription réussie !');

      // Afficher un message de succès et rediriger vers l'écran de connexion
      Alert.alert(
        'Succès',
        'Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );

    } catch (error: any) {
      console.error('Register error details:', error);

      // Handle server errors (ex: Email déjà existant, validation errors)
      let errorMessage = error.response?.data?.message || error.message || "Une erreur est survenue lors de l'inscription.";

      // Handle specific 401 errors from register endpoint (backend validation errors)
      if (error.response?.status === 401 && errorMessage.includes('CIN')) {
        errorMessage = "Ce numéro CIN existe déjà. Veuillez utiliser un autre numéro.";
      } else if (error.response?.status === 401 && errorMessage.includes('email')) {
        errorMessage = "Cet email est déjà utilisé. Veuillez vous connecter ou utiliser un autre email.";
      }

      Alert.alert('Erreur', Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>Rejoignez-nous dès maintenant</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Prénom"
            placeholder="Jean"
            value={firstName}
            onChangeText={setFirstName}
            error={errors.firstName}
          />

          <Input
            label="Nom"
            placeholder="Dupont"
            value={lastName}
            onChangeText={setLastName}
            error={errors.lastName}
          />

          <Input
            label="Email"
            placeholder="votre@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <Input
            label="Téléphone"
            placeholder="0341234567"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            error={errors.phoneNumber}
          />

          <Input
            label="Numéro CIN"
            placeholder="12 chiffres"
            value={cinNumber}
            onChangeText={setCinNumber}
            keyboardType="numeric"
            error={errors.cinNumber}
          />

          <Input
            label="Mot de passe"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
          />

          <Button
            title="S'inscrire"
            onPress={handleRegister}
            size="large"
            loading={isLoading}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Déjà un compte? </Text>
            <Text
              style={styles.link}
              onPress={() => navigation.navigate('Login')}
            >
              Se connecter
            </Text>
          </View>
        </View>
      </ScrollView>
      <LoadingSpinner visible={isLoading} message="Inscription en cours..." />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginTop: 40,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  form: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  link: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
});

export default RegisterScreen;