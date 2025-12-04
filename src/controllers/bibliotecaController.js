class BibliotecaController {
  constructor(bibliotecaService) {
    this.bibliotecaService = bibliotecaService;
  }

  async emprestar (livroISBN, usuarioID) { 
    const data = await this.bibliotecaService.emprestarLivro(usuarioID, livroISBN);
    return data;
  }

  async devolver (livroISBN, usuarioID) {
    const data = await this.bibliotecaService.devolverLivro(usuarioID, livroISBN);
    return data;
  }
}

module.exports = BibliotecaController;