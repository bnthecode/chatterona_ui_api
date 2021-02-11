

export const createChannel = async (req, res, next) => {
  try {
    res.status(201).send({ message: "created" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
