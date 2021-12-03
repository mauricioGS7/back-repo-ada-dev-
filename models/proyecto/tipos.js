import { gql } from "apollo-server-express";

const tiposProyecto = gql`
  type Objetivo {
    _id: ID!
    descripcion: String!
    tipo: Enum_TipoObjetivo!
  }

  input crearObjetivo {
    descripcion: String!
    tipo: Enum_TipoObjetivo!
  }
  input camposObjetivo {
    descripcion: String!
    tipo: Enum_TipoObjetivo!
  }

  input camposProyecto{
    nombre: String
    presupuesto: Float
    fechaInicio: Date
    fechaFin: Date
    estado: Enum_EstadoProyecto
    fase: Enum_FaseProyecto
    lider: String
  }

  type Proyecto {
    _id: ID!
    nombre: String!
    presupuesto: Float!
    fechaInicio: Date!
    fechaFin: Date
    estado: Enum_EstadoProyecto!
    fase: Enum_FaseProyecto!
    lider: Usuario!
    objetivos: [Objetivo]
    avances: [Avance]
    inscripciones: [Inscripcion]
  }

  type Query {
    Proyectos: [Proyecto]
    ProyectosLiderados(idLider:String!): [Proyecto]
  }

  type Mutation {
    crearProyecto(
      nombre: String!
      presupuesto: Float!
      fechaInicio: Date!
      fechaFin: Date
      estado: Enum_EstadoProyecto!
      fase: Enum_FaseProyecto!
      lider: String!
      objetivos: [crearObjetivo]
    ): Proyecto

    crearObjetivo(
      idProyecto: String!, 
      campos: camposObjetivo!
    ):Proyecto

    editarProyectoAdmin(
      _id:String!
      estado: Enum_EstadoProyecto
      fase: Enum_FaseProyecto
      fechaInicio: Date
      fechaFin: Date
    ):Proyecto

    editarProyectoLider(
      _id:String!
      nombre: String
      presupuesto: Float
      indexObjetivo:Int
      campos:camposObjetivo

    ):Proyecto

    eliminarProyecto(
      _id:String!
    ): Proyecto

    editarObjetivo(
      idProyecto: String!
      indexObjetivo:Int!
      campos:camposObjetivo
    ):Proyecto

    eliminarObjetivo(
      idPoryecto:String!
      idObjetivo:String!
    ):Proyecto
  }
`;

export { tiposProyecto };
