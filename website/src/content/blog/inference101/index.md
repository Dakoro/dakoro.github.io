---
title: "Anatomie de l'Inférence d'un Grand Modèle de Langage : Une Plongée Technique Approfondie dans le Voyage du Prompt à la Réponse"
summary: Décris les étapes nécessaire à l'inférence du modèle de language
date: 09/07/2025
tags:
- llm
- IA
---

## La Demande Initiale - Du Prompt aux Tokens

Le processus de génération d'une réponse à partir d'un Grand Modèle de Langage (LLM) ne commence pas par des calculs neuronaux complexes, mais par la saisie d'un utilisateur, communément appelée "prompt". Cette étape initiale, englobant la formulation du prompt et sa conversion subséquente en un format lisible par machine, est un composant fondamental et souvent sous-estimé du pipeline d'inférence. La qualité, la structure et la représentation de cette entrée dictent la trajectoire de l'ensemble du processus de génération, établissant le contexte et les contraintes dans lesquels le modèle opère. Les erreurs, ambiguïtés ou inefficacités introduites à ce stade peuvent se propager à travers le système, conduisant à des sorties et performances sous-optimales. Cette section déconstruit ces étapes préliminaires, examinant l'art et la science de l'ingénierie des prompts et le processus critique de tokenisation, qui transforme le langage humain en la lingua franca numérique des LLM.

### L'Anatomie d'un Prompt : Ingénierie de l'Entrée

Un prompt est bien plus qu'une simple requête ; c'est un ensemble sophistiqué et structuré d'instructions conçu pour guider le comportement d'un LLM et susciter une réponse désirée. La pratique de création de ces instructions, connue sous le nom d'ingénierie des prompts, est une discipline critique pour contrôler et affiner les sorties du modèle. Un prompt efficace est typiquement composé de plusieurs éléments clés, chacun servant une fonction distincte dans la direction du processus computationnel du modèle.

Les composants primaires d'un prompt bien structuré incluent :

**La Directive** : C'est l'instruction ou question centrale qui spécifie la tâche que le modèle est censé accomplir, comme "Résumez ce document" ou "Traduisez cette phrase en français". La clarté et la spécificité dans la directive sont primordiales ; les instructions ambiguës sont une source principale de sorties de modèle non pertinentes ou incorrectes.

**Contexte** : Ce composant fournit des informations supplémentaires, des connaissances de base, ou du matériel de référence que le modèle devrait utiliser pour informer sa réponse. Pour des tâches complexes ou spécifiques à un domaine, fournir un contexte pertinent est essentiel pour la précision.

**Exemples (Prompting Few-Shot)** : Inclure quelques exemples du motif d'entrée-sortie désiré peut améliorer dramatiquement les performances. Cette technique, connue sous le nom de prompting few-shot, permet au modèle d'inférer le format, le style et la structure désirés de la sortie sans nécessiter un fine-tuning explicite.

**Rôle (Persona)** : Assigner une persona spécifique au modèle (par exemple, "Vous êtes un analyste juridique senior") ancre son ton, sa profondeur et son format, exploitant l'entraînement du modèle sur de vastes corpus pour produire des réponses qui répondent aux standards professionnels ou stylistiques.

**Formatage de Sortie** : Des instructions explicites sur le format de sortie désiré (par exemple, "Formatez le résumé comme un objet JSON", "Listez les éléments comme une liste numérotée") fournissent des contraintes qui structurent le processus de génération du modèle, rendant la sortie plus prévisible et analysable programmatiquement.

Les techniques de prompting avancées peuvent altérer davantage le chemin d'inférence. Le prompting Chain-of-Thought (CoT), par instance, instruit le modèle à "réfléchir étape par étape" avant de fournir une réponse finale. Cette méthode change fondamentalement le processus de génération. Au lieu de produire une réponse directement, le modèle génère d'abord une séquence de tokens de raisonnement intermédiaires. Ces tokens sont ensuite ajoutés au contexte, créant effectivement une entrée plus riche et plus détaillée pour l'étape subséquente qui génère la réponse finale.

La structure et la qualité du prompt représentent un goulot d'étranglement significatif, bien que non-computationnel, dans le pipeline d'inférence. Une fenêtre de contexte surchargée peut confondre le modèle, tandis que des instructions ambiguës ou vagues peuvent conduire à des résultats incohérents ou des inexactitudes factuelles, souvent appelées "hallucinations". Par conséquent, l'ingénierie soigneuse du prompt initial est la première et l'une des étapes les plus cruciales pour assurer un processus d'inférence réussi et efficace.

### Tokenisation : La Lingua Franca des LLM

Les LLM, comme tous les systèmes d'apprentissage profond, sont fondamentalement des modèles mathématiques qui opèrent sur des données numériques, pas sur du texte brut. Conséquemment, le prompt soigneusement conçu de l'utilisateur doit être converti en une séquence de nombres avant de pouvoir être traité. Ce processus de conversion est connu sous le nom de tokenisation. Un tokenizer décompose une chaîne de texte en unités plus petites appelées tokens, puis mappe chaque token unique à un ID entier spécifique basé sur un vocabulaire prédéfini. Cette séquence d'IDs de tokens est l'entrée finale qui est alimentée dans le réseau neuronal.

#### Tokenisation de Sous-mots comme Compromis Nécessaire

Le choix de la granularité des tokens implique des compromis significatifs. Un tokenizer au niveau des mots, qui divise le texte basé sur les espaces et la ponctuation, fait face à deux problèmes majeurs : il génère un vocabulaire immense pour tout corpus raisonnablement large, et il ne peut pas gérer les mots hors vocabulaire (OOV), tels que les néologismes, fautes de frappe, ou termes spécialisés. Inversement, un tokenizer au niveau des caractères a un vocabulaire très petit mais produit des séquences de tokens extrêmement longues pour tout texte donné. Puisque la complexité computationnelle de l'architecture Transformer centrale évolue quadratiquement avec la longueur de séquence, cette approche est computationnellement prohibitive.

La tokenisation de sous-mots a émergé comme le paradigme dominant pour résoudre ce dilemme. Cette approche décompose les mots rares ou complexes en unités de sous-mots plus petites et plus communes tout en gardant les mots fréquents comme tokens uniques. Par exemple, un mot comme "incassable" pourrait être tokenisé en ["in", "##cass", "##able"]. Cette méthode offre un équilibre crucial : elle maintient une taille de vocabulaire gérable tout en conservant la capacité de représenter n'importe quel mot en le composant à partir de sous-mots connus, éliminant effectivement le problème OOV.

#### Plongée Profonde dans les Algorithmes de Tokenisation

Plusieurs algorithmes de tokenisation de sous-mots sont prévalents dans les LLM modernes, chacun avec des méthodologies distinctes pour construire son vocabulaire et segmenter le texte.

**Byte-Pair Encoding (BPE)** : Popularisé par la série de modèles GPT, BPE est un algorithme de compression de données adapté pour la tokenisation. Le processus commence avec un vocabulaire initial consistant en tous les bytes individuels dans les données d'entraînement (représentant tous les caractères possibles en UTF-8). L'algorithme identifie ensuite itérativement la paire de tokens adjacents la plus fréquemment occurrence dans le corpus et les fusionne en un nouveau token unique, qui est ajouté au vocabulaire. Ce processus est répété pour un nombre prédéterminé de fusions, résultant en un vocabulaire qui représente efficacement les séquences de caractères et mots communs comme tokens uniques. Parce que son vocabulaire de base est l'ensemble de tous les bytes, BPE peut, en principe, tokeniser n'importe quelle chaîne de texte sans jamais rencontrer un caractère inconnu.

