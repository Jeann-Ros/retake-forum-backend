import mongoose from "mongoose";

const NoticiaSchema = new mongoose.Schema(
  {
    noticiaNumber: {
      type: Number,
      required: true,
      default: 0,
    },
    titulo: { type: String, required: true },
    data: { type: String, required: true },
    nick: { type: String, required: true },
    content: { type: String, required: true },
    evento: { type: String, required: true },
    likes: { type: Number, required: true, default: 0 },
    likedBy: [{ type: String }],
    comentarios: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true },
);

const NoticiaModel = mongoose.model("Noticia", NoticiaSchema);

export default NoticiaModel;
