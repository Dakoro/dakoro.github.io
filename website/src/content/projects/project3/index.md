---
title: Traffic Counter
summary: Permert de localicer et de compter le nombre de véhicules parcourant les axes routier
repoURL: https://github.com/Dakoro/traffic-counter
date: 10/24/2025
tags:
- Computer Vision
- Vidéo
---


# 🚗 Traffic Counter
## Système de Comptage de Véhicules en Temps Réel

<video width="500" height="300" controls>
  <source src="https://drive.google.com/file/d/1reUv647BtclrbN46eQ7cgPjcc61ydpcv/view?usp=sharing" type="video/mp4">
</video>


---

## Vue d'ensemble

**Traffic Counter** est un système innovant de surveillance et de comptage de véhicules en temps réel pour flux de trafic vidéo. Utilisant les dernières technologies d'intelligence artificielle et d'apprentissage automatique, il détecte, suit et compte les véhicules qui traversent des voies virtuelles prédéfinies.

Ce système représente une solution automatisée et fiable pour l'analyse du trafic routier, offrant des données précises et instantanées sur le flux de circulation.

---

## Fonctionnalités principales

### 🎯 Détection Intelligente en Temps Réel
Le système utilise le modèle **YOLOv8-Large**, un détecteur d'objets de pointe entraîné sur le dataset COCO. Il identifie automatiquement plusieurs catégories de véhicules :
- Voitures particulières
- Camions
- Bus
- Motocyclettes

### 📍 Suivi Multi-Objets Performant
Grâce à l'algorithme **SORT** (Simple Online and Realtime Tracker), le système :
- Attribue des identifiants uniques à chaque véhicule
- Prédit les trajectoires avec le filtre de Kalman
- Associe les détections aux objets existants via l'algorithme hongrois

### 🛣️ Comptage par Voie
Le système monitore deux lignes de détection virtuelles configurables pour :
- Analyser le trafic dans les deux sens de circulation
- Compter les véhicules qui franchissent chaque ligne
- Fournir des statistiques en temps réel par direction

### 👁️ Visualisation en Direct
L'interface d'affichage montre :
- Les boîtes de délimitation autour de chaque véhicule
- Les identifiants de suivi uniques
- Les lignes de détection qui changent de couleur lors du franchissement
- Les statistiques actualisées de comptage

### 🎭 Réduction du Bruit
Utilise un masquage d'image pour exclure les zones non pertinentes, améliorant la précision et réduisant les faux positifs.

### 💾 Export Vidéo
Génère une vidéo annotée (`result.mp4`) contenant tous les résultats avec graphiques superposés.

---

## Architecture Technique

### Pipeline de Traitement

Le système fonctionne selon un processus bien défini :

1. **Acquisition** : Lecture de la vidéo d'entrée
2. **Prétraitement** : Application du masque de bruit
3. **Détection** : YOLOv8 identifie les véhicules
4. **Filtrage** : Extraction des classes de véhicules
5. **Suivi** : SORT maintient l'identité des véhicules
6. **Comptage** : Détection des passages aux lignes
7. **Visualisation** : Superposition des annotations
8. **Sauvegarde** : Export de la vidéo traitée

### Composants Clés

**Détection (YOLOv8)**
- Modèle pré-entraîné 84 MB
- 80 classes d'objets du dataset COCO
- Filtrage pour classes de véhicules uniquement
- Performances : ~30 FPS sur GPU

**Suivi (SORT)**
- Filtre de Kalman pour prédiction de trajectoire
- Algorithme hongrois pour association
- Paramètres : max_age=22 frames, min_hits=3, IoU threshold=0.3

**Comptage**
- Deux lignes de détection configurables (trafic montant/descendant)
- Suivi des centres des véhicules
- Comptage unique par direction et total global

---

## Configuration Requise

- **Python** : version 3.12 ou supérieure
- **GPU** (recommandé) : pour performance optimale
- **CPU** : capable de traitement en temps réel
- **Vidéo source** : flux de caméra de circulation

---

## Installation Rapide

### 1. Cloner le projet
```bash
git clone https://github.com/yourusername/traffic-counter.git
cd traffic-counter
```

