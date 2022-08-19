# RideRoad
Idée de base et evolution de SafeCycle - Résumé - French

Le projet SafeCycle est un projet Open Source qui a été créé originellement par [Jolivet Raphael](https://raphael-jolivet.name/) et qui est disponible [ici](https://github.com/atelier-des-communs/safecycle)

Le principal objectif de ce projet est de proposer un service de création d'itinéraire pour vélo, dans un environnement serein. Par environnement serein, nous insinuons une application permettant à l'utilisateur de créer son itinéraire à vélo, selon les réglages qui l'arrangent.

Certains cyclistes font du VTT, d'autres du vélo de route, d'autres personnes veulent seulement se promener en famille en privilégiant la sécurité des pistes cyclables. Grâce à SafeCycle, l'utilisateur peut choisir son profil de route et ainsi préparer son itinéraire au mieux.

La version initiale du projet proposé par Jolivet Raphael générait des itinéraires avec les différents réglages cités dans la section ci-dessus.

Suite à une proposition de stage de [Deantoni Julien](https://www.i3s.unice.fr/\~deantoni/), [D'Andréa William](https://github.com/william-dandrea) a été affecté à l'amélioration de ce projet, et le projet se nomme désormais RideRoad afin de donner une visibilité aux 2 projets (SafeCycle et RideRoad)

L'idée de base, qui était aussi mon sujet de stage, était de

- de créer une navigation guidée du cycliste
- l’ajout de fonctionnalités (e.g., ajout d’étapes, de possibilité de recherche plus fine)
- la possibilité de collaborer plus facilement à la carte
- mettre en place une chaîne de développement DevOps


# Accès à RideRoad

Vous pouvez accéder au service RideRoad [ici](rideroad.dandrea-william.fr). 

# Comment contribuer

Vous pouvez voir la liste des choses à implémenter dans les issues de ce répertoire, et forker ce repository et ensuite
nous soumettre une pull-request. 

Vous pouvez également ouvrir une nouvelle pull-request en mentionnant un bug ou une feature que vous souhaitez ajouter

# Deploiement de RideRoad

Le service RideRoad a été entierement conteneurisé grace à Docker, vous pouvez retrouver 2 DockerFile situé dans 
`client/safecycle-client/Dockerfile` et dans `server/safecycle_server/Dockerfile`

Ces 2 dockers sont fait de telle manière à que 
* `safecycle_client` écoute le port 80 (port HTML par défault), pour le modifier :
  * Modifier le port dans le fichier `client/safecycle-client/Dockerfile` au niveau du `EXPOSE 80`
  * Modifier le port dans le fichier `client/safecycle-client/nginx.conf` au niveau du `listen 80`
* `safecycle_server` écoute le port 8080
  * Modifier le port dans le fichier `server/safecycle_server/Dockerfile` au niveau du `EXPOSE 8080`
  * Modifier le port dans le fichier `server/safecycle_server/entrypoint.sh` au niveau du `gunicorn safecycle_server.wsgi:application --bind 0.0.0.0:8080`


Nous avons également préparer un fichier `docker-compose.yml` qui vous permettra de déployer plus facilement les images
sur un serveur. Nous vous recommandons de l'adapter à vos ports ouverts.

