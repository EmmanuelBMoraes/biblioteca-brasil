const Biblioteca = require("../src/biblioteca");
const Livro = require("../src/livro");
const Usuario = require("../src/usuario");

describe("Biblioteca", () => {
    test("deve criar uma biblioteca", () => {
        const bilbioteca = new Biblioteca(
            [],
            [],
        )

        expect(bilbioteca instanceof Biblioteca).toBe(true);
    });

    test("deve inserir um usuário", () => {
        const biblioteca = new Biblioteca(
            [],
            [],
        )
        const usuario = new Usuario(
            "João Silva",
            22,
            "12345678910",
            ["222544321"],
            "bolsonaro@brasil.com"
        );

        expect(biblioteca.cadastrarUsuario(usuario)).toBe("Usuário cadastrado com sucesso!");
        
    });

    test("deve inserir um livro", () => {
        const biblioteca = new Biblioteca(
            [],
            []
        )
        const livro = new Livro(
            "O Senhor dos Anéis",
            "J.R.R. Tolkien",
            1954,
            "Fantasia",
            "222544321",
            true
        );

        expect(biblioteca.cadastrarLivro(livro)).toBe("Livro cadastrado com sucesso!");
    });

    test("deve emprestar um livro ao usuário", () => {
        const biblioteca = new Biblioteca(
            [],
            []
        );

        const livro = new Livro(
            "O Senhor dos Anéis",
            "J.R.R. Tolkien",
            1954,
            "Fantasia",
            "222544321",
            true
        );

        const usuario = new Usuario(
            "João Silva",
            22,
            "12345678910",
            ["222544321"],
            "bolsonaro@brasil.com"
        );

        expect(biblioteca.emprestarLivro(usuario, livro)).toBe("Emprestimo realziado com sucesso!");
    })

    test("deve emprestar um livro ao usuário", () => {
        const biblioteca = new Biblioteca(
            [],
            []
        );

        const livro = new Livro(
            "O Senhor dos Anéis",
            "J.R.R. Tolkien",
            1954,
            "Fantasia",
            "222544321",
            true
        );

        const usuario = new Usuario(
            "João Silva",
            22,
            "12345678910",
            ["222544321"],
            "bolsonaro@brasil.com"
        );

        expect(biblioteca.devolverLivro(usuario, livro)).toBe("Devolução realziado com sucesso!");
    })

})