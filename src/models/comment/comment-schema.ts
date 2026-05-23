import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    commentNumber: {
      type: Number,
      required: true,
      default: 0,
    },
    content: { type: String, required: true },
    date: { type: String, required: true },
    autorNickname: { type: String, required: true },
    targetType: {
      type: String,
      required: true,
      enum: ["Noticia", "Post", "Comment"],
    },
    targetNumber: { type: Number, required: true },
    likes: { type: Number, required: true },
    likedBy: [{ type: String }],
    commentaries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true },
);

const CommentModel = mongoose.model("Comment", CommentSchema);

export default CommentModel;
