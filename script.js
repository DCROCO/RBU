///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// DEFINITION DE LA CARTE /////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////

// Chemin vers mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoiZGNyb2NvIiwiYSI6ImNsc2tkdDhtMTAyaGYyd253c2I5Z3hrc2UifQ.5BLIcpfsRJ5OpRYex0y6PQ';

// Ajout de la carte
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/momo4/clv2kp13600bz01qpdlzt1l9c', // Fond de carte
    center: [-2.9205663298399966, 48.21422772374418], // lat/long 48.855396472127794, 2.345032229371638
    zoom: 7, // zoom
    pitch: 0, // Inclinaison
    bearing: 0, // Rotation
    customAttribution: '<a href="https://rbu.jimdo.com//">Réseau Bretagne Urgences</a>'
});


///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// AJOUT DES DONNEES //////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////

// Les 3 principaux jeux de données: smur, SAMU et sau
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
      'line-color': '#292929',
      'line-width': 0.6
    }
  });

  //Ajout des territoires de Santé 
  map.addSource('source_TS', {
    'type': 'geojson',
    'data': './DATA/territoire_sante.geojson'
  });

  map.addLayer({
    'id': 'TerritoiresSA',
    'type': 'line',
    'source': 'source_TS', 
    'paint' : {
      'line-color': '#7CB254',
      'line-width' : 0.2
    },
    'layout': {
      'visibility': 'none'
    }
  });

  //Ajout des départements
  map.addSource('source_dep', {
    'type': 'geojson',
    'data': './DATA/departement.geojson'
  });

  map.addLayer({
    'id': 'dep',
    'type': 'line',
    'source': 'source_dep', 
    'paint' : {
      'line-color': '#E0A419',
      'line-width' : 0.4
    },
    'layout': {
      'visibility': 'none'
    }
  });

  //ajout des routes
  map.addSource('source_routes', {
    type: 'vector',
    url: 'mapbox://mapbox.mapbox-streets-v8'
  });        
  
  map.addLayer({
    "id": "routes",
    "type": "line",
    "source": "source_routes",
    "source-layer": "road",
    "filter": ["all",  ["in", "class", "primary", "motorway", "secondary", "trunk", "tertiary"]],        
    "layout": {'visibility': 'none'},
    'paint': {'line-color': [
	    'match',['get', 'class'],
      'motorway', '#E990A0',
      'primary', '#E990A0',
      'secondary', '#F7B4C0',
      'tertiary', '#F7B4C0',
      'trunk', '#E990A0',
      '#F7B4C0'], 
    'line-width' : 1,
    'line-opacity': 0.5
    }
  });

  //Ajout des iscohrones 30min autour des SMUR terrestres
  map.addSource('source_iso30', {
    'type': 'geojson',
    'data': './DATA/isochrones30_SMUR.geojson'
  });

  map.addLayer({
    'id': 'iso30',
    'type': 'fill',
    'source': 'source_iso30', 
    'paint' : {
      'fill-color' : '#F7ED55',
      'fill-opacity': 0.5, 
      'line-color' : '#282DD7',
      'line-width': 2
    },
    'layout': {
      'visibility': 'none'
    }
  });

  //Ajout des smur
  map.addSource('source_smur', {
    type: 'geojson',
    data: './DATA/smurok.geojson'
  });

  //Icones des points smur
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
  map.loadImage('./DATA/HéliSMUR.png', function(error, image) {
    if (error) throw error;
    map.addImage('custom-marker-4', image);
  });

  // chargement des données smurs
  map.addLayer({
    'id': 'smur',
    'type': 'symbol',
    'source': 'source_smur',
    'layout': {
      'icon-image': ['match', ['get', 'field_1'], 
                    'SMUR Bretagne', 'custom-marker-1', 
                    'SMUR Limitrophes', 'custom-marker-2',
                    'Dragon', 'custom-marker-3',
                    'HéliSMUR', 'custom-marker-4',
                    'default-marker'],
      'icon-size': 0.9,
      'icon-allow-overlap': true,
      'visibility': 'visible'
    }
  });


  //Ajout des sau bretons
  map.addSource('source_sau', {
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
    'id': 'sau',
    'type': 'symbol',
    'source': 'source_sau',
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

  //Ajout des iscohrones 30min autour des héliSMUR
  map.addSource('source_heliiso30', {
    'type': 'geojson',
    'data': './DATA/isochrones30_heliSMUR.geojson'
  });

  map.addLayer({
    'id': 'heliiso30',
    'type': 'fill',
    'source': 'source_heliiso30', 
    'layout': {
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
      'line-color': '#f2a221',
      'line-width': 0.6
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
      'fill-color': '#f2a221',
      'fill-opacity': 0.6
    }
  },
  'poi-label'
  );
  
  // Fonction pour appeler API iso
  getIso();
});



