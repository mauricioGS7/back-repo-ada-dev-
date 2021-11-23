import mongoose from 'mongoose';
import { ProjectModel } from '../proyecto/proyecto.js';
import { UserModel } from '../usuario/usuario.js';

const { Schema, model } = mongoose;

const inscriptionSchema = new Schema({
  estado: {
    type: String,
    enum: ['ACEPTADO', 'RECHAZADO', 'PENDIENTE'],
    default: 'PENDIENTE',
    required: false,
  },
  fechaInscripcion: {
    type: Date,
    required: false,
    default: Date.now
  },
  fechaIngreso: {
    type: Date,
    required: false,
  },
  fechaEgreso: {
    type: Date,
    required: false,
  },
  proyecto: {
    type: Schema.Types.ObjectId,
    ref: ProjectModel,
    required: true,
  },
  estudiante: {
    type: Schema.Types.ObjectId,
    ref: UserModel,
    required: true,
  },
});

const InscriptionModel = model('Inscripcion', inscriptionSchema);

export { InscriptionModel };
