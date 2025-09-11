---
title: "Architectures Avancées des Grands Modèles de Langage en 2025 : Une Analyse Approfondie des Innovations et des Tendances"
summary: "Résumer des avancées architecturales des llms en 2025"
date: 08/11/2025
tags:
- AI
- llm
---

## 1. Introduction : Le paysage des Grands Modèles de Langage en 2025

### 1.1. L'évolution du Transformer : De la révolution à l'optimisation

L'année 2025 marque une étape significative dans l'évolution des Grands Modèles de Langage (LLM), sept ans après la sortie de l'architecture GPT originale. Le paysage est désormais saturé de nouvelles architectures, chacune apportant son lot de spécificités. Bien que les bases de ces modèles restent fidèles à l'architecture de transformateur introduite en 2017, une analyse superficielle pourrait suggérer une stagnation. Cependant, un examen approfondi révèle une ingénierie de précision, où les innovations se concentrent sur l'optimisation des goulots d'étranglement majeurs, à savoir la gestion de la mémoire, la réduction de la latence d'inférence et la stabilisation de l'entraînement de modèles de plus en plus massifs.

Le véritable progrès ne réside plus dans une rupture architecturale fondamentale, mais dans la maîtrise des compromis entre performance, efficacité et coût. Cette approche conduit à un paradoxe où des architectures, à première vue similaires, affichent des performances et des caractéristiques d'efficacité très divergentes. L'architecture de transformateur s'est montrée d'une robustesse exceptionnelle, capable de tolérer de petites modifications qui, une fois combinées, génèrent des gains substantiels. 

Par exemple, une comparaison entre le Qwen3 et un modèle Llama 3 montre que le Qwen3 est presque deux fois plus lent en termes de jetons par seconde, mais consomme environ deux fois moins de mémoire. Ce type d'échange calcul-mémoire illustre la maturité de la discipline, où chaque choix de conception a un impact direct sur la praticité et l'efficacité opérationnelle du modèle.

### 1.2. Objectif de la Conférence : Une analyse en profondeur

Cette conférence se propose de démystifier les innovations qui définissent les LLM de nouvelle génération. L'analyse ne se limitera pas aux caractéristiques de haut niveau, mais plongera au cœur des mécanismes, des méthodologies de post-entraînement et des avancées en matière de raisonnement. L'objectif est de fournir une compréhension technique et concrète des choix de conception et de leur impact sur le comportement et l'efficacité des modèles, en s'appuyant sur des pseudo-codes pour illustrer les concepts algorithmiques clés.

## 2. Les Composants Fondamentaux et Leurs Évolutions

### 2.1. Le Bloc de Transformateur : Rappel et Modifications Modernes

Le cœur de tout LLM moderne est le bloc de transformateur, qui se compose de deux sous-couches principales : le mécanisme d'auto-attention et le réseau de neurones à propagation avant (Feed-Forward Network, FFN). Ces sous-couches sont encadrées par des connexions résiduelles et des couches de normalisation, qui sont cruciales pour la stabilité de l'entraînement des modèles profonds. Le FFN, en particulier, est le composant le plus gourmand en paramètres, ce qui en fait une cible privilégiée pour les optimisations visant à augmenter la capacité du modèle sans exploser les coûts d'inférence.

Le pseudo-code suivant décrit la structure de base d'un bloc de transformateur, en mettant l'accent sur la séquence d'opérations :

```
function TransformerBlock(X):
    // X est le tenseur d'entrée
    AttentionOutput = SelfAttention(X)
    AttentionOutput = AttentionOutput + X  // Connexion résiduelle
    AttentionOutput = LayerNorm(AttentionOutput)
    FFNOutput = FFN(AttentionOutput)
    FFNOutput = FFNOutput + AttentionOutput  // Connexion résiduelle
    FFNOutput = LayerNorm(FFNOutput)
    return FFNOutput
```

### 2.2. Le Mécanisme d'Attention : De MHA à l'efficacité du KV Cache

