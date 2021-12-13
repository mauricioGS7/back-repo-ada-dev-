import { ProjectModel } from "./proyecto.js";
import { UserModel } from "../usuario/usuario.js";
import {InscriptionModel} from "../inscripcion/inscripcion.js"

const resolversProyecto = {
  Query: {
    Proyectos: async (parent, args) => {    //Historia de usuario: HU_006 y HU_019
      const proyectos = await ProjectModel.find()
        .populate({
          path: 'avances',
          populate: ({
            path: 'creadoPor'
          })
        }).populate({
          path: 'inscripciones',
          populate: ({
            path: 'estudiante'
          })
        })
        .populate('lider')
      return proyectos;
    },

    ProyectosLiderados: async (parent, args) => {    //Historia de usuario: HU_013 y HU_017

      const proyectosLiderados = await ProjectModel.find({ 'lider': args.idLider })
        .populate({
          path: 'avances',
          populate: ({
            path: 'creadoPor'
          })
        }).populate({
          path: 'inscripciones',
          populate: ({
            path: 'estudiante'
          })
        })
        .populate('lider');
      return proyectosLiderados;
    }
  },

  Mutation: {
    crearProyecto: async (parent, args) => {   //Historia de usuario: HU_012  
      const proyectoCreado = await ProjectModel.create({
        nombre: args.nombre,
        estado: args.estado,
        fase: args.fase,
        fechaInicio: args.fechaInicio,
        presupuesto: args.presupuesto,
        lider: args.lider,
        objetivos: args.objetivos,
      });
      return proyectoCreado;
    },
    editarProyectoAdmin: async (parent, args) => {   //Historia de usuario: HU_007, HU_008 y HU_009
      const buscarProyecto = await ProjectModel.findById(
        args._id);
      if (buscarProyecto.fase === "TERMINADO") {
        return null;
      } else if (buscarProyecto.estado === "INACTIVO" && buscarProyecto.fase === "NULO") {
        const proyectoEditado = await ProjectModel.findByIdAndUpdate(
          args._id,
          {
            estado: "ACTIVO",
            fase: "INICIADO",
            fechaInicio: new Date(),
          },
          { new: true });
        return proyectoEditado;
      }
      else if (buscarProyecto.fase === "DESARROLLO") {
        const proyectoEditado = await ProjectModel.findByIdAndUpdate(
          args._id,
          {
            fase: args.fase,
            fechaFin: new Date(),
            estado: "INACTIVO"
          },
          { new: true });
        const inscripcionesTerminadas = await InscriptionModel.updateMany({ proyecto: args._id },
          {
            estado: "RECHAZADO"
          },{ new: true });
          console.log(inscripcionesTerminadas)
        return proyectoEditado;
      }
      else {
        const proyectoEditado = await ProjectModel.findByIdAndUpdate(
          args._id,
          {
            estado: args.estado,
          },
          { new: true });
        return proyectoEditado;
      }
    },
    editarProyectoLider: async (parent, args) => {   //Historia de usuario: HU_014
      const buscarProyecto = await ProjectModel.findById(
        args._id);
      if (buscarProyecto.fase === "TERMINADO" || buscarProyecto.estado==="INACTIVO") {
        return null;
      } else if (buscarProyecto.estado === "ACTIVO") {
        const proyectoEditado = await ProjectModel.findByIdAndUpdate(
          args._id,
          {
            nombre: args.nombre,
            presupuesto: args.presupuesto,
            $set: {
              [`objetivos.${args.indexObjetivo}.descripcion`]: args.campos.descripcion,
              [`objetivos.${args.indexObjetivo}.tipo`]: args.campos.tipo
            }
          },
          { new: true });

        return proyectoEditado;
      }

    },
    editarProyectoLider: async (parent, args) => {
      const proyectoLider = await ProjectModel.findById(args._id);

      if (proyectoLider.fase == "TERMINADO") {
        return null;
      } else if (proyectoLider.estado == "ACTIVO") {
        const edicionLider = await ProjectModel.findByIdAndUpdate(
          args._id,
          {
            nombre: args.nombre,
            presupuesto: args.presupuesto
          },
          { new: true }
        );
        return edicionLider;
      }


    },
    crearObjetivo: async (parent, args) => {
      const proyectoConObjetivo = await ProjectModel.findByIdAndUpdate(args.idProyecto, {
        $addToSet: {
          objetivos: { ...args.campos },
        },
      }, { new: true });

      return proyectoConObjetivo;
    },
    eliminarProyecto: async (parent, args) => {
      const proyectoEliminada = await ProjectModel.findByIdAndDelete(args._id);
      return proyectoEliminada;
    },

    editarObjetivo: async (parent, args) => {
      const proyectoEditado = await ProjectModel.findByIdAndUpdate(args.idProyecto, {
        $set: {
          [`objetivos.${args.indexObjetivo}.descripcion`]: args.campos.descripcion,
          [`objetivos.${args.indexObjetivo}.tipo`]: args.campos.tipo
        }
      }, { new: true });

      return proyectoEditado;

    },
    eliminarObjetivo: async (parent, args) => {
      const proyectoObjetivo = await ProjectModel.findByIdAndUpdate(
        { _id: args.idProyecto },
        {
          $pull: {
            objetivos: {
              _id: args.idObjetivo,
            },
          },
        },
        { new: true }
      );
      return proyectoObjetivo;
    }
  },
};

export { resolversProyecto };
