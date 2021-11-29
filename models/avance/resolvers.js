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
    ProyectosInscritos: async (parent, args) => {
      const proyectoFiltradoInscripcion = await ProjectModel.find({
        _id: args.idEstudiante,
      })
        .populate("inscripciones")
        .populate("estudiante");
      return proyectoFiltradoInscripcion;
    },
  },
  Mutation: {
    crearAvance: async (parents, args, context) => {
      // consulto el proyecto para saber la fase en la que se encuentra
      const proyecto = await ProjectModel.findById({
        _id: args.proyecto,
      }).populate("inscripciones");

      //buscamos en el proyecto si exite la inscripcion, si existe guardamos el id, el id del estudtiena
      let estadoInscripcion;
      proyecto.inscripciones.forEach((element) => {
        if (element.estudiante + "" === context.userData._id) {
          estadoInscripcion = element.estado;
          console.log("estado inscp", estadoInscripcion);
        }
      });

      //si la fase es TERMINADO o NULO, o estado de la inscripcion es PENDIENTE o RECHAZADO no puedo agregar avances
      if (
        proyecto.fase === "TERMINADO" ||
        proyecto.fase === "NULO" ||
        proyecto.estado === "INACTIVO" ||
        estadoInscripcion === "PENDIENTE" ||
        estadoInscripcion === "RECHAZADO"
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
          creadoPor: context.userData._id,
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