Le mécanisme d'attention multi-tête (MHA) est la pierre angulaire des transformateurs. Pour chaque jeton d'entrée, il calcule des vecteurs de requête (Q), de clé (K) et de valeur (V), qui sont ensuite utilisés pour calculer un score d'attention pondéré sur l'ensemble de la séquence d'entrée. Cependant, lors de la génération de texte (inférence), une optimisation cruciale appelée mise en cache KV (KV caching) est utilisée. Au lieu de recalculer les vecteurs K et V pour l'ensemble de la séquence à chaque nouveau jeton, ils sont stockés en mémoire. Si cela améliore considérablement la vitesse, cela devient un goulot d'étranglement pour les modèles à long contexte, car le cache KV grandit linéairement avec la longueur de la séquence, consommant des quantités massives de mémoire GPU.

Le pseudo-code de l'attention multi-tête (MHA) est donné ci-dessous :

```
function MultiHeadAttention(X, W_Q, W_K, W_V, W_O):
    // X est le tenseur d'entrée, W_Q, W_K, W_V sont les matrices de poids
    Query = X * W_Q
    Key = X * W_K
    Value = X * W_V
    AttentionScores = Softmax((Query * Key^T) / sqrt(d_k))
    AttentionOutput = AttentionScores · Value
    Output = AttentionOutput · W_O
    return Output
```

### 2.3. Les Encodages Positionnels (PE) : De l'absolu au relatif

Les transformateurs n'ont pas de concept inné de l'ordre des jetons dans une séquence. Les encodages positionnels sont donc essentiels pour injecter cette information. L'encodage positionnel absolu, utilisé par GPT-2, consistait à ajouter un vecteur fixe à chaque jeton, appris pendant l'entraînement. Les architectures modernes ont largement adopté l'encodage positionnel rotatif (RoPE). RoPE encode l'information de position relative en faisant pivoter les vecteurs de requête et de clé, ce qui est particulièrement efficace pour les contextes longs et la généralisation.

La transition des encodages absolus vers les encodages relatifs illustre une évolution dans la compréhension du fonctionnement des modèles. Il ne s'agit pas de connaître la position exacte d'un jeton, mais plutôt sa relation spatiale avec les autres jetons de la séquence. L'importance de cette relation est confirmée par le cas particulier de SmolLM3, qui utilise les encodages RoPE mais les désactive complètement (NOPE, pour No Positional Embeddings) dans une couche sur quatre. Ce choix de conception audacieux suggère que l'information de position n'est pas toujours nécessaire dans toutes les couches, ouvrant la voie à des optimisations supplémentaires.

## 3. Innovations Architecturales pour l'Efficacité de l'Inférence

### 3.1. Les Optimisations du KV Cache

Le problème de la mémoire du cache KV a conduit à plusieurs innovations distinctes, chacune explorant un compromis unique.

#### 3.1.1. Grouped-Query Attention (GQA)

Le Grouped-Query Attention (GQA) est une méthode qui réduit la taille du cache KV en partageant les paires de vecteurs K et V entre plusieurs têtes d'attention (requêtes Q). Au lieu d'avoir une paire (K, V) pour chaque tête de Q, le GQA regroupe les têtes et leur attribue une seule paire (K, V) partagée. Cette approche réduit considérablement l'espace mémoire nécessaire et accélère l'inférence sans sacrifier de manière significative les performances du modèle, à condition que le bon nombre de groupes soit choisi.

Le pseudo-code ci-dessous compare l'approche GQA à l'attention multi-tête classique :

```
function GroupedQueryAttention(X, W_Q, W_K, W_V):
    // X est le tenseur d'entrée
    // W_Q a une taille égale au nombre de têtes
    // W_K et W_V sont plus petits, avec un nombre de têtes = num_groupes
    Query = X * W_Q
    Key = X * W_K
    Value = X * W_V
    // Redimensionner Key et Value pour être partagés
    Key_reshaped = repeat_interleave(Key, group_size)
    Value_reshaped = repeat_interleave(Value, group_size)
    AttentionScores = Softmax((Query * Key_reshaped^T) / sqrt(d_k))
    AttentionOutput = AttentionScores · Value_reshaped
    return AttentionOutput
```

#### 3.1.2. Multi-Head Latent Attention (MLA)

