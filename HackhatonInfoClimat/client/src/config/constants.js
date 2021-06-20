import {getYear} from "date-fns";

export const IMPORTANT = [
  {
    id: -1,
    name: "non concerné",
    color: "#ffffff",
  },
  {
    id: 0,
    name: "non défini",
    color: "#ffffff",
  },
  {
    id: 1,
    name: "anecdotique",
    color: "#33cccc",
  },
  {
    id: 2,
    name: "notable",
    color: "#99cc00",
  },
  {
    id: 3,
    name: "remarquable",
    color: "#ff9900",
  },
  {
    id: 4,
    name: "exceptionnel",
    color: "#ff0000",
  },
  {
    id: 5,
    name: "mémorable",
    color: "#ff00ff",
  },
  {
    id: 99,
    name: "dépression tropicale",
    color: "#ffffff",
  },
  {
    id: 98,
    name: "tempête tropicale",
    color: "#ffffff",
  },
  {
    id: 91,
    name: "cyclone cat. 1",
    color: "#33cccc",
  },
  {
    id: 92,
    name: "cyclone cat. 2",
    color: "#99cc00",
  },
  {
    id: 93,
    name: "cyclone cat. 3",
    color: "#ff9900",
  },
  {
    id: 94,
    name: "cyclone cat. 4",
    color: "#ff0000",
  },
  {
    id: 95,
    name: "cyclone cat. 5",
    color: "#ff00ff",
  },
];

export const FILTERS = [
  {
    name: "Nature",
    filters: [
      {
        label: "Type",
        name: "type",
        values: [{
          name: "Froid",
          value: 14,
        }, {
          name: "Froid inhabituel",
          value: 1,
        }, {
          name: "Gelées tardives",
          value: 12,
        }, {
          name: "Gelées précoces",
          value: 13,
        }, {
          name: "Episode neigeux",
          value: 2,
        }, {
          name: "Episode neigeux tardif",
          value: 16,
        }, {
          name: "Episode neigeux précoce",
          value: 17,
        }, {
          name: "Pluies verglaçantes",
          value: 11,
        }, {
          name: "Episode pluvieux",
          value: 4,
        }, {
          name: "Inondation",
          value: 5,
        }, {
          name: "Tempête/coup de vent",
          value: 6,
        }, {
          name: "Dépression extra-tropicale",
          value: 19,
        }, {
          name: "Tempête tropicale",
          value: 20,
        }, {
          name: "Cyclone",
          value: 7,
        }, {
          name: "Chaleur / canicule",
          value: 8,
        }, {
          name: "Douceur inhabituelle",
          value: 3,
        }, {
          name: "Orages",
          value: 9,
        }, {
          name: "Tornades",
          value: 18,
        }, {
          name: "Grêle",
          value: 15,
        }, {
          name: "Sécheresse",
          value: 10,
        }, {
          name: "Autres",
          value: -1,
        }],
      },
      {
        label: "Importance",
        name: "importance",
        values: [{
          name: "Mémorable",
          value: 5,
        }, {
          name: "Exceptionnel",
          value: 4,
        }, {
          name: "Remarquable",
          value: 3,
        }, {
          name: "Notable",
          value: 2,
        }, {
          name: "Anecdotique",
          value: 1,
        }, {
          name: "Non définie",
          value: 0,
        }],
      },
    ],
  },
  {
    name: "Localisation",
    filters: [
      {
        label: "Lieu",
        name: "localisation",
        values: [{
          name: "Evenement national",
          value: -1,
        }, {
          name: "Alsace",
          value: 42,
        }, {
          name: "Aquitaine",
          value: 72,
        }, {
          name: "Auvergne",
          value: 83,
        }, {
          name: "Bourgogne",
          value: 26,
        }, {
          name: "Bretagne",
          value: 53,
        }, {
          name: "Champagne-Ardenne",
          value: 21,
        }, {
          name: "Corse",
          value: 94,
        }, {
          name: "Franche-Comté",
          value: 43,
        }, {
          name: "Ile-de-France",
          value: 11,
        }, {
          name: "Languedoc-Rousillon",
          value: 91,
        }, {
          name: "Limousin",
          value: 74,
        }, {
          name: "Centre",
          value: 24,
        }, {
          name: "Lorraine",
          value: 41,
        }, {
          name: "Midi-Pyrénées",
          value: 73,
        }, {
          name: "Nord-Pas-de-Calais",
          value: 31,
        }, {
          name: "Basse-Normandie",
          value: 25,
        }, {
          name: "Pays de la Loire",
          value: 52,
        }, {
          name: "Picardie",
          value: 22,
        }, {
          name: "Poitou-Charentes",
          value: 54,
        }, {
          name: "PACA",
          value: 93,
        }, {
          name: "Rhône-Alpe",
          value: 82,
        }, {
          name: "Guadeloupe",
          value: -1,
        }, {
          name: "Guyane",
          value: -1,
        }, {
          name: "Martinique",
          value: -1,
        }, {
          name: "La Réunion",
          value: -1,
        }, {
          name: "Nouvelle-Calédonie",
          value: -1,
        }, {
          name: "Saint-Barthélemy",
          value: -1,
        }, {
          name: "Saint-Martin",
          value: -1,
        }, {
          name: "Autre",
          value: -1,
        }],
      },
    ],
  },
  {
    name: "Temporalité",
    filters: [
      {
        col: 6,
        label: "Mois",
        name: "mois",
        values: [{
          name: "Janvier",
          value: 1,
        }, {
          name: "Février",
          value: 2,
        }, {
          name: "Mars",
          value: 3,
        }, {
          name: "Avril",
          value: 4,
        }, {
          name: "Mai",
          value: 5,
        }, {
          name: "Juin",
          value: 6,
        }, {
          name: "Juillet",
          value: 7,
        }, {
          name: "Aout",
          value: 8,
        }, {
          name: "Septembre",
          value: 9,
        }, {
          name: "Octobre",
          value: 10,
        }, {
          name: "Novembre",
          value: 11,
        }, {
          name: "Décembre",
          value: 12,
        }],
      },
      {
        col: 6,
        label: "Année",
        name: "annee",
        values: generateYears(new Date()),
      },
      {
        label: "Durée",
        name: "duree",
        values: [{
          name: "Ponctuel",
          value: 1,
        }, {
          name: "Plusieurs jours",
          value: 2,
        }, {
          name: "Plusieurs semaines",
          value: 3,
        }, {
          name: "Plusieurs mois",
          value: 4,
        }],
      },
      {
        col: 6,
        label: "Date de début",
        name: "date_deb",
        isDate: true,
      },
      {
        col: 6,
        label: "Date de fin",
        name: "date_fin",
        isDate: true,
      },
    ],
  },
];

