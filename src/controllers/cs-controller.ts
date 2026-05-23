import type { Request, Response } from "express";
import { CsApiService } from "../services/csapi-service.ts";

function getLimit(req: Request, fallback: number) {
  const limit = Number(req.query.limit);

  if (!Number.isFinite(limit) || limit <= 0) {
    return fallback;
  }

  return Math.min(limit, 50);
}

export class CsController {
  static async getTopPlayers(req: Request, res: Response) {
    try {
      const players = await CsApiService.getTopPlayers(getLimit(req, 10));
      return res.status(200).json(players);
    } catch (error) {
      console.error("Erro ao buscar top jogadores na CSAPI:", error);
      return res.status(502).json({
        message: "Nao foi possivel carregar os jogadores externos",
      });
    }
  }

  static async getWorldRankings(req: Request, res: Response) {
    try {
      const rankings = await CsApiService.getWorldRankings(getLimit(req, 10));
      return res.status(200).json(rankings);
    } catch (error) {
      console.error("Erro ao buscar ranking mundial na CSAPI:", error);
      return res.status(502).json({
        message: "Nao foi possivel carregar o ranking mundial",
      });
    }
  }
}
