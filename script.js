// Définition du fond de carte (chemin vers mapbox)
mapboxgl.accessToken = 'pk.eyJ1IjoiZGNyb2NvIiwiYSI6ImNsc2tkdDhtMTAyaGYyd253c2I5Z3hrc2UifQ.5BLIcpfsRJ5OpRYex0y6PQ';

// Ajout de la carte
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/momo4/clv2kp13600bz01qpdlzt1l9c', // Fond de carte
    center: [-2.9205663298399966, 48.21422772374418], // lat/long 48.855396472127794, 2.345032229371638
    zoom: 7, // zoom
    pitch: 0, // Inclinaison
    bearing: 0, // Rotation
    customAttribution: '<a href="https://rbu.jimdo.com//">Réseau Bretagne Urgence</a>'
});


// Configuration des fonctions

// Boite de recherche d'adresses créée par Mapbox et accessible via leur site qui permet d'avoir accès à la base d'adresse nationale
var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken, //chemin vers mapbox
    mapboxgl: mapboxgl,
    container: 'contener'
});
map.addControl(geocoder);

// Fonction pour calculer et afficher l'isochrone
function calculateIsochrone(center, minutes) {
    fetch('https://api.mapbox.com/isochrone/v1/mapbox/driving/' + center.join(',') + '?contours_minutes=' + minutes + '&polygons=true&access_token=' + mapboxgl.accessToken)
        .then(response => response.json())
        .then(data => {
            // Supprimer la couche d'isochrone existante s'il y en a une
            if (map.getSource('isochrone')) {
                map.removeLayer('isochrone');
                map.removeSource('isochrone');
            }
            // Ajouter la nouvelle couche d'isochrone
            map.addLayer({
                id: 'isochrone',
                type: 'fill',
                source: {
                    type: 'geojson',
                    data: data
                },
                paint: {
                    'fill-color': '#f00',
                    'fill-opacity': 0.5
                }
            });
        });
}

// Utilisation de la fonction calculateIsochrone lorsque l'adresse est sélectionnée
geocoder.on('result', function(ev) {
    var center = ev.result.center; // Centre de l'adresse sélectionnée
    var selectedTime = document.getElementById('isochrone-time-select').value;
    calculateIsochrone(center, selectedTime);
});

// Événement de changement de temps dans la menu déroulante de configuration
document.getElementById('isochrone-time-select').addEventListener('change', function() {
    var selectedTime = this.value;
    var selectedAddress = geocoder.getSelectedItem();
    if (selectedAddress) {
        var center = selectedAddress.geometry.coordinates;
        calculateIsochrone(center, selectedTime);
    }
});

// Supprimer l'isochrone lorsque l'adresse est désélectionnée
geocoder.on('clear', function() {
    if (map.getSource('isochrone')) {
        map.removeLayer('isochrone');
        map.removeSource('isochrone');
    }
});

//isochrones pour le menu deroulant QUOI?
var params = document.getElementById('params');
var urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/';
var lon = -1.68;
var lat = 48.12;
var profile = 'driving';
var minutes = 30;
// var minutes = 45;
// var minutes = 60;


