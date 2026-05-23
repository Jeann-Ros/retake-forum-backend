import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import {
  urlencodedMiddleware,
  jsonMiddleware,
  securityMiddleware,
  compressionMiddlewware,
  rateLimitMiddleware,
  morganMiddleware,
  corsMiddleware,
} from "./middlewares/base-middlewares.ts";
import UsuarioRouter from "./routes/usuario-router.ts";
import NoticiaRouter from "./routes/noticia-router.ts";
import PostRouter from "./routes/post-router.ts";
import CommentRouter from "./routes/comment-router.ts";
import MongoConfig from "./config/mongo-config.ts";
import { Usuario } from "./models/usuario/usuario.ts";
import UsuarioModel, { AdmFlag } from "./models/usuario/usuario-schema.ts";

dotenv.config();

const app = express();
const port = process.env.PORT ?? "3000";

app.use(urlencodedMiddleware);
app.use(jsonMiddleware);
app.use(securityMiddleware);
app.use(compressionMiddlewware);
app.use(rateLimitMiddleware);
app.use(morganMiddleware);
app.use(corsMiddleware);

app.use("/usuarios", UsuarioRouter);
app.use("/noticias", NoticiaRouter);
app.use("/posts", PostRouter);
app.use("/comentarios", CommentRouter);

async function seedInitialUsers() {
  const initialUsers = [
    {
      nick: "jean.ros",
      email: "jean.ros@teste.com.br",
      senha: "Teste@123",
      pais: "Brasil",
      admflag: AdmFlag.ADMIN,
      time: "",
      jogador: "",
    },
    {
      nick: "chris",
      email: "chris@teste.com.br",
      senha: "Teste@123",
      pais: "Brasil",
      admflag: AdmFlag.USER,
      time: "",
      jogador: "",
    },
  ];

  for (const user of initialUsers) {
    const existingUser = await UsuarioModel.findOne({ email: user.email });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(user.senha, 10);
      const newUsuario = new Usuario(
        0,
        user.nick,
        user.email,
        hashedPassword,
        user.pais,
        user.admflag,
        user.time,
        user.jogador,
      );
      await newUsuario.save();
      console.log(`Usuário seed criado: ${user.email}`);
    }
  }
}

async function bootstrap() {
  await MongoConfig.connect();
  await seedInitialUsers();

  app.listen(port, () => {
    console.log("Servidor rodando na porta", port);
  });
}

bootstrap().catch((error) => {
  console.error("Falha ao iniciar servidor:", error);
});
