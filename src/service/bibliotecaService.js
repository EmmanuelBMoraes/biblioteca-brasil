class BibliotecaService {
  constructor(livroRepo, usuarioRepo) {
    this.livroRepo = livroRepo;
    this.usuarioRepo = usuarioRepo;
  }

  async emprestarLivro(usuarioID, livroISBN) {
    const usuario = await this.usuarioRepo.findById(usuarioID);
    const livro = await this.livroRepo.findByISBN(livroISBN);

    if (!usuario) throw new Error("Usuário não encontrado");
    if (!livro) throw new Error("Livro não encontrado");
    if (!livro.disponivel) throw new Error("Livro não disponível");

    livro.disponivel = false;
    await this.livroRepo.save(livro);

    usuario.livrosEmprestados.push(livro._id);
    await this.usuarioRepo.save(usuario);

    return { usuario, livro };
  }

  async devolverLivro(usuarioID, livroISBN) {
    const usuario = await this.usuarioRepo.findById(usuarioID);
    const livro = await this.livroRepo.findByISBN(livroISBN);

    if (!usuario || !livro) throw new Error("Dados inválidos");

    // Verifica se o usuário realmente tem o livro
    const possuiLivro = usuario.livrosEmprestados.some(id => id.equals(livro._id));
    if (!possuiLivro) {
      throw new Error("Livro não emprestado ao usuário");
    }

    livro.disponivel = true;
    await this.livroRepo.save(livro);

    usuario.livrosEmprestados = usuario.livrosEmprestados.filter(
        id => !id.equals(livro._id)
    );

    await this.usuarioRepo.save(usuario);

    return { usuario, livro };
  }

}

module.exports = BibliotecaService;