// Ajout des données grâce à la fonction map.on 
// Les 3 principaux jeux de données: SMUR, SAMU et SAU
map.on ('load', function() {
    
  //Ajout des contours de la Bretagne
  map.addSource('Contours', {
    'type': 'geojson',
    'data': './DATA/contour_bretagneok.geojson'
  });

  map.addLayer({
    'id': 'Contours',
    'type': 'line',
    'source': 'Contours',
    'paint': {
      'line-color': 'black',
      'line-width': 0.3
    }
  });

  //Ajout des territoires de Santé 
  map.addSource('TerritoiresSA', {
    'type': 'geojson',
    'data': './DATA/territoire_santeok.geojson'
  });

  map.addLayer({
    'id': 'TerritoiresSA',
    'type': 'line',
    'source': 'TerritoiresSA', 
    'paint' : {
      'line-color': 'grey',
      'line-width' : 0.1
    }
  });

  //ajout des routes
  map.addSource('mapbox-streets-v8', {
    type: 'vector',
    url: 'mapbox://mapbox.mapbox-streets-v8'
  });        
  
  map.addLayer({
    "id": "routes",
    "type": "line",
    "source": "mapbox-streets-v8",
    "source-layer": "road",
    "filter": ["all",  ["in", "class", "primary", "motorway", "secondary", "trunk", "tertiary"]],        
    "layout": {'visibility': 'visible'},
    'paint': {'line-color': [
	    'match',['get', 'class'],
      'motorway', '#E990A0',
      'primary', '#FDD7A1',
      'secondary', '#FDD7A1',
      'tertiary', '#FEFEFE',
      'trunk', '#FBC0AC',
      '#A5A9B0'], 'line-width' : 1.5,
    }
  });

  //Ajout des SMUR
  map.addSource('source_SMUR', {
    'type': 'geojson',
    'data': './DATA/smurok.geojson'
  });
  
  //Icones des points SMUR
  map.loadImage('./DATA/SMUR.png', function(error, image) {
    if (error) throw error;
    map.addImage('custom-marker-1', image);
  });
  map.loadImage('./DATA/SMUR_limitrophes.png', function(error, image) {
    if (error) throw error;
    map.addImage('custom-marker-2', image);
  });
  map.loadImage('./DATA/Dragon.png', function(error, image) {
    if (error) throw error;
    map.addImage('custom-marker-3', image);
  });
  map.loadImage('./DATA/HélicoD.png', function(error, image) {
    if (error) throw error;
    map.addImage('custom-marker-4', image);
  });

  //Chargement de la couche SMUR
  map.addLayer({
    'id': 'SMUR',
    'type': 'symbol',
    'source': 'source_SMUR',
    'layout': {
      'icon-image': ['match', ['get', 'field_1'], 
                     'SMUR Bretagne', 'custom-marker-1', 
                     'SMUR Limitrophes', 'custom-marker-2',
                     'HélicoD', 'custom-marker-3',
                     'Hélico', 'custom-marker-4',
                     'default-marker'],
      'icon-size': 0.8,
      'icon-allow-overlap': true,
      'visibility': 'visible'
    } 
  });

  //Ajout des SAMU 
  map.addSource('source_SAMU', {
    'type': 'geojson',
    'data': './DATA/samuok.geojson'
  });

  map.loadImage('./DATA/SAMU.png', function(error, image) {
    if (error) throw error;
    map.addImage('custom-marker', image);
  });

  map.addLayer({
    'id': 'SAMU',
    'type': 'symbol',
    'source': 'source_SAMU',
    'layout': {
      'icon-image': 'custom-marker',
      'icon-size': 0.8,
      'icon-allow-overlap': true,
      'visibility': 'none'
    }
  });

  //Ajout des SAU bretons
  map.addSource('source_SAU', {
    'type': 'geojson',
    'data': './DATA/sauok.geojson'
  });

  map.loadImage('./DATA/SAU_privé.png', function(error, image) {
    if (error) throw error;
    map.addImage('custom-marker-a', image);
  });
  map.loadImage('./DATA/SAU_public.png', function(error, image) {
    if (error) throw error;
    map.addImage('custom-marker-b', image);
  });
  map.loadImage('./DATA/SAU_militaire.png', function(error, image) {
    if (error) throw error;
    map.addImage('custom-marker-c', image);
  });

  map.addLayer({
    'id': 'SAU',
    'type': 'symbol',
    'source': 'source_SAU',
    'layout': {
      'icon-image': ['match', ['get', 'Statut'], 
                     'privé', 'custom-marker-a', 
                     'public', 'custom-marker-b',
                     'militaire', 'custom-marker-c',
                     'default-marker'], 
      'icon-size': 0.7,
      'icon-allow-overlap': true,
      'visibility': 'none'
    }
  });

  //Ajout des SAU limitrophes
  map.addSource('source_SAUlim', {
    'type': 'geojson',
    'data': './DATA/sau_limitrook.geojson'
  });

  map.addLayer({
    'id': 'SAU_lim',
    'type': 'symbol',
    'source': 'source_SAU2',
    'layout': {
      'icon-image': ['match', ['get', 'Statut'], 
                     'privé', 'custom-marker-a', 
                     'public', 'custom-marker-b',
                     'militaire', 'custom-marker-c',
                     'default-marker'], 
      'icon-size': 0.7,
      'icon-allow-overlap': true,
      'visibility': 'none'
    }
  });

  // Ajout isochrone pour le menu deroulant 
  map.addSource('iso', {
    type: 'geojson',
    data: {
    'type': 'FeatureCollection',
    'features': []}
  });
  
  //Ajout du contour de l'isochrone
  map.addLayer({
    'id': 'isoLayer',
    'type': 'line',
    'source': 'iso',
    'layout': {},
    'paint': {
      'line-color': '#000000',
      'line-width': 0
    }
  },
  'poi-label'
  );
    
  //Ajout de la couche polygon de l'isochrone
  map.addLayer({
    'id': 'isoLayerfill',
    'type': 'fill',
    'source': 'iso',
    'layout': {},
    'paint': {
      'fill-color': '#f00',
      'fill-opacity': 0.5
    }
  },
  'poi-label'
  );
  
  // Fonction pour appeler API iso
  getIso();
});


