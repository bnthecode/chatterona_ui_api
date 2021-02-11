import admin from "firebase-admin";

export const authMiddleware = async (req, res, next) => {
  // basic google auth
  // console.log(req.headers.uid)
  try {
   await admin
      .auth()
      .getUser(req.headers.uid)
      .then((user) => {
        req.user = user;
        console.log(`authenicated ${user.displayName}`)
        next();
      })
      .catch((error) => {
        console.log(error);
        next()
        // res.status(401).send("You are not authorized to view this page.");
      });
  } catch (err) {
    res.status(200).send('OK')
    console.log(err);
  }
  next()
};