Le Multi-Head Latent Attention (MLA), introduit par DeepSeek V3/R1, est une autre innovation pour l'efficacité de la mémoire. Au lieu de stocker les vecteurs K et V bruts, l'architecture les projette d'abord dans un espace latent de dimension beaucoup plus petite. C'est cette représentation compressée qui est stockée dans le cache KV. Lors de l'inférence, le modèle doit effectuer des multiplications matricielles supplémentaires pour projeter la requête Q et décompresser l'état latent afin d'obtenir les clés et valeurs nécessaires.

Cette approche représente un échange explicite et calculé entre la mémoire et le calcul. En minimisant l'utilisation de la mémoire, un goulot d'étranglement majeur, le modèle peut se permettre d'ajouter un peu plus de calcul à chaque étape. Les résultats pratiques ont montré que cette approche fonctionne très bien, offrant une réduction de la mémoire du cache KV d'environ 20 fois par rapport à l'attention multi-tête classique, tout en améliorant la performance du modèle.

Le pseudo-code de l'attention latente illustre ce processus de compression et de décompression :

```
function MultiHeadLatentAttention(X, W_Q, W_L, W_K_L, W_V_L):
    // X est le tenseur d'entrée
    Query = X * W_Q
    // Projection en espace latent pour le KV cache
    LatentState = X * W_L
    // Décompression lors de l'inférence
    Key_from_latent = LatentState * W_K_L
    Value_from_latent = LatentState * W_V_L
    AttentionScores = Softmax((Query * Key_from_latent^T) / sqrt(d_k))
    AttentionOutput = AttentionScores · Value_from_latent
    return AttentionOutput
```

#### 3.1.3. Sliding Window Attention (SWA)

La technique de Sliding Window Attention (SWA), utilisée notamment par Gemma 3, propose une autre solution au problème du contexte long en limitant la portée de l'attention. Chaque jeton ne peut se référer qu'à une fenêtre de contexte locale, d'une taille prédéfinie (par exemple 1024 jetons pour Gemma 3). Ce mécanisme réduit significativement la complexité du calcul de l'attention et limite la croissance du cache KV, le rendant plus efficace pour les séquences très longues.

Pour compenser la perte de l'information contextuelle globale, les modèles utilisant SWA, comme Gemma 3, peuvent incorporer de manière occasionnelle des couches d'attention globales. Ce compromis permet de maintenir une certaine cohérence sur de très longues séquences tout en bénéficiant de l'efficacité du SWA.

### 3.2. Les Architectures Sparses et l'Ascension des Mixture of Experts (MoE)

La Mixture of Experts (MoE) est l'innovation architecturale la plus marquante de 2025. Elle permet de construire des modèles avec un nombre colossal de paramètres (jusqu'à plus d'un billion) tout en maintenant un coût d'inférence gérable.

#### 3.2.1. Principes de la MoE

Contrairement aux modèles "denses" où tous les paramètres sont activés à chaque étape de calcul, les modèles MoE sont "parcimonieux" (sparse). Ils remplacent le FFN standard par plusieurs "experts", qui sont en fait des FFN distincts. Un module appelé "routeur" est chargé de déterminer dynamiquement quel sous-ensemble de ces experts doit être activé pour un jeton donné. Le coût d'inférence est ainsi dicté par le nombre de paramètres actifs, et non par le nombre total.

La tendance observée est le passage de quelques experts de grande taille à un grand nombre d'experts plus petits et plus granulaires. De plus, de nombreuses architectures MoE, comme DeepSeek V3 et Kimi 2, intègrent un "expert partagé" qui est toujours activé, permettant de traiter les connaissances générales communes à toutes les tâches et libérant les autres experts pour des apprentissages plus spécialisés.

Le pseudo-code d'un bloc de transformateur avec un module MoE remplaçant le FFN est le suivant :

