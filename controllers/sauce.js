const Sauce = require('../models/sauce');
const fs = require('fs');


exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.likeDislike = (req, res, next) => { 
  if(req.body.like === 1) { 
      Sauce.updateOne({ _id: req.params.id }, { $inc: {likes: +1}, $push: {usersLiked: req.body.userId }})
  .then(() => res.status(200).json({ message: 'Like !'}))
  .catch(error => res.status(400).json({ error }))
}

  else if(req.body.like === -1) {
      Sauce.updateOne({ _id: req.params.id }, { $inc: {dislikes: +1}, $push: {usersDisliked: req.body.userId }})
  .then(() => res.status(200).json({ message: 'Dislike !'}))
  .catch(error => res.status(400).json({ error }))

}
  else if(req.body.like === 0) {
      Sauce.findOne({ _id: req.params.id })
  .then((sauce) => {
      if(sauce.usersLiked.find(user => user === req.body.userId)) {
          Sauce.updateOne({ _id: req.params.id }, { $inc: {likes: -1}, $pull: {usersLiked: req.body.userId }})
          .then(() => res.status(200).json({ message: "like annulé !"}))
          .catch(error => res.status(400).json({ error }));
      }
      
      else if(sauce.usersDisliked.find(user => user === req.body.userId)) {
          Sauce.updateOne({ _id: req.params.id }, { $inc: {dislikes: -1}, $pull: {usersDisliked: req.body.userId }})
          .then(() => res.status(200).json({ message: "Dislike annulé !"}))
          .catch(error => res.status(400).json({ error }));
      }
  })
  .catch(error => res.status(400).json({ error }))
}
};