**WordPiece** : Utilisé par des modèles tels que BERT et DistilBERT, WordPiece est conceptuellement similaire à BPE mais emploie un critère de fusion différent. Au lieu de fusionner la paire la plus fréquente, WordPiece fusionne la paire qui, quand ajoutée au vocabulaire, maximise la vraisemblance des données d'entraînement sous un modèle de langage unigramme. Cela signifie qu'il priorise les fusions qui ne sont pas seulement fréquentes mais rendent aussi la tokenisation globale du corpus plus probable. Pendant la tokenisation actuelle de nouveau texte, WordPiece utilise une stratégie gourmande, match-le-plus-long-d'abord, trouvant le sous-mot le plus long possible du vocabulaire qui correspond au début du segment de mot actuel.

**SentencePiece** : Cet algorithme, utilisé dans des modèles comme Llama et T5, traite le texte d'entrée comme une séquence brute de caractères Unicode, ne faisant aucune assumption sur le pré-traitement spécifique au langage, tel que la division sur les espaces blancs. Une innovation clé de SentencePiece est qu'il traite l'espace blanc comme un symbole normal, typiquement en le remplaçant par un méta-symbole comme ▁ (U+2581). Cela assure que le processus de tokenisation est entièrement réversible et sans perte, signifiant que le texte brut original peut être parfaitement reconstruit à partir de la séquence de tokens. Cette propriété rend SentencePiece particulièrement efficace pour les langues qui n'utilisent pas d'espaces pour délimiter les mots, comme le chinois et le japonais, en rendant cela une solution vraiment agnostique au langage.

La sortie finale de toute cette étape initiale est un seul vecteur unidimensionnel d'IDs de tokens entiers. Ce vecteur représente l'entrée complète au modèle, incluant la requête de l'utilisateur, les instructions système, les exemples few-shot, et toute autre information contextuelle fournie dans le prompt. Cette séquence numérique est maintenant prête pour le moteur computationnel central du LLM.

Le choix de l'algorithme de tokenisation est une décision architecturale fondamentale avec des effets profonds en aval. Le tokenizer agit comme l'organe sensoriel du LLM ; le modèle ne perçoit jamais le texte brut, seulement la séquence d'IDs entiers générée par son tokenizer. Cela crée une dépendance critique. Puisque les tokenizers comme BPE sont entraînés sur de vastes corpus mais finis, leurs vocabulaires sont intrinsèquement biaisés vers les motifs statistiques de ces données, qui sont souvent prédominamment anglaises.

Cela conduit à un phénomène qui peut être décrit comme une "taxe de tokenisation". Les mots anglais communs sont typiquement représentés efficacement comme tokens uniques. Cependant, les mots de langues moins représentées, ou même des termes techniques complexes en anglais, sont souvent décomposés en de nombreux tokens de sous-mots. Par exemple, certaines langues peuvent nécessiter jusqu'à 15 fois plus de tokens par mot que l'anglais. Cette disparité n'est pas simplement un problème de représentation ; elle crée un goulot d'étranglement de performance direct. Une séquence plus longue de tokens nécessite quadratiquement plus de calculs dans le mécanisme d'auto-attention, consomme plus de mémoire dans le cache KV, et prend plus de temps à traiter pendant les phases de prefill et decode. Ainsi, l'étape de pré-traitement apparemment anodine de la tokenisation intègre un biais linguistique dans les fondations mêmes du modèle, créant des disparités de performance et des inefficacités pour les applications multilingues ou spécialisées. Cette limitation fondamentale a stimulé la recherche sur des modèles sans tokenizer qui opèrent directement sur des bytes bruts, visant à contourner entièrement ce goulot d'étranglement.

#### Tableau 1 : Analyse Comparative des Algorithmes de Tokenisation de Sous-mots

| Algorithme | Principe Central | Gestion des Espaces Blancs | Dépendance Linguistique | Avantage Clé | Modèles Notables |
|------------|------------------|---------------------------|-------------------------|---------------|------------------|
| **Byte-Pair Encoding (BPE)** | Fusionne itérativement les paires de tokens adjacents les plus fréquentes pour construire le vocabulaire | Nécessite typiquement une pré-tokenisation ; l'espace blanc est traité comme un délimiteur | Le vocabulaire est optimisé pour le corpus d'entraînement, conduisant souvent à des inefficacités pour d'autres langues | Approche simple et efficace basée sur la compression. Peut encoder n'importe quelle chaîne en se rabattant sur les bytes | Série GPT, RoBERTa |
| **WordPiece** | Fusionne itérativement les paires de tokens qui maximisent la vraisemblance des données d'entraînement | Nécessite une pré-tokenisation ; utilise un préfixe spécial (par exemple, ##) pour dénoter les sous-mots dans un mot | Similaire à BPE, le vocabulaire est dépendant du corpus et peut être sous-optimal pour différents domaines ou langues | La fusion basée sur la vraisemblance peut créer des sous-mots plus sémantiquement significatifs | BERT, DistilBERT, Electra |
| **SentencePiece** | Traite le texte comme une séquence brute de caractères Unicode et entraîne un modèle de sous-mots (BPE ou unigramme) directement | Échappe l'espace blanc en un méta-symbole spécial (▁), le préservant dans la séquence de tokens | Agnostique au langage ; ne nécessite pas de pré-tokenizers spécifiques au langage, le rendant hautement polyvalent | Tokenisation sans perte et entièrement réversible, idéale pour les applications multilingues et langues sans délimiteurs de mots explicites | Llama, T5, Mistral |

## Le Moteur Central - Un Passage Avant à travers le Décodeur Transformer

Une fois que le prompt d'entrée a été converti en une séquence d'IDs de tokens, il entre dans le cœur computationnel du LLM : le décodeur Transformer. Cette architecture complexe, composée d'une pile de blocs de traitement identiques, est responsable de transformer les IDs de tokens discrets en représentations vectorielles riches et contextualisées. Ce processus, connu sous le nom de passage avant, implique une série d'opérations mathématiques — embedding, encodage positionnel, auto-attention, et transformations feed-forward — qui permettent collectivement au modèle de comprendre les relations entre tokens et de construire une représentation sophistiquée de la signification de l'entrée. Cette section trace méticuleusement le voyage de la séquence de tokens à travers ces composants centraux.

### Des Tokens aux Vecteurs : Les Couches d'Embedding et d'Encodage Positionnel

La première étape à l'intérieur du modèle est de convertir la séquence d'IDs de tokens entiers en une séquence de vecteurs haute-dimension. Ceci est accompli par deux couches initiales cruciales.

