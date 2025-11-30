const Usuario = require("../schema/usuarioSchema");

class UsuarioService {
  /**
   * Cadastra um novo usuário no banco de dados.
   * @param {object} usuarioData - Os dados do usuário a ser cadastrado.
   * @returns {Promise<object>} O documento do usuário salvo.
   */
  async cadastrarUsuario(usuarioData) {
    try {
      const novoUsuario = new Usuario(usuarioData);
      return await novoUsuario.save();
    } catch (error) {
      // Trata erros de validação ou de duplicidade (CPF/email)
      throw new Error(`Erro ao cadastrar usuário: ${error.message}`);
    }
  }

  /**
   * Busca todos os usuários cadastrados.
   * @returns {Promise<Array<object>>} Uma lista de todos os usuários.
   */
  async buscarUsuarios() {
    try {
      return await Usuario.find();
    } catch (error) {
      throw new Error(`Erro ao buscar usuários: ${error.message}`);
    }
  }

  /**
   * Busca um usuário pelo seu ID.
   * @param {string} id - O ID do usuário.
   * @returns {Promise<object>} O documento do usuário encontrado.
   */
  async buscarUsuarioPorId(id) {
    try {
      const usuario = await Usuario.findById(id).populate("livrosEmprestados");
      if (!usuario) {
        throw new Error("Usuário não encontrado");
      }
      return usuario;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário por ID: ${error.message}`);
    }
  }

  /**
   * Atualiza os dados de um usuário existente.
   * @param {string} id - O ID do usuário a ser atualizado.
   * @param {object} usuarioData - Os novos dados do usuário.
   * @returns {Promise<object>} O documento do usuário atualizado.
   */
  async atualizarUsuario(id, usuarioData) {
    try {
      const usuarioAtualizado = await Usuario.findByIdAndUpdate(
        id,
        usuarioData,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!usuarioAtualizado) {
        throw new Error("Usuário não encontrado para atualização");
      }
      return usuarioAtualizado;
    } catch (error) {
      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }
  }

  /**
   * Deleta um usuário do banco de dados.
   * @param {string} id - O ID do usuário a ser deletado.
   */
  async deletarUsuario(id) {
    return Usuario.findByIdAndDelete(id);
  }
}

module.exports = new UsuarioService();
