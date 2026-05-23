import CommentModel from "./comment-schema.ts";

export class Comment {
  #commentNumber: number;
  #content: string;
  #date: string;
  #autorNickname: string;
  #targetType: string;
  #targetNumber: number;
  #likes: number;
  #commentaries: Comment[];

  constructor(
    commentNumber: number,
    content: string,
    date: string,
    autorNickname: string,
    targetType: string,
    targetNumber: number,
    likes: number,
    commentaries: Comment[],
  ) {
    this.#commentNumber = commentNumber;
    this.#content = content;
    this.#date = date;
    this.#autorNickname = autorNickname;
    this.#targetType = targetType;
    this.#targetNumber = targetNumber;
    this.#likes = likes;
    this.#commentaries = commentaries;
  }

  async save() {
    const payload: any = {
      content: this.#content,
      date: this.#date,
      autorNickname: this.#autorNickname,
      targetType: this.#targetType,
      targetNumber: this.#targetNumber,
      likes: this.#likes,
      commentaries: this.#commentaries,
    };

    if (this.#commentNumber > 0) {
      payload.commentNumber = this.#commentNumber;
    } else {
      const count = await CommentModel.countDocuments();
      payload.commentNumber = count + 1;
    }

    const newComment = new CommentModel(payload);
    return await newComment.save();
  }

  static async findAll() {
    return await CommentModel.find();
  }

  static async findAllByUserNickname(nickname: string) {
    return await CommentModel.find({ autorNickname: nickname });
  }

  static async findByDate(date: string) {
    return await CommentModel.find({ date: date });
  }

  static async findByCommentNumber(commentNumber: number) {
    return await CommentModel.findOne({ commentNumber: commentNumber });
  }

  static async addChildComment(parentCommentNumber: number, commentId: any) {
    return await CommentModel.findOneAndUpdate(
      { commentNumber: parentCommentNumber },
      { $push: { commentaries: commentId } },
    );
  }

  static async like(commentNumber: number, userId: string) {
    const comment: any = await CommentModel.findOne({ commentNumber });

    if (!comment) {
      return null;
    }

    const likedBy = comment.likedBy || [];

    if (likedBy.includes(userId)) {
      comment.likes = Math.max((comment.likes || 0) - 1, 0);
      comment.likedBy = likedBy.filter((id: string) => id !== userId);
    } else {
      comment.likes = (comment.likes || 0) + 1;
      comment.likedBy = [...likedBy, userId];
    }

    return await comment.save();
  }
}
