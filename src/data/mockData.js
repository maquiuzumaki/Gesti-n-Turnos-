/**
 * Mock Data - Base de datos simulada para Uzumaki
 * Estructura simple, limpia y sin lógica de negocio.
 * Todos los datos responden a las reglas definidas en Directivas.md
 */

// ============================================================================
// CATÁLOGOS
// ============================================================================

export const rolesOperativos = {
  cocinero: {
    id: "rol-cocinero",
    nombre: "Cocinero",
    sector: "Cocina",
  },
  peonCocina: {
    id: "rol-peon-cocina",
    nombre: "Peón de cocina",
    sector: "Cocina",
  },
  camarera: {
    id: "rol-camarera",
    nombre: "Camarera",
    sector: "Pisos",
  },
  franquera: {
    id: "rol-franquera",
    nombre: "Franquera",
    sectores: ["Pisos", "Cocina"],
  },
  nutricionista: {
    id: "rol-nutricionista",
    nombre: "Nutricionista",
  },
};

export const rolesSistema = {
  admin: {
    id: "sys-admin",
    nombre: "Administradora",
  },
  encargada: {
    id: "sys-encargada",
    nombre: "Encargada",
  },
  supervisora: {
    id: "sys-supervisora",
    nombre: "Supervisora",
  },
  personal: {
    id: "sys-personal",
    nombre: "Personal",
  },
};

export const sectores = {
  cocina: {
    id: "sec-cocina",
    nombre: "Cocina",
  },
  pisos: {
    id: "sec-pisos",
    nombre: "Pisos",
  },
};

export const turnos = {
  manana: {
    id: "turno-manana",
    nombre: "Mañana",
    horaInicio: "06:00",
    horaFin: "14:00",
  },
  tarde: {
    id: "turno-tarde",
    nombre: "Tarde",
    horaInicio: "14:00",
    horaFin: "21:30",
  },
};

export const pisos = {
  piso1: {
    id: "piso-1",
    numero: 1,
  },
  piso2: {
    id: "piso-2",
    numero: 2,
  },
  piso3: {
    id: "piso-3",
    numero: 3,
  },
};

// ============================================================================
// MÓDULOS DEL MVP
// ============================================================================

// Dotación oficial: 13 empleados operativos y 3 perfiles administrativos.
// Cocina: 2 cocineros y 1 peón de mañana; 1 cocinero y 1 peón de tarde.
// Pisos: 6 camareras fijas y 2 franqueras.
// La cobertura de Julio por Gustavo es una excepción documentada, no automática.

