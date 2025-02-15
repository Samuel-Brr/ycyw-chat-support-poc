# Your Car Your Way - POC Support Chat Synchrone 

## Vue d'ensemble

Ce projet est un Proof of Concept (POC) pour la fonctionnalité de chat synchrone de la plateforme de location de voitures Your Car Your Way. 
Il se compose de deux parties principales :

- Une application backend Spring Boot fournissant des API REST et WebSocket pour les fonctionnalités de chat
- Une application frontend Angular pour l'interface de chat

## Backend Chat Support

Il s'agit d'une application Spring Boot qui fournit des fonctionnalités de chat basées sur WebSocket avec authentification JWT.

### Prérequis

- Java JDK 17 ou ultérieur
- Maven 3.6 ou ultérieur
- MySQL 8.0 ou ultérieur

### Installation

#### 1. Cloner le Dépôt

```bash
git clone [url-du-dépôt]
cd chat-support
```

#### 2. Configuration de la Base de Données

1. Créer une base de données MySQL :

```sql
CREATE DATABASE ycyw;
```

2. Créer un fichier `application-secret.properties` avec vos identifiants de base de données :

```properties
spring.datasource.username=votre_utilisateur
spring.datasource.password=votre_mot_de_passe
```

3. Les tables de la base de données seront automatiquement générées au premier lancement de l'application :

```properties
spring.jpa.hibernate.ddl-auto=update
```

#### 3. Configuration JWT

Mettre à jour le fichier `application-secret.properties` avec votre configuration JWT :

```properties
jwt.issuer=votre-jwt-issuer
```

Générer vos clés JWT :
```bash
openssl genrsa -out app.key 2048
openssl pkcs8 -topk8 -inform PEM -outform PEM -in app.key -out private_key_pkcs8.pem -nocrypt
openssl rsa -in app.key -pubout -out app.pub
```

Placer les fichiers générés dans `src/main/resources/`.

#### 4. Construction et Lancement

Construire le projet :
```bash
mvn clean install
```

Démarrer l'application :
```bash
mvn spring-boot:run
```

Le backend sera disponible à l'adresse `http://localhost:3003`.

## Frontend Chat Support

Une application Angular fournissant l'interface utilisateur pour le système de chat support.

### Prérequis

- Node.js 20.x ou ultérieur
- npm 10.x ou ultérieur
- Angular CLI 18.x

### Installation

#### 1. Naviguer vers le Répertoire Frontend

```bash
cd your-car-your-way-frontend
```

#### 2. Installer les Dépendances

```bash
npm install
```

#### 3. Serveur de Développement

Démarrer le serveur de développement :
```bash
npm start
```

L'application sera disponible à l'adresse `http://localhost:4200`.

## Fonctionnalités

- Chat en temps réel utilisant WebSocket
- Authentification JWT
- Persistance de l'historique des conversations
- Gestion des demandes de support

## Points d'Accès Principaux

### Authentification
- POST `/api/auth/register` - Inscription d'un nouvel utilisateur
- POST `/api/auth/login` - Connexion utilisateur

### Support Chat
- POST `/api/support_requests` - Créer une nouvelle demande de support
- GET `/api/support_requests/user/{userId}` - Obtenir les demandes de support d'un utilisateur
- GET `/api/support_requests/{chatSessionId}/messages` - Obtenir les messages d'un chat
- WebSocket `/chat-websocket` - Point d'accès WebSocket pour le chat en temps réel

## Architecture

L'application suit une architecture modulaire :

### Backend
- Spring Boot pour les API REST et WebSocket
- Spring Security avec authentification JWT
- JPA/Hibernate pour la persistance des données
- WebSocket pour la communication en temps réel

### Frontend
- Angular 18 avec composants autonomes
- RxJS pour la programmation réactive
- Composants Material Design
- Intégration client WebSocket

## Sécurité

- Authentification basée sur JWT
- Sécurité des sessions WebSocket
- Configuration CORS
- Validation des entrées
- Prévention des injections SQL

## Dépannage

- Si la connexion WebSocket échoue, vérifiez que le backend est en cours d'exécution et que le token JWT est valide
- Pour les problèmes de connexion à la base de données, vérifiez vos identifiants MySQL et assurez-vous que le serveur est en cours d'exécution
- Assurez-vous que les ports corrects (3003 pour le backend, 4200 pour le frontend) sont disponibles
