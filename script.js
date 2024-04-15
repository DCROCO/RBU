// Définition du fond de carte (chemin vers mapbox)
mapboxgl.accessToken = 'pk.eyJ1IjoiZGNyb2NvIiwiYSI6ImNsc2tkdDhtMTAyaGYyd253c2I5Z3hrc2UifQ.5BLIcpfsRJ5OpRYex0y6PQ';

// Configuration de la carte
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/dcroco/clsmz8fbx01fc01qlhvm38cuq', // Fond de carte
    center: [-2.9205663298399966, 48.21422772374418], // lat/long 48.855396472127794, 2.345032229371638
    zoom: 7, // zoom
    pitch: 0, // Inclinaison
    bearing: 0, // Rotation
    customAttribution: '<a href="https://rbu.jimdo.com//">Réseau Bretagne Urgence</a>'
});







// Boite de recherche d'adresse
var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
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









//isochrones pour le menu deroulant
var params = document.getElementById('params');
var urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/';
var lon = -1.68;
var lat = 48.12;
var profile = 'driving';
var minutes = 30;


 
// Ajout donnees sur le map.on 
// Les 3 principaux jeux de donneees: SMUR, SAMU et SAU
map.on ('load', function() {
  
  // //Ajout des contour de la Bretagne
  // map.addSource('Contours', {
  //   'type': 'geojson',
  //   'data': './DATA/contour_bretagneok.geojson'
  // });

  // map.addLayer({
  //   'id': 'Contours',
  //   'type': 'fill',
  //   'source': 'Contours',
  //   'paint': {
  //       'fill_outline_color': 'grey', 'fill_color': 'none'}
  // });

  //Ajout des territoires de Santé 
  // map.addSource('TerritoiresSA', {
  //   'type': 'geojson',
  //   'data': './DATA/contour_bretagneok.geojson'
  // });

  // map.addLayer({
  //   'id': 'TerritoiresSA',
  //   'type': 'fill',
  //   'source': 'TerritoiresSA', 
  //    'fill_outline_color': 'white'
  // });
  
  //Ajout des SMUR
  map.addSource('SMUR', {
    'type': 'geojson',
    'data': './DATA/smurok.geojson'
  });
  
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

  map.addLayer({
    'id': 'SMUR',
    'type': 'symbol',
    'source': 'SMUR',
    'layout': {
      'icon-image': ['match', ['get', 'field_1'], 
                     'SMUR Bretagne', 'custom-marker-1', 
                     'SMUR Limitrophes', 'custom-marker-2',
                     'HélicoD', 'custom-marker-3',
                     'Hélico', 'custom-marker-4',
                     'default-marker'],
      'icon-size': 0.8,
      'icon-allow-overlap': true
    },
    'visibility': 'visible'
  });

  //Ajout des SAMU 
  map.addSource('SAMU', {
    'type': 'geojson',
    'data': './DATA/samuok.geojson'
  });

  map.loadImage('./DATA/SMURok.png', function(error, image) {
    if (error) throw error;
    map.addImage('custom-marker', image);
  });

  map.addLayer({
    'id': 'SAMU',
    'type': 'symbol',
    'source': 'SAMU',
    'layout': {
      'icon-image': 'custom-marker',
      'icon-size': 0.8,
      'icon-allow-overlap': true
    },
    'visibility': 'visible'
  });

  //Ajout des SAU bretons
  map.addSource('SAU_1', {
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
    'id': 'SAU_1',
    'type': 'symbol',
    'source': 'SAU_1',
    'layout': {
      'icon-image': ['match', ['get', 'Statut'], 
                     'privé', 'custom-marker-a', 
                     'public', 'custom-marker-b',
                     'militaire', 'custom-marker-c',
                     'default-marker'], 
      'icon-size': 0.7,
      'icon-allow-overlap': true
    },
    'visibility': 'visible'
  });

  //Ajout des SAU  limitrophes
  map.addSource('SAU_2', {
    'type': 'geojson',
    'data': './DATA/sau_limitrook.geojson'
  });

  map.addLayer({
    'id': 'SAU_2',
    'type': 'symbol',
    'source': 'SAU_2',
    'layout': {
      'icon-image': ['match', ['get', 'Statut'], 
                     'privé', 'custom-marker-a', 
                     'public', 'custom-marker-b',
                     'militaire', 'custom-marker-c',
                     'default-marker'], 
      'icon-size': 0.7,
      'icon-allow-overlap': true
    },
    'visibility': 'visible'
  });

  // Ajout isochrone pour le menu deroulant 
    map.addSource('iso', {
    type: 'geojson',
    data: {
    'type': 'FeatureCollection',
    'features': []}
    });

  map.addLayer(
  {
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
    
    map.addLayer(
  {
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


// map.on('load', () => {
        


  
  
  
//   // Fonction pour activer/désactiver la liste déroulante des hôpitaux
// function toggleDropdown() {
//   document.getElementById("myDropdown").classList.toggle("show");
// }

// // Fonction pour gérer la sélection d'un hôpital
// function selectHospital(hospitalName) {
//   // Récupérer les valeurs sélectionnées pour le profil et la durée
//   var selectedProfile = document.querySelector('input[name="profile"]:checked').value;
//   var selectedDuration = document.querySelector('input[name="duration"]:checked').value;
  
//   // Vous pouvez ici utiliser les valeurs sélectionnées pour déterminer l'appel à votre API d'isochrone
//   console.log("Profil sélectionné :", selectedProfile);
//   console.log("Durée sélectionnée :", selectedDuration);
//   console.log("Hôpital sélectionné :", hospitalName);
//   // Ajoutez votre logique pour appeler l'API d'isochrone avec les valeurs sélectionnées
// }

// // Ajoutez un événement "click" à chaque élément de la liste des hôpitaux pour gérer la sélection
// var hospitals = document.querySelectorAll('.dropdown-content .hospital');
// hospitals.forEach(function(hospital) {
//   hospital.addEventListener('click', function() {
//     selectHospital(hospital.textContent);
//   });
// });

  
  
  
  
//   function toggleDropdown() {
//     document.getElementById("myDropdown").classList.toggle("show");
// }

// // Fermer le bouton déroulant si l'utilisateur clique en dehors de celui-ci
// window.onclick = function(event) {
//     if (!event.target.matches('.dropbtn')) {
//         var dropdowns = document.getElementsByClassName("dropdown-content");
//         var i;
//         for (i = 0; i < dropdowns.length; i++) {
//             var openDropdown = dropdowns[i];
//             if (openDropdown.classList.contains('show')) {
//                 openDropdown.classList.remove('show');
//             }
//         }
//     }
// }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
// //ajout image satellite quand on zoom
//                map.loadImage('https://cdn-icons-png.flaticon.com/128/179/179571.png', function(error, image) {
//         if (error) throw error;

//         map.addImage('custom-marker', image);
                 
                 
                 
// // //ajout hopitaux symboles
// //        map.addLayer({
// //             'id': 'hopitaux',
// //             'type': 'symbol',
// //             'source': {
// //                 'type': 'geojson',
// //                 'data': 'https://data.opendatasoft.com/api/explore/v2.1/catalog/datasets/osm-fr-lieux-de-soin@babel/exports/geojson?lang=fr&refine=amenity%3A%22hospital%22&refine=emergency%3A%22yes%22&where=(geometry(%60geo_point_2d%60%2C%20geom%27POLYGON((-4.9658203125%2049.001843917978526%2C%20-3.6694335937500004%2049.1314084139986%2C%20-2.4224853515625%2049.31079887964633%2C%20-1.69189453125%2049.30721745093609%2C%20-1.07666015625%2049.26780455063753%2C%20-0.81298828125%2049.0738659012854%2C%20-0.59326171875%2048.65105695744785%2C%20-0.4229736328125%2048.27953734226008%2C%20-0.46142578125%2047.897930761804965%2C%20-0.6317138671874999%2047.720849190702324%2C%20-1.153564453125%2047.35371061951363%2C%20-1.505126953125%2047.18224592701489%2C%20-1.9445800781249998%2047.156104775044035%2C%20-3.8397216796875%2047.34626718205302%2C%20-4.647216796875%2047.502358951968574%2C%20-5.1416015625%2048.085418575511966%2C%20-4.9658203125%2049.001843917978526))%27))&timezone=Europe%2FBerlin'
// //             },
// //            "filter": ["all",  ["in", "emergency", "yes"], ["in", "amenity", "hospital"]],
// //             'layout': {
// //                 'icon-image': 'custom-marker',
// //                 'icon-size': 0.1, 
// //                 'visibility': 'visible'
// //             },
// //             'paint': {}
// //         });
// //     });

  
//   //ajout routes fond de carte
//   map.addSource('mapbox-streets-v8', {
//    type: 'vector',
//    url: 'mapbox://mapbox.mapbox-streets-v8'});
           
  
//         map.addLayer({
//             "id": "routes",
//             "type": "line",
//             "source": "mapbox-streets-v8",
//             "source-layer": "road",
//             "filter": ["all",  ["in", "class", "primary", "motorway", "secondary", "trunk", "tertiary"]],        
//             "layout": {'visibility': 'visible'},
//             'paint': {'line-color': [
// 	     	              'match',['get', 'class'],
//                       'motorway', '#E990A0',
//               		    'primary', '#FDD7A1',
//                       'secondary', '#FDD7A1',
//                       'tertiary', '#FEFEFE',
//                	      'trunk', '#FBC0AC',
//                         '#A5A9B0'],
//                       'line-width' : 1.5,
//             },
//              minzoom : 5,
//              maxzoom : 20
//         });
  
  
  
 
  
  
  
  
// // fin du map on
// });








// //popup hopitaux
// map.on('click', 'hopitaux', function (e) {
//     var coordinates = e.features[0].geometry.coordinates.slice();
//     var description = e.features[0].properties.description;
//     var nomHopital = e.features[0].properties.name; 
//     var telephone = e.features[0].properties.phone; 
//     var site_web = e.features[0].properties.website;
//     var displaySiteWeb = site_web.length > 20 ? site_web.substring(0, 20) + "..." : site_web; /* Le lien hypertexte mais raccourci*/
  
  
  
//     // Créez le contenu HTML pour le popup
  
//      var popupContent = "<div class='popup'>";
// popupContent += "<h3>" + nomHopital + "</h3>";
// popupContent += "<p class='info'>Téléphone : " + telephone +"</p>";
// popupContent += "<p class='info'>Site Web : <a href='" + site_web + "' target='_blank'>" + displaySiteWeb + "</a></p>";
// popupContent += "</div>";


//     // Créez une popup et attachez-la à l'élément cliqué
//     new mapboxgl.Popup()
//         .setLngLat(coordinates)
//         .setHTML(popupContent)
//         .addTo(map);
// });


















// // Fonction pour le menu deroulant + isochrones
// function fetchHopitaux() {
//   fetch("https://data.opendatasoft.com/api/explore/v2.1/catalog/datasets/osm-fr-lieux-de-soin@babel/exports/geojson?lang=fr&refine=amenity%3A%22hospital%22&refine=emergency%3A%22yes%22&where=(geometry(%60geo_point_2d%60%2C%20geom%27POLYGON((-4.9658203125%2049.001843917978526%2C%20-3.6694335937500004%2049.1314084139986%2C%20-2.4224853515625%2049.31079887964633%2C%20-1.69189453125%2049.30721745093609%2C%20-1.07666015625%2049.26780455063753%2C%20-0.81298828125%2049.0738659012854%2C%20-0.59326171875%2048.65105695744785%2C%20-0.4229736328125%2048.27953734226008%2C%20-0.46142578125%2047.897930761804965%2C%20-0.6317138671874999%2047.720849190702324%2C%20-1.153564453125%2047.35371061951363%2C%20-1.505126953125%2047.18224592701489%2C%20-1.9445800781249998%2047.156104775044035%2C%20-3.8397216796875%2047.34626718205302%2C%20-4.647216796875%2047.502358951968574%2C%20-5.1416015625%2048.085418575511966%2C%20-4.9658203125%2049.001843917978526))%27))&timezone=Europe%2FBerlin")
//     .then(response => response.json())
//     .then(data => {
//       // Une fois les données récupérées avec succès, appeler la fonction pour générer les options du menu déroulant
//       generateDropdownOptions(data.features);
//     })
//     .catch(error => {
//       console.error('Une erreur s/'est produite lors de la récupération des données:', error);
//     });
// }





// // Fonction pour générer les options du menu déroulant à partir des données
// function generateDropdownOptions(features) {
//   // Récupérer le conteneur du menu déroulant
//   var dropdownContent = document.getElementById("myDropdown");

//   // Parcourir les données
//   features.forEach(feature => {
//     // Créer une option pour chaque élément
//     var option = document.createElement("a");
//     option.href = "#"; // Vous pouvez configurer l'URL appropriée ici si nécessaire
//     option.textContent = feature.properties.name; // Utiliser la valeur du champ 'nom' de chaque feature
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

// // Fonction pour créer un isochrone pour un emplacement donné
// async function createIsochrone(coordinates) {
//   const lon = coordinates[0];
//   const lat = coordinates[1];
//   // Appeler la fonction getIso avec les coordonnées fournies
//   await getIso(lon, lat);
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
//   const lon = feature.hopitaux.geo_point.lon;
//   const lat = feature.hopitaux.geo_point.lat;
//   // Appeler la fonction getIso avec les nouvelles valeurs de lon, lat et minutes
//   await getIso(lon, lat);
// }


// // Appeler la fonction pour récupérer les données de la couche "hopitaux"
// fetchHopitaux();

// // Fonction pour afficher ou masquer le menu déroulant
// function toggleDropdown() {
//   var dropdownContent = document.getElementById("myDropdown");
//   dropdownContent.classList.toggle("show");
// }

// });