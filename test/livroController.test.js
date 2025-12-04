// test/livroController.test.js
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const Livro = require("../src/schema/livroSchema");
const LivroRepository = require("../src/repositories/livroRepository");
const LivroController = require("../src/controllers/livroController");

let mongoServer;
let livroRepo;
let livroController;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  livroRepo = new LivroRepository();
  livroController = new LivroController(livroRepo);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Livro.deleteMany({});
});

describe("Livro - Controller", () => {
  test("deve cadastrar um livro com ISBN válido", async () => {
    const livroData = {
      titulo: "O Senhor dos Anéis",
      autor: "J.R.R. Tolkien",
      anoPublicacao: 1954,
      genero: "Fantasia",
      isbn: "222544321",
      disponivel: true
    };

    const result = await livroController.adicionaLivro(livroData);
    expect(result).toHaveProperty("msg", "Livro cadastrdo com sucesso!");
    expect(result.livro._id).toBeDefined();
  });

  test("não deve cadastrar um livro sem ISBN", async () => {
    const livroData = {
      titulo: "O Hobbit",
      autor: "J.R.R. Tolkien",
      anoPublicacao: 1937,
      genero: "Fantasia",
      isbn: null,
      disponivel: true
    };

    const result = await livroController.adicionaLivro(livroData);
    expect(result).toHaveProperty("error", "O livro deve possuir o ISBN preenchido!");
  });
});
