// Tipos de placas
export const types = [
  {
    id: 1, // Tipo de placa
    lines: 3, // Número de líneas
    maxChars: 20 // Máximo de caracteres
  },
  {
    id: 2,
    lines: 5,
    maxChars: 20
  },
  {
    id: 3,
    lines: 7,
    maxChars: 13
  }
];

// Modelos de planchas
export const models = [
  {
    id: 1,
    config: [
      {
        type: 1, // Tipo de placa
        droneSheets: 10 // Número de placas por plancha
      }
    ]
  },
  {
    id: 2,
    config: [
      {
        type: 1,
        droneSheets: 2
      },
      {
        type: 2,
        droneSheets: 2
      },
      {
        type: 3,
        droneSheets: 2
      }
    ]
  }
];
