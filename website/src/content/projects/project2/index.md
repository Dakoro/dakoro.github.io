---
title: Projet Simplon
summary: RAG application with an arxiv 
repoURL: https://github.com/Dakoro/doc2struct
date: 21/10/2025
tags:
- NLP
- Clustering
---

# Résumé du Projet doc2struct

## Aperçu
doc2struct est un outil CLI Python qui transforme les documents en ensembles de données structurées en utilisant des embeddings sémantiques et des techniques de clustering. Il traite les documents et crée des sorties organisées, prêtes pour l'apprentissage automatique, adaptées à l'apprentissage par curriculum, l'étiquetage actif et l'analyse de données.

## Caractéristiques Principales
- **Support Multi-format** : Traite les fichiers TXT, PDF et DOCX
- **Segmentation Sémantique** : Divise intelligemment les documents en fragments sémantiquement significatifs
- **Clustering Basé sur Pivots** : Utilise l'échantillonnage par point le plus éloigné pour identifier les fragments représentatifs clés
- **Organisation par Bandes** : Regroupe le contenu par distance aux pivots pour un apprentissage structuré
- **Analyse de Nouveauté et Redondance** : Évalue les fragments en fonction de leur unicité et de la densité d'information

## Architecture

### Composants Principaux
1. **Analyseurs de Documents** (`src/doc2struct/main.py:31-59`)
   - `read_docx_to_paragraphs()` : Extrait les paragraphes des documents Word
   - `read_pdf_to_paragraphs()` : Extrait le texte des fichiers PDF
   - `read_txt_to_paragraphs()` : Traite les fichiers texte brut

2. **Traitement du Texte** (`src/doc2struct/main.py:61-90`)
   - `split_into_sentences()` : Segmentation légère des phrases
   - `make_chunks()` : Crée des fragments de texte superposés avec une taille configurable

3. **Analyse Sémantique** (`src/doc2struct/main.py:92-163`)
   - Utilise sentence-transformers pour les embeddings de texte
   - FAISS pour la recherche de similarité efficace
   - K-plus proches voisins pour l'analyse de redondance

4. **Clustering et Organisation** (`src/doc2struct/main.py:103-152`)
   - Échantillonnage glouton par point le plus éloigné pour la sélection de pivots
   - Attribution de bandes basée sur la distance en utilisant les quantiles
   - Score d'énergie combinant la nouveauté et la redondance

## Configuration
- **Modèle** : `sentence-transformers/all-MiniLM-L6-v2` (rapide, léger)
- **Taille des Fragments** : 350 caractères avec 60 caractères de chevauchement
- **Pivots** : Jusqu'à 12 fragments représentatifs clés
- **Bandes** : 4 groupes basés sur la distance par pivot (quantiles 0,25, 0,5, 0,75)
- **KNN** : 16 voisins pour l'analyse de redondance

## Fichiers de Sortie
L'outil génère un ensemble de données structurées dans un dossier dédié :
- `structured_dataset.jsonl` : Données complètes des fragments avec métadonnées
- `pivots.json` : Fragments représentatifs clés
- `train.csv` : Paires simples (texte, étiquette) pour l'entraînement ML
- `dataset_card.md` : Documentation complète
- `band_sizes.png` : Visualisation de la distribution des données

## Cas d'Usage
- **Apprentissage par Curriculum** : Entraînement progressif du contenu central au contenu périphérique
- **Apprentissage Actif** : Étiquetage efficace en se concentrant sur les fragments pivots
- **Déduplication de Données** : Filtrage du contenu redondant
- **Extraction de Contenu** : Priorisation des informations de haute valeur et nouvelles

## Installation et Utilisation
```bash
uv pip install -e .
doc2struct --file-path=<chemin_vers_le_document>
```

## Dépendances Techniques
- **Core** : fire, pandas, numpy
- **NLP** : sentence-transformers, faiss-cpu
- **Traitement de Documents** : pypdf, python-docx
- **Visualisation** : matplotlib

## Structure du Projet
```
doc2struct/
├── src/doc2struct/
│   ├── __init__.py          # Initialisation du package
│   ├── main.py              # Pipeline de traitement principal
│   └── py.typed             # Marqueur d'indications de type
├── pyproject.toml           # Configuration du projet
└── README.md                # Documentation de base
```

Cet outil représente une approche sophistiquée de la structuration de documents, combinant les techniques NLP modernes avec les flux de travail pratiques d'apprentissage automatique pour l'organisation et l'analyse efficaces des données.