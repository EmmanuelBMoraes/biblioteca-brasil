const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const Livro = require("../src/schema/livroSchema");
const LivroRepository = require("../src/repositories/livroRepository");

let mongoServer;
let livroRepo;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  livroRepo = new LivroRepository();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Livro.deleteMany({});
});

describe("Livro", () => {
  test("deve criar um livro com título, autor e ISBN", async () => {
    const livroData = {
      titulo: "O Senhor dos Anéis",
      autor: "J.R.R. Tolkien",
      anoPublicacao: 1954,
      genero: "Fantasia",
      isbn: "222544321",
      disponivel: true
    };

    const livro = await livroRepo.create(livroData);
    expect(livro._id).toBeDefined();
    expect(livro.titulo).toBe("O Senhor dos Anéis");
    expect(livro.disponivel).toBe(true);
  });

  test("não deve criar um livro sem ISBN", async () => {
    const livroData = {
      titulo: "O Senhor dos Anéis",
      autor: "J.R.R. Tolkien",
      anoPublicacao: 1954,
      genero: "Fantasia",
      isbn: null,
      disponivel: true
    };

    await expect(livroRepo.create(livroData)).rejects.toThrow();
  });

  test("deve marcar o livro como disponível", async () => {
    const livro = await livroRepo.create({
      titulo: "O Senhor dos Anéis",
      autor: "J.R.R. Tolkien",
      anoPublicacao: 1954,
      genero: "Fantasia",
      isbn: "222544321",
      disponivel: false
    });

    livro.disponivel = true;
    await livroRepo.save(livro);

    const atualizado = await livroRepo.findByISBN("222544321");
    expect(atualizado.disponivel).toBe(true);
  });

  test("deve marcar o livro como indisponível", async () => {
    const livro = await livroRepo.create({
      titulo: "O Senhor dos Anéis",
      autor: "J.R.R. Tolkien",
      anoPublicacao: 1954,
      genero: "Fantasia",
      isbn: "222544321",
      disponivel: true
    });

    livro.disponivel = false;
    await livroRepo.save(livro);

    const atualizado = await livroRepo.findByISBN("222544321");
    expect(atualizado.disponivel).toBe(false);
  });
});
