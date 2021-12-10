import { gql } from 'apollo-server-express';

const tiposUsuario = gql`
  type Usuario {
    _id: ID!
    nombre: String!
    apellido: String!
    identificacion: String!
    correo: String!
    rol: Enum_Rol!
    estado: Enum_EstadoUsuario
    inscripciones: [Inscripcion]
    avances: [Avance]
    proyectos: [Proyecto]
  }
  type Password{
    mensaje: Boolean!
  }

  input FiltroUsuarios{
    _id: ID
    identificacion: String
    correo: String
    rol: Enum_Rol
    estado: Enum_EstadoUsuario
  }

  type Query {
    Usuarios(filtro:FiltroUsuarios): [Usuario]
    UsuariosEstudiantes: [Usuario]
    Usuario(_id: String!): Usuario
  }
  type Mutation {
    crearUsuario(
      nombre: String!
      apellido: String!
      identificacion: String!
      correo: String!
      rol: Enum_Rol!
      estado: Enum_EstadoUsuario
      password: String!
    ): Usuario
    editarUsuario(
      _id: String!
      nombre: String
      apellido: String
      identificacion: String
      correo: String
      rol: Enum_Rol
      estado: Enum_EstadoUsuario
    ): Usuario
    eliminarUsuario(_id: String, correo: String): Usuario
    actualizarPassword(
      correo: String! 
      password: String!
      nuevapassword: String! 
    ): Password
  }
`;

export { tiposUsuario };