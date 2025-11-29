module.exports = class Livro {
  constructor(titulo, autor, anoPublicacao, genero, isbn, disponivel) {
    if (!isbn) {
      throw new Error("ISBN é obrigatório");
    }
    this.titulo = titulo;
    this.autor = autor;
    this.anoPublicacao = anoPublicacao;
    this.genero = genero;
    this.isbn = isbn;
    this.disponivel = disponivel;
  }

  disponibilizar() {
    this.disponivel = true;
  }

  indisponibilizar() {
    this.disponivel = false;
  }
};
