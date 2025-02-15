# POC Module de Support Chat Synchrone - Document des Exigences Produit

## 1. Introduction

Ce document décrit les exigences pour un Proof of Concept (POC) de la fonctionnalité de support chat en temps réel 
pour la plateforme de service client de Your Car Your Way. 
La POC démontrera la faisabilité d'implémenter un système de chat synchrone sécurisé et évolutif au sein de l'architecture existante 
tout en validant les approches techniques clés.

## 2. Objectifs

Les objectifs principaux de ce POC sont de :

1. Valider l'architecture technique pour la communication en temps réel entre les clients et les agents de support
2. Démontrer l'intégration sécurisée du WebSocket avec l'authentification OAuth2/JWT et Spring Security
3. Établir une base pour l'implémentation complète du chat support
4. Vérifier la performance et la fiabilité de la stack technique choisie

## 3. Périmètre

### 3.1 Dans le Périmètre

La POC implémentera les fonctionnalités principales suivantes :

1. Capacités de chat en temps réel utilisant WebSocket
   - Échange de messages entre client et agent de support

2. Intégration de la Sécurité
   - Implémentation de Spring Security
   - Implémentation de OAuth2 pour la validation JWT
   - Établissement sécurisé de connexion WebSocket
   - Persistance de l'authentification utilisateur pendant les sessions de chat

3. Interface de Chat Basique
   - Zone d'affichage des messages avec horodatage
   - Champ de saisie de message avec bouton d'envoi
   - Affichage basique d'identification utilisateur

### 3.2 Hors Périmètre

Les fonctionnalités suivantes ne seront pas incluses dans la POC :

- Support chat multi-agents
- Historique et recherche de messages
- Capacités de partage de fichiers
- Gestion de file d'attente des chats
- Statut de disponibilité des agents
- Notifications de messages
- Adaptabilité mobile
- Intégration de chatbot
- CDN Cloudfront
- Redis Cache
- ElasticSearch
- Interface d'inscription et de connexion
- API REST complète pour les agences
- Tests unitaires et tests d'intégration complets
- Infrastructure de déploiement et de mise à l'échelle

## 4. Exigences Techniques

### 4.1 Exigences Frontend

- Implémentation avec Angular 18.0.0
- Intégration client WebSocket STOMP
- Gestion des tokens JWT
- Mises à jour des messages en temps réel sans rafraîchissement
- Implémentation du composant de chat dans le module de support

### 4.2 Exigences Backend

- Implémentation Spring Boot 3.4.2
- Configuration de OAuth2 pour la validation JWT
- Configuration de Spring Security pour l'authentification
- Implémentation des points de terminaison WebSocket
- Intégration basique avec la base de données pour la persistance des messages
- Gestion des erreurs et journalisation
- Gestion des connexions

### 4.3 Exigences de Sécurité

- Connexion WebSocket sécurisée (WSS)
- Validation JWT pour toutes les connexions
- Persistance de l'authentification utilisateur
- Assainissement basique des entrées

### 4.4 Modèle de Données

La POC implémentera un modèle de données qui prend en charge le chat synchrone avec le service de support. 
Le modèle se compose de quatre entités principales qui fonctionnent ensemble pour fournir un système complet de suivi des interactions de support :

#### 4.4.1 Utilisateur
L'entité Utilisateur représente à la fois les clients et les agents de support dans le système. 
Pour le POC, nous nous concentrerons sur les informations utilisateur essentielles nécessaires pour les interactions de support :

```sql
User {
    user_id: UUID (Clé Primaire)         -- Identifiant unique pour l'utilisateur
    email: String                         -- Email de l'utilisateur pour l'identification
    password_hash: String                 -- Mot de passe haché avec Bcrypt
    first_name: String                    -- Prénom de l'utilisateur
    last_name: String                     -- Nom de famille de l'utilisateur
    language: String                      -- Langue préférée de l'utilisateur
    created_at: Timestamp                 -- Horodatage de création du compte
    updated_at: Timestamp                 -- Horodatage de dernière mise à jour
}
```