```
function MoETransformerBlock(X, Experts, Router, SharedExpert):
    // X est le tenseur d'entrée
    AttentionOutput = SelfAttention(X)
    AttentionOutput = AttentionOutput + X  // Connexion résiduelle
    AttentionOutput = LayerNorm(AttentionOutput)
    RouterOutput = Router(AttentionOutput)
    // Le routeur sélectionne un sous-ensemble d'experts
    TopKExpertIndices = TopK(RouterOutput)
    // Calculer la sortie de chaque expert sélectionné
    ExpertOutputs = concatenate([Experts[i](AttentionOutput) for i in TopKExpertIndices])
    // Le routeur pondère et somme les sorties des experts
    MoEOutput = WeightedSum(ExpertOutputs, RouterOutput)
    MoEOutput = MoEOutput + SharedExpert(AttentionOutput)  // Optionnel
    FFNOutput = MoEOutput + AttentionOutput
    FFNOutput = LayerNorm(FFNOutput)
    return FFNOutput
```

#### 3.2.2. Analyse Comparative des Modèles MoE

**DeepSeek V3/R1** : Avec 671 milliards de paramètres totaux, ce modèle n'en active que 37 milliards à la fois, en utilisant un expert partagé et huit experts classiques. C'est un exemple précoce et très réussi de la popularisation des MoE.

**Qwen 3 (sparse)** : Ce modèle de 235 milliards de paramètres totaux active également 37 milliards, mais de manière intéressante, il n'utilise pas d'expert partagé. Ce choix de conception soulève des questions sur la raison de cette omission et son impact potentiel sur la performance et l'efficacité, un point qui pourrait être précisé dans de futures versions.

**Kimi 2** : Ce modèle a repoussé les limites en atteignant un billion de paramètres totaux, mais avec seulement 32 milliards de paramètres actifs, il est encore plus efficace que DeepSeek. Le modèle utilise un expert partagé et huit experts réguliers, tout en ayant un nombre de têtes d'attention réduit, ce qui contribue à son efficacité.

**Llama 4 (Maverick)** : Llama 4 utilise moins d'experts mais d'une taille plus grande, un choix de conception qui va à l'encontre de la tendance vers des experts plus granulaires.

## 4. La Normalisation : Un Rôle Critique pour la Stabilité et la Performance

Les couches de normalisation jouent un rôle crucial dans l'entraînement des modèles profonds, en particulier pour la stabilisation des gradients.

### 4.1. RMSNorm vs LayerNorm : L'efficacité à l'honneur

LayerNorm est la méthode de normalisation classique. Cependant, RMSNorm (Root Mean Square Normalization), utilisée notamment par la série Llama, est une variante plus efficace, qui réduit le nombre de paramètres et les coûts de calcul en supprimant la division par l'écart-type. Bien qu'il s'agisse d'un détail mineur, ces optimisations contribuent à des gains marginaux qui s'accumulent à l'échelle d'un modèle colossal.

### 4.2. Le Placement des Couches de Normalisation

La position des couches de normalisation par rapport aux connexions résiduelles a un impact significatif sur la stabilité de l'entraînement. Historiquement, deux paradigmes coexistaient :

- **Post-Norm** : La normalisation est appliquée après la connexion résiduelle (comme dans le transformateur original).
- **Pre-Norm** : La normalisation est appliquée avant la connexion résiduelle (comme dans GPT-2 et Llama). Le Pre-Norm est devenu la norme de facto car il réduit les pics de gradient et améliore la stabilité de l'entraînement.

Cependant, les modèles récents comme OLMo 2 et Gemma 3 ont introduit un placement hybride, une forme de Post-Norm où la normalisation est insérée à l'intérieur de la connexion résiduelle. Cette approche a démontré une amélioration de la stabilité de l'entraînement, suggérant que l'ingénierie continue de trouver de nouvelles façons d'optimiser même les composants les plus fondamentaux.

### 4.3. QK-Norm : Une normalisation fine-grained

Le QK-Norm est une normalisation supplémentaire appliquée aux vecteurs de requête (Q) et de clé (K) à l'intérieur du mécanisme d'attention. Cette technique, utilisée par des modèles comme OLMo 2 et Qwen 3, contribue à la stabilité des gradients et à la performance globale du modèle. Elle représente le niveau de granularité atteint par l'ingénierie des LLM, où même les sous-composants des sous-couches sont optimisés.

## 5. Tableau Comparatif des Architectures Clés de 2025

