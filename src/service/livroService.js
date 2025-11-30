const Livro = require("../schema/livroSchema");

class LivroService {
  /**
   * Cadastra um novo livro no banco de dados.
   * @param {object} livroData - Os dados do livro a ser cadastrado.
   * @returns {Promise<object>} O documento do livro salvo.
   */
  async cadastrarLivro(livroData) {
    try {
      const novoLivro = new Livro(livroData);
      return await novoLivro.save();
    } catch (error) {
      throw new Error(`Erro ao cadastrar livro: ${error.message}`);
    }
  }

  /**
   * Busca todos os livros cadastrados.
   * @returns {Promise<Array<object>>} Uma lista de todos os livros.
   */
  async buscarLivros() {
    try {
      return await Livro.find();
    } catch (error) {
      throw new Error(`Erro ao buscar livros: ${error.message}`);
    }
  }

  /**
   * Busca um livro pelo seu ISBN.
   * @param {string} isbn - O ISBN do livro a ser buscado.
   * @returns {Promise<object>} O documento do livro encontrado.
   */
  async buscarLivroPorIsbn(isbn) {
    try {
      const livro = await Livro.findOne({ isbn: isbn });
      if (!livro) {
        throw new Error("Livro não encontrado");
      }
      return livro;
    } catch (error) {
      throw new Error(`Erro ao buscar livro por ISBN: ${error.message}`);
    }
  }

  /**
   * Atualiza os dados de um livro existente.
   * @param {string} id - O ID do livro a ser atualizado.
   * @param {object} livroData - Os novos dados do livro.
   * @returns {Promise<object>} O documento do livro atualizado.
   */
  async atualizarLivro(id, livroData) {
    try {
      const livroAtualizado = await Livro.findByIdAndUpdate(id, livroData, {
        new: true,
        runValidators: true,
      });
      if (!livroAtualizado) {
        throw new Error("Livro não encontrado para atualização");
      }
      return livroAtualizado;
    } catch (error) {
      throw new Error(`Erro ao atualizar livro: ${error.message}`);
    }
  }

  /**
   * Deleta um livro do banco de dados.
   * @param {string} id - O ID do livro a ser deletado.
   * @returns {Promise<object>} O documento do livro que foi deletado.
   */
  async deletarLivro(id) {
    return Livro.findByIdAndDelete(id);
  }
}

module.exports = new LivroService();
