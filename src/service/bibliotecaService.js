const Biblioteca = require("../schema/bibliotecaSchema");

class BibliotecaService {
    constructor({ usuarioService, livroService }) {
        this.usuarioService = usuarioService;
        this.livroService = livroService; 
        this.bibliotecaId = null;
    }
    
    async criarBiblioteca(nome) {
        const biblioteca = await Biblioteca.create({ nome, usuarios: [], livros: [] });
        this.bibliotecaId = biblioteca._id;
        return biblioteca;
    }

    async cadastrarUsuario(usuarioData) {
        const usuario = await this.usuarioService.cadastrarUsuario(usuarioData);

        if (!this.bibliotecaId) throw new Error("Biblioteca não criada");

        const biblioteca = await Biblioteca.findById(this.bibliotecaId);
        biblioteca.usuarios.push(usuario._id);
        await biblioteca.save();

        return { msg: "Usuário cadastrado com sucesso!", usuario };
    }

    async cadastrarLivro(livroData) {
        const livro = await this.livroService.cadastrarLivro(livroData);
        
        if (!this.bibliotecaId) throw new Error("Biblioteca não criada");

        const biblioteca = await Biblioteca.findById(this.bibliotecaId);
        biblioteca.livros.push(livro._id);
        
        await biblioteca.save();

        return { msg: "Livro cadastrado com sucesso!", livro };
    }

    async emprestarLivro(usuarioId, livroISBN) {
        const usuario = await this.usuarioService.buscarUsuarioPorId(usuarioId);
        const livro = await this.livroService.buscarLivroPorIsbn(livroISBN);

        if (!livro.disponivel) {
            throw new Error("Livro indisponível para empréstimo");
        }

        usuario.livrosEmprestados.push(livro._id);
        livro.disponivel = false;

        await Promise.all([
            this.usuarioService.atualizarUsuario(usuario._id, usuario),
            this.livroService.atualizarLivro(livro._id, livro),
        ]);

        return { msg: "Empréstimo realizado com sucesso!", usuario, livro };
    }

    async devolverLivro(usuarioId, livroISBN) {
        const usuario = await this.usuarioService.buscarUsuarioPorId(usuarioId);
        const livro = await this.livroService.buscarLivroPorIsbn(livroISBN);

        const index = usuario.livrosEmprestados.findIndex(id => id.equals(livro._id));

        if (index === -1) {
            throw new Error("Livro não emprestado a este usuário");
        }

        usuario.livrosEmprestados.splice(index, 1);
        livro.disponivel = true;

        await Promise.all([
            this.usuarioService.atualizarUsuario(usuario._id, usuario),
            this.livroService.atualizarLivro(livro._id, livro),
        ]);

        return { msg: "Devolução realizada com sucesso!", usuario, livro };
    }

    async listarLivrosDisponiveis() {
        const livros = await this.livroService.buscarLivros();
        return livros.filter(l => l.disponivel);
    }

    async listarEmprestimosPorUsuario(usuarioId) {
        const usuario = await this.usuarioService.buscarUsuarioPorId(usuarioId);
        return usuario.livrosEmprestados;
    }

    async listarTodosLivros() {
        if (!this.bibliotecaId) throw new Error("Biblioteca não criada");

        const biblioteca = await Biblioteca.findById(this.bibliotecaId).populate("livros");
        return biblioteca.livros;
    }

    async listarTodosUsuarios() {
        if (!this.bibliotecaId) throw new Error("Biblioteca não criada");

        const biblioteca = await Biblioteca.findById(this.bibliotecaId).populate("usuarios");
        return biblioteca.usuarios;
    }
}

module.exports = BibliotecaService;