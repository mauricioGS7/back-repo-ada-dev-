import { UserModel } from "../../models/usuario/usuario.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/tokenUtils.js";

const resolversAutenticacion = {
  Mutation: {
    //Mutación para el registro de un nuevo usuario
    registro: async (parent, args) => {
      const salt = await bcrypt.genSalt(10);
      //Genera la contraseña encriptada para guardar en la base de datos
      const hashedPassword = await bcrypt.hash(args.password, salt);
      //Crea el usuario con los datos enviados desde el formulario de registro
      const usuarioCreado = await UserModel.create({
        nombre: args.nombre,
        apellido: args.apellido,
        identificacion: args.identificacion,
        correo: args.correo,
        rol: args.rol,
        password: hashedPassword,
      });
      //El usuario puede elegir el rol pero el estado por defecto queda en Pendiente
      console.log('usuario creado', usuarioCreado);
      return {
        //Cuando se complete el registro se envia un token de autenticación
        token: generateToken({
          _id: usuarioCreado._id,
          nombre: usuarioCreado.nombre,
          apellido: usuarioCreado.apellido,
          identificacion: usuarioCreado.identificacion,
          correo: usuarioCreado.correo,
          rol: usuarioCreado.rol,
        }),
      };
    },
    //Muatción para manejar el login al sistema
    login: async (parent, args) => {
      //Busca al usuario que ingresó su correo en el formulario del login
      const usuarioEcontrado = await UserModel.findOne({ correo: args.correo });
      //Si encuentra al usuario con el correo
      if (usuarioEcontrado) {
        //Si la contraseña que ingresó en el login es igual a la guardad en la base de dato
        if (await bcrypt.compare(args.password, usuarioEcontrado.password)) {
          //Si el estado del usuario es pendiente o no autorizado
          if (usuarioEcontrado.estado === "PENDIENTE" || usuarioEcontrado.estado === "NO AUTORIZADO") {
            //Entonces retorna mensaje de que no está autorizado a entrar al sistema
            return { error: "No estás autorizado para ingresar" }
          } else {
            //Si está autorizado entonces retorna el token de autenticación
            return {
              token: generateToken({
                _id: usuarioEcontrado._id,
                nombre: usuarioEcontrado.nombre,
                apellido: usuarioEcontrado.apellido,
                identificacion: usuarioEcontrado.identificacion,
                correo: usuarioEcontrado.correo,
                rol: usuarioEcontrado.rol,
                estado: usuarioEcontrado.estado,
              }),
            };
          }
        } else {
          //Si la contraseña que ingresó no es igual a la de la base de datos retorna error
          return { error: "Contraseña incorrecta" }
        }
      } else {
        //Si no encuentra un usuario con el correo ingresado retorna error
        return { error: "Usuario no encontrado" }
      }
    },

    refreshToken: async (parent, args, context) => {
      console.log("contexto", context);
      if (!context.userData) {
        return {
          error: "token no valido",
        };
      } else {
        const usuarioEcontrado = await UserModel.findOne({ correo: context.userData.correo });
        return {
          token: generateToken({
            _id: usuarioEcontrado._id,
            nombre: usuarioEcontrado.nombre,
            apellido: usuarioEcontrado.apellido,
            identificacion: usuarioEcontrado.identificacion,
            correo: usuarioEcontrado.correo,
            rol: usuarioEcontrado.rol,
            estado: usuarioEcontrado.estado,
          }),
        };
      }
      // valdiar que el contexto tenga info del usuario. si si, refrescar el token
      // si no devolver null para que en el front redirija al login.
    },
  },
};

export { resolversAutenticacion };
