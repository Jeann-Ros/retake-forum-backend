import express from "express";
import { CsController } from "../controllers/cs-controller.ts";
import { authMiddleware } from "../middlewares/jwt-middleware.ts";

const CsRouter = express.Router();

CsRouter.get("/players", authMiddleware, CsController.getTopPlayers);
CsRouter.get("/rankings", authMiddleware, CsController.getWorldRankings);

export default CsRouter;
