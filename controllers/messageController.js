export const createMessage = async (req, res) => {
  try {
    res.status(201).send({ message: "created" });
  } catch (err) {
    console.log(err.message);
  }
};
