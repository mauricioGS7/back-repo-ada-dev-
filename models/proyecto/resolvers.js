import { ProjectModel } from "./proyecto.js";

const resolversProyecto = {
  Query: {
    Proyectos: async (parent, args) => {
      const proyectos = await ProjectModel.find()
        .populate("avances")
        .populate("inscripciones");
      return proyectos;
    },
  },
  Mutation: {
    crearProyecto: async (parent, args) => {
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

    editarProyecto: async (parent, args) => {
      const proyecto = await ProjectModel.findOne({
        _id: args._id
      });
      if (proyecto.fase === "TERMINADO") {
        return null;
      } else {
        const proyectoEditado = await ProjectModel.findByIdAndUpdate(
          args._id,
          { ...args.campos },
          { new: true }
        );
        return proyectoEditado;
      }
    },
  },
};

export { resolversProyecto };