| Modèle | Taille (Totale / Active) | Blocs | Attention | Normalisation | Configuration MoE | Particularités |
|--------|-------------------------|-------|-----------|---------------|-------------------|----------------|
| DeepSeek V3/R1 | 671B / 37B | 61 | Multi-Head Latent Attention | Pré-Norm | 1 Expert Partagé + 8 Experts | Introduction de l'MLA et de l'expert partagé |
| OLMo 2 | 7B | 32 | Multi-Head Attention | Hybride Post-Norm + QK-Norm | Dense | Normalisation hybride pour la stabilité |
| Gemma 3 | 27B | 62 | Sliding Window Attention | Hybride Pré-Norm + Post-Norm + QK-Norm | Dense | Attentions locales + globales occasionnelles |
| Mistral Small 3.1 | 24B | 40 | Grouped-Query Attention | Pré-Norm | Dense | Architecture plus large, moins profonde |
| Llama 4 | 400B | 40 | Grouped-Query Attention | Pré-Norm | Moins d'experts, mais plus grands | Taille des experts supérieure à la moyenne |
| Qwen 3 | 235B / 37B | 92 | Grouped-Query Attention | Pré-Norm + QK-Norm | 8 Experts (pas d'expert partagé) | Architecture très profonde, moins large |
| SmolLM3 | 3B | 28 | Rotary Position Embeddings | N/A | Dense | Utilise NOPE (No Positional Embeddings) dans certaines couches |
| Kimi 2 | 1T / 32B | 61 | Grouped-Query Attention | N/A | 1 Expert Partagé + 8 Experts | Modèle d'un billion de paramètres, très efficace |
| GPT-OSS | 20B, 120B | 24 | N/A | N/A | 4 à 8 Experts | Premier modèle Open-Weight d'OpenAI depuis 2019 |
| GLM-4.5 | 335B | 92 | Multi-Head Attention | N/A | 1 Expert Partagé + 8 Experts | Architecture très profonde et performante |

## 6. Au-delà de l'Architecture : Méthodologies de Post-Entraînement et de Raisonnement

L'innovation en 2025 ne se limite pas à la structure des modèles, mais s'étend aux méthodologies qui leur confèrent une intelligence et une capacité de raisonnement avancées. Il s'agit d'une évolution majeure des architectures statiques (dont la structure est fixe) vers des architectures dynamiques qui allouent les ressources de calcul en fonction de la complexité de la tâche.

### 6.1. L'Ère du Raisonnement et de l'Auto-Réflexion

Les techniques de raisonnement visent à améliorer la capacité d'un modèle à résoudre des problèmes complexes en lui permettant de générer une chaîne de pensée avant de produire la réponse finale.

#### 6.1.1. Le Raisonnement en Chaîne de Pensée (CoT) et l'Auto-Correction

Le Chain-of-Thought (CoT) est une technique de prompt engineering qui incite le modèle à décomposer un problème en étapes logiques. Des recherches récentes ont affiné cette méthode en introduisant des mécanismes d'auto-réflexion, où le modèle critique et affine son propre raisonnement. Par exemple, le Multiplex CoT utilise une double chaîne de pensée, où la seconde corrige la première, et le framework R³V (pour Reasoning by Reflecting on CoT Rationales) permet au modèle d'apprendre de ses propres erreurs.

Le pseudo-code pour une simple requête CoT illustre le processus :

```
function GenerateCoTResponse(Model, Prompt):
    // Un prompt structuré pour inciter le raisonnement
    Prompt_CoT = Prompt + "\nRéfléchissons étape par étape."
    CoTResponse = Model.generate(Prompt_CoT, stop_sequence="Conclusion:")
    FinalPrompt = Prompt_CoT + CoTResponse + "\nConclusion:"
    FinalResponse = Model.generate(FinalPrompt)
    return FinalResponse
```

#### 6.1.2. Le Mode de "Réflexion Étendue" de Claude 3.7 Sonnet

Anthropic a introduit le mode de "réflexion étendue" pour son modèle Claude 3.7 Sonnet. Cette fonctionnalité permet au modèle de se donner plus de temps et d'allouer des ressources de calcul supplémentaires (serial test-time compute) pour décomposer et résoudre des problèmes complexes. Contrairement à un simple changement de modèle, il s'agit d'une capacité native qui autorise le modèle à explorer plusieurs pistes de raisonnement en parallèle et à choisir la plus pertinente. Cela améliore considérablement l'exactitude et la fiabilité sur les tâches de raisonnement.

#### 6.1.3. La Couche d'Auto-Réflexion de Gemini 2.5 Pro

Gemini 2.5 Pro dispose d'une couche d'auto-réflexion qui lui permet d'évaluer ses propres réponses avant de les produire. Ce mécanisme de vérification interne réduit les taux d'erreur et améliore la précision factuelle, particulièrement sur les benchmarks scientifiques et dans la génération de code. Cette capacité illustre la tendance vers des modèles qui peuvent non seulement générer des informations, mais aussi les valider de manière autonome.

### 6.2. Les Stratégies d'Alignement Avancées

L'alignement, qui consiste à faire en sorte que les modèles agissent de manière utile, honnête et inoffensive, reste un domaine de recherche crucial.

#### 6.2.1. L'IA Constitutionnelle

L'IA constitutionnelle est une approche développée par Anthropic qui vise à aligner les modèles sur des principes éthiques prédéfinis. Plutôt que de s'appuyer uniquement sur le retour d'information humain, le modèle est invité à évaluer ses propres réponses par rapport à une "constitution" de principes écrits en langage naturel. Cette auto-critique est ensuite utilisée pour ajuster le modèle par un processus de renforcement. Cette méthode s'appuie sur la capacité des modèles à raisonner et à s'auto-réfléchir, démontrant une synergie entre l'architecture et les méthodologies d'alignement.

### 6.3. L'Intégration de la Connaissance Externe : RAG

La génération augmentée par la récupération (Retrieval-Augmented Generation, RAG) est une stratégie qui permet aux LLM de récupérer des informations factuelles à partir de sources externes (par exemple, des bases de données de vecteurs) pour ancrer leurs réponses et réduire les hallucinations.

Le pseudo-code de la méthode RAG est le suivant :

```
function RAGGeneration(Query, VectorDB, LLM):
    // 1. Récupérer les documents pertinents
    RetrievedDocs = VectorDB.query(Query)
    // 2. Construire un prompt augmenté
    AugmentedPrompt = "Context: " + RetrievedDocs + "\nQuery: " + Query
    // 3. Générer la réponse avec le LLM
    Response = LLM.generate(AugmentedPrompt)
    return Response
```

## 7. Conclusion : Synthèse et Perspectives

L'année 2025 confirme la suprématie de l'architecture de transformateur, tout en montrant que son évolution passe par une ingénierie de plus en plus sophistiquée. La course n'est plus à la simple augmentation de la taille des modèles, mais à la maximisation de leur efficacité et de leur intelligence. Les innovations majeures se concentrent sur :

**L'efficacité de l'inférence** : L'optimisation du cache KV par des techniques comme le GQA, l'MLA et le SWA est une priorité absolue pour la mise à l'échelle des LLM en production.

**L'extension de la capacité** : Le MoE est devenu un standard pour augmenter la capacité de connaissance des modèles sans augmenter le coût d'inférence de manière prohibitive.

**L'intelligence de l'inférence** : Les modèles développent des capacités de raisonnement et d'auto-réflexion, qui leur permettent de dépasser la simple prédiction du prochain jeton pour résoudre des problèmes complexes.

Le paradoxe de la similarité architecturale est en fait une illusion. Sous la surface, chaque modèle est un ensemble de compromis finement ajustés. Le fait que tant d'approches différentes (largeur vs. profondeur, attention locale vs. globale, expert partagé vs. absence d'expert) puissent toutes aboutir à des modèles très performants témoigne de la robustesse de l'architecture Transformer. 

Les tendances futures se dirigeront probablement vers des modèles encore plus dynamiques, qui allouent des ressources de calcul non seulement en fonction du jeton, mais aussi de la complexité de la tâche. La transparence des données d'entraînement et l'exploration de nouveaux optimiseurs comme Muon seront également cruciales pour faire progresser la discipline.