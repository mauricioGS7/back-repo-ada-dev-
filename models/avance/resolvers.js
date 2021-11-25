import { ProjectModel } from "../proyecto/proyecto.js";
import { ModeloAvance } from "./avance.js";

const resolversAvance = {
  Query: {
    Avances: async (parent, args) => {
      const avances = await ModeloAvance.find()
        .populate("proyecto")
        .populate("creadoPor");
      return avances;
    },
    Avance: async (parents, args) => {
      const avance = await ModeloAvance.findOne({ _id: args._id })
        .populate("proyecto")
        .populate("creadoPor");
      return avance;
    },
    filtrarAvance: async (parents, args) => {
      const avanceFiltradoProyecto = await ModeloAvance.find({
        proyecto: args.idProyecto,
      })
        .populate("proyecto")
        .populate("creadoPor");
      return avanceFiltradoProyecto;
    },
  },
  Mutation: {
    crearAvance: async (parents, args) => {
      const proyecto = await ProjectModel.findById({
        _id: args.proyecto,
      });

      if (proyecto.fase === "TERMINADO") {
        return null;
      } else if (proyecto.fase === "NULO" || proyecto.fase === "INICIADO") {
        const avanceCreado = await ModeloAvance.create({
          fechaAvance: new Date(),
          descripcion: args.descripcion,
          proyecto: args.proyecto,
          creadoPor: args.creadoPor,
          observaciones: args.observaciones,
        });

        const proyectoEditado = await ProjectModel.findByIdAndUpdate(
          args.proyecto,
          {
            fase: "DESARROLLO",
          },
          { new: true }
        );
        // console.log("proyectoEditado", proyectoEditado);

        return avanceCreado;
      } else {
        const avanceCreado = await ModeloAvance.create({
          fechaAvance: new Date(),
          descripcion: args.descripcion,
          proyecto: args.proyecto,
          creadoPor: args.creadoPor,
          observaciones: args.observaciones,
        });
        return avanceCreado;
      }
    },
    editarAvance: async (parents, args) => {
      const avanceEditado = await ModeloAvance.findByIdAndUpdate(
        args._id,
        {
          descripcion: args.descripcion,
          observaciones: args.observaciones,
        },
        { new: true }
      );
      return avanceEditado;
    },
  },
};

export { resolversAvance };
