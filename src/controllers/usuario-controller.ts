import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Usuario } from "../models/usuario/usuario.ts";
import { generateToken } from "../middlewares/jwt-middleware.ts";

const fallbackCountries = [
  { value: "BR", label: "Brasil" },
  { value: "US", label: "Estados Unidos" },
  { value: "PT", label: "Portugal" },
  { value: "ES", label: "Espanha" },
  { value: "AR", label: "Argentina" },
  { value: "MX", label: "México" },
  { value: "OTHER", label: "Outro" },
];

export class UsuarioController {
  static async createUsuario(req: Request, res: Response) {
    try {
      const {
        nick,
        email,
        senha,
        pais,
        admflag = 0,
        time = "",
        jogador = "",
      } = req.body;

      if (!nick || !email || !senha || !pais) {
        return res
          .status(400)
          .json({ message: "Campos obrigatórios ausentes" });
      }

      const existingUser = await Usuario.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "Email já cadastrado" });
      }

      const hashedPassword = await bcrypt.hash(senha, 10);
      const newUsuario = new Usuario(
        0,
        nick,
        email,
        hashedPassword,
        pais,
        Number(admflag),
        time,
        jogador,
      );

      await newUsuario.save();
      return res.status(201).json({ message: "Usuario criado com sucesso" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res
          .status(400)
          .json({ message: "Email e senha são obrigatórios" });
      }

      const usuario = await Usuario.findByEmail(email);
      if (!usuario) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const isPasswordValid = await bcrypt.compare(senha, usuario.senha);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      const role = usuario.admflag === 1 ? "ADMIN" : "USER";
      const userId = usuario.usuarioNumber ?? usuario._id;
      const token = generateToken({
        id: userId,
        email: usuario.email,
        role,
      });

      return res.status(200).json({
        token,
        user: {
          id: userId,
          nick: usuario.nick,
          email: usuario.email,
          role,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getAllUsuarios(req: Request, res: Response) {
    try {
      const usuarios = await Usuario.findAll();
      return res.status(200).json(usuarios);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getUsuarioByID(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByID(Number(id));
      if (!usuario) {
        return res.status(404).json({ message: "Usuario not found" });
      }
      return res.status(200).json(usuario);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getUsuarioByNick(req: Request, res: Response) {
    try {
      const { nick } = req.params as { nick: string };
      const usuario = await Usuario.findByNick(nick);
      if (!usuario) {
        return res.status(404).json({ message: "Usuario not found" });
      }
      return res.status(200).json(usuario);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getCountries(req: Request, res: Response) {
    try {
      const countries = JSON.parse(process.env.COUNTRIES || "[]");

      if (!Array.isArray(countries) || countries.length === 0) {
        return res.status(200).json(fallbackCountries);
      }

      return res.status(200).json(countries);
    } catch (error) {
      return res.status(200).json(fallbackCountries);
    }
  }

  static async updateUsuario(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nick, senha, pais, admflag, time, jogador } = req.body;
      const userId = (req as any).user?.id;

      if (
        Number(id) !== Number(userId) &&
        (req as any).user?.role !== "ADMIN"
      ) {
        return res.status(403).json({
          message: "Você não tem permissão para atualizar esse usuário",
        });
      }

      const updateData: any = {};

      if (nick !== undefined) updateData.nick = nick;
      if (senha !== undefined) {
        const hashedPassword = await bcrypt.hash(senha, 10);
        updateData.senha = hashedPassword;
      }
      if (pais !== undefined) updateData.pais = pais;
      if (admflag !== undefined) updateData.admflag = Number(admflag);
      if (time !== undefined) updateData.time = time;
      if (jogador !== undefined) updateData.jogador = jogador;

      const usuarioAtualizado = await Usuario.updateByID(
        Number(id),
        updateData,
      );

      if (!usuarioAtualizado) {
        return res.status(404).json({ message: "Usuario não encontrado" });
      }

      return res.status(200).json({
        message: "Usuario atualizado com sucesso",
        usuario: usuarioAtualizado,
      });
    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}