**Embedding de Token** : La séquence d'IDs de tokens est passée à une couche d'embedding, qui fonctionne comme une grande table de consultation apprise. Cette table est représentée comme une matrice de taille V×d_model, où V est la taille du vocabulaire et d_model est la dimensionnalité des états cachés du modèle (par exemple, 4096 pour Llama 2 7B). Pour chaque ID de token dans la séquence d'entrée, cette couche récupère la ligne correspondante de la matrice, produisant un vecteur dense connu sous le nom d'embedding de token. Ces vecteurs d'embedding ne sont pas aléatoires ; ils sont des paramètres qui sont appris pendant la phase de pré-entraînement du modèle. Le processus d'entraînement organise cet espace vectoriel haute-dimension de sorte que les tokens avec des significations sémantiques similaires soient positionnés plus près les uns des autres. Par exemple, les vecteurs pour "roi" et "reine" seraient plus proches que les vecteurs pour "roi" et "voiture". Cette transformation initiale imprègne ainsi la représentation numérique de signification sémantique.

**Encodage Positionnel** : Une caractéristique fondamentale de l'architecture Transformer est sa dépendance au mécanisme d'auto-attention, qui traite tous les tokens dans une séquence en parallèle. Une conséquence directe de ce traitement parallèle est que le modèle n'a pas de conscience inhérente de l'ordre des tokens ; il est invariant aux permutations. Cependant, dans le langage humain, l'ordre des mots est critique pour la signification ("Le chien a poursuivi le chat" est différent de "Le chat a poursuivi le chien"). Pour adresser cela, l'information sur la position de chaque token dans la séquence doit être explicitement injectée dans le modèle. C'est le rôle de l'encodage positionnel.

Dans le papier Transformer original, ceci est accompli en utilisant un ensemble de fonctions sinusoïdales déterministes de fréquences variées. Pour chaque position pos dans la séquence et chaque dimension i du vecteur d'embedding, une valeur positionnelle unique est calculée. Les formules sont les suivantes :

```
PE(pos,2i) = sin(pos/10000^(2i/d_model))
PE(pos,2i+1) = cos(pos/10000^(2i/d_model))
```

Cette méthode génère un vecteur d'encodage positionnel unique pour chaque position dans la séquence. Ce vecteur positionnel, qui a la même dimension (d_model) que les embeddings de tokens, est ensuite ajouté élément par élément à l'embedding de token correspondant. La séquence résultante de vecteurs, contenant maintenant à la fois l'information sémantique et positionnelle, sert d'entrée au premier bloc décodeur de la pile Transformer.

### Le Cœur du Contexte : Le Mécanisme d'Auto-Attention

Le mécanisme d'auto-attention est l'innovation centrale de l'architecture Transformer, lui permettant de modéliser des dépendances complexes entre tokens dans une séquence, indépendamment de leur distance les uns des autres. Il permet au modèle de pondérer dynamiquement l'importance de différents tokens lors de la production d'une représentation pour un token spécifique, créant effectivement des embeddings contextuels.

#### Cadre Conceptuel : Requêtes, Clés et Valeurs

Le mécanisme peut être compris à travers une analogie avec un système de récupération. Pour la représentation vectorielle de chaque token d'entrée, trois nouveaux vecteurs sont générés en le multipliant avec trois matrices de poids distinctes et apprises : W_q, W_k, et W_v. Ce sont :

- **Requête (Q)** : Un vecteur représentant ce que le token actuel "cherche" ou interroge du reste de la séquence
- **Clé (K)** : Un vecteur qui agit comme une étiquette ou un index pour un token, représentant quelle information il "peut offrir"
- **Valeur (V)** : Un vecteur contenant le contenu ou l'information actuelle du token qui devrait être transmise s'il reçoit de l'attention

#### Attention par Produit Scalaire Ajusté

Le calcul effectif de l'attention suit une séquence précise d'opérations matricielles :

1. **Calculer les Scores d'Attention** : Pour déterminer à quel point chaque token est pertinent pour un token donné, le produit scalaire du vecteur Requête du token actuel est calculé avec les vecteurs Clés de tous les tokens dans la séquence (y compris lui-même). Un produit scalaire élevé indique une compatibilité ou pertinence élevée. Ceci est effectué pour toutes les requêtes simultanément via une multiplication matricielle : QK^T.

2. **Ajuster** : Les scores d'attention résultants sont réduits en divisant par la racine carrée de la dimension des vecteurs clés, √d_k. Ce facteur d'ajustement est crucial pour stabiliser le processus d'entraînement, car il empêche les produits scalaires de devenir trop grands, ce qui pourrait pousser la fonction softmax dans des régions avec des gradients extrêmement petits (le problème des gradients évanescents).

3. **Appliquer Softmax** : Une fonction softmax est appliquée le long de chaque ligne de la matrice de scores ajustée. Cela normalise les scores pour chaque requête en une distribution de probabilité, où les valeurs somment à 1. Ces scores normalisés sont les poids d'attention, représentant la quantité de focus ou "attention" que chaque token devrait placer sur chaque autre token dans la séquence.

4. **Calculer la Somme Pondérée des Valeurs** : La sortie finale pour chaque token est calculée comme une somme pondérée de tous les vecteurs Valeur dans la séquence. Les poids utilisés dans cette somme sont les poids d'attention calculés à l'étape précédente. Ceci est fait via une multiplication matricielle finale : softmax(QK^T/√d_k)V. Le vecteur résultant pour chaque token est une nouvelle représentation qui a incorporé l'information contextuelle de la séquence entière, pondérée par pertinence.

#### Attention Multi-Têtes

Plutôt que d'effectuer une seule opération d'auto-attention, l'architecture Transformer emploie l'Attention Multi-Têtes. Les vecteurs d'entrée sont projetés en représentations Q, K, et V plusieurs fois en parallèle, utilisant différents ensembles de matrices de poids apprises pour chaque "tête". Chaque tête d'attention peut alors apprendre indépendamment à se concentrer sur différents types de relations dans le texte — par exemple, une tête pourrait apprendre les dépendances syntaxiques, tandis qu'une autre apprend les relations sémantiques. Les sorties de toutes les têtes d'attention sont concaténées puis passées à travers une couche de projection linéaire finale pour produire la sortie finale du bloc d'attention multi-têtes. Ce traitement parallèle permet au modèle de capturer un ensemble beaucoup plus riche et diversifié de dépendances contextuelles.

### Le Bloc Décodeur Complet

Le cœur d'un LLM comme GPT est une pile de blocs décodeurs identiques, chacun appliquant une séquence de transformations aux vecteurs qu'il reçoit du bloc précédent. Un bloc décodeur standard consiste en deux sous-couches principales.

**Auto-Attention Multi-Têtes Masquée** : La première sous-couche est le mécanisme d'auto-attention multi-têtes décrit ci-dessus, avec une modification cruciale pour la génération auto-régressive : le masquage. Pendant le calcul des scores d'attention (QK^T), un masque "look-ahead" est appliqué. Ce masque est une matrice triangulaire qui fixe toutes les valeurs dans le triangle supérieur (qui correspondent aux connexions vers les tokens futurs) à l'infini négatif (−∞). Quand la fonction softmax est appliquée, ces valeurs deviennent zéro. Cela assure que la représentation pour un token à la position i ne peut dépendre que des tokens aux positions j≤i. Ce masquage est ce qui préserve la propriété auto-régressive du modèle, l'empêchant de "tricher" en regardant les tokens futurs pendant l'entraînement et assurant que la génération puisse procéder un token à la fois pendant l'inférence.

**Add & Norm** : Suivant la sous-couche d'attention, deux opérations sont effectuées. Premièrement, une connexion résiduelle (ou connexion de saut) ajoute l'entrée de la sous-couche à sa sortie. Deuxièmement, le résultat est passé à travers une étape de normalisation de couche. Les connexions résiduelles sont vitales pour entraîner des réseaux très profonds car elles aident à atténuer le problème des gradients évanescents, tandis que la normalisation de couche stabilise le processus d'apprentissage.

