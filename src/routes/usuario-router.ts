import express from "express";
import { UsuarioController } from "../controllers/usuario-controller.ts";
import { authMiddleware } from "../middlewares/jwt-middleware.ts";

const UsuarioRouter = express.Router();

UsuarioRouter.post("/createUsuario", UsuarioController.createUsuario);
UsuarioRouter.post("/login", UsuarioController.login);
UsuarioRouter.get("/countries", UsuarioController.getCountries);

UsuarioRouter.get(
  "/getAllUsuarios",
  authMiddleware,
  UsuarioController.getAllUsuarios,
);

UsuarioRouter.get(
  "/getUsuarioByID/:id",
  authMiddleware,
  UsuarioController.getUsuarioByID,
);

UsuarioRouter.get(
  "/getUsuarioByNick/:nick",
  authMiddleware,
  UsuarioController.getUsuarioByNick,
);

UsuarioRouter.put("/:id", authMiddleware, UsuarioController.updateUsuario);

export default UsuarioRouter;