export const employees = [
  {
    id: "emp-cocinero-manana-1",
    name: "Gustavo",
    initials: "GU",
    role: "Cocinero",
    roleId: "rol-cocinero",
    sector: "Cocina",
    sectorId: "sec-cocina",
    turno: "Mañana",
    turnoId: "turno-manana",
    piso: null,
    phone: "",
    status: "active",
    systemRole: "Personal",
    participaEnOperacion: true,
    francos: [
      { fecha: "2025-11-30", tipo: "F2" },
      { fecha: "2025-12-01", tipo: "F2" },
      { fecha: "2025-12-08", tipo: "F1" },
    ],
  },
  {
    id: "emp-cocinero-manana-2",
    name: "Mario",
    initials: "MA",
    role: "Cocinero",
    roleId: "rol-cocinero",
    sector: "Cocina",
    sectorId: "sec-cocina",
    turno: "Mañana",
    turnoId: "turno-manana",
    piso: null,
    phone: "",
    status: "active",
    systemRole: "Personal",
    participaEnOperacion: true,
    francos: [
      { fecha: "2025-12-04", tipo: "F2" },
      { fecha: "2025-12-05", tipo: "F2" },
      { fecha: "2025-12-12", tipo: "F1" },
      { fecha: "2025-12-28", tipo: "F1" },
    ],
  },
  {
    id: "emp-peon-veronica",
    name: "Verónica",
    initials: "VE",
    role: "Peón de cocina",
    roleId: "rol-peon-cocina",
    sector: "Cocina",
    sectorId: "sec-cocina",
    turno: "Mañana",
    turnoId: "turno-manana",
    piso: null,
    phone: "",
    status: "active",
    systemRole: "Personal",
    participaEnOperacion: true,
    francos: [
      { fecha: "2025-12-02", tipo: "F2" },
      { fecha: "2025-12-03", tipo: "F2" },
      { fecha: "2025-12-10", tipo: "F1" },
      { fecha: "2025-12-25", tipo: "F1" },
    ],
  },
  {
    id: "emp-cocinero-julio",
    name: "Julio",
    initials: "JU",
    role: "Cocinero",
    roleId: "rol-cocinero",
    sector: "Cocina",
    sectorId: "sec-cocina",
    turno: "Tarde",
    turnoId: "turno-tarde",
    piso: null,
    phone: "",
    status: "active",
    systemRole: "Personal",
    participaEnOperacion: true,
    francos: [
      { fecha: "2025-12-06", tipo: "F2" },
      { fecha: "2025-12-07", tipo: "F2" },
      { fecha: "2025-12-14", tipo: "F1" },
      { fecha: "2025-12-29", tipo: "F1" },
    ],
  },
  {
    id: "emp-peon-tarde-1",
    name: "Víctor",
    initials: "VI",
    role: "Peón de cocina",
    roleId: "rol-peon-cocina",
    sector: "Cocina",
    sectorId: "sec-cocina",
    turno: "Tarde",
    turnoId: "turno-tarde",
    piso: null,
    phone: "",
    status: "active",
    systemRole: "Personal",
    participaEnOperacion: true,
    francos: [
      { fecha: "2025-12-05", tipo: "F1" },
      { fecha: "2025-12-12", tipo: "F2" },
      { fecha: "2025-12-13", tipo: "F2" },
    ],
  },
  {
    id: "emp-camarera-yesica",
    name: "Yesica",
    initials: "YE",
    role: "Camarera",
    roleId: "rol-camarera",
    sector: "Pisos",
    sectorId: "sec-pisos",
    turno: "Tarde",
    turnoId: "turno-tarde",
    piso: 3,
    phone: "",
    status: "active",
    systemRole: "Personal",
    participaEnOperacion: true,
    francos: [
      { fecha: "2025-12-04", tipo: "F1" },
      { fecha: "2025-12-18", tipo: "F1" },
      { fecha: "2025-12-11", tipo: "F2" },
      { fecha: "2025-12-12", tipo: "F2" },
      { fecha: "2025-12-26", tipo: "F2" },
      { fecha: "2025-12-27", tipo: "F2" },
    ],
  },
  {
    id: "emp-camarera-loly",
    name: "Loly",
    initials: "LO",
    role: "Camarera",
    roleId: "rol-camarera",
    sector: "Pisos",
    sectorId: "sec-pisos",
    turno: "Mañana",
    turnoId: "turno-manana",
    piso: 2,
    phone: "",
    status: "active",
    systemRole: "Personal",
    participaEnOperacion: true,
    francos: [
      { fecha: "2025-12-02", tipo: "F2" },
      { fecha: "2025-12-03", tipo: "F2" },
      { fecha: "2025-12-17", tipo: "F2" },
      { fecha: "2025-12-18", tipo: "F2" },
      { fecha: "2025-12-10", tipo: "F1" },
      { fecha: "2025-12-25", tipo: "F1" },
    ],
  },
  {
    id: "emp-camarera-estela",
    name: "Estela",
    initials: "ES",
    role: "Camarera",
    roleId: "rol-camarera",
    sector: "Pisos",
    sectorId: "sec-pisos",
    turno: "Mañana",
    turnoId: "turno-manana",
    piso: 1,
    phone: "",
    status: "active",
    systemRole: "Personal",
    participaEnOperacion: true,
    francos: [
      { fecha: "2025-12-01", tipo: "F2" },
      { fecha: "2025-12-02", tipo: "F2" },
      { fecha: "2025-12-16", tipo: "F2" },
      { fecha: "2025-12-17", tipo: "F2" },
      { fecha: "2025-12-30", tipo: "F2" },
      { fecha: "2025-12-31", tipo: "F2" },
      { fecha: "2025-12-09", tipo: "F1" },
      { fecha: "2025-12-24", tipo: "F1" },
    ],
  },
  {
    id: "emp-camarera-romina",
    name: "Romina",
    initials: "RO",
    role: "Camarera",
    roleId: "rol-camarera",
    sector: "Pisos",
    sectorId: "sec-pisos",
    turno: "Tarde",
    turnoId: "turno-tarde",
    piso: 2,
    phone: "",
    status: "active",
    systemRole: "Personal",
    participaEnOperacion: true,
    francos: [
      { fecha: "2025-12-07", tipo: "F2" },
      { fecha: "2025-12-08", tipo: "F2" },
      { fecha: "2025-12-22", tipo: "F2" },
      { fecha: "2025-12-23", tipo: "F2" },
      { fecha: "2025-12-15", tipo: "F1" },
      { fecha: "2025-12-30", tipo: "F1" },
    ],
  },
  {
    id: "emp-camarera-cintia",
    name: "Cintia",
    initials: "CI",
    role: "Camarera",
    roleId: "rol-camarera",
    sector: "Pisos",
    sectorId: "sec-pisos",
    turno: "Mañana",
    turnoId: "turno-manana",
    piso: 3,
    phone: "",
    status: "active",
    systemRole: "Personal",
    participaEnOperacion: true,
    francos: [
      { fecha: "2025-12-05", tipo: "F1" },
      { fecha: "2025-12-20", tipo: "F1" },
      { fecha: "2025-12-12", tipo: "F2" },
      { fecha: "2025-12-13", tipo: "F2" },
      { fecha: "2025-12-27", tipo: "F2" },
      { fecha: "2025-12-28", tipo: "F2" },
    ],
  },
  {
    id: "emp-camarera-milagros",
    name: "Milagros",
    initials: "MI",
    role: "Camarera",
    roleId: "rol-camarera",
    sector: "Pisos",
    sectorId: "sec-pisos",
    turno: "Tarde",
    turnoId: "turno-tarde",
    piso: 1,
    phone: "",
    status: "active",
    systemRole: "Personal",
    participaEnOperacion: true,
    francos: [
      { fecha: "2025-12-08", tipo: "F1" },
      { fecha: "2025-12-23", tipo: "F1" },
      { fecha: "2025-12-15", tipo: "F2" },
      { fecha: "2025-12-16", tipo: "F2" },
      { fecha: "2025-12-29", tipo: "F2" },
      { fecha: "2025-12-30", tipo: "F2" },
    ],
  },
  {
    id: "emp-franquera-debora",
    name: "Débora",
    initials: "DE",
    role: "Franquera",
    roleId: "rol-franquera",
    sector: "Pisos",
    sectorId: "sec-pisos",
    turno: null,
    turnoId: null,
    piso: null,
    phone: "",
    status: "active",
    systemRole: "Personal",
    participaEnOperacion: true,
    francos: [
      { fecha: "2025-12-06", tipo: "F2" },
      { fecha: "2025-12-07", tipo: "F2" },
      { fecha: "2025-12-21", tipo: "F2" },
      { fecha: "2025-12-22", tipo: "F2" },
      { fecha: "2025-12-15", tipo: "F1" },
      { fecha: "2025-12-29", tipo: "F1" },
    ],
  },
  {
    id: "emp-franquera-lucila",
    name: "Lucila",
    initials: "LU",
    role: "Franquera",
    roleId: "rol-franquera",
    sector: "Pisos",
    sectorId: "sec-pisos",
    turno: null,
    turnoId: null,
    piso: null,
    phone: "",
    status: "active",
    systemRole: "Personal",
    participaEnOperacion: true,
    francos: [
      { fecha: "2025-12-07", tipo: "F1" },
      { fecha: "2025-12-20", tipo: "F1" },
      { fecha: "2025-12-13", tipo: "F2" },
      { fecha: "2025-12-14", tipo: "F2" },
      { fecha: "2025-12-27", tipo: "F2" },
      { fecha: "2025-12-28", tipo: "F2" },
    ],
  },
  {
    id: "emp-encargada-manana",
    name: "Encargada Nutricionista Mañana",
    initials: "ENM",
    role: "Encargada/Nutricionista",
    roleId: "rol-nutricionista",
    sector: null,
    sectorId: null,
    turno: "Mañana",
    turnoId: "turno-manana",
    piso: null,
    phone: "",
    status: "active",
    systemRole: "Encargada",
    participaEnOperacion: false,
    francos: [],
    jornadaAdministrativa: {
      diasHabituales: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
      horaInicio: "07:00",
      horaFin: "14:00",
      guardiaSabado: {
        participa: true,
        modalidad: "Alternada semana por medio",
        horaInicio: "08:00",
        horaFin: "13:00",
      },
    },
  },
  {
    id: "emp-encargada-tarde",
    name: "Encargada Nutricionista Tarde",
    initials: "ENT",
    role: "Encargada/Nutricionista",
    roleId: "rol-nutricionista",
    sector: null,
    sectorId: null,
    turno: "Tarde",
    turnoId: "turno-tarde",
    piso: null,
    phone: "",
    status: "active",
    systemRole: "Encargada",
    participaEnOperacion: false,
    francos: [],
    jornadaAdministrativa: {
      diasHabituales: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
      horaInicio: "14:00",
      horaFin: "21:00",
      guardiaSabado: {
        participa: true,
        modalidad: "Alternada semana por medio",
        horaInicio: "08:00",
        horaFin: "13:00",
      },
    },
  },
  {
    id: "emp-supervisora-general",
    name: "Supervisora General",
    initials: "SG",
    role: "Supervisora",
    roleId: null,
    sector: null,
    sectorId: null,
    turno: null,
    turnoId: null,
    piso: null,
    phone: "",
    status: "active",
    systemRole: "Supervisora",
    participaEnOperacion: false,
    francos: [],
  },
];

