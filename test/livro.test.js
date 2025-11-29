const Livro = require("../src/livro");

describe("Livro", () => {
  test("deve criar um livro com título e autor", () => {
    //titulo, autor, anoPublicacao, genero, isbn, disponivel
    const livro = new Livro(
      "O Senhor dos Anéis",
      "J.R.R. Tolkien",
      1954,
      "Fantasia",
      "222544321",
      false
    );
    expect(livro instanceof Livro).toBe(true);
  });

  test("não deve criar um livro sem ISBN", () => {
    expect(() => {
      new Livro(
        "O Senhor dos Anéis",
        "J.R.R. Tolkien",
        1954,
        "Fantasia",
        null,
        true
      );
    }).toThrow("ISBN é obrigatório");
  });

  test("deve marcar o livro como disponível", () => {
    const livro = new Livro(
      "O Senhor dos Anéis",
      "J.R.R. Tolkien",
      1954,
      "Fantasia",
      "222544321",
      false
    );
    livro.disponibilizar();
    expect(livro.disponivel).toBe(true);
  });

  test("deve marcar o livro como indisponível", () => {
    const livro = new Livro(
      "O Senhor dos Anéis",
      "J.R.R. Tolkien",
      1954,
      "Fantasia",
      "222544321",
      true
    );
    livro.indisponibilizar();
    expect(livro.disponivel).toBe(false);
  });
});
