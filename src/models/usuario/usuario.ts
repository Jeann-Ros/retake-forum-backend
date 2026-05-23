import UsuarioModel from "./usuario-schema.ts";

export class Usuario {
  #usuarioNumber: number;
  #nick: string;
  #email: string;
  #senha: string;
  #pais: string;
  #admflag: number;
  #time: string;
  #jogador: string;

  constructor(
    usuarioNumber: number,
    nick: string,
    email: string,
    senha: string,
    pais: string,
    admflag: number,
    time: string,
    jogador: string,
  ) {
    this.#usuarioNumber = usuarioNumber;
    this.#nick = nick;
    this.#email = email;
    this.#senha = senha;
    this.#pais = pais;
    this.#admflag = admflag;
    this.#time = time;
    this.#jogador = jogador;
  }

  async save() {
    const usuarioPayload: any = {
      nick: this.#nick,
      email: this.#email,
      senha: this.#senha,
      pais: this.#pais,
      admflag: this.#admflag,
      time: this.#time,
      jogador: this.#jogador,
    };

    if (this.#usuarioNumber > 0) {
      usuarioPayload.usuarioNumber = this.#usuarioNumber;
    } else {
      const count = await UsuarioModel.countDocuments();
      usuarioPayload.usuarioNumber = count + 1;
    }

    const novoUsuario = new UsuarioModel(usuarioPayload);
    await novoUsuario.save();
  }

  static async findAll(): Promise<any[]> {
    return await UsuarioModel.find();
  }

  static async findByID(id: number): Promise<any | null> {
    return await UsuarioModel.findOne({ usuarioNumber: id });
  }

  static async findByNick(nick: string): Promise<any | null> {
    return await UsuarioModel.findOne({ nick });
  }

  static async findByEmail(email: string): Promise<any | null> {
    return await UsuarioModel.findOne({ email });
  }

  static async updateByID(id: number, updateData: any): Promise<any | null> {
    const updatePayload: any = {};

    if (updateData.nick !== undefined) updatePayload.nick = updateData.nick;
    if (updateData.senha !== undefined) updatePayload.senha = updateData.senha;
    if (updateData.pais !== undefined) updatePayload.pais = updateData.pais;
    if (updateData.admflag !== undefined)
      updatePayload.admflag = updateData.admflag;
    if (updateData.time !== undefined) updatePayload.time = updateData.time;
    if (updateData.jogador !== undefined)
      updatePayload.jogador = updateData.jogador;

    return await UsuarioModel.findOneAndUpdate(
      { usuarioNumber: id },
      updatePayload,
      { new: true },
    );
  }
}