map.on('load', () => {
  // Fonctions pour les isochrones des SMUR
  // Fonction pour gérer la sélection d'un SMUR
  function selectHospital(hospitalName) {
    // Récupérer les valeurs sélectionnées pour le profil et la durée
    var selectedProfile = document.querySelector('input[name="profile"]:checked').value;
    var selectedDuration = document.querySelector('input[name="duration"]:checked').value;
    // Vous pouvez ici utiliser les valeurs sélectionnées pour déterminer l'appel à votre API d'isochrone
    console.log("Profil sélectionné :", selectedProfile);
    console.log("Durée sélectionnée :", selectedDuration);
    console.log("SMUR sélectionné :", hospitalName);
    // Ajoutez votre logique pour appeler l'API d'isochrone avec les valeurs sélectionnées
  }

  // Ajoutez un événement "click" à chaque élément de la liste des SMUR pour gérer la sélection
  var hospitals = document.querySelectorAll('.dropdown-content .hospital');
  hospitals.forEach(function(hospital) {
    hospital.addEventListener('click', function() {
      selectHospital(hospital.textContent);
    });
  });

  //SMUR iso
  function toggleDropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
  }

  // Fermer le bouton déroulant si l'utilisateur clique en dehors de celui-ci (iso SMUR)
  window.onclick = function(event) {
      if (!event.target.matches('.dropbtn')) {
          var dropdowns = document.getElementsByClassName("dropdown-content");
          var i;
          for (i = 0; i < dropdowns.length; i++) {
              var openDropdown = dropdowns[i];
              if (openDropdown.classList.contains('show')) {
                  openDropdown.classList.remove('show');
              }
          }
      }
  }
});

// Fonction charger les données des SAMU
function fetchSAMU() {
  fetch('./DATA/samuok.geojson')
    .then(response => response.json())
    .then(data => {
      const features = data.features;
      // Trier les fonctionnalités en fonction du champ 'Ville'
      features.sort((a, b) => a.properties.Etablissement.localeCompare(b.properties.Etablissement));
      // Une fois les données récupérées avec succès, appeler la fonction pour générer les options du menu déroulant
      generateDropdownOptions(features);
    })
    .catch(error => {
      console.error('Une erreur s est produite lors de la récupération des données:', error);
    });
}
// Appeler la fonction pour récupérer les données de la couche "SAMU"
fetchSAMU();

// Fonction charger les données des SAU
function fetchSAU() {
  fetch('./DATA/sauok.geojson')
    .then(response => response.json())
    .then(data => {
      const features = data.features;
      // Trier les fonctionnalités en fonction du champ 'Ville'
      features.sort((a, b) => a.properties.Etablissement.localeCompare(b.properties.Etablissement));
      // Une fois les données récupérées avec succès, appeler la fonction pour générer les options du menu déroulant
      generateDropdownOptions(features);      
    })
    .catch(error => {
      console.error('Une erreur s est produite lors de la récupération des données:', error);
    });
}
// Appeler la fonction pour récupérer les données de la couche "SAU"
fetchSAU();

// Fonction charger les données des SMUR
function fetchSMUR() {
  fetch('./DATA/smurok.geojson')
    .then(response => response.json())
    .then(data => {
      const features = data.features;
      // Trier les fonctionnalités en fonction du champ 'Ville'
      features.sort((a, b) => a.properties.Ville.localeCompare(b.properties.Ville));
      // Une fois les données récupérées avec succès, appeler la fonction pour générer les options du menu déroulant
      generateDropdownOptions(features);      
    })
    .catch(error => {
      console.error('Une erreur s est produite lors de la récupération des données:', error);
    });
}
// Appeler la fonction pour récupérer les données de la couche "SAU"
fetchSMUR();

// Récupérer la source GeoJSON pour la couche SAMU
const samuSource = map.getSource('SAMU');

// Vérifier si la source existe
if (samuSource) {
  const samuData = samuSource.get('Etablissement'); // Récupérer les données GeoJSON de la source
  const listeRBU = document.getElementById('listeRBU');  // Récupérer l'élément HTML de la liste des couches
  const samuFieldset = listeRBU.querySelector('.SAMU');  // Récupérer l'élément HTML du champset SAMU
  const samuContainer = samuFieldset.querySelector('div');  // Récupérer l'élément HTML du conteneur des checkboxes SAMU
  // Parcourir les fonctionnalités de la couche SAMU
  samuData.features.forEach(feature => {
    const checkbox = document.createElement('input');  // Créer un élément HTML pour la checkbox
    checkbox.type = 'checkbox';
    checkbox.id = `samu-${feature.properties.Etablissement}`;
    checkbox.value = feature.properties.Etablissement;
    checkbox.onchange = () => switchlayer(`SAMU-${feature.properties.Etablissement}`);
    const label = document.createElement('label');  // Créer un élément HTML pour le libellé de la checkbox
    label.htmlFor = `samu-${feature.properties.Etablissement}`;
    label.textContent = feature.properties.Etablissement;
    samuContainer.appendChild(checkbox);  // Ajouter la checkbox et son libellé au conteneur des checkboxes SAMU
    samuContainer.appendChild(label);
  });
}

