module.exports = class Usuario {
  constructor(nome, idade, cpf, livrosEmprestados, email) {
    if (!this.validarCPF(cpf)) {
      throw new Error("CPF inválido");
    }
    if (!this.validarEmail(email)) {
      throw new Error("Email inválido");
    }
    this.nome = nome;
    this.idade = idade;
    this.cpf = cpf;
    this.livrosEmprestados = livrosEmprestados;
    this.email = email;
  }

  validarCPF(cpf) {
    if (cpf.length !== 11) {
      return false;
    }
    return true;
  }
  validarEmail(email) {
    if (!email.includes("@") || !email.includes(".")) {
      return false;
    }
    return true;
  }

  emprestarLivro(isbn) {
    this.livrosEmprestados.push(isbn);
  }

  devolverLivro(isbn) {
    const index = this.livrosEmprestados.indexOf(isbn);
    if (index === -1) {
      throw new Error(`Livro não emprestado ao usuário ${this.nome}`);
    }
    this.livrosEmprestados.splice(index, 1);
  }
};
