import { removeEmptyKeys } from "../../utils/remove-empty-keys.ts";
import NoticiaModel from "./noticia-schema.ts";
import { Comment } from "../comment/comment.ts";

export class Noticia {
  #noticiaNumber: number;
  #titulo: string;
  #data: string;
  #nick: string;
  #content: string;
  #evento: string;
  #likes: number;
  #comentarios: Comment[];

  constructor(
    noticiaNumber: number,
    titulo: string,
    data: string,
    nick: string,
    content: string,
    evento: string,
    comentarios: Comment[] = [],
    likes: number = 0,
  ) {
    this.#noticiaNumber = noticiaNumber;
    this.#titulo = titulo;
    this.#data = data;
    this.#nick = nick;
    this.#content = content;
    this.#evento = evento;
    this.#likes = likes;
    this.#comentarios = comentarios;
  }

  async save() {
    const payload: any = {
      titulo: this.#titulo,
      data: this.#data,
      nick: this.#nick,
      content: this.#content,
      evento: this.#evento,
      likes: this.#likes,
      comentarios: this.#comentarios,
    };

    if (this.#noticiaNumber > 0) {
      payload.noticiaNumber = this.#noticiaNumber;
    } else {
      const count = await NoticiaModel.countDocuments();
      payload.noticiaNumber = count + 1;
    }

    const novaNoticia = new NoticiaModel(payload);
    return await novaNoticia.save();
  }

  static async findAll(): Promise<any[]> {
    return await NoticiaModel.find().sort({ createdAt: -1, _id: -1 });
  }

  static async findByID(id: number): Promise<typeof NoticiaModel | null> {
    return await NoticiaModel.findOne({ noticiaNumber: id });
  }

  static async findByTitulo(
    titulo: string,
  ): Promise<typeof NoticiaModel | null> {
    return await NoticiaModel.findOne({ titulo });
  }

  static async findByUserNickname(
    nick: string,
  ): Promise<(typeof NoticiaModel)[]> {
    return await NoticiaModel.find({ nick });
  }

  static async addComment(noticiaNumber: number, commentId: any) {
    return await NoticiaModel.findOneAndUpdate(
      { noticiaNumber },
      { $push: { comentarios: commentId } },
    );
  }

  static async like(noticiaNumber: number, userId: string) {
    const noticia: any = await NoticiaModel.findOne({ noticiaNumber });

    if (!noticia) {
      return null;
    }

    const likedBy = noticia.likedBy || [];

    if (likedBy.includes(userId)) {
      noticia.likes = Math.max((noticia.likes || 0) - 1, 0);
      noticia.likedBy = likedBy.filter((id: string) => id !== userId);
    } else {
      noticia.likes = (noticia.likes || 0) + 1;
      noticia.likedBy = [...likedBy, userId];
    }

    return await noticia.save();
  }
}
