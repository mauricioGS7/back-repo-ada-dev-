import { ProjectModel } from "../proyecto/proyecto.js";
import { InscriptionModel } from "../inscripcion/inscripcion.js";
import { ModeloAvance } from "./avance.js";
import { BREAK } from "graphql";

const resolversAvance = {
  Query: {
    Avances: async (parent, args) => {
      const avances = await ModeloAvance.find().populate([
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
    AvancePorProyecto: async (parents, args, context) => {
      const avances = await ModeloAvance.find().populate([
        {
          path: "proyecto",
          populate: {
            path: "inscripciones",
          },
        },
        {
          path: "creadoPor",
        },
      ]);

      let idsAvances = [];
      let c = 0;
      avances.forEach((avance) => {
        avance.proyecto.inscripciones.forEach((inscripcion) => {
          if (
            inscripcion.estado === "ACEPTADO" &&
            inscripcion.estudiante + "" === context.userData._id
          ) {
            idsAvances = [...idsAvances, avance];
            c += 1;
          }
        });
      });

      console.log(c);
      return idsAvances;
    },
    ProyectosRegistrar: async (parents, args) => {
      return await ProjectModel.find();
    },
  },
  Mutation: {
    crearAvance: async (parents, args, context) => {
      // consulto el proyecto para saber la fase en la que se encuentra
      const proyecto = await ProjectModel.findById({
        _id: args.proyecto,
      }).populate("inscripciones");

      // buscamos en el proyecto si exite la inscripcion,
      // si no tiene inscripciones el proyecto, retornamos null
      let estadoInscripcion;
      if (proyecto.inscripciones.length === 0) {
        // no hay inscripciones
        return null;
      } else {
        // si existen inscripciones, recorremos buscando el estudiante,
        // si no existe retornamos null
        proyecto.inscripciones.forEach((element) => {
          console.log("element", element);
          if (element.estudiante + "" === context.userData._id) {
            estadoInscripcion = element.estado;
            console.log("estado inscp", estadoInscripcion);
          }
        });
      }
      // si la fase es TERMINADO o NULO, o estado de la inscripcion
      // es PENDIENTE o RECHAZADO no puedo agregar avances
      if (
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
      else if (estadoInscripcion === "ACEPTADO") {
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
    editarAvance: async (parents, args, context) => {
      const proyecto = await ProjectModel.findOne({
        nombre: args.proyecto,
      }).populate("inscripciones");

      // verificamos que el usuario sea un estudiante
      if (proyecto.lider._id + "" !== context.userData._id) {
        // buscamos en el proyecto si exite la inscripcion,
        // si no tiene inscripciones el proyecto, retornamos null
        let estadoInscripcion;
        if (proyecto.inscripciones.length === 0) {
          // no hay inscripciones
          return null;
        }
        // si existen inscripciones, recorremos buscando el estudiante,
        // si no existe retornamos null
        else {
          proyecto.inscripciones.forEach((element) => {
            if (element.estudiante + "" === context.userData._id) {
              estadoInscripcion = element.estado;
              console.log("estado inscp", estadoInscripcion);
            }
          });
        }
        // si la fase del proyecto es TERMINADO o el estado es INACTIVO
        // no se pueden hacer actualizaciones, sino lo actualiza normalmente
        if (
          estadoInscripcion === "RECHAZADO" ||
          estadoInscripcion === "PENDIENTE" ||
          proyecto.fase === "TERMINADO" ||
          proyecto.fase === "NULO" ||
          proyecto.estado === "INACTIVO"
        ) {
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