export const rotacionPisosProgramada = {
  periodo: "Septiembre",
  estado: "Planificada",
  asignaciones: [
    { employeeId: "emp-camarera-cintia", name: "Cintia", turno: "Mañana", piso: 1 },
    { employeeId: "emp-camarera-estela", name: "Estela", turno: "Mañana", piso: 2 },
    { employeeId: "emp-camarera-loly", name: "Loly", turno: "Mañana", piso: 3 },
    { employeeId: "emp-camarera-yesica", name: "Yesica", turno: "Tarde", piso: 1 },
    { employeeId: "emp-camarera-milagros", name: "Milagros", turno: "Tarde", piso: 2 },
    { employeeId: "emp-camarera-romina", name: "Romina", turno: "Tarde", piso: 3 },
  ],
};

// Semana real cargada exclusivamente como referencia visual y funcional.
// No fue calculada, no define recurrencias y no debe alimentar futuras grillas.
export const referenceSchedule = {
  id: "grilla-referencia-2026-06-29",
  type: "reference",
  calculated: false,
  startDate: "2026-06-29",
  endDate: "2026-07-05",
  label: "29 de junio al 5 de julio de 2026",
  days: [
    {
      id: "2026-06-29",
      label: "Lunes",
      shortLabel: "Lun",
      displayDate: "29/06",
      cocina: {
        manana: [
          { employeeId: "emp-cocinero-manana-2", name: "Mario" },
          { employeeId: "emp-peon-veronica", name: "Verónica" },
        ],
        tarde: [
          { employeeId: "emp-cocinero-julio", name: "Julio" },
          { employeeId: "emp-peon-tarde-1", name: "Víctor" },
        ],
      },
      pisos: {
        manana: {
          1: { employeeId: "emp-franquera-lucila", name: "Lucila", kind: "coverage", note: "Cobertura" },
          2: { employeeId: "emp-camarera-loly", name: "Loly" },
          3: { employeeId: "emp-camarera-cintia", name: "Cintia" },
        },
        tarde: {
          1: { employeeId: "emp-franquera-debora", name: "Débora", kind: "coverage", note: "Cobertura" },
          2: { employeeId: "emp-camarera-romina", name: "Romina" },
          3: { employeeId: "emp-camarera-yesica", name: "Yesica" },
        },
      },
      francos: {
        cocina: [
          { employeeId: "emp-cocinero-manana-1", name: "Gustavo" },
        ],
        pisos: [
          { employeeId: "emp-camarera-estela", name: "Estela" },
          { employeeId: "emp-camarera-milagros", name: "Milagros" },
        ],
      },
    },
    {
      id: "2026-06-30",
      label: "Martes",
      shortLabel: "Mar",
      displayDate: "30/06",
      cocina: {
        manana: [
          { employeeId: "emp-cocinero-manana-2", name: "Mario" },
          { employeeId: "emp-cocinero-manana-1", name: "Gustavo" },
        ],
        tarde: [
          { employeeId: "emp-cocinero-julio", name: "Julio" },
          { employeeId: "emp-peon-tarde-1", name: "Víctor" },
        ],
      },
      pisos: {
        manana: {
          1: { employeeId: "emp-franquera-debora", name: "Débora", kind: "coverage", note: "Cobertura" },
          2: { employeeId: "emp-franquera-lucila", name: "Lucila", kind: "coverage", note: "Cobertura" },
          3: { employeeId: "emp-camarera-cintia", name: "Cintia" },
        },
        tarde: {
          1: { employeeId: "emp-camarera-milagros", name: "Milagros" },
          2: { employeeId: "emp-camarera-romina", name: "Romina" },
          3: { employeeId: "emp-camarera-yesica", name: "Yesica" },
        },
      },
      francos: {
        cocina: [
          { employeeId: "emp-peon-veronica", name: "Verónica" },
        ],
        pisos: [
          { employeeId: "emp-camarera-loly", name: "Loly" },
          { employeeId: "emp-camarera-estela", name: "Estela" },
        ],
      },
    },
    {
      id: "2026-07-01",
      label: "Miércoles",
      shortLabel: "Mié",
      displayDate: "01/07",
      cocina: {
        manana: [
          { employeeId: "emp-cocinero-manana-2", name: "Mario" },
          { employeeId: "emp-cocinero-manana-1", name: "Gustavo" },
          { employeeId: "emp-franquera-debora", name: "Débora", kind: "collaboration", note: "Franquera en Cocina" },
        ],
        tarde: [
          { employeeId: "emp-cocinero-julio", name: "Julio" },
          { employeeId: "emp-peon-tarde-1", name: "Víctor" },
        ],
      },
      pisos: {
        manana: {
          1: { employeeId: "emp-camarera-estela", name: "Estela" },
          2: { employeeId: "emp-franquera-lucila", name: "Lucila", kind: "coverage", note: "Cobertura" },
          3: { employeeId: "emp-camarera-cintia", name: "Cintia" },
        },
        tarde: {
          1: { employeeId: "emp-camarera-milagros", name: "Milagros" },
          2: { employeeId: "emp-camarera-romina", name: "Romina" },
          3: { employeeId: "emp-camarera-yesica", name: "Yesica" },
        },
      },
      francos: {
        cocina: [
          { employeeId: "emp-peon-veronica", name: "Verónica" },
        ],
        pisos: [
          { employeeId: "emp-camarera-loly", name: "Loly" },
        ],
      },
    },
    {
      id: "2026-07-02",
      label: "Jueves",
      shortLabel: "Jue",
      displayDate: "02/07",
      cocina: {
        manana: [
          { employeeId: "emp-cocinero-manana-1", name: "Gustavo" },
          { employeeId: "emp-peon-veronica", name: "Verónica" },
          { employeeId: "emp-franquera-lucila", name: "Lucila", kind: "collaboration", note: "Franquera en Cocina" },
        ],
        tarde: [
          { employeeId: "emp-cocinero-julio", name: "Julio" },
          { employeeId: "emp-peon-tarde-1", name: "Víctor" },
        ],
      },
      pisos: {
        manana: {
          1: { employeeId: "emp-camarera-estela", name: "Estela" },
          2: { employeeId: "emp-camarera-loly", name: "Loly" },
          3: { employeeId: "emp-camarera-cintia", name: "Cintia" },
        },
        tarde: {
          1: { employeeId: "emp-camarera-milagros", name: "Milagros" },
          2: { employeeId: "emp-camarera-romina", name: "Romina" },
          3: { employeeId: "emp-franquera-debora", name: "Débora", kind: "coverage", note: "Cobertura" },
        },
      },
      francos: {
        cocina: [
          { employeeId: "emp-cocinero-manana-2", name: "Mario" },
        ],
        pisos: [
          { employeeId: "emp-camarera-yesica", name: "Yesica" },
        ],
      },
    },
    {
      id: "2026-07-03",
      label: "Viernes",
      shortLabel: "Vie",
      displayDate: "03/07",
      cocina: {
        manana: [
          { employeeId: "emp-cocinero-manana-1", name: "Gustavo" },
          { employeeId: "emp-peon-veronica", name: "Verónica" },
        ],
        tarde: [
          { employeeId: "emp-cocinero-julio", name: "Julio" },
          { employeeId: "emp-franquera-debora", name: "Débora", kind: "coverage", note: "Cubriendo" },
        ],
      },
      pisos: {
        manana: {
          1: { employeeId: "emp-camarera-estela", name: "Estela" },
          2: { employeeId: "emp-camarera-loly", name: "Loly" },
          3: { employeeId: "emp-franquera-lucila", name: "Lucila", kind: "coverage", note: "Cobertura" },
        },
        tarde: {
          1: { employeeId: "emp-camarera-milagros", name: "Milagros" },
          2: { employeeId: "emp-camarera-romina", name: "Romina" },
          3: { employeeId: "emp-camarera-yesica", name: "Yesica" },
        },
      },
      francos: {
        cocina: [
          { employeeId: "emp-cocinero-manana-2", name: "Mario" },
          { employeeId: "emp-peon-tarde-1", name: "Víctor" },
        ],
        pisos: [
          { employeeId: "emp-camarera-cintia", name: "Cintia" },
        ],
      },
    },
    {
      id: "2026-07-04",
      label: "Sábado",
      shortLabel: "Sáb",
      displayDate: "04/07",
      cocina: {
        manana: [
          { employeeId: "emp-cocinero-manana-2", name: "Mario" },
          { employeeId: "emp-peon-veronica", name: "Verónica" },
        ],
        tarde: [
          { employeeId: "emp-cocinero-manana-1", name: "Gustavo", kind: "exception", note: "Cubre franco de Julio" },
          { employeeId: "emp-peon-tarde-1", name: "Víctor" },
        ],
      },
      pisos: {
        manana: {
          1: { employeeId: "emp-camarera-estela", name: "Estela" },
          2: { employeeId: "emp-camarera-loly", name: "Loly" },
          3: { employeeId: "emp-camarera-cintia", name: "Cintia" },
        },
        tarde: {
          1: { employeeId: "emp-camarera-milagros", name: "Milagros" },
          2: { employeeId: "emp-camarera-romina", name: "Romina" },
          3: { employeeId: "emp-camarera-yesica", name: "Yesica" },
        },
      },
      francos: {
        cocina: [
          { employeeId: "emp-cocinero-julio", name: "Julio" },
        ],
        pisos: [
          { employeeId: "emp-franquera-debora", name: "Débora" },
          { employeeId: "emp-franquera-lucila", name: "Lucila" },
        ],
      },
    },
    {
      id: "2026-07-05",
      label: "Domingo",
      shortLabel: "Dom",
      displayDate: "05/07",
      cocina: {
        manana: [
          { employeeId: "emp-cocinero-manana-2", name: "Mario" },
          { employeeId: "emp-peon-veronica", name: "Verónica" },
        ],
        tarde: [
          { employeeId: "emp-cocinero-manana-1", name: "Gustavo", kind: "exception", note: "Cubre franco de Julio" },
          { employeeId: "emp-peon-tarde-1", name: "Víctor" },
        ],
      },
      pisos: {
        manana: {
          1: { employeeId: "emp-camarera-estela", name: "Estela" },
          2: { employeeId: "emp-camarera-loly", name: "Loly" },
          3: { employeeId: "emp-camarera-cintia", name: "Cintia" },
        },
        tarde: {
          1: { employeeId: "emp-camarera-milagros", name: "Milagros" },
          2: { employeeId: "emp-franquera-lucila", name: "Lucila", kind: "coverage", note: "Cobertura" },
          3: { employeeId: "emp-camarera-yesica", name: "Yesica" },
        },
      },
      francos: {
        cocina: [
          { employeeId: "emp-cocinero-julio", name: "Julio" },
        ],
        pisos: [
          { employeeId: "emp-franquera-debora", name: "Débora" },
          { employeeId: "emp-camarera-romina", name: "Romina" },
        ],
      },
    },
  ],
};

