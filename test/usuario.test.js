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
});
