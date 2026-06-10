# Backlog du projet "Optimisation Sante+"

## USER STORIES

Triées par ordre de priorisation.

### Story 1 : Mise en cache

**En tant que** utilisateur régulier,

**je veux** que les ressources statiques de l'application soient mises en cache par mon navigateur,

**afin de** réduire le temps de chargement des pages lors de mes visites suivantes.

- 🎯 Objectif : diminuer les transferts réseau inutiles
- 🧱 BP associée : mise en cache des ressources statiques
- 🛠️ KPI : présence des en-têtes Cache-Control et/ou Expires sur 100 % des ressources concernées

---

### Story 2 : Réduction du nombre de requêtes HTTP

**En tant que** utilisateur,

**je veux** que l'application limite le nombre de requêtes nécessaires à l'affichage d'une page,

**afin de** bénéficier d'un chargement plus rapide et d'une consommation énergétique réduite.

- 🎯 Objectif : optimiser les échanges réseau
- 🧱 BP associée : limitation des requêtes HTTP
- 🛠️ KPI : ≤ 40 requêtes HTTP par page

---

### Story 3 : Compression des ressources

**En tant que** utilisateur,

**je veux que** les ressources téléchargées soient compressées,

**afin de** réduire ma consommation de données et accélérer l'affichage des pages.

- 🎯 Objectif : réduire le poids des transferts réseau
- 🧱 BP associée : compression des ressources
- 🛠️ KPI : taux de compression ≥ 95 % des ressources textuelles (HTML, CSS, JS)

---

### Story 4 : Optimisation des images bitmap

**En tant que** utilisateur récurrent,  

**je veux** que les visuels du dashboard soient plus légers  

**afin de** économiser de la data sur mon forfait.

- 🎯 Objectif : 80% des images converties en WebP
- 🧱 BP associée : compression d’images / formats modernes
- 🛠️ KPI : poids total dossier `/assets` < 2 Mo

---

### Story 5 : Utilisation de HTTP/2

**En tant que** utilisateur,

**je veux** que l'application utilise un protocole de communication moderne et performant,

**afin de** bénéficier d'un affichage plus rapide et d'une meilleure expérience de navigation.

- 🎯 Objectif : optimiser les performances réseau
- 🧱 BP associée : utilisation d'HTTP/2 ou supérieur
- 🛠️ KPI : 100 % des échanges réalisés via HTTP/2

---

### Story 6 : Ne pas retailler les images dans le navigateur

**En tant que** utilisateur,

**je veux** que les images téléchargées correspondent à la taille réellement affichée à l'écran,

**afin de** éviter le téléchargement de données inutiles et accélérer l'affichage des pages.

- 🎯 Objectif : limiter les transferts de données superflus
- 🧱 BP associée : adaptation des dimensions des images à leur usage
- 🛠️ KPI : 100 % des images affichées avec des dimensions proches de leurs dimensions téléchargées

---

### Story 7 : Utiliser des polices de caractères standards

**En tant que** utilisateur,

**je veux** que l'application privilégie des polices déjà disponibles sur mon appareil lorsque cela est possible,

**afin de** limiter les téléchargements supplémentaires et accélérer l'affichage du contenu.

- 🎯 Objectif : réduire le poids des ressources externes
- 🧱 BP associée : utilisation de polices système ou standards
- 🛠️ KPI : diminution du nombre et du poids des fichiers de polices téléchargés

---

### Story 8 : Minification des fichiers CSS et JavaScript

**En tant que** utilisateur,

**je veux** que les fichiers CSS et JavaScript soient optimisés avant leur téléchargement,

**afin de** réduire le temps de chargement de l'application.

- 🎯 Objectif : réduire le poids des ressources
- 🧱 BP associée : minification des fichiers statiques
- 🛠️ KPI : 100 % des fichiers CSS et JS distribués en version minifiée
