const Livro = require("../schema/livroSchema");

class LivroRepository {
  create(data) {
    return Livro.create(data);
  }
  findByID(title) {
    return Livro.findOne({ _id: title });
  }
  findByISBN(isbn) {
    return Livro.findOne({ isbn })
  }
  findAll() {
    return Livro.find();
  }
  save(livro) {
    return livro.save();
  }
}

module.exports = LivroRepository;