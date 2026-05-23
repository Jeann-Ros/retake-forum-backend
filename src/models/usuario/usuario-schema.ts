import mongoose from "mongoose";

export const AdmFlag = {
  USER: 0,
  ADMIN: 1,
} as const;

const UsuarioSchema = new mongoose.Schema(
  {
    usuarioNumber: {
      type: Number,
      required: true,
      default: 0,
    },
    nick: { type: String, required: true },
    email: { type: String, required: true },
    senha: { type: String, required: true },
    pais: { type: String, required: true },
    admflag: {
      type: Number,
      enum: Object.values(AdmFlag), // só permite 0 ou 1
      required: true,
    },
    time: { type: String },
    jogador: { type: String },
  },
  { timestamps: true },
);

const UsuarioModel = mongoose.model("Usuario", UsuarioSchema);

export default UsuarioModel;
