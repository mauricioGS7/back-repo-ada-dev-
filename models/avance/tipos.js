import { gql } from "apollo-server-express";

const tiposAvance = gql`
  type Avance {
    _id: ID!
    fechaAvance: Date!
    descripcion: String!
    observaciones: String
    proyecto: Proyecto!
    creadoPor: Usuario!
  }

  type Query {
    Avances: [Avance]
    Avance(_id: String!): Avance
    AvancePorProyecto(idProyecto: String!): [Avance]
    AvancePorUsuario(_id: String!): [Avance]
    ProyectosRegistrar: [Proyecto]
    ProyectosInscritos(idEstudiante: String!): [Proyecto]
  }
  type Mutation {
    crearAvance(
      fechaAvance: Date
      descripcion: String!
      proyecto: String!
      creadoPor: String
      observaciones: String
    ): Avance
    editarAvance(
      _id: String!
      proyecto: String
      descripcion: String!
      observaciones: String
    ): Avance
  }
`;

export { tiposAvance };