///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// CODE CREATION LISTE DYNAMIQUE  ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////

map.on('load', () => {
  // Fermer le bouton déroulant si l'utilisateur clique en dehors de celui-ci (iso smur)
  window.onclick = function(event2) {
      if (!event2.target.matches('.droplist')) {
          var layerList = document.getElementsByClassName("hiddenList");
          var i;
          for (i = 0; i < layerList.length; i++) {
              var openlayerList = layerList[i];
              if (openlayerList.classList.contains('show2')) {
                  openlayerList.classList.remove('show2');
              }
          }
      }
  }
    // Appel de la fonction pour afficher/masquer la liste déroulante
    toggleLayerList();
}); 

// Fonction pour basculer l'affichage de la liste déroulante
function toggleLayerList() {
  const layerListContent = document.getElementById("layerListContent");
  layerListContent.classList.toggle("hiddenList");
}

///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// CODE AFFICHE TOUTES LES COUCHES  //////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////

// Afficher/masquer tous les SMUR
const smurCheckbox = document.getElementById("smurLayer");
smurCheckbox.addEventListener("change", function () {
  const visible = smurCheckbox.checked;
  toggleLayer('smur', visible);
});

// Afficher/masquer tous les sau
const sauCheckbox = document.getElementById("sauLayer");
sauCheckbox.addEventListener("change", function () {
  const visible = sauCheckbox.checked;
  toggleLayer('sau', visible);
});

// Afficher/masquer les territoires de santé
const TSCheckbox = document.getElementById("tsLayer");
TSCheckbox.addEventListener("change", function () {
  const visible = TSCheckbox.checked;
  toggleLayer('TerritoiresSA', visible);
});

// Afficher/masquer les départements
const DepCheckbox = document.getElementById("depLayer");
DepCheckbox.addEventListener("change", function () {
  const visible = DepCheckbox.checked;
  toggleLayer('dep', visible);
});

// Afficher/masquer les routes
const routesCheckbox = document.getElementById("routesLayer");
routesCheckbox.addEventListener("change", function () {
  const visible = routesCheckbox.checked;
  toggleLayer('routes', visible);
});

// Afficher/masquer les isochrones SMUR terrestres
const smurisoCheckbox = document.getElementById("smurisoLayer");
smurisoCheckbox.addEventListener("change", function () {
  const visible = smurisoCheckbox.checked;
  toggleLayer('iso30', visible);
});

