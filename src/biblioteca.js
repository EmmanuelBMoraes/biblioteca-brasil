module.exports = class Biblioteca {
    constructor(usuarios, livros) {
        this.usuarios = usuarios;
        this.livros = livros;
    }

    cadastrarUsuario(usuario) {
        return "Usuário cadastrado com sucesso!"
    }
    cadastrarLivro(livro) {
        return "Livro cadastrado com sucesso!";
    }

    emprestarLivro(usuario, livro) {
        return "Emprestimo realziado com sucesso!";
    }

    devolverLivro(usuario, livro) {
        return "Devolução realziado com sucesso!"
    }
}