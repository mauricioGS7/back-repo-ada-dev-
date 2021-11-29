import { InscriptionModel } from "./inscripcion.js";

const resolverInscripciones = {
  Query: {
    consultarInscripciones: async (parent, args) => {
      const inscripciones = await InscriptionModel.find()
        .populate("proyecto")
        .populate("estudiante");
      return inscripciones;
    },
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
        }
      );
      return inscripcionAprobada;
    },
    rechazarInscripcion: async (parent, args) => {
      const inscripcionRechazada = await InscriptionModel.findByIdAndUpdate(
        args.id,
        {
          estado: "RECHAZADO",
          fechaEgreso: Date.now(),
        }
      );
      return inscripcionRechazada;
    },
  },
};

export { resolverInscripciones };