### 2. Créer un environnement virtuel
```bash
python -m venv .venv
source .venv/bin/activate
# Windows: .venv\Scripts\activate
```

### 3. Installer les dépendances
```bash
pip install cvzone>=1.6.1 filterpy>=1.4.5 numpy>=2.3.4 \
            opencv-python>=4.11.0.86 scikit-image>=0.25.2 \
            ultralytics>=8.3.220
```

---

## Utilisation

### Exécution Simple
```bash
python main.py
```

L'application va :
- Charger le modèle YOLOv8
- Lire la vidéo d'entrée
- Traiter chaque frame en détection et suivi
- Afficher les résultats en temps réel dans une fenêtre
- Générer la vidéo annotée `result.mp4`

Appuyez sur `q` pour quitter.

### Utiliser Votre Propre Vidéo

Modifiez le chemin d'accès dans `main.py` :
```python
cap = cv2.VideoCapture("chemin/vers/votre/video.mp4")
```

### Ajuster les Lignes de Détection

Adaptez les coordonnées à votre vue caméra :
```python
line_up = [x1, y1, x2, y2]      # Trafic montant
line_down = [x1, y1, x2, y2]    # Trafic descendant
```

### Créer un Masque Personnalisé

Générez une image binaire où :
- **Blanc** : zones analysées
- **Noir** : zones ignorées

Sauvegardez en tant que `assets/mask.png`

---

## Structure du Projet

```
traffic-counter/
├── main.py                    # Point d'entrée principal
├── pyproject.toml            # Configuration du projet
├── assets/
│   ├── traffic_cam.mp4       # Vidéo d'entrée
│   ├── graphics.png          # Affichage du compte total
│   ├── graphics1.png         # Affichage des comptes par voie
│   └── mask.png              # Masque de réduction du bruit
├── utils/
│   └── sort.py               # Implémentation de SORT
├── models/
│   └── yolov8l.pt           # Modèle YOLOv8 pré-entraîné
└── result.mp4               # Vidéo de sortie (générée)
```

---

## Dépendances

| Bibliothèque | Version | Rôle |
|---|---|---|
| ultralytics | ≥8.3.220 | Implémentation YOLOv8 |
| opencv-python | ≥4.11.0.86 | Traitement vidéo et images |
| cvzone | ≥1.6.1 | Utilitaires vision par ordinateur |
| numpy | ≥2.3.4 | Calculs numériques |
| filterpy | ≥1.4.5 | Filtre de Kalman |
| scikit-image | ≥0.25.2 | Traitement d'images |

---

## Performance et Résultats

**Détection**
- Environ 30 FPS sur GPU
- Temps de latence minimal
- Haute précision sur scénarios de trafic standard

**Suivi**
- Traitement en temps réel sur CPU moderne
- Identification fiable des véhicules
- Robustesse aux occultations partielles

**Comptage**
- Précision élevée pour flux non-congestionné
- Gestion des véhicules proches
- Zéro double-comptage grâce aux identifiants uniques

---

## Points Forts du Système

✅ **Entièrement Automatisé** : Pas de configuration manuelle requise  
✅ **Précis et Fiable** : Basé sur des modèles et algorithmes éprouvés  
✅ **Temps Réel** : Résultats instantanés et exploitables  
✅ **Flexible** : Adaptable à différentes configurations de caméra  
✅ **Scalable** : Peut traiter plusieurs flux simultanément  
✅ **Open Source** : Code transparent et modifiable

---

## Cas d'Usage

- **Analyse du trafic routier** : Compréhension des flux de circulation
- **Gestion des embouteillages** : Détection des zones critiques
- **Planification urbaine** : Données pour optimisation routière
- **Comptage automobile** : Statistiques d'affluence par direction
- **Recherche** : Étude des comportements de trafic
- **Sécurité routière** : Monitoring de zones à risque

---

## Licence et Crédits

**Licence** : Open Source (voir fichier LICENSE)

**Technologies utilisées**
- YOLOv8 par Ultralytics
- Algorithme SORT par Alex Bewley
- OpenCV pour les opérations de vision
- Écosystème Python

---

**Traffic Counter** : Transformez vos données vidéo en intelligence de trafic. 🎯