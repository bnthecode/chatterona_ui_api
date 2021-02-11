

export const createServer = async (req, res) => {
  try {
    res.status(201).send({ message: "created"});
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

