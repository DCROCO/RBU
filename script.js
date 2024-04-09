// Le fond de carte
mapboxgl.accessToken = 'pk.eyJ1IjoiZGNyb2NvIiwiYSI6ImNsc2tkdDhtMTAyaGYyd253c2I5Z3hrc2UifQ.5BLIcpfsRJ5OpRYex0y6PQ';

    // Configuration de la carte
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/dcroco/clsmz8fbx01fc01qlhvm38cuq', // Fond de carte
    center: [-2.9205663298399966, 48.21422772374418], // lat/long 48.855396472127794, 2.345032229371638
    zoom: 7, // zoom
    pitch: 0, // Inclinaison
    bearing: 0, // Rotation
    customAttribution : '<a href="https://rbu.jimdo.com//">Réseau Bretagne Urgence</a>'
});


 // Add the control to the map.
    map.addControl(
        new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            container : 'contener'
        })
    );



// Target the params form in the HTML
var params = document.getElementById('params');
 
// Create variables to use in getIso()
var urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/';
var lon = -1.68;
var lat = 48.12;
var profile = 'driving';
var minutes = 30;


// Create a function that sets up the Isochrone API query then makes an Ajax call
function getIso() {
    var query =
    urlBase +
    profile +
    '/' +
    lon +
    ',' +
    lat +
    '?contours_minutes=' +
    minutes +
    '&polygons=false&access_token=' +
    mapboxgl.accessToken;
 
    $.ajax({
      method: 'GET',
      url: query
    }).done(function (data) {
      // Set the 'iso' source's data to what's returned by the API query
      map.getSource('iso').setData(data);
    });
}
 
// Ajout donnees 
map.on ('load', function() {


  // Ajout isochrone
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
'line-width': 3
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
'fill-color': '#FF6F61',
'fill-opacity': 0.2
}
},
'poi-label'
);

         // Ajout pointeur deplacable
    var pointeur_iso = new mapboxgl.Marker({
        'color': '#314ccd', draggable: true
      })
      .setLngLat([-1.68, 48.12, ])
      .addTo(map);
  
    function onDragEnd() {
      var lngLat = pointeur_iso.getLngLat();
      lat = lngLat.lat;
      lon = lngLat.lng;
      getIso();
    }
    
    pointeur_iso.on('dragend', onDragEnd);
   
    // Fonction pour appeler API iso
    getIso();
  
  });

  // Re-appel API pour changement parametres
params.addEventListener('change', function (e) {
    if (e.target.name === 'profile') {
      profile = e.target.value;
    getIso();
    } 
    else if (e.target.name === 'duration') {
      minutes = e.target.value;
    getIso();
    }
  });







map.on('load', () => {
        


  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  map.addSource('BDTOPO', {
        type: 'vector',
        url: 'https://wxs.ign.fr/topographie/geoportail/tms/1.0.0/BDTOPO/metadata.json',
       
    });
        
        map.addLayer({
            'id': 'mesbatiments',
            'type': 'fill-extrusion',
            'source': 'BDTOPO',
            'source-layer': 'batiment',
            'paint': {'fill-extrusion-opacity': 0.80,
                      'fill-extrusion-color' : '#E6E6FA',
                      'fill-extrusion-height':{'type': 'identity','property': 'hauteur'},
                      'fill-extrusion-base': 0},
            'layout': {'visibility': 'none'},
              minzoom: 15,
              maxzoom: 19
      });
  
        
        map.addLayer({
            'id': 'mesroutes',
            'type': 'line',
            'source': 'BDTOPO',
            'source-layer': 'troncon_de_route',
            'paint': {'line-color' : 'rgba(255, 255, 255, 0.6)'},
            'layout': {'visibility': 'visible'},
              minzoom: 12,
              maxzoom: 19
      });
  
               map.loadImage('https://cdn-icons-png.flaticon.com/128/179/179571.png', function(error, image) {
        if (error) throw error;

        map.addImage('custom-marker', image);

       map.addLayer({
            'id': 'hopitaux',
            'type': 'symbol',
            'source': {
                'type': 'geojson',
                'data': 'https://data.opendatasoft.com/api/explore/v2.1/catalog/datasets/osm-fr-lieux-de-soin@babel/exports/geojson'
            },
           "filter": ["all",  ["in", "emergency", "yes"], ["in", "amenity", "hospital"]],
            'layout': {
                'icon-image': 'custom-marker',
                'icon-size': 0.1, 
                'visibility': 'visible'
            },
            'paint': {}
        });
    });

  
  
  map.addSource('mapbox-streets-v8', {
   type: 'vector',
   url: 'mapbox://mapbox.mapbox-streets-v8'});
           
  
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
                        '#A5A9B0'],
                      'line-width' : 1.5,
            },
             minzoom : 5,
             maxzoom : 20
        });
  
  
  
        


    
 
// fin du map on
});


map.on('click', 'hopitaux', function (e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = e.features[0].properties.description;
    var nomHopital = e.features[0].properties.name; 
    var telephone = e.features[0].properties.phone; 
    var site_web = e.features[0].properties.website;
    var displaySiteWeb = site_web.length > 20 ? site_web.substring(0, 20) + "..." : site_web; /* Le lien hypertexte mais raccourci*/
  
    // Créez le contenu HTML pour le popup
  
     var popupContent = "<div class='popup'>";
popupContent += "<h3>" + nomHopital + "</h3>";
popupContent += "<p class='info'>Téléphone : " + telephone +"</p>";
popupContent += "<p class='info'>Site Web : <a href='" + site_web + "' target='_blank'>" + displaySiteWeb + "</a></p>";
popupContent += "</div>";


    // Créez une popup et attachez-la à l'élément cliqué
    new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(popupContent)
        .addTo(map);
});



















// Fonction pour récupérer les données de la couche "sites_olympiques"
function fetchHopitaux() {
  fetch("https://data.opendatasoft.com/api/explore/v2.1/catalog/datasets/osm-fr-lieux-de-soin@babel/exports/geojson")
    .then(response => response.json())
    .then(data => {
      // Une fois les données récupérées avec succès, appeler la fonction pour générer les options du menu déroulant
      generateDropdownOptions(data.features);
    })
    .catch(error => {
      console.error('Une erreur s\'est produite lors de la récupération des données:', error);
    });
}

// Fonction pour générer les options du menu déroulant à partir des données
function generateDropdownOptions(features) {
  // Récupérer le conteneur du menu déroulant
  var dropdownContent = document.getElementById("myDropdown");

  // Parcourir les données
  features.forEach(feature => {
    // Créer une option pour chaque élément
    var option = document.createElement("a");
    option.href = "#"; // Vous pouvez configurer l'URL appropriée ici si nécessaire
    option.textContent = feature.properties.name; // Utiliser la valeur du champ 'nom' de chaque feature
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
  const lon = feature.hopitaux.geo_point.lon;
  const lat = feature.hopitaux.geo_point.lat;
  // Appeler la fonction getIso avec les nouvelles valeurs de lon, lat et minutes
  await getIso(lon, lat);
}


// Appeler la fonction pour récupérer les données de la couche "sites_olympiques"
fetchHopitaux();

// Fonction pour afficher ou masquer le menu déroulant
function toggleDropdown() {
  var dropdownContent = document.getElementById("myDropdown");
  dropdownContent.classList.toggle("show");
}



function flyToStore(currentFeature) {
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 15
  });
}


  // Zoom automatique sur la position de l'hôpital
  map.flyToStore(hopitaux)


