const CodeBlock = require('../models/CodeBlock'); 

const getCodeBlocks = async (req, res) => {
    try {
    const codeBlocks = await CodeBlock.find({});
    res.json(codeBlocks);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getCodeBlock = async (req, res) => {
  try {
  const { title } = req.params;
  const codeBlock = await CodeBlock.findOne({ title });
  res.json(codeBlock);
} catch (error) {
  res.status(500).json({ error: 'Internal Server Error' });
}
};

module.exports = { getCodeBlocks, getCodeBlock };