export const weeklySchedules = [];
export const requests = [];
export const notifications = [];
export const auditLogs = [];
export const incidents = [];

export const initialSchedule = weeklySchedules;
export const initialRequests = requests;
export const initialNotifications = notifications;
export const initialAudit = auditLogs;

// ============================================================================
// USUARIOS DE DEMOSTRACIÓN
// ============================================================================

export const demoUsers = [
  {
    id: "user-maqui",
    username: "maqui",
    password: "demo123",
    name: "Maqui Uzumaki",
    role: "manager",
    employeeId: "emp-encargada-manana",
  },
  {
    id: "user-supervisora",
    username: "supervisora",
    password: "demo123",
    name: "Supervisora",
    role: "supervisor",
    employeeId: "emp-supervisora-general",
  },
  {
    id: "user-debora",
    username: "debora",
    password: "demo123",
    name: "Débora",
    role: "staff",
    employeeId: "emp-franquera-debora",
  },
  {
    id: "user-lucila",
    username: "lucila",
    password: "demo123",
    name: "Lucila",
    role: "staff",
    employeeId: "emp-franquera-lucila",
  },
];

// Alias para compatibilidad
export const DAYS = ["Lun 29", "Mar 30", "Mié 1", "Jue 2", "Vie 3", "Sáb 4", "Dom 5"];
