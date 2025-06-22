# Analyse et classification des tweets pour identifier le cyberbullying

## Description
Ce projet vise à détecter et classifier automatiquement les messages (tweets ou commentaires) contenant du cyberharcèlement.  
Un modèle de Deep Learning (Embedding → LSTM/GRU → Dense softmax) est entraîné sur un jeu de données annoté pour prédire l’une des catégories :  
`age`, `ethnicity`, `gender`, `religion`, `other_cyberbullying`, `not_cyberbullying`.

## Jeu de données
- **Source** : Kaggle – dataset “Cyberbullying Classification”  
- **Colonnes** :  
  - `Tweet_text` (string) : texte brut du tweet  
  - `Cyberbullying_type` (string) : étiquette de cyberharcèlement

## Pré-traitement
1. Nettoyage : suppression des doublons, des URLs, mentions, chiffres, ponctuation et stop-words  
2. Stemming  
3. Tokenisation (top 10 000 mots + `OOV` token)  
4. Vectorisation & padding (longueur fixe 50)  
5. Encodage des labels (LabelEncoder)  
6. Séparation train/test (80/20, stratifié)

## Architecture du modèle
- **Embedding**  
- **Couche récurrente** : LSTM ou GRU  
- **Dropout**  
- **Dense (softmax)**  

## Compilation & entraînement
- **Loss** : `sparse_categorical_crossentropy`  
- **Optimiseur** : `Adam`  
- **Métrique** : `accuracy`  
- **Paramètres** :  
  - `epochs=10`  
  - `batch_size=32`  
  - `validation_split=0.2`

## Évaluation
Performance sur le jeu de test :  
- **Loss** : 0.4725  
- **Accuracy** : 86.9%  

Métriques additionnelles (précision, rappel, F1-score, matrice de confusion) calculées pour chaque classe.

## API Flask pour l’inférence
1. Charger `cyberbullying_model.keras`, le tokenizer et le label encoder.  
2. Définir un endpoint `/predict` qui :  
   - Reçoit un texte via POST  
   - Applique le même pipeline de pré-traitement  
   - Renvoie la catégorie prédite  

**Exposition (optionnel)** : utilisation de Ngrok pour rendre l’API accessible externement.

## Installation & exécution
1. Cloner le dépôt  
2. Créer un environnement virtuel et installer les dépendances :  
   ```bash
   pip install -r requirements.txt
