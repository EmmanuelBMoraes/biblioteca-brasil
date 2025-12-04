class LivroController {
  constructor(livroRepo) {
    this.livroRepo = livroRepo;
  }

  async adicionaLivro(livro) {
    const { titulo, autor, anoPublicacao, genero, isbn, disponivel } = livro;

    if (!isbn) return { error: "O livro deve possuir o ISBN preenchido!" }

    const novoLivro = await this.livroRepo.create({ titulo, autor, anoPublicacao: anoPublicacao, genero, isbn, disponivel });
    
    return { msg: "Livro cadastrdo com sucesso!", livro: novoLivro }
  }

  async listaLivros() {
    const books = await this.livroRepo.findAll();
    return books;
  }
}

module.exports = LivroController;