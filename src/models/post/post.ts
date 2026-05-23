import type { Comment } from "../comment/comment.ts";
import PostModel from "./post-schema.ts";

export class Post {
  #postNumber: number;
  #titulo: string;
  #content: string;
  #date: string;
  #autorNickname: string;
  #likes: number;
  #commentaries: Comment[];

  constructor(
    postNumber: number,
    content: string,
    date: string,
    autorNickname: string,
    likes: number,
    commentaries: Comment[],
    titulo?: string,
  ) {
    this.#postNumber = postNumber;
    this.#titulo = titulo || "";
    this.#content = content;
    this.#date = date;
    this.#autorNickname = autorNickname;
    this.#likes = likes;
    this.#commentaries = commentaries;
  }

  async save() {
    const payload: any = {
      titulo: this.#titulo,
      content: this.#content,
      date: this.#date,
      autorNickname: this.#autorNickname,
      likes: this.#likes,
      commentaries: this.#commentaries,
    };

    if (this.#postNumber > 0) {
      payload.postNumber = this.#postNumber;
    } else {
      const count = await PostModel.countDocuments();
      payload.postNumber = count + 1;
    }

    const newPost = new PostModel(payload);
    await newPost.save();
  }

  static async findAll() {
    return await PostModel.find().sort({ createdAt: -1, _id: -1 });
  }

  static async findAllByAutorNickname(autorNickname: string) {
    return await PostModel.find({ autorNickname });
  }

  static async addComment(postNumber: number, commentId: any) {
    return await PostModel.findOneAndUpdate(
      { postNumber },
      { $push: { commentaries: commentId } },
    );
  }

  static async findByPostNumber(postNumber: number) {
    return await PostModel.findOne({ postNumber });
  }

  static async findByDate(date: string) {
    return await PostModel.find({ date });
  }

  static async like(postNumber: number, userId: string) {
    const post: any = await PostModel.findOne({ postNumber });

    if (!post) {
      return null;
    }

    const likedBy = post.likedBy || [];

    if (likedBy.includes(userId)) {
      post.likes = Math.max((post.likes || 0) - 1, 0);
      post.likedBy = likedBy.filter((id: string) => id !== userId);
    } else {
      post.likes = (post.likes || 0) + 1;
      post.likedBy = [...likedBy, userId];
    }

    return await post.save();
  }
}