#### 4.4.2 Demande de Support
L'entité Demande de Support sert de point central pour le suivi de toutes les interactions de support client. Elle fournit un moyen unifié de gérer les sessions de chat et d'autres formes de communication :

```sql
SupportRequest {
    request_id: UUID (Clé Primaire)      -- Identifiant unique pour la demande de support
    user_id: UUID (Clé Étrangère)        -- Référence vers l'utilisateur demandeur
    agent_id: UUID (Clé Étrangère)       -- Référence vers l'agent de support assigné
    type: Enum                           -- Type de demande de support (CHAT, CONTACT_FORM)
    status: Enum                         -- Statut actuel (NEW, IN_PROGRESS, RESOLVED, CLOSED)
    priority: Enum                       -- Priorité de la demande (LOW, MEDIUM, HIGH)
    created_at: Timestamp                -- Horodatage de création de la demande
    updated_at: Timestamp                -- Horodatage de dernière mise à jour
    resolved_at: Timestamp               -- Horodatage de résolution
}
```

#### 4.4.3 Session de Chat
L'entité Session de Chat représente une interaction en temps réel active ou terminée entre un client et un agent de support :

```sql
ChatSession {
    session_id: UUID (Clé Primaire)      -- Identifiant unique pour la session de chat
    request_id: UUID (Clé Étrangère)     -- Référence vers la demande de support parente
    status: Enum                         -- Statut de la session (ACTIVE, CLOSED, TIMEOUT)
    created_at: Timestamp                -- Horodatage de début de session
    updated_at: Timestamp                -- Horodatage de dernière activité
}
```

#### 4.4.4 Message de Chat
L'entité Message de Chat stocke les messages individuels échangés durant une session de chat :

```sql
ChatMessage {
    message_id: UUID (Clé Primaire)      -- Identifiant unique pour le message
    session_id: UUID (Clé Étrangère)     -- Référence vers la session de chat parente
    sender_id: UUID (Clé Étrangère)      -- Référence vers l'expéditeur du message
    content: Text                        -- Contenu du message
    timestamp: Timestamp                 -- Horodatage de création du message
    status: Enum                         -- Statut du message (SENT, DELIVERED, READ)
}
```

#### 4.4.5 Relations entre Entités

Le modèle de données établit les relations clés suivantes :

1. Chaque SupportRequest est associée à exactement un User (le client) et optionnellement un agent
2. Une ChatSession est toujours associée à exactement une SupportRequest
3. Les ChatMessages sont toujours associés à exactement une ChatSession et un User (expéditeur)
4. Les Users peuvent avoir plusieurs SupportRequests, ChatSessions et ChatMessages

Pour l'implémentation du POC, nous nous concentrerons principalement sur la fonctionnalité de chat en temps réel 
tout en maintenant la base pour l'expansion future du système de support. Le modèle est conçu pour permettre :

- Un suivi complet des interactions de support
- Une piste d'audit claire des communications
- Le support des communications en temps réel et asynchrones
- Une expansion facile pour inclure des fonctionnalités de support supplémentaires à l'avenir

## 5. Critères de Succès

Le POC sera considéré comme réussi si il démontre :

1. Critères Fonctionnels
   - Échange réussi de messages en temps réel entre deux utilisateurs
   - Ordre approprié des messages 
   - Connexions WebSocket stables
   - Authentification et autorisation réussies utilisant JWT

2. Critères Techniques
   - Latence de livraison des messages inférieure à 500ms dans des conditions normales
   - Persistance réussie en base de données des sessions et messages de chat

3. Critères de Sécurité
   - Validation réussie des JWT pour toutes les connexions
   - Isolation appropriée des sessions entre différents utilisateurs
   - Gestion sécurisée des connexions WebSocket
   - Absence d'accès non autorisé aux sessions de chat

## 7. Livrables

La POC devra fournir :

1. Une application fonctionnelle
2. Code source avec documentation
3. Instructions basiques d'installation et de configuration
