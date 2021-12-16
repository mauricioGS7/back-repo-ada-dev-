import { InscriptionModel } from "./inscripcion.js";

const resolverInscripciones = {
  Query: {
    consultarInscripciones: async (parent, args) => {
      const inscripciones = await InscriptionModel.find({ estado: "PENDIENTE" })
        .populate("proyecto")
        .populate("estudiante");
      return inscripciones;
    },

    consultarInscripcionesPorProyecto: async (parent, args) => {
      const inscripcionesPorProyecto = await InscriptionModel.find({
        proyecto: args.projectId, estado : 'PENDIENTE'
      }).populate("proyecto")
        .populate("estudiante")        
      return inscripcionesPorProyecto;
    },

    consultarInscripcionesPorEstudiante :async (parent, args) => {
      const inscripcionesPorEstudiante = await InscriptionModel.find({
        estudiante: args.estudianteId
      }).populate("proyecto")
        .populate("estudiante");
      return inscripcionesPorEstudiante;
    }        
    
  },
  Mutation: {
    crearInscripcion: async (parent, args) => {
      const inscripcionCreada = await InscriptionModel.create({
        proyecto: args.proyecto,
        estudiante: args.estudiante,
      });
      return inscripcionCreada;
    },
    aprobarInscripcion: async (parent, args) => {
      const inscripcionAprobada = await InscriptionModel.findByIdAndUpdate(
        args.id,
        {
          estado: "ACEPTADO",
          fechaIngreso: Date.now(),
        },
        {
          new: true,
        }
      );
      return inscripcionAprobada;
    },

    eliminarInscripcionesProyecto: async (parent, args) => {
      const inscripcionesEliminadasPorProyecto =
        await InscriptionModel.deleteMany({
          proyecto: args.projectId,
        }, 
        {
          new: true,
        }
      );
      return inscripcionesEliminadasPorProyecto.deletedCount;
    },

    rechazarInscripcion: async (parent, args) => {
      const inscripcionRechazada = await InscriptionModel.findByIdAndUpdate(
        args.id,
        {
          estado: "RECHAZADO",
          fechaEgreso: Date.now(),
        },
        {
          new: true,
        }
      );
      return inscripcionRechazada;
    },
  },
};

export { resolverInscripciones };
