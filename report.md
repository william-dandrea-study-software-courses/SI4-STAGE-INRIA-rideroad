# Idée de base de SafeCycle

Le projet SafeCycle est un projet Open Source qui a été créé originellement par [Jolivet Raphael](https://raphael-jolivet.name/) et qui est disponible [ici](https://github.com/atelier-des-communs/safecycle)

Le principal objectif de ce projet est de proposer un service de création d'itinéraire pour vélo, dans un environnement serein. Par environnement serein, nous insinuons une application permettant à l'utilisateur de créer son itinéraire à vélo selon les réglages qui l'arrangent.

Certains cycliste font du VTT, d'autres du vélo de route, d'autres personnes veulent juste se promener en famille en privilégiant la sécurité des pistes cyclables. Grâce à SafeCycle, l'utilisateur peut choisir son profil de route, et ainsi préparer son itinéraire au mieux.

# Evolution du projet SafeCycle

La version initiale du projet proposé par Jolivet Raphael générait des itinéraires avec les différents réglages cités dans la section ci-dessus.

Suite à une proposition de stage de [Deantoni Julien](https://www.i3s.unice.fr/~deantoni/), [D'Andréa William](https://github.com/william-dandrea) a été affecté à l'amélioration de ce projet.

L'idée de base, qui était aussi mon sujet de stage, était de
- de créer une navigation guidée du cycliste
- l’ajout de fonctionnalités (e.g., ajout d’étapes, de possibilité de recherche plus fine)
- la possibilité de collaborer plus facilement à la carte
- mettre en place un chaîne de développement DevOps

Nous avons fait le choix, durant le stage, de se concentrer sur quelques features importantes, car, souvent, certains aspects du sujet prenait beaucoup de temps et étaient plus compliqué que prévu.

Nous nous sommes principalement intéressé à :
- Restructurer le projet initial dans une nouvelle architecture.
- Permettre une évolution simple du design front-end en abstrayant la logique métier du code initial.
- Permettre la création d'itinéraires à plusieurs checkpoints
- Rechercher des "points stratégiques" (appelés "amenities") qui sont des points d'eau libre accès, des campings (des endroits utiles pour le cycliste)
- Créer un mode navigation afin de permettre à l'utilisateur de suivre son chemin en temps réel (une sorte de GPS moderne qui nous dit "tourner à droite dans 200m ...")
- Permettre la collaboration des amenities avec OpenStreetMap simplement.
- Mettre en place une architecture DevOps grâce à docker et des scripts permettant un déploiement simple

Nous allons détaillé dans chacune de ces prochaines parties ces différentes étapes, afin de vous permettre de contribuer a ce projet Open Source, en ne perdant pas le temps que j'ai passé a comprendre comment les services utilisé fonctionnent (dans les grandes lignes) ainsi que les défi auxquels nous pouvons être confronté lors de la création d'un système d'itinéraire et de GPS.

Nous allons d'abord commencé ce compte-rendu par une brève présentation des étapes de conceptions, afin de mieux comprendre le processus par lequel je suis passé durant ce stage.

# Brève présentation

### Etape 1
La première étape fut de définir quel spectre nous allions couvrir dans la refonte de SafeCycle, cette étape fut principalement
une tâche de communication entre les parties prenantes du projet afin de cibler les principales features et les principaux
objectifs que nous souhaitions réaliser. Cette étape a déjà été documenté dans la partie "Evolution du projet SafeCycle"

### Etape 2
La seconde étape du projet fut de discuter quelle architecture et quelles technologies nous allions utiliser pour réaliser
au mieux le projet, mais aussi pour le rendre le plus maintenable possible au fil du temps.

### Etape 3
Une fois décidé quelles technologies nous allions utilisé, nous avons commencé par redévelopper la fonctionnalité de recherche 
d'itinéraire en utilisant le service Brouter afin de générer un itinéraire (également un itinéraire multi-étapes), et les 
services d'OpenStreetMap ainsi que de Leaflet afin d'afficher la carte, et l'itinéraire sur la map.

### Etape 4
En complément de l'étape précédente, nous avons développer le système de recherche d'amenities ("points stratégiques" - les aménagements)
grâce au service OpenStreetMap. Ces amenities ont, en suite, été affiché sur la map côté front-end

### Etape 5
Cette étape était consacré au déploiement de l'application sur un serveur de test. Globalement, nous avons essayé de deployer
le projet à plusieurs reprises, mais avec beaucoup d'echec du au manque d'expérience que j'avais à ce moment la. Nous avons donc
passé du temps à déployer le site en production

### Etape 6
Une fois la version initiale déployé, il fut temps de créer la fonctionnalité de navigation en direct. Nous avons du appeler un service 
externe à Brouter pour gérer les données de navigation (le service OSRM)

### Etape 7
La dernière étape fut l'implémentation de la collaboration avec les services d'OpenStreetMap afin de continuer à contribuer
au projet OpenStreetMap par l'intermédiaire d'une application plus simple d'utilisation


# Details techniques

Dans cette section, nous allons présenter les détails techniques relevant des différentes étapes ci-dessus. Nous reviendrons
sur les alternatives envisagées, ainsi que sur les choix techniques retenues, avec une explication de pourquoi nous avons
privilégié un choix plutot qu'un autre. Finalement, nous proposerons une évolution possible relevant de l'expérience 
acquises. 

L'objectif premier de ces détails est, de permettre à 
n'importe qui, de reprendre le travail commencé afin d'enrichir ce projet et le faire perdurer au fil des années. Mais également
de permettre à des personnes rencontrant les problèmes auxquels nous avons été confronté, de comprendre par quels procédés, 
nous les avons résolu sur SafeCycle.

## Choix de l'architecture et des technologies 

#### Architecture globale
Initialement, le projet SafeCycle fut entièrement sur le micro-framework Flask (en python). Ce micro-framework permet
la création d'une interface web en même temps que la création d'une api. En sorte, ce micro-framework permet l'implémentation
du front-end et du back-end au sein du même projet, c'est ce qui était implémenté initialement sur SafeCycle.

Nous avons décidé de séparer la partie front-end et la partie back-end en 2 sous-modules différents pour des raisons simples :
- Rassembler tout un projet au sein d'un même monolithe peut-être dérangeant lorsque des personnes extérieures au projet 
souhaitent y contribuer. En effet, aujourd'hui, de plus en plus de profils développeur sont spécialisé que sur une partie
backend ou frontend, et ils peuvent donc être rapidement perdu lorsque les 2 élements ne sont pas séparer en 2 sous-projets
- Créer une architecture plus claire, indépendante et plus optimisé pour créer une chaîne DevOps. Si ces 2 services 
communiquent via une API, nous pouvons facilement modifier - par exemple - le frontend et le redéployer sans avoir à 
toucher la partie backend
- D'un point de vue plus technique, il est recommandé à l'heure actuelle de séparer en "micro-services" ce que l'on est 
capable de séparer, il nous semblait donc important de continuer sur cette lignée dans la mesure ou nous souhaitions 
améliorer un projet déjà existant.


#### Technologie retenue en partie front-end