**Réseau Feed-Forward (FFN)** : La deuxième sous-couche est un réseau feed-forward position-wise. Ce réseau est appliqué indépendamment à la représentation vectorielle de chaque token. Il consiste typiquement en deux transformations linéaires avec une fonction d'activation non-linéaire, telle que GELU (Gaussian Error Linear Unit) ou SwiGLU, entre elles. Cette sous-couche permet au modèle d'effectuer des transformations plus complexes sur la représentation de chaque token.

**Add & Norm** : Une connexion résiduelle finale et une normalisation de couche sont appliquées après le FFN.

La sortie d'un bloc décodeur est ensuite passée comme entrée au bloc identique suivant dans la pile. Ce processus est répété à travers toutes les couches du modèle (par exemple, 32 couches pour Llama 2 7B). Il vaut la peine de noter que dans les architectures Transformer complètes (modèles encodeur-décodeur utilisés pour des tâches comme la traduction), le bloc décodeur contient une couche d'attention croisée additionnelle entre l'auto-attention et le FFN. Dans cette couche, les vecteurs Requête viennent du décodeur, tandis que les vecteurs Clé et Valeur viennent de la sortie de l'encodeur, permettant au décodeur de prêter attention à la séquence d'entrée source. Cependant, dans les modèles décodeur-seulement comme la famille GPT, cette couche d'attention croisée est absente.

L'architecture computationnelle du Transformer, spécifiquement le mécanisme d'auto-attention, contient une propriété fondamentale qui dicte le paysage de performance de tous les LLM modernes. Le cœur de l'auto-attention est la multiplication matricielle QK^T, qui compare chaque token dans la séquence contre chaque autre token. Cela résulte en une matrice de scores d'attention de taille N×N, où N est la longueur de séquence. Le temps et la mémoire requis pour calculer et stocker cette matrice évoluent quadratiquement avec la longueur de séquence, une complexité de O(N²).

Cette mise à l'échelle quadratique est le "péché originel" de l'architecture Transformer et la cause racine de ses goulots d'étranglement de performance les plus significatifs. Alors que les fenêtres de contexte s'étendent de quelques milliers de tokens à des centaines de milliers, les exigences computationnelles et mémoire de cette seule opération explosent. Un contexte de 4 096 tokens nécessite de calculer plus de 16 millions de scores d'attention par tête par couche, tandis qu'un contexte de 128 000 tokens en demande plus de 16 milliards. Ce comportement de mise à l'échelle est l'impulsion directe pour le développement de presque chaque optimisation majeure d'inférence LLM. Le Cache Clé-Valeur (KV) a été inventé spécifiquement pour contourner le besoin de recalculer les matrices Clé et Valeur pour tous les N tokens précédents à chaque nouvelle étape de génération, réduisant effectivement la complexité computationnelle de la phase de décodage de O(N²) à O(N). Similairement, FlashAttention a été développé non pour réduire le nombre d'opérations en virgule flottante (FLOPS), mais pour optimiser les motifs d'accès mémoire de cette multiplication QK^T massive, reconnaissant que pour le matériel moderne, le vrai goulot d'étranglement est le temps passé à déplacer les données entre différents niveaux de mémoire. Le champ entier des LLM à contexte long est, en essence, une bataille continue contre cette loi de mise à l'échelle quadratique fondamentale.

## Le Processus de Génération - Création de Texte Auto-Régressive

Après que le prompt d'entrée ait été traité à travers la pile profonde de blocs décodeurs Transformer, le modèle a produit une représentation riche et contextualisée de l'entrée. Le processus se déplace maintenant de la compréhension vers la création. Cette phase de génération est fondamentalement auto-régressive, signifiant que le modèle produit sa réponse un token à la fois, avec chaque token nouvellement généré étant réinjecté dans le modèle pour influencer la génération du suivant. Ce processus itératif n'est pas monolithique ; il est divisé en deux phases computationnelles distinctes — prefill et decode — et s'appuie sur des algorithmes sophistiqués, connus sous le nom de stratégies de décodage, pour sélectionner la sortie finale d'un univers de possibilités.

### La Danse à Deux Phases : Prefill et Decode

La nature auto-régressive des LLM donne lieu à deux phases distinctes pendant l'inférence, chacune avec son propre profil computationnel et ses goulots d'étranglement de performance.

#### Prefill (Traitement du Prompt)

