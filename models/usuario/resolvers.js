import { UserModel } from "./usuario.js";
import bcrypt from "bcrypt";

const resolversUsuario = {
  Query: {
    Usuarios: async (parent, args) => {
      const usuarios = await UserModel.find({...args.filtro})
        .populate('proyectos')
        .populate('inscripciones')
        .populate('avances');
      return usuarios;
    },
    UsuariosEstudiantes: async (parent, args) => {
      const usuariosEstudiantes = await UserModel.find({rol : 'ESTUDIANTE'})
        .populate('proyectos')
        .populate('inscripciones')
        .populate('avances');
      return usuariosEstudiantes;
    },
    Usuario: async (parent, args) => {
      const usuario = await UserModel.findOne({ _id: args._id })
        .populate("proyectos")
        .populate("inscripciones")
        .populate("avances");
      return usuario;
    },
  },
  Mutation: {
    crearUsuario: async (parent, args) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(args.password, salt);
 
      const usuarioCreado = await UserModel.create({
        nombre: args.nombre,
        apellido: args.apellido,
        identificacion: args.identificacion,
        correo: args.correo,
        password: hashedPassword,
        rol: args.rol,
      });

      if (Object.keys(args).includes("estado")) {
        usuarioCreado.estado = args.estado;
      }

      return usuarioCreado;
    },
    //Muación para editar los datos de un usuario
    editarUsuario: async (parent, args) => {
      //Busca al usuario por id el cual se manda desde el front
      const usuarioEditado = await UserModel.findByIdAndUpdate(
        args._id,
        {
          //Si encuentra el usuario entonces puede actualziar cualquiera de los datos que se envíen desde el front
          nombre: args.nombre,
          apellido: args.apellido,
          identificacion: args.identificacion,
          correo: args.correo,
          rol: args.rol,
          estado: args.estado,
        },
        {
          new: true,
        }
      );

      return usuarioEditado;
    },
    eliminarUsuario: async (parent, args) => {
      if (Object.keys(args).includes("_id")) {
        const usuarioEliminado = await UserModel.findOneAndDelete({
          _id: args._id,
        });
        return usuarioEliminado;
      } else if (Object.keys(args).includes("correo")) {
        const usuarioEliminado = await UserModel.findOneAndDelete({
          correo: args.correo,
        });
        return usuarioEliminado;
      }
    },
    //Muación para cambiar la contraseña
    actualizarPassword: async (parent, args) => {
      //Encuentra el usuario que quiere cambiar la contraseña por su correo
      const usuarioEcontrado = await UserModel.findOne({ correo: args.correo });
      //Se le pide al usuario que ingrese la contraseña actual
      //Si coincide con la contraseña guardada en la base de datos
      if (await bcrypt.compare(args.password, usuarioEcontrado.password)) {
        const salt = await bcrypt.genSalt(10);
        console.log("Usuario encontrado");
        //Encripta la nueva contraseña
        bcrypt.hash(args.nuevapassword, salt, async (err, hash) => {
          //Actualiza la contraseña del usuario
          const actualizarPassword= await UserModel.findOneAndUpdate({correo: args.correo}, {password : `${hash}`},{new:true});
        });
        //Se retorna true para que en el front le aparezca al usuario un mensaje de confirmación
        return {mensaje: true};
      }else{
        //Si la contraseña que ingresó es erronea entonces retorna false para mostrar un mensaje de error en el front
        return{
          mensaje: false
        }
      }
    },
  },
};

export { resolversUsuario };
