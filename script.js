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
    customAttribution: '<a href="https://rbu.jimdo.com//">Réseau Bretagne Urgence</a>'
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
      'primary', '#E990A0',
      'secondary', '#F7B4C0',
      'tertiary', '#F7B4C0',
      'trunk', '#E990A0',
      '#F7B4C0'], 
    'line-width' : 1,
    'line-opacity': 0.5
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
  map.loadImage('./DATA/HélicoD.png', function(error, image) {
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
                    'HélicoD', 'custom-marker-3',
                    'Hélico', 'custom-marker-4',
                    'default-marker'],
      'icon-size': 0.8,
      'icon-allow-overlap': true,
      'visibility': 'visible' // Définissez la visibilité initiale de la couche sur 'none'
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

  //Ajout des sau limitrophes
  map.addSource('source_saulim', {
    'type': 'geojson',
    'data': './DATA/sau_limitrophesok.geojson'
  });

  map.addLayer({
    'id': 'sau_lim',
    'type': 'symbol',
    'source': 'source_saulim',
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
////////////////////////////////// CODE AFFICHE TOUS LES SMUR ET SAU  /////////////////////////////////
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

// Fonction pour activer la checkbox des SAU et SMUR
function toggleLayer(layerId, visible) {
  const layer = map.getLayer(layerId);
  if (layer) {
    const newVisibility = visible ? 'visible' : 'none';
    map.setLayoutProperty(layerId, 'visibility', newVisibility);
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////:///// CODE POUR LISTER LES VEHICULES SMUR ////////////////////////////////////
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
    // Trier les fonctionnalités en fonction du champ 'Ville'
    data.features.sort((a, b) => a.properties.SMUR.localeCompare(b.properties.SMUR));
    generatevehismurOptions(smurData);
    generatehelismurOptions(smurData);
  })
  .catch((error) => {
    console.error(error);
  });
});

// Fonction pour générer les options du menu déroulant pour la liste des véhicules SMUR
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

// Fonction pour générer les options du menu déroulant pour la liste des héliSMUR
function generatehelismurOptions(data) {
  const smurListe = document.getElementById("helismurList");
  data.features.forEach(feature => {
    if (feature.properties.fid != null && (feature.properties.field_1 === 'Hélico' || feature.properties.field_1 === 'HélicoD')) { 
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


// Tableau pour stocker les identifiants des couches SMUR sélectionnées
let selectedSmurLayers = [];

// Fonction pour afficher/masquer un SMUR spécifique
function togglesmur(smurId, visible) {
  const fid = parseInt(smurId.split('-')[1]);
  const feature = smurData.features.find(f => f.properties.fid === fid);
  
  if (visible && feature) {
    const filter = ['==', 'fid', fid];

    // Ajouter la couche SMUR spécifique à la liste des couches sélectionnées
    if (!selectedSmurLayers.includes(smurId)) {
      selectedSmurLayers.push(smurId);
    }

    map.setFilter(smurId, filter);
    
    // Vérifier la valeur de field_1 pour définir le style de l'icône
    let iconImage = 'default-marker';
    switch (feature.properties.field_1) {
      case 'SMUR Bretagne':
        iconImage = 'custom-marker-1';
        break;
      case 'SMUR Limitrophes':
        iconImage = 'custom-marker-2';
        break;
      case 'HélicoD':
        iconImage = 'custom-marker-3';
        break;
      case 'Hélico':
        iconImage = 'custom-marker-4';
        break;
      default:
        iconImage = 'default-marker';
        break;
    }
    
    // Ajouter la couche SMUR spécifique si elle n'est pas déjà ajoutée
    if (!map.getLayer(smurId)) {
      map.addLayer({
        'id': smurId,
        'type': 'symbol',
        'source': 'source_smur',
        'layout': {
          'icon-image': iconImage,
          'icon-size': 0.8,
          'icon-allow-overlap': true,
          'visibility': 'visible' // Définissez la visibilité initiale de la couche sur 'none'
        },
        'filter': filter
      });
    } else {
      // Si la couche existe déjà, assurez-vous qu'elle est visible
      map.setLayoutProperty(smurId, 'visibility', 'visible');
    }
  } else {
    // Retirer la couche SMUR spécifique de la liste des couches sélectionnées
    const index = selectedSmurLayers.indexOf(smurId);
    if (index !== -1) {
      selectedSmurLayers.splice(index, 1);
    }
    
    map.setLayoutProperty(smurId, 'visibility', 'none');
  }
}











///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// CODE POUR CALCULER LA COUVERTURE DES SMUR //////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////


// Récupérer les éléments de la page
const helismurRadio = document.getElementById('helismur');
const smurvlRadio = document.getElementById('smurvl');
const dropdownContent = document.getElementById('myDropdown');

// Ajouter un gestionnaire d'événements pour les boutons de radio
helismurRadio.addEventListener('change', updateDropdown);
smurvlRadio.addEventListener('change', updateDropdown);

// Fonction pour mettre à jour la liste déroulante en fonction du mode de déplacement sélectionné
function updateDropdown() {
  // Effacer le contenu de la liste déroulante
  dropdownContent.innerHTML = '';

  // Sélectionner les SMUR en fonction du mode de déplacement
  const selectedMode = helismurRadio.checked ? 'Hélico' : 'SMUR Bretagne';

  // Mettre à jour la liste déroulante en fonction du mode sélectionné
  const smurList = smurData.features.filter(feature => feature.properties.field_1 === selectedMode);
  smurList.forEach(feature => {
    const option = document.createElement('a');
    option.textContent = feature.properties.SMUR;
    option.addEventListener('click', () => selectSmur(feature.properties.SMUR));
    dropdownContent.appendChild(option);
  });
}

// Fonction appelée lorsque l'utilisateur sélectionne un SMUR dans la liste déroulante
function selectSmur(smurName) {
  // Mettre en œuvre les actions souhaitées lorsque l'utilisateur sélectionne un SMUR
  console.log('SMUR sélectionné :', smurName);
}

// Appeler la fonction pour initialiser la liste déroulante avec le mode de déplacement par défaut
updateDropdown();



// appel de la liste quand on clique sur le bouton
function toggleDropdownIso() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// // Fonction pour générer les options du menu déroulant à partir des données
// function generateDropdownOptionsIso(data) {
//   // Récupérer le conteneur du menu déroulant
//   var dropdownContent = document.getElementById("myDropdown");
//   // Parcourir les données
//   data.features.forEach(feature => {
//     // Créer une option pour chaque élément
//     var option = document.createElement("a");
//     option.href = "#"; // Vous pouvez configurer l'URL appropriée ici si nécessaire
//     option.textContent = capitalizeFirstLetter(feature.properties.SMUR.toLowerCase()); 
//     option.classList.add('smuriso'); // Ajouter la classe 'smuriso' à chaque élément
//     // Ajouter un gestionnaire d'événements pour le clic sur chaque option
//     option.addEventListener("click", function() {
//       // Récupérer les coordonnées de la fonctionnalité
//       var coordinates = feature.geometry.coordinates;
//       // Appeler la fonction pour créer un isochrone pour cet emplacement
//       createIsochrone(coordinates);
//     });
//     // Ajouter l'option au menu déroulant
//     dropdownContent.appendChild(option);
//   });
// }

// map.on('load', () => {
//   // Ajoutez un événement "click" à chaque élément de la liste des smur pour gérer la sélection
//   var smursiso = document.querySelectorAll('.dropdown-content .smuriso');
//   smursiso.forEach(function(smuriso) {
//     smuriso.addEventListener('click', function() {
//       selectsmuriso(smuriso.textContent);
//     });
//   });

//   // Fermer le bouton déroulant si l'utilisateur clique en dehors de celui-ci (iso smur)
//   window.onclick = function(event) {
//       if (!event.target.matches('.dropbtn')) {
//           var dropdowns = document.getElementsByClassName("dropdown-content");
//           var i;
//           for (i = 0; i < dropdowns.length; i++) {
//               var openDropdown = dropdowns[i];
//               if (openDropdown.classList.contains('show')) {
//                   openDropdown.classList.remove('show');
//               }
//           }
//       }
//   }

//   // Fonction pour charger les données des smur
//   function fetchsmuriso() {
//     fetch('./DATA/smurok.geojson')
//       .then(response => response.json())
//       .then(data => {
//         // Trier les fonctionnalités en fonction du champ 'Ville'
//         data.features.sort((a, b) => a.properties.Ville.localeCompare(b.properties.SMUR));
//         // Une fois les données récupérées avec succès, appeler la fonction pour générer les options du menu déroulant
//         generateDropdownOptionsIso(data);
//       })
//       .catch(error => {
//         console.error('Une erreur s est produite lors de la récupération des données:', error);
//       });
//   }
//   // Appeler la fonction pour récupérer les données de la couche "smur"
//   fetchsmuriso();
// });

// // Fonction pour créer un isochrone pour un emplacement donné
// async function createIsochrone(coordinates) {
//   const lon = coordinates[0];
//   const lat = coordinates[1];
//   // Appeler la fonction getIso avec les coordonnées fournies
//   await getIso(lon, lat);
       
//   // Effectuer le "fly to" vers les coordonnées sélectionnées
//   map.flyTo({
//     center: coordinates,
//     zoom: 9, // Vous pouvez ajuster le niveau de zoom selon vos besoins
//     speed: 0.8 // Vous pouvez ajuster la vitesse d'animation selon vos besoins
//   }); 
// }

// // Modifier la fonction getIso pour accepter les coordonnées comme arguments
// async function getIso(lon, lat) {
//   const query = await fetch(
//     `${urlBase}${profile}/${lon},${lat}?contours_minutes=${minutes}&polygons=true&access_token=${mapboxgl.accessToken}`,
//     { method: 'GET' }
//   );
//   const data = await query.json();
//   // Set the 'iso' source's data to what's returned by the API query
//   map.getSource('iso').setData(data);
// }

// // Fonction pour mettre à jour les isochrones avec la nouvelle valeur de minutes
// async function updateIsochrone() {
//   // Récupérer les coordonnées du site olympique sélectionné
//   const lon = feature.smur.geo_point.lon;
//   const lat = feature.smur.geo_point.lat;
//   // Appeler la fonction getIso avec les nouvelles valeurs de lon, lat et minutes
//   await getIso(lon, lat);
// }

// //isochrones pour la couverture des SMUR
// var params = document.getElementById('params');
// var urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/';
// var lon = -1.68;
// var lat = 48.12;
// var profile = 'driving';
// var minutes = 30;
// // var minutes = 45;
// // var minutes = 60;

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


// //popup smur
// map.on('click', 'smur', function (e) {
//   var coordinates = e.features[0].geometry.coordinates.slice();
//   var description = e.features[0].properties.description;
//   var nomsmur = e.features[0].properties.name; 
//   var telephone = e.features[0].properties.phone; 
//   var site_web = e.features[0].properties.website;
//   var displaySiteWeb = site_web.length > 20 ? site_web.substring(0, 20) + "..." : site_web; /* Le lien hypertexte mais raccourci*/
  
//   // Créez le contenu HTML pour le popup
//   var popupContent = "<div class='popup'>";
//   popupContent += "<h3>" + nomsmur + "</h3>";
//   popupContent += "<p class='info'>Téléphone : " + telephone +"</p>";
//   popupContent += "<p class='info'>Site Web : <a href='" + site_web + "' target='_blank'>" + displaySiteWeb + "</a></p>";
//   popupContent += "</div>";

//   // Créez une popup et attachez-la à l'élément cliqué
//   new mapboxgl.Popup()
//     .setLngLat(coordinates)
//     .setHTML(popupContent)
//     .addTo(map);
// });


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
      zoom: 10, // Ajuster le niveau de zoom selon vos besoins
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