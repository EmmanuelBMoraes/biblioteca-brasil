const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const Usuario = require("../src/schema/usuarioSchema");
const UsuarioRepository = require("../src/repositories/usuarioRepository");
const UsuarioController = require("../src/controllers/usuarioController");

let mongoServer;
let usuarioRepo;
let usuarioController;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  usuarioRepo = new UsuarioRepository();
  usuarioController = new UsuarioController(usuarioRepo);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Usuario.deleteMany({});
});

describe("Usuário - Controller", () => {
  test("deve criar um usuário com nome, email e CPF válido", async () => {
    const usuarioData = {
      nome: "João Silva",
      idade: 22,
      cpf: "12345678910",
      email: "joao@email.com",
      livrosEmprestados: []
    };

    const result = await usuarioController.create(usuarioData);
    expect(result.usuario._id).toBeDefined();
    expect(result.usuario.nome).toBe("João Silva");
    expect(result.usuario.email).toBe("joao@email.com");
    expect(result).toHaveProperty("msg", "Usuario cadastrado com sucesso!")
  });

  test("não deve criar usuário com CPF inválido", async () => {
    const usuarioData = {
      nome: "João Silva",
      idade: 22,
      cpf: "12345",
      email: "joao@email.com",
      livrosEmprestados: []
    };

    const result = await usuarioController.create(usuarioData);
    expect(result).toHaveProperty("error", "Informe um CPF válido para o usuário!");
  });

  test("não deve criar usuário com email inválido", async () => {
    const usuarioData = {
      nome: "João Silva",
      idade: 22,
      cpf: "12345678910",
      email: "joao-brasil.com",
      livrosEmprestados: []
    };

    const result = await usuarioController.create(usuarioData);
    expect(result).toHaveProperty("error", "Informe um EMAIL vaálido para o usuário!");
  });
});
