const Usuario = require("../schema/usuarioSchema");

class UsuarioRepository {
  create(data) {
    return Usuario.create(data);
  }
  findById(id) {
    return Usuario.findOne({ _id: id }).populate("livrosEmprestados");
  }
  save(usuario) {
    return usuario.save();
  }
}

module.exports = UsuarioRepository;