// Fonction pour activer la checkbox des couches
function toggleLayer(layerId, visible) {
  const layer = map.getLayer(layerId);
  if (layer) {
    const newVisibility = visible ? 'visible' : 'none';
    map.setLayoutProperty(layerId, 'visibility', newVisibility);
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// CODE POUR LISTER TOUS LES SMUR ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////

// Récupérez l'URL du fichier GeoJSON à partir de l'objet source SMUR
const smurUrl = './DATA/smurok.geojson';

// Utilisez la fonction fetch() pour récupérer les données SMUR à partir de l'URL
document.addEventListener('DOMContentLoaded', function() {
  fetch(smurUrl)
  .then((response) => response.json())
  .then((data) => {
    smurData = data;
    // Trier les fonctionnalités en fonction du champ 'SMUR'
    data.features.sort((a, b) => a.properties.SMUR.localeCompare(b.properties.SMUR));
    generatevehismurOptions(smurData);
    generatevehismurlimOptions(smurData);
    generatehelismurOptions(smurData);
  })
  .catch((error) => {
    console.error(error);
  });
});

// Fonction pour générer les options du menu déroulant pour la liste des véhicules SMUR de Bretagne
function generatevehismurOptions(data) {
  const smurListe = document.getElementById("vehismurList");
  data.features.forEach(feature => {
    if (feature.properties.fid != null && feature.properties.field_1 === 'SMUR Bretagne') { 
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `smur-${feature.properties.fid}`;
      checkbox.onchange = () => togglesmur(`smur-${feature.properties.fid}`, checkbox.checked);
      const label = document.createElement("label");
      label.htmlFor = `smur-${feature.properties.fid}`;
      label.textContent = capitalizeFirstLetter(feature.properties.SMUR.toLowerCase());
      smurListe.appendChild(checkbox);
      smurListe.appendChild(label);
      smurListe.appendChild(document.createElement("br"));
    }
  });
}

// Fonction pour générer les options du menu déroulant pour la liste des véhicules SMUR de Bretagne
function generatevehismurlimOptions(data) {
  const smurListe = document.getElementById("vehismurlimList");
  data.features.forEach(feature => {
    if (feature.properties.fid != null && feature.properties.field_1 === 'SMUR Limitrophes') { 
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `smur-${feature.properties.fid}`;
      checkbox.onchange = () => togglesmur(`smur-${feature.properties.fid}`, checkbox.checked);
      const label = document.createElement("label");
      label.htmlFor = `smur-${feature.properties.fid}`;
      label.textContent = capitalizeFirstLetter(feature.properties.SMUR.toLowerCase());
      smurListe.appendChild(checkbox);
      smurListe.appendChild(label);
      smurListe.appendChild(document.createElement("br"));
    }
  });
}

// Fonction pour générer les options du menu déroulant pour la liste des héliSMUR
function generatehelismurOptions(data) {
  const smurListe = document.getElementById("helismurList");
  data.features.forEach(feature => {
    if (feature.properties.fid != null && (feature.properties.field_1 === 'Dragon' || feature.properties.field_1 === 'HéliSMUR')) { 
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `smur-${feature.properties.fid}`;
      checkbox.onchange = () => togglesmur(`smur-${feature.properties.fid}`, checkbox.checked);
      const label = document.createElement("label");
      label.htmlFor = `smur-${feature.properties.fid}`;
      label.textContent = capitalizeFirstLetter(feature.properties.SMUR.toLowerCase());
      smurListe.appendChild(checkbox);
      smurListe.appendChild(label);
      smurListe.appendChild(document.createElement("br"));
    }
  });
}


// Stocker le niveau de zoom initial de la carte
const initialZoom = map.getZoom();
// Tableau pour stocker les identifiants des couches SMUR sélectionnées
let selectedSmurLayers = [];
// Tableau pour stocker les identifiants des couches d'isochrones associées à chaque SMUR terrestres
let selectedIsochroneLayers = {};
// Tableau pour stocker les identifiants des couches d'isochrones associées à chaque SMUR hélicoptés
let selectedIsochroneHeliLayers = {};

// Fonction pour afficher/masquer un SMUR spécifique
function togglesmur(smurId, visible) {
  const fid = parseInt(smurId.split('-')[1]);
  const feature = smurData.features.find(f => f.properties.fid === fid);

  if (visible && feature) {
    const filter = ['==', 'fid', fid];
    
    // Vérifier la valeur de field_1 pour définir le style de l'icône
    let iconImage = 'default-marker';
    switch (feature.properties.field_1) {
      case 'SMUR Bretagne':
        iconImage = 'custom-marker-1';
        break;
      case 'SMUR Limitrophes':
        iconImage = 'custom-marker-2';
        break;
      case 'Dragon':
        iconImage = 'custom-marker-3';
        break;
      case 'HéliSMUR':
        iconImage = 'custom-marker-4';
        break;
      default:
        iconImage = 'default-marker';
        break;
    }

    // Charger et filtrer la couche "isochrones30_SMUR" ou "isochrones_heliSMUR_30min" selon le type de SMUR
    const ville = feature.properties.Ville;
    const smur = feature.properties.SMUR;
    const isochroneLayerId = 'iso30_' + smurId;
    
    if (feature.properties.field_1 === 'SMUR Bretagne' ||feature.properties.field_1 === 'SMUR Limitrophes'){ 
      if (!selectedIsochroneLayers[smurId]) {
        // Si la couche d'isochrone n'est pas déjà chargée
        if (!map.getLayer(isochroneLayerId)) {
          map.addLayer({
            'id': isochroneLayerId,
            'type': 'fill',
            'source': 'source_iso30',
            'paint': {
              'fill-color': '#F7ED55', // Couleur de remplissage de l'isochrone
              'fill-opacity': 0.5
            },
            'filter': ['==', 'layer', ville] // Filtrer sur le champ "layer" égal à la ville du SMUR sélectionné
          });
        } else {
          // Si la couche est déjà chargée, assurez-vous qu'elle est visible
          map.setLayoutProperty(isochroneLayerId, 'visibility', 'visible');
        }
        // Stocker l'ID de la couche d'isochrone associée à ce SMUR
        selectedIsochroneLayers[smurId] = isochroneLayerId;
        // Déplacer la carte vers les coordonnées du SMUR
        map.flyTo({
          center: feature.geometry.coordinates,
          zoom: 9, // Zoom désiré
          speed: 0.75, // Vitesse de déplacement
          essential: true // Animation "fly to" essentielle
        });        
      } else {
        // Si la couche d'isochrone est déjà chargée, assurez-vous qu'elle est visible
        map.setLayoutProperty(selectedIsochroneLayers[smurId], 'visibility', 'visible');
      }

    } else if (feature.properties.field_1 === 'Dragon' || feature.properties.field_1 === 'HéliSMUR'){
      if (!selectedIsochroneHeliLayers[smurId]) {
        // Si la couche d'isochrone n'est pas déjà chargée
        const isochroneHeliLayerId = 'iso30_' + smurId;
        if (!map.getLayer(isochroneHeliLayerId)) {
          map.addLayer({
            'id': isochroneHeliLayerId,
            'type': 'fill',
            'source': 'source_heliiso30',
            'paint': {
              'fill-color': '#F7ED55', // Couleur de remplissage de l'isochrone
              'fill-opacity': 0.5
            },
            'filter': ['==', 'SMUR', smur] // Filtrer sur le champ "layer" égal à la ville du SMUR sélectionné
          });
        } else {
          // Si la couche est déjà chargée, assurez-vous qu'elle est visible
          map.setLayoutProperty(isochroneHeliLayerId, 'visibility', 'visible');
        }
        // Déplacer la carte vers les coordonnées du SMUR
        map.flyTo({
          center: feature.geometry.coordinates,
          zoom: 8, // Zoom désiré
          speed: 0.75, // Vitesse de déplacement
          essential: true // Animation "fly to" essentielle
        });
        // Stocker l'ID de la couche d'isochrone associée à ce SMUR
        selectedIsochroneHeliLayers[smurId] = isochroneHeliLayerId;
      } else {
        // Si la couche d'isochrone est déjà chargée, assurez-vous qu'elle est visible
        map.setLayoutProperty(selectedIsochroneHeliLayers[smurId], 'visibility', 'visible');
      }
    }
    
    // Stocker l'ID de la couche SMUR spécifique
    selectedSmurLayers[smurId] = smurId;


    // Ajouter la couche SMUR spécifique si elle n'est pas déjà ajoutée
    if (!map.getLayer(smurId)) {
      map.addLayer({
        'id': smurId,
        'type': 'symbol',
        'source': 'source_smur',
        'layout': {
          'icon-image': iconImage,
          'icon-size': 0.9,
          'icon-allow-overlap': true,
          'visibility': 'visible' 
        },
        'filter': filter
      });
    } else {
      // Si la couche existe déjà, assurez-vous qu'elle est visible
      map.setLayoutProperty(smurId, 'visibility', 'visible');
    }

  } else {
    // Si la couche SMUR spécifique est décochée, masquer et retirer la couche SMUR
    map.setLayoutProperty(smurId, 'visibility', 'none');
    if (selectedSmurLayers[smurId]) {
      delete selectedSmurLayers[smurId];
    }

    // Si la couche d'isochrone associée à ce SMUR est décochée, masquer et retirer la couche d'isochrone
    if (selectedIsochroneLayers[smurId]) {
      map.setLayoutProperty(selectedIsochroneLayers[smurId], 'visibility', 'none');
      map.removeLayer(selectedIsochroneLayers[smurId]);
      delete selectedIsochroneLayers[smurId];
    }
    // Si la couche d'isochrone associée à ce SMUR est décochée, masquer et retirer la couche d'isochrone
    if (selectedIsochroneHeliLayers[smurId]) {
      map.setLayoutProperty(selectedIsochroneHeliLayers[smurId], 'visibility', 'none');
      map.removeLayer(selectedIsochroneHeliLayers[smurId]);
      delete selectedIsochroneHeliLayers[smurId];
    }
    
    // Supprimer les identifiants de couche SMUR spécifique
    delete selectedSmurLayers[smurId];

    // Revenir au zoom initial
    map.flyTo({
      zoom: initialZoom, // Utiliser le zoom initial
      essential: true // Animation "fly to" essentielle
    });
  }
}




///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// CODE POUR CALCULER LA COUVERTURE DES SMUR //////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////




// appel de la liste quand on clique sur le bouton
function toggleDropdownIso() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Fonction pour générer les options du menu déroulant à partir des données
function generateDropdownOptionsIso(data) {
  // Récupérer le conteneur du menu déroulant
  var dropdownContent = document.getElementById("myDropdown");
  // Parcourir les données
  data.features.forEach(feature => {
    // Créer une option pour chaque élément
    var option = document.createElement("a");
    option.href = "#"; // Vous pouvez configurer l'URL appropriée ici si nécessaire
    option.textContent = capitalizeFirstLetter(feature.properties.SMUR.toLowerCase()); 
    option.classList.add('smuriso'); // Ajouter la classe 'smuriso' à chaque élément
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

map.on('load', () => {
  // Ajoutez un événement "click" à chaque élément de la liste des smur pour gérer la sélection
  var smursiso = document.querySelectorAll('.dropdown-content .smuriso');
  smursiso.forEach(function(smuriso) {
    smuriso.addEventListener('click', function() {
      selectsmuriso(smuriso.textContent);
    });
  });

  // Fermer le bouton déroulant si l'utilisateur clique en dehors de celui-ci (iso smur)
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

  // Fonction pour charger les données des smur
  function fetchsmuriso() {
    fetch('./DATA/smurok.geojson')
      .then(response => response.json())
      .then(data => {
        // Trier les fonctionnalités en fonction du champ 'Ville'
        data.features.sort((a, b) => a.properties.Ville.localeCompare(b.properties.SMUR));
        // Une fois les données récupérées avec succès, appeler la fonction pour générer les options du menu déroulant
        generateDropdownOptionsIso(data);
      })
      .catch(error => {
        console.error('Une erreur s est produite lors de la récupération des données:', error);
      });
  }
  // Appeler la fonction pour récupérer les données de la couche "smur"
  fetchsmuriso();
});

// Fonction pour créer un isochrone pour un emplacement donné
async function createIsochrone(coordinates) {
  const lon = coordinates[0];
  const lat = coordinates[1];
  // Appeler la fonction getIso avec les coordonnées fournies
  await getIso(lon, lat);
       
  // Effectuer le "fly to" vers les coordonnées sélectionnées
  map.flyTo({
    center: coordinates,
    zoom: 9, // Vous pouvez ajuster le niveau de zoom selon vos besoins
    speed: 0.8 // Vous pouvez ajuster la vitesse d'animation selon vos besoins
  }); 
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
  const lon = feature.smur.geo_point.lon;
  const lat = feature.smur.geo_point.lat;
  // Appeler la fonction getIso avec les nouvelles valeurs de lon, lat et minutes
  await getIso(lon, lat);
}

//isochrones pour la couverture des SMUR
var params = document.getElementById('params');
var urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/';
var lon = -1.68;
var lat = 48.12;
var profile = 'driving';
var minutes = 30;
// var minutes = 45;
// var minutes = 60;

//Création de la fonction pour supprimé l'isochrone après son calcul
function removeIsochrone() {
  if (map.getSource('iso')) {
    map.getSource('iso').setData({
      "type": "FeatureCollection",
      "features": []
    });
  }
}

//Suppression par un click de l'isochrone
map.on('click', function(e) {
  removeIsochrone();
});

///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// CODE POUR AJOUTER DES POP-UP SUR LES SMUR //////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////


//popup smur
map.on('click', 'smur', function (e) {
  var feature = e.features[0]; // Récupérer la fonctionnalité à partir de l'événement

  // Vérifier si la fonctionnalité est définie
  if (!feature) {
    return;
  }

  var coordinates = feature.geometry.coordinates;
  var nomsmur = capitalizeFirstLetter(feature.properties.SMUR.toLowerCase()); 
  var type = feature.properties.field_1; 
  //var equip = feature.properties.equip; //A ajouter quand on aura le nb de véhicules par smur
  
  // Créez le contenu HTML pour le popup
  var popupContent = "<div class='popup'>";
  popupContent += "<h3>" + nomsmur + "</h3>";
  popupContent += "<p class='info'>Type : " + type +"</p>";
  popupContent += "<p class='info'>Nombre d'équipements : </p>";
  popupContent += "</div>";

  // Créez une popup et attachez-la à l'élément cliqué
  new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(popupContent)
    .addTo(map);
});



///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// CODE POUR LES ISOCHRONES SUR L'ADRESSE /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////

// Boite de recherche d'adresses créée par Mapbox et accessible via leur site qui permet d'avoir accès à la base d'adresse nationale
var geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken, //chemin vers mapbox
  mapboxgl: mapboxgl,
  container: 'contener',
  marker: {
    color: '#c65505'
    }
});
map.addControl(geocoder);

function calculateIsochrone(center, minutes) {
fetch('https://api.mapbox.com/isochrone/v1/mapbox/driving-traffic/' + center.join(',') + '?contours_minutes=' + minutes + '&polygons=true&access_token=' + mapboxgl.accessToken)
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
        'fill-color': '#FB4D3D',
        'fill-opacity': 0.6
      }
    });
    // Effectuer le "fly to" vers les coordonnées du centre avec un zoom personnalisé
    map.flyTo({
      center: center,
      zoom: 9, // Ajuster le niveau de zoom selon vos besoins
      speed: 0.5 // Ajuster la vitesse d'animation selon vos besoins
    });
  });
}

// Supprimer l'isochrone lorsque l'adresse est désélectionnée
geocoder.on('clear', function() {
  if (map.getSource('isochrone')) {
      map.removeLayer('isochrone');
      map.removeSource('isochrone');
  }
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

// Utilisation de la fonction calculateIsochrone lorsque l'adresse est sélectionnée
geocoder.on('result', function(ev) {
  var center = ev.result.center; // Centre de l'adresse sélectionnée
  var selectedTime = document.getElementById('isochrone-time-select').value;
  calculateIsochrone(center, selectedTime);
});

// Fonction qui permet de retourner le mot en mettant la première lettre en majuscule
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}