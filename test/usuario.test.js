const Usuario = require("../src/usuario");

describe("Usuario", () => {
  test("deve criar um usuário com nome e email", () => {
    const usuario = new Usuario(
      "João Silva",
      22,
      "12345678910",
      [],
      "bolsonaro@brasil.com"
    );
    expect(usuario instanceof Usuario).toBe(true);
  });

  test("não deve criar um usuário com cpf inválido", () => {
    expect(() => {
      new Usuario("João Silva", 22, "12345", [], "bolsonaro@brasil.com");
    }).toThrow("CPF inválido");
  });

  test("não deve criar um usuário com email inválido", () => {
    expect(() => {
      new Usuario("João Silva", 22, "12345678910", [], "bolsonaro-brasil.com");
    }).toThrow("Email inválido");
  });

  test("deve devolver o livro emprestado", () => {
    const usuario = new Usuario(
      "João Silva",
      22,
      "12345678910",
      ["222544321"],
      "bolsonaro@brasil.com"
    );
    usuario.devolverLivro("222544321");
    expect(usuario.livrosEmprestados).toEqual([]);
  });

  test("deve emprestar um livro ao usuário", () => {
    const usuario = new Usuario(
      "João Silva",
      22,
      "12345678910",
      [],
      "bolsonaro@brasil.com"
    );
    usuario.emprestarLivro("222544321");
    expect(usuario.livrosEmprestados).toEqual(["222544321"]);
  });

  test("não deve devolver um livro que não foi emprestado", () => {
    const usuario = new Usuario(
      "João Silva",
      22,
      "12345678910",
      [],
      "bolsonaro@brasil.com"
    );
    expect(() => {
      usuario.devolverLivro("222544321");
    }).toThrow(`Livro não emprestado ao usuário ${usuario.nome}`);
  });
});
