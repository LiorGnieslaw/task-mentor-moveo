const mongoose = require('mongoose');

const codeBlockSchema = new mongoose.Schema(
  {
  title: { type: String, required: true },
  code: { type: String, default: '' },
  solution: { type: String, default: '' },
  }
);

const CodeBlock = mongoose.model('codeBlocks', codeBlockSchema);

module.exports = CodeBlock;
