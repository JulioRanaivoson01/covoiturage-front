# Mon App Covoiturage

Application mobile de covoiturage développée avec React Native, TypeScript et Expo.

## 🚀 Fonctionnalités

### Authentification
- Inscription utilisateur avec validation
- Connexion sécurisée avec JWT
- Téléversement de photo CIN pour vérification

### Recherche de trajets
- Formulaire de recherche (Départ, Arrivée, Date, Passagers)
- Liste des trajets disponibles avec détails visuels
- Détails complets du trajet avec informations conducteur
- Système de réservation

### Publication de trajets
- Formulaire complet pour les conducteurs
- Gestion des places disponibles
- Option bagages
- Prix personnalisable

### Gestion des trajets
- Suivi des trajets publiés
- Historique des réservations
- Statuts des réservations

### Profil utilisateur
- Gestion des informations personnelles
- Affichage des avis et notes
- Messagerie (structure prête)
- Vérification d'identité

## 📁 Structure du projet

```
src/
├── api/
│   ├── axios.ts              # Configuration Axios avec intercepteurs
│   └── services/
│       ├── auth.service.ts   # Service d'authentification
│       ├── rides.service.ts  # Service des trajets
│       ├── bookings.service.ts # Service des réservations
│       ├── messages.service.ts # Service de messagerie
│       └── reviews.service.ts # Service des avis
├── components/
│   ├── common/
│   │   ├── Button.tsx        # Bouton personnalisé
│   │   ├── Input.tsx         # Champ de saisie stylisé
│   │   └── LoadingSpinner.tsx # Spinner de chargement
│   └── rides/
│       └── RideCard.tsx      # Carte de trajet
├── context/
│   └── AuthContext.tsx       # Contexte d'authentification
├── navigation/
│   ├── AppNavigator.tsx      # Navigateur principal
│   ├── AuthNavigator.tsx     # Stack d'authentification
│   ├── MainTabsNavigator.tsx # Onglets principaux
│   └── SearchNavigator.tsx   # Stack de recherche
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   └── CINUploadScreen.tsx
│   ├── search/
│   │   ├── SearchFormScreen.tsx
│   │   ├── RideListScreen.tsx
│   │   └── RideDetailsScreen.tsx
│   └── main/
│       ├── PublishScreen.tsx
│       ├── MyRidesScreen.tsx
│       └── ProfileScreen.tsx
├── types/
│   ├── navigation.ts         # Types de navigation
│   └── api.ts               # Types API
└── utils/
```

## 🛠️ Installation

### Prérequis
- Node.js (v18 ou supérieur)
- npm ou yarn
- Expo CLI

### Étapes d'installation

1. Installer les dépendances:
```bash
npm install
```

2. (Optionnel) Pour iOS, installer les pods:
```bash
cd ios
pod install
cd ..
```

3. Lancer l'application:
```bash
# Pour démarrer le serveur de développement
npm start

# Pour iOS
npm run ios

# Pour Android
npm run android

# Pour Web
npm run web
```

## ⚙️ Configuration

### API Backend

Configurez l'URL de l'API dans `src/api/axios.ts`:

```typescript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'  // URL locale en développement
  : 'https://your-api-domain.com/api'; // URL de production
```

### Expo

La configuration Expo se trouve dans `app.json`.

## 📱 Dépendances principales

- **React Native**: Framework mobile
- **Expo**: Plateforme de développement
- **React Navigation**: Navigation
- **Axios**: Client HTTP
- **TypeScript**: Typage statique
- **Async Storage**: Persistance locale

## 🔐 Sécurité

- Tokens JWT stockés dans AsyncStorage
- Intercepteurs Axios pour l'authentification
- Validation des formulaires côté client
- Gestion des erreurs réseau

## 🎨 UI/UX

- Interface moderne et intuitive
- Composants réutilisables
- Gestion des états de chargement
- Feedback utilisateur (alerts, spinners)
- Adaptée aux réseaux mobiles (gestion erreurs)

## 📝 Notes de développement

### Linting TypeScript
Les erreurs TypeScript concernant les modules manquants (`@react-native-async-storage/async-storage` et `expo-image-picker`) seront résolues après l'installation des dépendances avec `npm install`.

### Navigation
La navigation utilise React Navigation v7 avec:
- Native Stack pour les écrans empilés
- Bottom Tabs pour la navigation principale

### Services API
Tous les services API sont centralisés dans `src/api/services/` et utilisent l'instance Axios configurée.

## 🚧 À faire

- [ ] Implémenter l'écran de messagerie complet
- [ ] Ajouter les écrans de paramètres
- [ ] Implémenter le système d'avis détaillé
- [ ] Ajouter la géolocalisation
- [ ] Intégrer les notifications push
- [ ] Tests unitaires
- [ ] Tests E2E

## 📄 Licence

Ce projet est sous licence privée.
