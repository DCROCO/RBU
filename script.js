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

  //Ajout des iscohrones 45min autour des SMUR terrestres
  map.addSource('source_iso45', {
    'type': 'geojson',
    'data': './DATA/isochrones45_SMUR.geojson'
  });

  map.addLayer({
    'id': 'iso45',
    'type': 'fill',
    'source': 'source_iso45', 
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

  //Ajout des iscohrones 60min autour des SMUR terrestres
  map.addSource('source_iso60', {
    'type': 'geojson',
    'data': './DATA/isochrones60_SMUR.geojson'
  });

  map.addLayer({
    'id': 'iso60',
    'type': 'fill',
    'source': 'source_iso60', 
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

  //Ajout des iscohrones 10min autour des héliSMUR
  map.addSource('source_heliiso10', {
    'type': 'geojson',
    'data': './DATA/isochrones10_heliSMUR.geojson'
  });

  map.addLayer({
    'id': 'heliiso10',
    'type': 'fill',
    'source': 'source_heliiso10', 
    'layout': {
      'visibility': 'none'
    }
  });

    //Ajout des iscohrones 15min autour des héliSMUR
    map.addSource('source_heliiso15', {
      'type': 'geojson',
      'data': './DATA/isochrones15_heliSMUR.geojson'
    });
  
    map.addLayer({
      'id': 'heliiso15',
      'type': 'fill',
      'source': 'source_heliiso15', 
      'layout': {
        'visibility': 'none'
      }
    });

      //Ajout des iscohrones 20min autour des héliSMUR
  map.addSource('source_heliiso20', {
    'type': 'geojson',
    'data': './DATA/isochrones20_heliSMUR.geojson'
  });

  map.addLayer({
    'id': 'heliiso20',
    'type': 'fill',
    'source': 'source_heliiso20', 
    'layout': {
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

});

/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// CODE CREATION LISTE DYNAMIQUE  ///////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

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

// Afficher/masquer les territoires de santé
const comCheckbox = document.getElementById("comLayer");
comCheckbox.addEventListener("change", function () {
  const visible = comCheckbox.checked;
  toggleLayer('communesLayer', visible);
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

// Fonction pour afficher ou masquer un groupe de couches
function toggleGroup(groupId) {
  const group = document.getElementById(groupId);
  const ul = group.querySelector('ul');
  ul.classList.toggle('show');
}

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
  const ul = document.createElement("ul"); // Créer une balise <ul>
  data.features.forEach(feature => {
    if (feature.properties.fid != null && feature.properties.field_1 === 'SMUR Bretagne') {
      const listItem = document.createElement("li"); // Créer une balise <li> pour chaque élément
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `smur-${feature.properties.fid}`;
      checkbox.onchange = () => togglesmur(`smur-${feature.properties.fid}`, checkbox.checked);
      const label = document.createElement("label");
      label.htmlFor = `smur-${feature.properties.fid}`;
      label.textContent = capitalizeFirstLetter(feature.properties.SMUR.toLowerCase());      
      // Ajouter le checkbox et le label à la balise <li>
      listItem.appendChild(checkbox);
      listItem.appendChild(label);      
      // Ajouter la balise <li> à la balise <ul>
      ul.appendChild(listItem);
    }
  });
  // Ajouter la balise <ul> à la liste
  smurListe.appendChild(ul);
}



// Fonction pour générer les options du menu déroulant pour la liste des véhicules SMUR de Bretagne
function generatevehismurlimOptions(data) {
  const vehilimsmurListe = document.getElementById("vehismurlimList");
  const ul = document.createElement("ul"); // Créer une balise <ul>
  data.features.forEach(feature => {
    if (feature.properties.fid != null && feature.properties.field_1 === 'SMUR Limitrophes') {
      const listItem = document.createElement("li"); // Créer une balise <li> pour chaque élément
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `smur-${feature.properties.fid}`;
      checkbox.onchange = () => togglesmur(`smur-${feature.properties.fid}`, checkbox.checked);
      const label = document.createElement("label");
      label.htmlFor = `smur-${feature.properties.fid}`;
      label.textContent = capitalizeFirstLetter(feature.properties.SMUR.toLowerCase());
      // Ajouter le checkbox et le label à la balise <li>
      listItem.appendChild(checkbox);
      listItem.appendChild(label);
      // Ajouter la balise <li> à la liste
      ul.appendChild(listItem);
    }
  });
  // Ajouter la balise <ul> à la liste
  vehilimsmurListe.appendChild(ul);
}

// Fonction pour générer les options du menu déroulant pour la liste des héliSMUR
function generatehelismurOptions(data) {
  const helismurListe = document.getElementById("helismurList");
  const ul = document.createElement("ul"); // Créer une balise <ul>
  data.features.forEach(feature => {
    if (feature.properties.fid != null && (feature.properties.field_1 === 'Dragon' || feature.properties.field_1 === 'HéliSMUR')) {
      const listItem = document.createElement("li"); // Créer une balise <li> pour chaque élément
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `smur-${feature.properties.fid}`;
      checkbox.onchange = () => togglesmur(`smur-${feature.properties.fid}`, checkbox.checked);
      const label = document.createElement("label");
      label.htmlFor = `smur-${feature.properties.fid}`;
      label.textContent = capitalizeFirstLetter(feature.properties.SMUR.toLowerCase());
      // Ajouter le checkbox et le label à la balise <li>
      listItem.appendChild(checkbox);
      listItem.appendChild(label);      
      // Ajouter la balise <li> à la liste
      ul.appendChild(listItem);    }
  });
  // Ajouter la balise <ul> à la liste
  helismurListe.appendChild(ul);
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

    if (feature.properties.field_1 === 'SMUR Bretagne' || feature.properties.field_1 === 'SMUR Limitrophes') {
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

    } else if (feature.properties.field_1 === 'Dragon' || feature.properties.field_1 === 'HéliSMUR') {
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

// Sélectionner le bouton "Sélectionner un SMUR"
const selectSmurButton = document.getElementById('toggleDropdownIso');

// Ajouter un écouteur d'événement sur le bouton "Sélectionner un SMUR"
selectSmurButton.addEventListener('click', function(e) {
  e.stopPropagation(); // Empêcher la propagation de l'événement

  // Sélectionner la liste déroulante
  const dropdownContent = document.getElementById('myDropdown');

  // Basculer la visibilité de la liste déroulante
  dropdownContent.classList.toggle('show');
});

// Ajouter un écouteur d'événement sur le document pour fermer la liste déroulante lorsque l'utilisateur clique en dehors
document.addEventListener('click', function(e) {
  // Sélectionner la liste déroulante
  const dropdownContent = document.getElementById('myDropdown');

  // Vérifier si le clic s'est produit en dehors de la liste déroulante et du bouton "Sélectionner un SMUR"
  if (!dropdownContent.contains(e.target) && e.target !== selectSmurButton) {
    dropdownContent.classList.remove('show');
  }
});

// Utilisez la fonction fetch() pour récupérer les données SMUR à partir de l'URL
document.addEventListener('DOMContentLoaded', function() {
  fetch(smurUrl)
  .then((response) => response.json())
  .then((data) => {
    smurData = data;
    // Trier les fonctionnalités en fonction du champ 'SMUR'
    smurData.features.sort((a, b) => a.properties.SMUR.localeCompare(b.properties.SMUR));
  })
});

// Sélection des boutons du menu
const btnHelismur = document.getElementById('btnHelismur');
const btnSmurTerrestres = document.getElementById('btnSmurTerrestres');
const btnterre30 = document.getElementById('btn30');
const btnterre45 = document.getElementById('btn45');
const btnterre60 = document.getElementById('btn60');
const btnheli10 = document.getElementById('btn10');
const btnheli15 = document.getElementById('btn15');
const btnheli20 = document.getElementById('btn20');

// Sélectionner les formulaires
const tempssmur = document.querySelector('#tempssmur');
const tempsheli = document.querySelector('#tempsheli');

// Masquer le formulaire des hélismur au chargement de la page
tempsheli.style.display = 'none';

// Écouteurs d'événements pour les clics sur les boutons "Smur Terrestres"
btnSmurTerrestres.addEventListener('click', function() {
  clearDropdown();
  // Masquer le formulaire tempsheli
  tempsheli.style.display = 'none';
  // Afficher le formulaire tempssmur
  tempssmur.style.display = 'block';
});

// Écouteurs d'événements pour les clics sur les boutons "HéliSMUR"
btnHelismur.addEventListener('click', function() {
  clearDropdown();
  // Masquer le formulaire tempssmur
  tempssmur.style.display = 'none';
  // Afficher le formulaire tempsheli
  tempsheli.style.display = 'block';
});

// Écouteurs d'événements pour les boutons de distance
btnterre30.addEventListener('click', function() {
  clearDropdown();
  getIsoSmur30(smurData, 'terrestre');
});

btnterre45.addEventListener('click', function() {
  clearDropdown();
  getIsoSmur45(smurData, 'terrestre');
});

btnterre60.addEventListener('click', function() {
  clearDropdown();
  getIsoSmur60(smurData, 'terrestre');
});

// Écouteurs d'événements pour les boutons de distance
btnheli10.addEventListener('click', function() {
  clearDropdown();
  getIsoHeliSmur10(smurData, 'heli');
});

btnheli15.addEventListener('click', function() {
  clearDropdown();
  getIsoHeliSmur15(smurData, 'heli');
});

btnheli20.addEventListener('click', function() {
  clearDropdown();
  getIsoHeliSmur20(smurData, 'heli');
});

// Fonction pour effacer le contenu du menu déroulant
function clearDropdown() {
  const container = document.getElementById('myDropdown');
  container.innerHTML = ''; // Effacer le contenu existant du conteneur
  const existingLayers = map.getStyle().layers;
  existingLayers.forEach(layer => {
    if (layer.id.startsWith('iso30_') || layer.id.startsWith('iso45_') || layer.id.startsWith('iso60_')) {
      map.removeLayer(layer.id);
    }
  });
}

const deletebtn = document.getElementById('delete');
deletebtn.addEventListener('click', function() {
  const dropdownContent = document.getElementById('myDropdown');
  dropdownContent.classList.remove('show');
});


// Fonction pour générer les options du menu déroulant si on sélectionne smur terrestre 30min
function getIsoSmur30(data, type) {
  const container = document.getElementById('myDropdown');
  data.features.forEach(feature => {
    if (feature.properties.fid != null && ((type === 'heli' && (feature.properties.field_1 === 'Dragon' || feature.properties.field_1 === 'HéliSMUR')) || (type === 'terrestre' && (feature.properties.field_1 === 'SMUR Bretagne' || feature.properties.field_1 === 'SMUR Limitrophes')))) { 
      // Créer un élément pour chaque SMUR
      const option = document.createElement("a");
      option.href = "#";
      option.textContent = capitalizeFirstLetter(feature.properties.SMUR.toLowerCase()); 
      option.classList.add('smurdata');
      // Ajouter un gestionnaire d'événements pour le clic sur chaque option
      option.addEventListener("click", function() {
        const ville = feature.properties.Ville;
        const smur = feature.properties.SMUR;
        // Supprimer les couches d'isochrone existantes
        const existingLayers = map.getStyle().layers;
        existingLayers.forEach(layer => {
          if (layer.id.startsWith('iso30_')) {
            map.removeLayer(layer.id);
          }
        });
        // Ajouter la nouvelle couche d'isochrone
        const isochroneLayerId = 'iso30_' + smur; // Utiliser le nom du SMUR comme ID de la couche
        map.addLayer({
          'id': isochroneLayerId,
          'type': 'fill',
          'source': 'source_iso30',
          'paint': {
            'fill-color': '#85D3E4', // Couleur de remplissage de l'isochrone
            'fill-opacity': 0.5
          },
          'filter': ['==', 'layer', ville] // Filtrer sur le champ "layer" égal à la ville du SMUR sélectionné
        });
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
      });
      // Ajouter l'élément au menu déroulant
      container.appendChild(option);
    }
  });
}

// Fonction pour générer les options du menu déroulant si on sélectionne smur terrestre 45min
function getIsoSmur45(data, type) {
  const container = document.getElementById('myDropdown');
  data.features.forEach(feature => {
    if (feature.properties.fid != null && ((type === 'heli' && (feature.properties.field_1 === 'Dragon' || feature.properties.field_1 === 'HéliSMUR')) || (type === 'terrestre' && (feature.properties.field_1 === 'SMUR Bretagne' || feature.properties.field_1 === 'SMUR Limitrophes')))) { 
      // Créer un élément pour chaque SMUR
      const option = document.createElement("a");
      option.href = "#";
      option.textContent = capitalizeFirstLetter(feature.properties.SMUR.toLowerCase()); 
      option.classList.add('smurdata');
      // Ajouter un gestionnaire d'événements pour le clic sur chaque option
      option.addEventListener("click", function() {
        const ville = feature.properties.Ville;
        const smur = feature.properties.SMUR;
        // Supprimer les couches d'isochrone existantes
        const existingLayers = map.getStyle().layers;
        existingLayers.forEach(layer => {
          if (layer.id.startsWith('iso45_')) {
            map.removeLayer(layer.id);
          }
        });
        // Ajouter la nouvelle couche d'isochrone
        const isochroneLayerId = 'iso45_' + smur; // Utiliser le nom du SMUR comme ID de la couche
        map.addLayer({
          'id': isochroneLayerId,
          'type': 'fill',
          'source': 'source_iso45',
          'paint': {
            'fill-color': '#85B6E4', // Couleur de remplissage de l'isochrone
            'fill-opacity': 0.5
          },
          'filter': ['==', 'SMUR', ville] // Filtrer sur le champ "layer" égal à la ville du SMUR sélectionné
        });
      });
      // Ajouter l'élément au menu déroulant
      container.appendChild(option);
    }
  });
}

// Fonction pour générer les options du menu déroulant si on sélectionne smur terrestre 60min
function getIsoSmur60(data, type) {
  const container = document.getElementById('myDropdown');
  data.features.forEach(feature => {
    if (feature.properties.fid != null && ((type === 'heli' && (feature.properties.field_1 === 'Dragon' || feature.properties.field_1 === 'HéliSMUR')) || (type === 'terrestre' && (feature.properties.field_1 === 'SMUR Bretagne' || feature.properties.field_1 === 'SMUR Limitrophes')))) { 
      // Créer un élément pour chaque SMUR
      const option = document.createElement("a");
      option.href = "#";
      option.textContent = capitalizeFirstLetter(feature.properties.SMUR.toLowerCase()); 
      option.classList.add('smurdata');
      // Ajouter un gestionnaire d'événements pour le clic sur chaque option
      option.addEventListener("click", function() {
        const ville = feature.properties.Ville;
        const smur = feature.properties.SMUR;
        // Supprimer les couches d'isochrone existantes
        const existingLayers = map.getStyle().layers;
        existingLayers.forEach(layer => {
          if (layer.id.startsWith('iso60_')) {
            map.removeLayer(layer.id);
          }
        });
        // Ajouter la nouvelle couche d'isochrone
        const isochroneLayerId = 'iso60_' + smur; // Utiliser le nom du SMUR comme ID de la couche
        map.addLayer({
          'id': isochroneLayerId,
          'type': 'fill',
          'source': 'source_iso60',
          'paint': {
            'fill-color': '#858CE4', // Couleur de remplissage de l'isochrone
            'fill-opacity': 0.5
          },
          'filter': ['==', 'SMUR', ville] // Filtrer sur le champ "layer" égal à la ville du SMUR sélectionné
        });
      });
      // Ajouter l'élément au menu déroulant
      container.appendChild(option);
    }
  });
}

// Fonction pour générer les options du menu déroulant si on sélectionne Hélismur 10min
function getIsoHeliSmur10(data, type) {
  const container = document.getElementById('myDropdown');
  data.features.forEach(feature => {
    if (feature.properties.fid != null && ((type === 'heli' && (feature.properties.field_1 === 'Dragon' || feature.properties.field_1 === 'HéliSMUR')) || (type === 'terrestre' && (feature.properties.field_1 === 'SMUR Bretagne' || feature.properties.field_1 === 'SMUR Limitrophes')))) { 
      // Créer un élément pour chaque SMUR
      const option = document.createElement("a");
      option.href = "#";
      option.textContent = capitalizeFirstLetter(feature.properties.SMUR.toLowerCase()); 
      option.classList.add('smurdata');
      // Ajouter un gestionnaire d'événements pour le clic sur chaque option
      option.addEventListener("click", function() {
        const ville = feature.properties.Ville;
        const smur = feature.properties.SMUR;
        // Supprimer les couches d'isochrone existantes
        const existingLayers = map.getStyle().layers;
        existingLayers.forEach(layer => {
          if (layer.id.startsWith('isoheli10_')) {
            map.removeLayer(layer.id);
          }
        });
        // Ajouter la nouvelle couche d'isochrone
        const isochroneLayerId = 'isoheli10_' + smur; // Utiliser le nom du SMUR comme ID de la couche
        map.addLayer({
          'id': isochroneLayerId,
          'type': 'fill',
          'source': 'source_heliiso10',
          'paint': {
            'fill-color': '#858CE4', // Couleur de remplissage de l'isochrone
            'fill-opacity': 0.5
          },
          'filter': ['==', 'Ville', ville] // Filtrer sur le champ "layer" égal à la ville du SMUR sélectionné
        });
      });
      // Ajouter l'élément au menu déroulant
      container.appendChild(option);
    }
  });
}

// Fonction pour générer les options du menu déroulant si on sélectionne hélismur 15min
function getIsoHeliSmur15(data, type) {
  const container = document.getElementById('myDropdown');
  data.features.forEach(feature => {
    if (feature.properties.fid != null && ((type === 'heli' && (feature.properties.field_1 === 'Dragon' || feature.properties.field_1 === 'HéliSMUR')) || (type === 'terrestre' && (feature.properties.field_1 === 'SMUR Bretagne' || feature.properties.field_1 === 'SMUR Limitrophes')))) { 
      // Créer un élément pour chaque SMUR
      const option = document.createElement("a");
      option.href = "#";
      option.textContent = capitalizeFirstLetter(feature.properties.SMUR.toLowerCase()); 
      option.classList.add('smurdata');
      // Ajouter un gestionnaire d'événements pour le clic sur chaque option
      option.addEventListener("click", function() {
        const ville = feature.properties.Ville;
        const smur = feature.properties.SMUR;
        // Supprimer les couches d'isochrone existantes
        const existingLayers = map.getStyle().layers;
        existingLayers.forEach(layer => {
          if (layer.id.startsWith('isoheli15_')) {
            map.removeLayer(layer.id);
          }
        });
        // Ajouter la nouvelle couche d'isochrone
        const isochroneLayerId = 'isoheli15_' + smur; // Utiliser le nom du SMUR comme ID de la couche
        map.addLayer({
          'id': isochroneLayerId,
          'type': 'fill',
          'source': 'source_heliiso15',
          'paint': {
            'fill-color': '#858CE4', // Couleur de remplissage de l'isochrone
            'fill-opacity': 0.5
          },
          'filter': ['==', 'Ville', ville] // Filtrer sur le champ "layer" égal à la ville du SMUR sélectionné
        });
      });
      // Ajouter l'élément au menu déroulant
      container.appendChild(option);
    }
  });
}

// Fonction pour générer les options du menu déroulant si on sélectionne hélismur 20min
function getIsoHeliSmur20(data, type) {
  const container = document.getElementById('myDropdown');
  data.features.forEach(feature => {
    if (feature.properties.fid != null && ((type === 'heli' && (feature.properties.field_1 === 'Dragon' || feature.properties.field_1 === 'HéliSMUR')) || (type === 'terrestre' && (feature.properties.field_1 === 'SMUR Bretagne' || feature.properties.field_1 === 'SMUR Limitrophes')))) { 
      // Créer un élément pour chaque SMUR
      const option = document.createElement("a");
      option.href = "#";
      option.textContent = capitalizeFirstLetter(feature.properties.SMUR.toLowerCase()); 
      option.classList.add('smurdata');
      // Ajouter un gestionnaire d'événements pour le clic sur chaque option
      option.addEventListener("click", function() {
        const ville = feature.properties.Ville;
        const smur = feature.properties.SMUR;
        // Supprimer les couches d'isochrone existantes
        const existingLayers = map.getStyle().layers;
        existingLayers.forEach(layer => {
          if (layer.id.startsWith('isoheli20_')) {
            map.removeLayer(layer.id);
          }
        });
        // Ajouter la nouvelle couche d'isochrone
        const isochroneLayerId = 'isoheli20_' + smur; // Utiliser le nom du SMUR comme ID de la couche
        map.addLayer({
          'id': isochroneLayerId,
          'type': 'fill',
          'source': 'source_heliiso20',
          'paint': {
            'fill-color': '#858CE4', // Couleur de remplissage de l'isochrone
            'fill-opacity': 0.5
          },
          'filter': ['==', 'Ville', ville] // Filtrer sur le champ "layer" égal à la ville du SMUR sélectionné
        });
      });
      // Ajouter l'élément au menu déroulant
      container.appendChild(option);
    }
  });
}


// Sélection du bouton "Supprimer"
const deleteButton = document.getElementById('delete');

// Écouteur d'événements pour le clic sur le bouton "Supprimer"
deleteButton.addEventListener('click', function() {
  // Obtenir toutes les couches de la carte
  const layers = map.getStyle().layers;
  
  // Parcourir les couches à partir de la fin pour trouver la dernière couche d'isochrone ajoutée
  for (let i = layers.length - 1; i >= 0; i--) {
    const layer = layers[i];
    if (layer.id.startsWith('iso')) {
      // Supprimer la dernière couche d'isochrone trouvée
      map.removeLayer(layer.id);
      break; // Arrêter la boucle après avoir supprimé la couche
    }
  }
});


///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// CODE POUR AJOUTER DES POP-UP SUR LES SMUR //////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////

d3.csv("./DATA/communes_rang.csv").then(function(csvData) {
  // Charger les données de communes depuis l'API Opendatasoft
  fetch("https://data.opendatasoft.com/api/explore/v2.1/catalog/datasets/georef-france-commune@public/exports/geojson?lang=fr&refine=reg_name%3A%22Bretagne%22&facet=facet(name%3D%22reg_name%22%2C%20disjunctive%3Dtrue)&timezone=Europe%2FBerlin")
    .then(response => response.json())
    .then(function(geojsonData) {
      // Ajout des communes
      map.addLayer({
        'id': 'communesLayer', // Nom de la couche
        'type': 'fill',
        'source': {
          'type': 'geojson',
          'data': geojsonData
        },
        'paint': {
          'fill-color': 'rgba(61,153,80,0)',
          'fill-opacity': 0.15,
          "fill-outline-color": 'grey',
        },
        'layout': {'visibility' : 'none'}
      });

      // Reste du code pour la fusion des données CSV avec les propriétés GeoJSON
      const csvDataMap = {};
      csvData.forEach(function(row) {
        csvDataMap[row.Nom_com] = row;
      });

      geojsonData.features.forEach(function(feature) {
        const communeName = feature.properties['com_name'];

        if (csvDataMap.hasOwnProperty(communeName)) {
          feature.properties = {...feature.properties, ...csvDataMap[communeName]};
        }
      });


      // Ajouter l'événement click à la couche communesLayer
      map.on('click', function(e) {
        var features = map.queryRenderedFeatures(e.point, {
          layers: ['communesLayer']
        });

        if (features.length > 0) {
          // Vérifier si la fonctionnalité est définie
          var feature = features[0];
          if (!feature) {
            return;
          }

          // Récupérer les coordonnées de la fonctionnalité
          var coordinates;
          if (feature.geometry.type === 'Point') {
            coordinates = feature.geometry.coordinates;
          } else if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
            coordinates = feature.geometry.coordinates[0][0];
          } else {
            console.log("Type de géométrie non pris en charge:", feature.geometry.type);
            return;
          }

          // Inverser l'ordre des coordonnées
          var lngLat = [coordinates[1], coordinates[0]];

          // Vérifier si les coordonnées sont valides
          if (isNaN(lngLat[0]) || isNaN(lngLat[1])) {
            console.log("Coordonnées invalides:", lngLat);
            return;
          }

          // Récupérer les autres propriétés nécessaires pour le popup
          var communeName = feature.properties['Nom_com'];
          var rang1 = feature.properties.Rang1;
          var rang2 = feature.properties.Rang2;
          var rang3 = feature.properties.Rang3;
          var rang4 = feature.properties.Rang4;
          var rang5 = feature.properties.Rang5;

          // Créer le contenu HTML pour le popup
          var popupContent = "<div class='popup'>";
          popupContent += "<h3>" + communeName + "</h3>";
          popupContent += "<p class='info'>1er rang : " + rang1 +"</p>";
          popupContent += "<p class='info'>2ème rang : " + rang2 +"</p>";
          popupContent += "<p class='info'>3ème rang : " + rang3 +"</p>";
          popupContent += "<p class='info'>4ème rang : " + rang4 +"</p>";
          popupContent += "<p class='info'>5ème rang : " + rang5 +"</p>";
          popupContent += "</div>";

          // Créer une instance de Popup
          var popup = new mapboxgl.Popup({
            offset: 25
          })
          .setLngLat(lngLat)
          .setHTML(popupContent)
          .addTo(map);
        } else {
          console.log("Aucune fonctionnalité de la couche communesLayer n'a été cliquée.");
        }
      });

        

    });
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


