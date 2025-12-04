const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const Usuario = require("../src/schema/usuarioSchema");
const Livro = require("../src/schema/livroSchema"); // Import necessário para populate
const UsuarioRepository = require("../src/repositories/usuarioRepository");

let mongoServer;
let usuarioRepo;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  usuarioRepo = new UsuarioRepository();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Usuario.deleteMany({});
  await Livro.deleteMany({});
});

describe("Usuario", () => {
  test("deve criar um usuário com nome, email e CPF válido", async () => {
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
    expect(usuario.email).toBe("joao@email.com");
  });

  test("não deve criar um usuário com CPF inválido", async () => {
    const usuarioData = {
      nome: "João Silva",
      idade: 22,
      cpf: "12345",
      email: "joao@email.com",
      livrosEmprestados: []
    };

    await expect(usuarioRepo.create(usuarioData)).rejects.toThrow();
  });

  test("não deve criar um usuário com email inválido", async () => {
    const usuarioData = {
      nome: "João Silva",
      idade: 22,
      cpf: "12345678910",
      email: "joao-brasil.com",
      livrosEmprestados: []
    };

    await expect(usuarioRepo.create(usuarioData)).rejects.toThrow();
  });

  test("deve emprestar um livro ao usuário", async () => {
    // Criar um livro para referência
    const livro = await Livro.create({
      titulo: "O Senhor dos Anéis",
      autor: "J.R.R. Tolkien",
      anoPublicacao: 1954,
      genero: "Fantasia",
      isbn: "222544321",
      disponivel: true
    });

    const usuario = await usuarioRepo.create({
      nome: "João Silva",
      idade: 22,
      cpf: "12345678910",
      email: "joao@email.com",
      livrosEmprestados: []
    });

    // Emprestando o livro
    usuario.livrosEmprestados.push(livro._id);
    await usuarioRepo.save(usuario);

    const atualizado = await usuarioRepo.findById(usuario._id);
    expect(atualizado.livrosEmprestados.length).toBe(1);
    expect(atualizado.livrosEmprestados[0].equals(livro._id)).toBe(true);
  });

  test("deve devolver o livro emprestado", async () => {
    const livro = await Livro.create({
      titulo: "O Hobbit",
      autor: "J.R.R. Tolkien",
      anoPublicacao: 1937,
      genero: "Fantasia",
      isbn: "333555777",
      disponivel: true
    });

    const usuario = await usuarioRepo.create({
      nome: "João Silva",
      idade: 22,
      cpf: "12345678910",
      email: "joao@email.com",
      livrosEmprestados: [livro._id]
    });

    // Devolvendo o livro
    usuario.livrosEmprestados = usuario.livrosEmprestados.filter(
      id => !id.equals(livro._id)
    );
    await usuarioRepo.save(usuario);

    const atualizado = await usuarioRepo.findById(usuario._id);
    expect(atualizado.livrosEmprestados.length).toBe(0);
  });

  test("não deve devolver um livro que não foi emprestado", async () => {
    const livro = await Livro.create({
      titulo: "O Hobbit",
      autor: "J.R.R. Tolkien",
      anoPublicacao: 1937,
      genero: "Fantasia",
      isbn: "333555777",
      disponivel: true
    });

    const usuario = await usuarioRepo.create({
      nome: "João Silva",
      idade: 22,
      cpf: "12345678910",
      email: "joao@email.com",
      livrosEmprestados: [] // Nenhum livro emprestado
    });

    expect(() => {
      if (!usuario.livrosEmprestados.some(id => id.equals(livro._id))) {
        throw new Error(`Livro não emprestado ao usuário ${usuario.nome}`);
      }
    }).toThrow(`Livro não emprestado ao usuário ${usuario.nome}`);
  });
});
