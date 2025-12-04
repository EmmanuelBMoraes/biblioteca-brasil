class UsuarioController {
  constructor(usuarioRepo) {
    this.usuarioRepo = usuarioRepo;
  }

  async create (usuario) {
    const { nome, idade, cpf, email, livrosEmprestados} = usuario;

    if (!this.validaCPF(cpf)) return { error: "Informe um CPF válido para o usuário!" }

    if (!this.validaEmail(email)) return { error: "Informe um EMAIL vaálido para o usuário!" }

    const novoUsuario = await this.usuarioRepo.create({ nome, idade, cpf, email, livrosEmprestados });
    
    return { msg: "Usuario cadastrado com sucesso!", usuario: novoUsuario}
  }

  validaCPF(cpf) {
    if (cpf.length !== 11) {
      return false;
    }
    return true;
  }

  validaEmail(email) {
    if (!email.includes("@") || !email.includes(".")) {
      return false;
    }
    return true;
  }
}

module.exports = UsuarioController;