export const FILTER_VALUES = [
  {value: '1', name: 'Température minimale', unit: '°C (Tn)'},
  {value: '2', name: 'Précipitations / 24h (6h-6h', unit: 'mm'},
  {value: '3', name: 'Vent en rafales', unit: 'km/h'},
  {value: '4', name: 'Hauteur de neige au sol', unit: 'cm'},
  {value: '5', name: 'Hauteur d’eau', unit: 'm'},
  {value: '6', name: 'Température maximale ', unit: '°C (Tx)'},
  {value: '7', name: 'Vent moyen', unit: 'km/h'},
  {value: '8', name: 'Hauteur de neige fraîche ', unit: 'cm'},
  {value: '9', name: 'Précipitations / + de 48h', unit: 'mm'},
  {value: '10', name: 'Windchill', unit: ''},
  {value: '11', name: 'Humidex', unit: ''},
  {value: '12', name: 'Pression', unit: 'hPa'},
  {value: '13', name: 'Impacts de foudre', unit: 'nombre en 24h'},
  {value: '14', name: 'Taille des grêlons', unit: 'cm'},
  {value: '15', name: 'Précipitations / 48h (6h-6h) ', unit: 'mm (en 48h)'},
  {value: '16', name: 'Précips. sur tout l’épisode ', unit: 'mm (total)'},
  {value: '17', name: 'Précipitations / 1h', unit: 'mm (en 1h)'},
  {value: '18', name: 'Précipitations / 6h', unit: 'mm (en 6h)'},
  {value: '19', name: 'Précipitations / 12h', unit: 'mm (en 12h)'},
]

export const FILTER_VALUES_OPERATORS = [
  {value: '>', name: 'Supérieure à'},
  {value: '<', name: 'Inférieure à'},
  {value: '>=', name: 'Supérieure ou égale à'},
  {value: '<=', name: 'Inférieure ou égale à'},
  {value: '=', name: 'Égale à'},
];

export function generateYears(date) {

  let lastYear = getYear(date);
  let tab = [];
  for (let i = lastYear; i >= 1900; i--) {
    tab.push({
      name: i,
      value: i,
    });
  }

  return tab;
}

export const DURATIONS = [
  {value: 1, name: "ponctuel"},
  {value: 2, name: "plusieurs jours"},
  {value: 3, name: "plusieurs semaines"},
  {value: 4, name: "plusieurs mois"},
];