C'est la première phase et la plus computationnellement intensive. Quand le prompt de l'utilisateur (représenté comme une séquence d'IDs de tokens) est d'abord reçu, le modèle effectue un seul passage avant large pour traiter tous ces tokens d'entrée en parallèle. Parce que le mécanisme d'attention permet à chaque token d'entrée de prêter attention à tous les tokens précédents simultanément, cette phase peut exploiter le parallélisme massif des GPU modernes. Les opérations sont dominées par de grandes multiplications matrice-matrice, rendant la phase prefill liée au calcul. Les deux résultats primaires de la phase prefill sont la génération du tout premier token de sortie et, critiquement, le calcul et le peuplement du cache Clé-Valeur (KV) pour la séquence d'entrée entière. Ce cache stocke les vecteurs Clé et Valeur de chaque couche d'attention pour chaque token d'entrée, préparant le modèle pour la phase suivante.

#### Decode (Génération de Token)

Suivant le prefill, le modèle entre dans une boucle itérative pour générer le reste de la réponse un token à la fois. Pour chaque nouveau token, ce qui suit se produit :

1. Le modèle prend le seul token le plus récemment généré comme sa nouvelle entrée
2. Il effectue un passage avant à travers le réseau pour prédire le token subséquent
3. Pendant les calculs d'auto-attention dans chaque bloc décodeur, le modèle n'a pas besoin de recalculer les Clés et Valeurs pour tous les tokens précédents (de à la fois le prompt original et la réponse générée). Au lieu de cela, il récupère ces vecteurs pré-calculés du cache KV. Il n'a besoin de calculer que les vecteurs Q, K, et V pour le seul nouveau token d'entrée
4. Les nouveaux vecteurs K et V sont ensuite ajoutés au cache pour usage à l'étape suivante

Ce processus transforme les multiplications matrice-matrice computationnellement intensives de la phase prefill en multiplications matrice-vecteur beaucoup plus petites. Cependant, pour chaque token généré, le modèle doit lire l'entièreté de ses poids (qui peuvent être des dizaines ou centaines de gigaoctets) et le cache KV en croissance constante de la Mémoire Haute Bande Passante (HBM) principale du GPU dans le SRAM sur puce beaucoup plus rapide pour le calcul. Ce mouvement de données massif rend la phase decode liée à la bande passante mémoire. La vitesse de génération est limitée non par la capacité du GPU à effectuer des calculs, mais par la vitesse à laquelle il peut transférer les données de la mémoire.

Cette division architecturale fondamentale entre une phase prefill parallèle, liée au calcul, et une phase decode sérielle, liée à la bande passante mémoire, crée deux régimes de performance distincts dans une seule requête d'inférence. La latence de la phase prefill, mesurée comme le Temps Jusqu'au Premier Token (TTFT), est hautement sensible à la longueur du prompt d'entrée, car un prompt plus long nécessite plus de calcul dans le passage avant parallèle. En contraste, la latence de chaque étape dans la phase decode, mesurée comme le Temps Par Token de Sortie (TPOT), est principalement sensible à la longueur totale du contexte (prompt + tokens déjà générés), parce qu'un contexte plus long signifie un cache KV plus large qui doit être lu du HBM à chaque étape. Cette dualité force les développeurs de systèmes de service LLM à gérer un compromis complexe. Optimiser pour une phase peut être préjudiciable à l'autre. Par exemple, traiter les requêtes en grandes batches peut améliorer le débit global du système en mieux utilisant les cœurs de calcul du GPU, mais cela cause aussi l'agrégation du cache KV à gonfler, potentiellement menant à des erreurs de mémoire insuffisante ou augmentant significativement le goulot d'étranglement de bande passante mémoire et ainsi le TPOT pour chaque requête dans la batch. Cette tension inhérente est la motivation primaire derrière le développement de systèmes de planification avancés comme le batching continu et les techniques sophistiquées de gestion mémoire comme PagedAttention, qui visent à équilibrer dynamiquement ces demandes concurrentes.

### Choisir le Mot Suivant : Une Analyse Comparative des Stratégies de Décodage

À la conclusion d'un passage avant, la couche finale du Transformer produit un vecteur de logits, qui sont des scores bruts, non normalisés pour chaque token dans le vocabulaire du modèle. Une fonction softmax est ensuite appliquée à ces logits pour les convertir en une distribution de probabilité, où chaque token se voit assigner une probabilité d'être le token suivant correct dans la séquence. Une stratégie de décodage est l'algorithme utilisé pour sélectionner un token de cette vaste distribution de probabilité. Le choix de stratégie impacte profondément la qualité, cohérence, et créativité du texte généré.

#### Stratégies Déterministes

Ces stratégies produiront toujours la même sortie pour une entrée donnée, car elles n'impliquent pas d'aléatoire.

**Recherche Gourmande** : C'est la méthode de décodage la plus directe. À chaque étape, elle sélectionne simplement le token avec la probabilité la plus élevée. Bien que rapide et computationnellement efficace, la recherche gourmande est myope. Elle fait le choix localement optimal à chaque étape sans considérer la probabilité globale de séquence. Cela peut la conduire à être piégée dans des chemins sous-optimaux, résultant souvent en texte répétitif, terne, ou insensé.

**Recherche par Faisceau** : Pour atténuer les défauts de la recherche gourmande, la recherche par faisceau explore simultanément plusieurs séquences potentielles. Elle maintient un nombre fixe de séquences candidates, connu sous le nom de "largeur de faisceau" (k), à chaque étape. Pour chaque séquence candidate, elle génère les probabilités pour tous les tokens suivants possibles et étend l'ensemble de candidats. Elle émonde ensuite cet ensemble étendu vers les k meilleures séquences basées sur leur probabilité cumulative. Ce processus continue jusqu'à ce qu'une condition d'arrêt soit rencontrée, à quel point la séquence avec la probabilité globale la plus élevée est choisie comme sortie. La recherche par faisceau produit souvent des sorties plus cohérentes et de qualité supérieure que la recherche gourmande mais au coût d'une complexité computationnelle accrue, car elle doit maintenir et évaluer k hypothèses à chaque étape.

#### Stratégies Stochastiques (Échantillonnage)

Ces stratégies introduisent un élément d'aléatoire dans le processus de sélection de token, permettant des sorties plus diverses et créatives.

**Échantillonnage par Température** : Cette technique ajuste la forme de la distribution de probabilité produite par la fonction softmax en échelonnant les logits avant que la fonction soit appliquée. Une valeur de température T est utilisée comme diviseur pour les logits.

- Si T<1, la distribution devient "plus nette", augmentant la probabilité des tokens à haute probabilité et rendant la sortie plus déterministe, similaire à la recherche gourmande
- Si T>1, la distribution devient "plus plate", augmentant la probabilité des tokens moins probables et menant à des sorties plus aléatoires et créatives
- Si T=1, la distribution de probabilité originale est utilisée

**Échantillonnage Top-K** : Cette méthode adresse un problème clé avec l'échantillonnage pur, où des tokens de faible probabilité, souvent insensés, ont une chance non-zéro d'être sélectionnés. L'échantillonnage Top-K tronque la distribution de probabilité, considérant seulement les k tokens les plus probables pour l'échantillonnage. Les probabilités de ces k tokens supérieurs sont ensuite redistribuées (renormalisées) pour sommer à 1, et un token est échantillonné de cet ensemble réduit. Cela empêche le modèle de sélectionner des tokens hautement improbables "charabia" tout en permettant encore la diversité.

**Échantillonnage Top-P (Nucleus)** : C'est une alternative plus adaptative au Top-K. Au lieu d'échantillonner d'un nombre fixe de tokens, l'échantillonnage Top-P sélectionne le plus petit ensemble possible de tokens dont la probabilité cumulative dépasse un seuil prédéfini p (le "noyau"). La taille du pool d'échantillonnage s'adapte ainsi dynamiquement basée sur la certitude du modèle à chaque étape. Si le modèle est très confiant et qu'un token a une très haute probabilité, le noyau pourrait contenir seulement quelques tokens. Si le modèle est incertain et les probabilités sont réparties plus uniformément, le noyau sera plus large. Cela fournit souvent un meilleur équilibre entre cohérence et créativité que l'échantillonnage Top-K et est une stratégie largement utilisée dans les modèles de production.

#### Tableau 2 : Analyse Comparative des Stratégies de Décodage

| Stratégie | Mécanisme | Type | Hyperparamètres Clés | Complexité Computationnelle | Avantages | Inconvénients | Cas d'Usage Idéal |
|-----------|-----------|------|---------------------|---------------------------|-----------|---------------|-------------------|
| **Recherche Gourmande** | Sélectionne le token avec la probabilité la plus élevée à chaque étape | Déterministe | Aucun | Faible (O(T'·\|V\|)) | Rapide, simple, computationnellement efficace | Myope, peut conduire à du texte répétitif, terne ou incohérent | Tâches nécessitant des réponses factuelles directes, résumé |
| **Recherche par Faisceau** | Maintient k séquences les plus probables à chaque étape et sélectionne celle avec la probabilité globale la plus élevée | Déterministe | num_beams (k) | Élevée (O(T'·k·\|V\|)) | Produit des séquences plus cohérentes, globalement optimales que la recherche gourmande | Computationnellement coûteuse, peut encore produire du texte générique ou répétitif | Traduction, résumé, tâches nécessitant de la cohérence |
| **Échantillonnage par Température** | Rééchèlonne les logits avant softmax pour affiner (T<1) ou aplatir (T>1) la distribution de probabilité | Stochastique | temperature (T) | Faible | Permet un contrôle fin-grain sur l'aléatoire et la créativité | Les températures élevées peuvent conduire à un texte incohérent ou insensé | Écriture créative, brainstorming, dialogue ouvert |
| **Échantillonnage Top-K** | Restreint l'échantillonnage aux k tokens les plus probables | Stochastique | top_k (k) | Faible | Empêche l'échantillonnage de tokens hautement improbables, insensés ; équilibre diversité et cohérence | Un k fixe peut être trop restrictif pour les distributions "piquées" et trop permissif pour les "plates" | Génération de texte général, chatbots, rédaction |
| **Échantillonnage Top-P (Nucleus)** | Restreint l'échantillonnage au plus petit ensemble de tokens dont la probabilité cumulative dépasse p | Stochastique | top_p (p) | Faible | S'adapte dynamiquement à la taille du pool d'échantillonnage basée sur la confiance du modèle ; produit souvent du texte de haute qualité, diversifié | Peut être légèrement plus difficile à interpréter et ajuster que Top-K | LLM à usage général, tâches créatives et factuelles, la plupart des systèmes de production |

Note: T' est la longueur de séquence et |V| est la taille du vocabulaire.

### Des Tokens au Texte : Détokenisation et Arrêt Contrôlé

Les étapes finales du processus d'inférence impliquent de convertir la sortie numérique du modèle en texte lisible par l'humain et d'assurer que le processus de génération se termine appropriément.

**Détokenisation** : Une fois que la stratégie de décodage sélectionne un ID de token, l'étape finale est de convertir cet entier vers sa représentation de chaîne correspondante. Ceci est accompli en effectuant une recherche inverse dans le vocabulaire du tokenizer. La chaîne résultante est ensuite ajoutée à la séquence de sortie. Ce processus, connu sous le nom de détokenisation, est l'inverse direct de l'étape de tokenisation initiale. Cependant, ce n'est pas toujours un mappage simple un-à-un. La recherche récente suggère que les LLM s'engagent dans un processus de détokenisation interne intrinsèque dans leurs couches cachées, où ils apprennent à assembler des représentations cohérentes de mots entiers à partir de séquences de tokens de sous-mots, formant une sorte de "lexique interne". Cela souligne la complexité derrière ce qui apparaît être une simple recherche inverse.

**Séquences d'Arrêt** : La boucle de génération auto-régressive ne fonctionne pas indéfiniment. Elle doit être terminée. Bien qu'une limite maximale de tokens puisse être fixée, une méthode plus précise est l'utilisation de séquences d'arrêt. Ce sont des chaînes prédéfinies qui, quand générées par le modèle, signalent la fin de la réponse. Par exemple, dans un système de questions-réponses, un caractère de nouvelle ligne ou la chaîne "Q:" pourrait être utilisée comme séquences d'arrêt pour empêcher le modèle de générer des questions et réponses subséquentes fallacieuses. Ce mécanisme est crucial pour contrôler la longueur, structure, et coût de la sortie générée, assurant que le modèle fournit une réponse concise et pertinente sans générer de texte extraneà.

## Identification et Atténuation des Goulots d'Étranglement de Performance

Alors que les sections précédentes détaillaient les étapes architecturales et algorithmiques de l'inférence des Grands Modèles de Langage (LLM), cette section se concentre sur les contraintes pratiques qui gouvernent sa performance. L'échelle immense des LLM modernes, avec des milliards de paramètres et de vastes fenêtres de contexte, place des demandes extraordinaires sur le matériel computationnel. Comprendre les goulots d'étranglement fondamentaux de ce processus — pourquoi l'inférence peut être lente et coûteuse — est crucial pour déployer ces modèles efficacement. Le paysage de performance est dominé par une interaction critique entre mémoire, calcul, et les demandes uniques du processus de génération auto-régressive.

### Le Mur Mémoire : Pourquoi l'Inférence Moderne est Liée à la Mémoire

La performance de toute tâche computationnelle est ultimement limitée soit par sa puissance de traitement brute (calcul) soit par sa capacité à accéder aux données (bande passante mémoire). La relation entre ces deux est capturée par le concept d'intensité arithmétique, qui est le ratio d'opérations arithmétiques (FLOPs) effectuées aux octets de données déplacées de la mémoire vers le processeur. Les GPU modernes, tels que le NVIDIA A100 ou H100, sont des centrales computationnelles avec un ratio extrêmement élevé de FLOPS disponibles à la bande passante mémoire. Un GPU NVIDIA A10, par exemple, peut effectuer 125 TFLOPS mais a une bande passante mémoire de seulement 600 GB/s, produisant un équilibre matériel d'approximativement 208 opérations par octet.

Une tâche est considérée liée au calcul si son intensité arithmétique est plus élevée que le ratio du matériel, signifiant que le processeur est le goulot d'étranglement. Une tâche est liée à la bande passante mémoire si son intensité arithmétique est plus faible, signifiant que le goulot d'étranglement est le temps passé à attendre que les données soient transférées de la mémoire GPU principale (Mémoire Haute Bande Passante, ou HBM) vers les unités de traitement rapides sur puce (SRAM).

Cette dichotomie est centrale pour comprendre la performance d'inférence LLM :

**La Phase Prefill est Liée au Calcul** : Pendant le traitement initial du prompt, le mécanisme d'auto-attention implique de grandes multiplications matrice-matrice (QK^T). Ces opérations ont une intensité arithmétique élevée parce qu'elles effectuent de nombreux calculs sur des données qui ont été chargées dans SRAM. En résultat, la phase prefill peut utiliser efficacement les vastes ressources computationnelles du GPU et est typiquement limitée par sa vitesse de traitement.

**La Phase Decode est Liée à la Bande Passante Mémoire** : La génération auto-régressive de chaque token subséquent est une histoire radicalement différente. Les opérations sont principalement des multiplications matrice-vecteur, qui ont une intensité arithmétique très faible. Pour chaque token, le modèle doit charger sa matrice de poids entière (souvent des dizaines de gigaoctets) et le cache Clé-Valeur (KV) en croissance du HBM lent dans le SRAM rapide. Les cœurs de calcul puissants du GPU effectuent ensuite un nombre relativement petit de calculs avant de devoir attendre le prochain ensemble de données pour le token suivant. Conséquemment, le processeur passe la plupart de son temps inactif, et la vitesse globale est dictée par la bande passante mémoire. Ce "mur mémoire" est le goulot d'étranglement de performance le plus significatif unique dans l'inférence LLM.

### Le Dilemme du Cache KV : Échanger Mémoire contre Calcul

Le cache Clé-Valeur (KV) est une optimisation fondamentale qui rend l'inférence LLM moderne faisable. Comme décrit précédemment, il stocke les tenseurs Clé et Valeur des couches d'attention pour tous les tokens qui ont été traités. En réutilisant ces valeurs cachées, le modèle évite de les recalculer à chaque étape de la phase decode. Ce compromis crucial — utiliser la mémoire pour sauver le calcul — réduit la complexité computationnelle de chaque étape decode d'être quadratique dans la longueur de séquence, O(N²), à être linéaire, O(N).

Cependant, cette économie computationnelle vient à un coût mémoire escarpé. La taille du cache KV peut être calculée avec la formule suivante :

```
Taille Totale Cache (octets) = (batch_size) × (sequence_length) × 2 × (num_layers) × (hidden_size) × (bytes_per_parameter)
```

Ici, hidden_size est équivalent à num_heads * dim_head. Pour un modèle comme Llama 2 7B, qui a 32 couches et une taille cachée de 4096, stocker le cache KV en demi-précision (FP16, 2 octets) pour une seule requête avec une longueur de séquence de 4096 tokens nécessite approximativement 2 GB de VRAM. Pour un modèle 70B comme Llama-70B, le cache KV peut consommer autour de 2,6 MB par token.

Cette empreinte mémoire massive crée un goulot d'étranglement sévère :

**Limitation de Longueur de Contexte** : Le cache KV grandit linéairement avec la longueur de séquence. Sur un GPU avec VRAM finie, la taille du cache place une limite dure sur la longueur de contexte maximale que le modèle peut gérer.

**Limitation de Débit** : Le cache grandit aussi linéairement avec la taille de batch. La mémoire consommée par le cache KV pour plusieurs requêtes concurrentes peut rapidement épuiser VRAM, limitant le nombre de requêtes qui peuvent être traitées en parallèle et plafonnant ainsi le débit global du système. Pour les séquences longues, la mémoire requise pour le cache KV peut même dépasser la mémoire nécessaire pour stocker les poids du modèle, devenant le consommateur mémoire dominant.

### Mesurer la Performance : Latence (TTFT, TPOT) et Débit

Pour analyser et optimiser la performance d'inférence, il est essentiel d'utiliser des métriques précises qui reflètent la nature à deux phases du processus.

**Temps Jusqu'au Premier Token (TTFT)** : Cette métrique mesure la latence de la phase prefill. C'est la durée depuis quand un utilisateur envoie une requête jusqu'à quand le premier token de sortie est généré et reçu. TTFT est un indicateur critique de réactivité perçue dans les applications interactives comme les chatbots. Il est principalement influencé par des facteurs affectant l'étape prefill liée au calcul, notamment la longueur du prompt d'entrée et toute latence réseau. Des prompts plus longs nécessitent plus de calculs parallèles, menant à un TTFT plus élevé.

**Temps Par Token de Sortie (TPOT)** : Aussi connu sous le nom de Latence Inter-Token (ITL), cette métrique mesure la latence moyenne de chaque étape dans la phase decode liée à la mémoire. C'est le temps entre la génération de tokens consécutifs. TPOT détermine la "vitesse" à laquelle la réponse apparaît être tapée dans les applications de streaming. TPOT est fortement influencé par la longueur totale du contexte (prompt + tokens générés), car un contexte plus long correspond à un cache KV plus large qui doit être lu du HBM à chaque étape.

**Débit** : C'est une métrique au niveau système qui mesure l'efficacité globale, typiquement en Requêtes Par Seconde (RPS) ou, plus précisément pour les LLM, Tokens de Sortie Par Seconde (TPS) à travers tous les utilisateurs concurrents. Le débit est directement influencé par les stratégies de batching. Augmenter la taille de batch peut améliorer le débit en mieux utilisant les ressources GPU, mais cela vient souvent au coût d'une latence accrue (à la fois TTFT et TPOT) pour les requêtes individuelles, soulignant un compromis fondamental que les concepteurs de système doivent naviguer.

## Un Aperçu des Techniques d'Optimisation État-de-l'Art

Le paysage entier d'optimisation d'inférence LLM peut être compris comme une collection de stratégies conçues pour combattre les goulots d'étranglement décrits ci-dessus, principalement le mur mémoire et l'explosion du cache KV. Ces techniques attaquent le problème sous différents angles : réduire la quantité de données à déplacer, rendre le mouvement de données plus efficace, ou réduire le nombre de mouvements de données requis.

### Compression de Modèle

Ces techniques visent à réduire l'empreinte mémoire du modèle.

**Quantification** : Cela implique de réduire la précision numérique des poids du modèle et, dans certains cas, des activations, de nombres en virgule flottante standard 32-bit ou 16-bit vers des formats de précision inférieure comme des entiers 8-bit ou 4-bit. Cela réduit directement la taille du modèle sur disque et en mémoire, ce qui réduit à son tour la quantité de données qui doivent être transférées du HBM vers SRAM à chaque étape decode, améliorant ainsi TPOT.

**Élagage** : Cette technique identifie et supprime les paramètres redondants ou non importants (poids, neurones, têtes d'attention, ou couches entières) du modèle. Le modèle résultant plus petit et clairsemé nécessite moins de calculs et moins de mémoire, menant à une inférence plus rapide.

### Améliorations Algorithmiques

Ces techniques modifient les algorithmes centraux pour être plus efficaces.

**Décodage Spéculatif** : Cette méthode utilise un modèle "brouillon" plus petit et plus rapide pour générer une séquence de plusieurs tokens candidats. Le modèle "cible" large et puissant vérifie ensuite ces candidats en un seul passage avant parallèle, les acceptant s'ils correspondent à ses propres prédictions. Cela peut accélérer significativement la phase decode en générant plusieurs tokens pour le coût d'une seule opération liée à la mémoire, augmentant effectivement le TPOT.

**FlashAttention** : C'est un algorithme d'attention conscient des I/O qui restructure le calcul pour minimiser le mouvement de données entre HBM et SRAM. Il utilise des techniques comme le tiling (traiter la matrice d'attention en petits blocs qui tiennent dans SRAM) et la recalculation pour éviter de matérialiser la matrice d'attention N×N complète dans HBM. Cela réduit dramatiquement les lectures/écritures mémoire, fournissant des accélérations significatives, spécialement pour les séquences longues dans la phase prefill.

### Optimisations au Niveau Système et Mémoire

Ces techniques se concentrent sur la gestion intelligente de la mémoire et la planification des requêtes.

**PagedAttention (vLLM)** : C'est un système avancé de gestion mémoire qui traite le cache KV comme la mémoire virtuelle dans un système d'exploitation. Il alloue la mémoire pour le cache KV en blocs non-contigus, de taille fixe ("pages"). Cette approche élimine presque le gaspillage mémoire de fragmentation interne et externe, permettant des tailles de batch effectives beaucoup plus larges et augmentant significativement le débit.

**Batching Continu** : Au lieu de former des batches statiques et attendre que toutes les requêtes dans un batch se terminent, le batching continu (ou batching en vol) ajoute dynamiquement de nouvelles requêtes au batch dès que d'autres finissent. Cela garde le GPU constamment utilisé, améliorant dramatiquement le débit système comparé au batching statique.

### Accélération Matérielle

Le choix du matériel est fondamental pour la performance.

**GPU (Unités de Traitement Graphique)** : Les GPU de vendeurs comme NVIDIA sont les chevaux de bataille de l'inférence LLM en raison de leur architecture massivement parallèle. Les caractéristiques clés incluent les Tensor Cores, qui sont spécialisés pour les multiplications matricielles centrales à l'apprentissage profond, et la mémoire haute bande passante (HBM), qui est cruciale pour atténuer le goulot d'étranglement mémoire.

**TPU (Unités de Traitement Tensoriel)** : Les ASIC (Circuits Intégrés Spécifiques à l'Application) conçus sur mesure par Google sont construits de zéro pour accélérer les charges de travail d'apprentissage automatique et sont une autre plateforme matérielle clé pour l'inférence LLM.

#### Tableau 3 : Goulots d'Étranglement d'Inférence LLM et Solutions d'Optimisation Correspondantes

| Goulot d'Étranglement | Description | Métrique(s) Principale(s) Affectée(s) | Technique(s) d'Optimisation Clé(s) | Mécanisme d'Action |
|----------------------|-------------|---------------------------------------|-----------------------------------|-------------------|
| **Taille de Modèle (Capacité Mémoire)** | Les grands modèles (milliards de paramètres) nécessitent VRAM significative, limitant quel matériel peut les exécuter et concurrençant l'espace avec le cache KV | Faisabilité, Taille Batch Max | Quantification, Élagage, Distillation de Connaissance | Réduit le nombre de bits par paramètre ou le nombre total de paramètres, réduisant l'empreinte mémoire du modèle |
| **Calcul d'Attention (O(N²))** | Le calcul et la mémoire requis pour le mécanisme d'auto-attention évoluent quadratiquement avec la longueur de séquence d'entrée (N) | TTFT (Latence Prefill) | FlashAttention, Attention Clairsemée/Fenêtre Glissante | Optimise les motifs d'accès mémoire (conscience I/O) ou limite la portée d'attention pour éviter de calculer la matrice N×N complète |
| **Bande Passante Mémoire (Phase Decode)** | La phase decode est limitée par la vitesse de transfert des poids du modèle et du cache KV du HBM vers SRAM pour chaque génération de token | TPOT (Latence Decode), Débit | Quantification, Élagage, Décodage Spéculatif, Matériel avec bande passante supérieure (par exemple, HBM3/HBM4) | Réduit la quantité de données à transférer (quantification/élagage) ou le nombre de transferts nécessaires (décodage spéculatif) |
| **Empreinte Mémoire Cache KV** | Le cache KV grandit linéairement avec la longueur de séquence et la taille de batch, consommant de vastes quantités de VRAM et limitant contexte et débit | Longueur Contexte Max, Taille Batch Max, TPOT | PagedAttention, MQA/GQA, Quantification/Compression Cache (par exemple, H2O, StreamingLLM) | Gère la mémoire plus efficacement (PagedAttention), réduit le nombre de têtes K/V à cacher (MQA/GQA), ou compresse les données cache |
| **Génération Séquentielle (Auto-régressive)** | Générer un token à la fois sous-utilise les capacités de traitement parallèle des GPU, limitant le débit | Débit (TPS), Utilisation GPU | Batching Continu, Décodage Spéculatif | Traite plusieurs requêtes concurremment au niveau itération (batching) ou génère plusieurs tokens par étape (décodage spéculatif) |

## Conclusion et Directions Futures

Le voyage du prompt d'un utilisateur à travers un Grand Modèle de Langage est un processus multi-étapes de transformation, calcul, et génération, gouverné par une interaction complexe de conception architecturale, choix algorithmiques, et contraintes matérielles. De l'ingénierie initiale du prompt et sa tokenisation en un format numérique, à travers le traitement profond et parallèle des mécanismes d'attention du Transformer, jusqu'à l'acte final et itératif de décodage auto-régressif, chaque étape présente des défis uniques et des opportunités d'optimisation. Ce rapport a disséqué ce pipeline d'inférence de bout en bout, identifiant les étapes critiques et analysant les goulots d'étranglement fondamentaux qui définissent sa performance.

### Synthèse du Pipeline d'Inférence de Bout en Bout

Le processus d'inférence peut être synthétisé en une séquence claire :

1. **Préparation d'Entrée** : L'intention de l'utilisateur est d'abord capturée à travers l'ingénierie de prompt, une étape cruciale qui cadre la tâche pour le modèle. Ce texte brut est ensuite passé à travers un tokenizer, qui le convertit en une séquence d'IDs entiers, un processus qui introduit son propre ensemble de biais et inefficacités potentielles.

2. **Phase Prefill** : Le modèle effectue un passage avant parallèle, lié au calcul sur la séquence d'entrée entière. Cette étape initiale calcule les tenseurs Clé et Valeur pour tous les tokens d'entrée, peuple le cache KV, et génère le premier token de sortie. La latence de cette phase est mesurée par le Temps Jusqu'au Premier Token (TTFT).

3. **Phase Decode** : Le modèle entre dans une boucle auto-régressive, générant la réponse un token à la fois. Cette phase est liée à la bande passante mémoire, car sa vitesse est limitée par le transfert des poids du modèle et du cache KV en croissance du HBM vers SRAM sur puce. La latence de chaque étape est mesurée par le Temps Par Token de Sortie (TPOT).

4. **Sélection de Token et Finalisation** : À chaque étape de la boucle decode, une stratégie de décodage (par exemple, recherche gourmande, recherche par faisceau, ou échantillonnage nucleus) est utilisée pour sélectionner le token suivant de la distribution de probabilité de sortie du modèle. L'ID de token sélectionné est ensuite détokenisé vers le texte et ajouté à la réponse jusqu'à ce qu'une séquence d'arrêt soit générée, terminant le processus.

### La Dominance de la Mémoire

Un thème central émergent de cette analyse est l'impact profond et pervasif de la mémoire sur la performance d'inférence LLM. Alors que la puissance computationnelle brute des accélérateurs modernes continue de croître exponentiellement, la vitesse d'accès mémoire n'a pas suivi le rythme. Cette disparité croissante a créé un "mur mémoire", rendant la phase decode auto-régressive de l'inférence fondamentalement liée à la bande passante mémoire. La complexité quadratique du mécanisme d'auto-attention et la croissance linéaire résultante du cache KV massif sont les moteurs primaires de ce goulot d'étranglement. Conséquemment, le paysage entier d'optimisation d'inférence LLM moderne — de la quantification et l'élagage aux innovations algorithmiques comme FlashAttention et le décodage spéculatif, et aux avancées au niveau système comme PagedAttention — peut être vu comme un effort multifacette pour atténuer ce problème mémoire central. Ces techniques visent soit à réduire la quantité de données qui doivent être déplacées soit à rendre le mouvement de ces données plus efficace.

### Directions Futures

Le champ de l'inférence LLM évolue rapidement, avec plusieurs directions de recherche prometteuses prêtes à remodeler le paysage de performance et adresser les goulots d'étranglement fondamentaux identifiés dans ce rapport.

**Modèles Sans Tokenizer** : Un corps croissant de recherche explore les modèles qui opèrent directement sur des bytes bruts, contournant entièrement l'étape de tokenisation. De tels modèles ont le potentiel d'éliminer la "taxe de tokenisation" sur les langues non-anglaises et domaines spécialisés, supprimer une source de biais intégré, et mieux gérer les tâches nécessitant une compréhension au niveau caractère. Cependant, ils présentent aussi de nouveaux défis, car les séquences de bytes sont significativement plus longues que les séquences de tokens, exacerbant davantage la complexité quadratique de l'attention.

**Architectures Nouvelles** : Bien que le Transformer ait été dominant, des architectures alternatives gagnent en traction. Les Modèles d'Espace d'État (SSM) et autres architectures qui remplacent le mécanisme d'auto-attention quadratique avec des opérations de complexité linéaire ou près-linéaire pourraient altérer fondamentalement les lois de mise à l'échelle de l'inférence, rendant potentiellement le traitement de contexte long significativement plus efficace.

**Co-conception Matériel-Logiciel** : Le développement de techniques comme FlashAttention souligne l'importance de concevoir des algorithmes avec une conscience explicite de la hiérarchie mémoire du matériel sous-jacent. L'avenir de l'inférence efficace impliquera probablement une intégration plus profonde de l'architecture de modèle, l'optimisation logicielle, et la conception matérielle. Cette philosophie de co-conception sera essentielle pour créer des systèmes qui peuvent garder les unités de calcul puissantes des accélérateurs de prochaine génération alimentées avec des données, poussant au-delà du mur mémoire actuel et permettant la prochaine vague de modèles de langage encore plus grands et plus capables.