import { gql } from "apollo-server-express";

const tiposInscripcion = gql`
  type Inscripcion {
    _id: ID!
    estado: Enum_EstadoInscripcion
    fechaInscripcion: Date
    fechaIngreso: Date
    fechaEgreso: Date
    proyecto: Proyecto!
    estudiante: Usuario!
  }

  type Query {
    consultarInscripciones: [Inscripcion]
    consultarInscripcionesPorProyecto(projectId: String!): [Inscripcion]
    consultarInscripcionesPorEstudiante(estudianteId: String!): [Inscripcion]
  }

  type Mutation {
    crearInscripcion(proyecto: String!, estudiante: String!): Inscripcion
    aprobarInscripcion(id: String!): Inscripcion
    rechazarInscripcion(id: String!): Inscripcion
    eliminarInscripcionesProyecto(projectId: String!): String
  }
`;

export { tiposInscripcion };
