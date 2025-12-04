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

  test("não deve emprestar livro inexistente", async () => {
    const usuario = await usuarioRepo.create({
      nome: "João Silva",
      idade: 22,
      cpf: "12345678910",
      email: "joao@email.com",
      livrosEmprestados: []
    });

    await expect(
      bibliotecaController.emprestar("ISBN_INEXISTENTE", usuario._id)
    ).rejects.toThrow("Livro não encontrado");
  });

  
  test("não deve emprestar livro para usuário inexistente", async () => {
    const mongoose = require("mongoose");

    const livro = await livroRepo.create({
      titulo: "O Senhor dos Anéis",
      autor: "J.R.R. Tolkien",
      anoPublicacao: 1954,
      genero: "Fantasia",
      isbn: "222544321",
      disponivel: true
    });

    const fakeId = new mongoose.Types.ObjectId();

    await expect(
      bibliotecaController.emprestar(livro.isbn, fakeId)
    ).rejects.toThrow("Usuário não encontrado");
  });


  test("não deve emprestar livro que não está disponível", async () => {
    const usuario1 = await usuarioRepo.create({
      nome: "João Silva",
      idade: 22,
      cpf: "12345678910",
      email: "joao@email.com",
      livrosEmprestados: []
    });

    const usuario2 = await usuarioRepo.create({
      nome: "Maria Souza",
      idade: 25,
      cpf: "98765432100",
      email: "maria@email.com",
      livrosEmprestados: []
    });

    const livro = await livroRepo.create({
      titulo: "O Hobbit",
      autor: "J.R.R. Tolkien",
      anoPublicacao: 1937,
      genero: "Fantasia",
      isbn: "333555777",
      disponivel: true
    });

    // Primeiro usuário pega o livro
    await bibliotecaController.emprestar(livro.isbn, usuario1._id);

    // Segundo usuário tenta pegar o mesmo livro
    await expect(
      bibliotecaController.emprestar(livro.isbn, usuario2._id)
    ).rejects.toThrow("Livro não disponível");
  });

  test("não deve devolver livro que não foi emprestado ao usuário", async () => {
    const usuario = await usuarioRepo.create({
      nome: "João Silva",
      idade: 22,
      cpf: "12345678910",
      email: "joao@email.com",
      livrosEmprestados: []
    });

    const livro = await livroRepo.create({
      titulo: "O Hobbit",
      autor: "J.R.R. Tolkien",
      anoPublicacao: 1937,
      genero: "Fantasia",
      isbn: "333555777",
      disponivel: true
    });

    await expect(
      bibliotecaController.devolver(livro.isbn, usuario._id)
    ).rejects.toThrow("Livro não emprestado ao usuário");
  });

});
