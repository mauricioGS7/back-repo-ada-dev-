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
    AvancePorProyecto: async (parents, args) => {
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
      // consulto el proyecto para saber la fase en la que se encuentra
      const proyecto = await ProjectModel.findById({
        _id: args.proyecto,
      });

      //si la fase es TERMINADO o NULO no puedo agregar avances
      if (proyecto.fase === "TERMINADO" || proyecto.fase === "NULO") {
        return null;
      }
      // si la fase es INICIADO creo el avance y cambio la fase a DESARROLLO
      else if (proyecto.fase === "INICIADO") {
        const avanceCreado = await ModeloAvance.create({
          fechaAvance: new Date(),
          descripcion: args.descripcion,
          proyecto: args.proyecto,
          creadoPor: args.creadoPor,
          observaciones: args.observaciones,
        });
        //cambio de la fase a DESARROLLO
        const proyectoEditado = await ProjectModel.findByIdAndUpdate(
          args.proyecto,
          {
            fase: "DESARROLLO",
          },
          { new: true }
        );
        return avanceCreado;
      }
      // si la fase es DESARROLLO crea el avance normalmente
      else {
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
