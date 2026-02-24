import catigoryModle from "../models/catigory.model.js";

export const getCategories = (req, res) => {
  const name = req.body.name;
  const newCatigory = new catigoryModle({ name });
  newCatigory
    .save()
    .then((catigory) => {
      res.send(catigory);
    })
    .catch((err) => {
      res.send(err);
    });
};
