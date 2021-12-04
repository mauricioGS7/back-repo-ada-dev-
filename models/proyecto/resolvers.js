import { ProjectModel } from "./proyecto.js";

const resolversProyecto = {
  Query: {
    Proyectos: async (parent, args) => {
      const proyectos = await ProjectModel.find()
        .populate({
          path: 'avances',
          populate:({
            path: 'creadoPor'
          })
        })
        .populate('lider');
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
    editarProyecto: async(parent, args)=>{
      const buscarProyecto = await ProjectModel.findById(
        args._id);
      if(buscarProyecto.fase === "TERMINADO"){
        return null;
      }else if(buscarProyecto.estado === "ACTIVO"){
        const proyectoEditado = await ProjectModel.findByIdAndUpdate(
          args._id,
          {...args.campos}, 
          {new:true});
        return proyectoEditado;
      }
    },
    crearObjetivo: async(parent, args)=>{
      const proyectoConObjetivo = await ProjectModel.findByIdAndUpdate(args.idProyecto,{
        $addToSet:{
          objetivos:{...args.campos},
        },
      }, {new:true});

      return proyectoConObjetivo;
    },
    eliminarProyecto: async(parent, args) => {
      const proyectoEliminada = await ProjectModel.findByIdAndDelete(args._id);
      return proyectoEliminada;
   },
  
    editarObjetivo: async(parent, args)=>{
      const proyectoEditado= await ProjectModel.findByIdAndUpdate(args.idProyecto, {
        $set:{
          [`objetivos.${args.indexObjetivo}.descripcion`]: args.campos.descripcion,
          [`objetivos.${args.indexObjetivo}.tipo`]: args.campos.tipo
        }
      }, {new:true});

      return proyectoEditado;

    },
    eliminarObjetivo: async(parent, args)=>{
      const proyectoObjetivo = await ProjectModel.findByIdAndUpdate(
        {_id: args.idProyecto},
        {
          $pull:{
            objetivos:{
              _id:args.idObjetivo,
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
