import { ProjectModel } from "../proyecto/proyecto.js";
import { ModeloAvance } from "./avance.js";

const resolversAvance = {
  Query: {
    Avances: async (parent, args) => {
      const avances = await ModeloAvance.find({}).populate([
        {
          path: "proyecto",
          populate: {
            path: "lider",
          },
        },
        {
          path: "creadoPor",
        },
      ]);
      return avances;
    },
    Avance: async (parents, args) => {
      const avance = await ModeloAvance.findOne({ _id: args._id })
        .populate("proyecto")
        .populate("creadoPor");
      return avance;
    },
    AvancePorUsuario: async (parents, args) => {
      const avanceFiltradoUsuario = await ModeloAvance.find({
        creadoPor: args._id,
      })
        .populate("proyecto")
        .populate("creadoPor");
      return avanceFiltradoUsuario;
    },
    AvancePorProyecto: async (parents, args) => {
      const avanceFiltradoProyecto = await ModeloAvance.find({
        proyecto: args.idProyecto,
      })
        .populate("proyecto")
        .populate("creadoPor");
      return avanceFiltradoProyecto;
    },

    ProyectosInscritos: async (parent, args) => {
      const proyectoFiltradoInscripcion = await ProjectModel.find().populate([
        {
          path: "inscripciones",
          populate: {
            path: "estudiante",
            // match: { _id: args.idEstudiante },
            match: { _id: { $in: [args.idEstudiante] } },
          },
        },
      ]);
      return proyectoFiltradoInscripcion;
    },
  },
  Mutation: {
    crearAvance: async (parents, args, context) => {
      // consulto el proyecto para saber la fase en la que se encuentra
      const proyecto = await ProjectModel.findById({
        _id: args.proyecto,
      }).populate("inscripciones");

      //buscamos en el proyecto si exite la inscripcion, si no tiene inscripciones el proyecto, retornamos null
      let estadoInscripcion;
      if (proyecto.inscripciones.length === 0) {
        // no hay inscripciones
        return null;
      } else {
        // si existen inscripciones, recorremos buscando el estudiante, si no existe retornamos null
        proyecto.inscripciones.forEach((element) => {
          console.log("element", element);
          if (element.estudiante + "" === context.userData._id) {
            estadoInscripcion = element.estado;
            console.log("estado inscp", estadoInscripcion);
          } else {
            console.log("NO INSCRITO");
            estadoInscripcion = null;
          }
        });
      }

      //si la fase es TERMINADO o NULO, o estado de la inscripcion es PENDIENTE o RECHAZADO no puedo agregar avances
      if (
        estadoInscripcion === null ||
        estadoInscripcion === "RECHAZADO" ||
        estadoInscripcion === "PENDIENTE" ||
        proyecto.fase === "TERMINADO" ||
        proyecto.fase === "NULO" ||
        proyecto.estado === "INACTIVO"
      ) {
        return null;
      }
      // si la fase es INICIADO creo el avance y cambio la fase a DESARROLLO
      else if (proyecto.fase === "INICIADO") {
        const avanceCreado = await ModeloAvance.create({
          fechaAvance: new Date(),
          descripcion: args.descripcion,
          proyecto: args.proyecto,
          creadoPor: context.userData._id,
          observaciones: args.observaciones,
        });
        //cambio de la fase a DESARROLLO
        const proyectoEditadoPorAvance = await ProjectModel.findByIdAndUpdate(
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
          creadoPor: context.userData._id,
          observaciones: args.observaciones,
        });
        return avanceCreado;
      }
    },
    editarAvance: async (parents, args) => {
      const proyecto = await ProjectModel.findOne({
        nombre: args.proyecto,
      });
      // si la fase del proyecto es TERMINADO o el estado es INACTIVO no se pueden hacer actualizaciones
      // sino lo actualiza normalmente
      if (proyecto.fase === "TERMINADO" || proyecto.estado === "INACTIVO") {
        return null;
      } else {
        const avanceEditado = await ModeloAvance.findByIdAndUpdate(
          args._id,
          {
            descripcion: args.descripcion,
            observaciones: args.observaciones,
          },
          { new: true }
        );
        return avanceEditado;
      }
    },
  },
};

export { resolversAvance };
