module.exports = class Biblioteca {
    constructor(bibliotecaService) {
        this.service = bibliotecaService;
    }

    async cadastrarUsuario(usuarioData) {
        return await this.service.cadastrarUsuario(usuarioData);
    }

    async cadastrarLivro(livroData) {
        return await this.service.cadastrarLivro(livroData);
    }

    async emprestarLivro(usuarioId, livroISBN) {
        return await this.service.emprestarLivro(usuarioId, livroISBN);
    }

    async devolverLivro(usuarioId, livroISBN) {
        return await this.service.devolverLivro(usuarioId, livroISBN);
    }

    async listarLivrosDisponiveis() {
        return await this.service.listarLivrosDisponiveis();
    }

    async listarEmprestimosPorUsuario(usuarioId) {
        return await this.service.listarEmprestimosPorUsuario(usuarioId);
    }

    async listarTodosLivros() {
        return await this.service.listarTodosLivros();
    }

    async listarTodosUsuarios() {
        return await this.service.listarTodosUsuarios();
    }
}   