//Fonction permettant de cliquer sur la couche pour qu'elle apparait
switchlayer = function (lname) {
  if (document.getElementById(lname + "CB").checked) {
     map.setLayoutProperty(lname, 'visibility', 'visible');
  } else {
     map.setLayoutProperty(lname, 'visibility', 'none');
  }
}



// //popup SMUR
// map.on('click', 'SMUR', function (e) {
//   var coordinates = e.features[0].geometry.coordinates.slice();
//   var description = e.features[0].properties.description;
//   var nomSMUR = e.features[0].properties.name; 
//   var telephone = e.features[0].properties.phone; 
//   var site_web = e.features[0].properties.website;
//   var displaySiteWeb = site_web.length > 20 ? site_web.substring(0, 20) + "..." : site_web; /* Le lien hypertexte mais raccourci*/
  
//   // Créez le contenu HTML pour le popup
//   var popupContent = "<div class='popup'>";
//   popupContent += "<h3>" + nomSMUR + "</h3>";
//   popupContent += "<p class='info'>Téléphone : " + telephone +"</p>";
//   popupContent += "<p class='info'>Site Web : <a href='" + site_web + "' target='_blank'>" + displaySiteWeb + "</a></p>";
//   popupContent += "</div>";

//   // Créez une popup et attachez-la à l'élément cliqué
//   new mapboxgl.Popup()
//     .setLngLat(coordinates)
//     .setHTML(popupContent)
//     .addTo(map);
// });



// Bouton permettant de calculer les isochrones sur les SMUR
// Fonction pour charger les données des SMUR 
function fetchSMURiso() {
  fetch('./DATA/smurok.geojson')
    .then(response => response.json())
    .then(data => {
      const features = data.features;

      // Trier les fonctionnalités en fonction du champ 'Ville'
      features.sort((a, b) => a.properties.Ville.localeCompare(b.properties.Ville));

      // Une fois les données récupérées avec succès, appeler la fonction pour générer les options du menu déroulant
      generateDropdownOptionsIso(features);
    })
    .catch(error => {
      console.error('Une erreur s est produite lors de la récupération des données:', error);
    });
}
// Appeler la fonction pour récupérer les données de la couche "SMUR"
fetchSMURiso();

// Fonction pour générer les options du menu déroulant à partir des données
function generateDropdownOptionsIso(features) {
  // Récupérer le conteneur du menu déroulant
  var dropdownContent = document.getElementById("myDropdown");
  // Parcourir les données
  features.forEach(feature => {
    // Créer une option pour chaque élément
    var option = document.createElement("a");
    option.href = "#"; // Vous pouvez configurer l'URL appropriée ici si nécessaire
    option.textContent = feature.properties.Ville; // Utiliser la valeur du champ 'nom' de chaque feature
    // Ajouter un gestionnaire d'événements pour le clic sur chaque option
    option.addEventListener("click", function() {
      // Récupérer les coordonnées de la fonctionnalité
      var coordinates = feature.geometry.coordinates;
      // Appeler la fonction pour créer un isochrone pour cet emplacement
      createIsochrone(coordinates);
    });
    // Ajouter l'option au menu déroulant
    dropdownContent.appendChild(option);
  });
}

// Fonction pour créer un isochrone pour un emplacement donné
async function createIsochrone(coordinates) {
  const lon = coordinates[0];
  const lat = coordinates[1];
  // Appeler la fonction getIso avec les coordonnées fournies
  await getIso(lon, lat);
}

// Modifier la fonction getIso pour accepter les coordonnées comme arguments
async function getIso(lon, lat) {
  const query = await fetch(
    `${urlBase}${profile}/${lon},${lat}?contours_minutes=${minutes}&polygons=true&access_token=${mapboxgl.accessToken}`,
    { method: 'GET' }
  );
  const data = await query.json();
  // Set the 'iso' source's data to what's returned by the API query
  map.getSource('iso').setData(data);
}

// Fonction pour mettre à jour les isochrones avec la nouvelle valeur de minutes
async function updateIsochrone() {
  // Récupérer les coordonnées du site olympique sélectionné
  const lon = feature.SMUR.geo_point.lon;
  const lat = feature.SMUR.geo_point.lat;
  // Appeler la fonction getIso avec les nouvelles valeurs de lon, lat et minutes
  await getIso(lon, lat);
}

// Fonction pour afficher ou masquer le menu déroulant des isochrones SMUR
function toggleDropdown() {
  var dropdownContent = document.getElementById("myDropdown");
  dropdownContent.classList.toggle("show");
}
