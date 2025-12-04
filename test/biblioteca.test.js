const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const Usuario = require("../src/schema/usuarioSchema");
const Livro = require("../src/schema/livroSchema");
const UsuarioRepository = require("../src/repositories/usuarioRepository");
const LivroRepository = require("../src/repositories/livroRepository");
const BibliotecaService = require("../src/service/bibliotecaService");
const BibliotecaController = require("../src/controllers/bibliotecaController");

let mongoServer;
let usuarioRepo;
let livroRepo;
let bibliotecaService;
let bibliotecaController;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  usuarioRepo = new UsuarioRepository();
  livroRepo = new LivroRepository();
  bibliotecaService = new BibliotecaService(livroRepo, usuarioRepo);
  bibliotecaController = new BibliotecaController(bibliotecaService);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Usuario.deleteMany({});
  await Livro.deleteMany({});
});

describe("Biblioteca", () => {
  test("deve cadastrar um usuário", async () => {
    const usuarioData = {
      nome: "João Silva",
      idade: 22,
      cpf: "12345678910",
      email: "joao@email.com",
      livrosEmprestados: []
    };

    const usuario = await usuarioRepo.create(usuarioData);

    expect(usuario._id).toBeDefined();
    expect(usuario.nome).toBe("João Silva");
  });

  test("deve cadastrar um livro", async () => {
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
  });

  test("deve emprestar um livro ao usuário", async () => {
    const usuario = await usuarioRepo.create({
      nome: "João Silva",
      idade: 22,
      cpf: "12345678910",
      email: "joao@email.com",
      livrosEmprestados: []
    });

    const livro = await livroRepo.create({
      titulo: "O Senhor dos Anéis",
      autor: "J.R.R. Tolkien",
      anoPublicacao: 1954,
      genero: "Fantasia",
      isbn: "222544321",
      disponivel: true
    });

    const result = await bibliotecaController.emprestar(livro.isbn, usuario._id);

    expect(result.livro.disponivel).toBe(false);
    expect(result.usuario.livrosEmprestados[0].equals(livro._id)).toBe(true);
  });

  test("deve devolver um livro do usuário", async () => {
    const usuario = await usuarioRepo.create({
      nome: "João Silva",
      idade: 22,
      cpf: "12345678910",
      email: "joao@email.com",
      livrosEmprestados: []
    });

    const livro = await livroRepo.create({
      titulo: "O Senhor dos Anéis",
      autor: "J.R.R. Tolkien",
      anoPublicacao: 1954,
      genero: "Fantasia",
      isbn: "222544321",
      disponivel: true
    });

    // Primeiro emprestar
    await bibliotecaController.emprestar(livro.isbn, usuario._id);

    // Devolver
    const result = await bibliotecaController.devolver(livro.isbn, usuario._id);

    expect(result.livro.disponivel).toBe(true);
    expect(result.usuario.livrosEmprestados.length).toBe(0);
  });
});
