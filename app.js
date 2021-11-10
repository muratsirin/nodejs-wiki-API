const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use(express.urlencoded({ extended: true }));
app.set("view-engine", "ejs");

mongoose.connect("mongodb://localhost:27017/wikiDB");
const articlesSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articlesSchema);

app
  .route("/articles")
  .get(function (req, res) {
    Article.find({}, function (err, articles) {
      if (!err) {
        res.send(articles);
      } else {
        console.log(err);
      }
    });
  })
  .post(function (req, res) {
    const article = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    article.save(function (err) {
      if (!err) {
        res.send("Article successfully added to API");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany({}, function (err) {
      if (!err) {
        res.send("All articles successfully deleted");
      } else {
        res.send(err);
      }
    });
  });

app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, article) {
        if (!err) {
          res.send(article);
        } else {
          res.send(err);
        }
      }
    );
  })
  .put(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: {title: req.body.title, content: req.body.content }},
      { overwrite: true },
      function (err) {
        if (!err) {
          res.send("Article successfully updated");
        } else {
          res.send(err);
        }
      }
    );
  })
  .patch(function(req, res){
    Article.updateOne(
        { title: req.params.articleTitle },
        { $set: req.body},
        { overwrite: true },
        function (err) {
          if (!err) {
            res.send("Article successfully updated");
          } else {
            res.send(err);
          }
        }
      );
  })
  .delete(function(req, res){
      Article.deleteOne({title: req.params.articleTitle}, function(err){
          if(!err){
              res.send("Article successfully deleted");
          }else{
              res.send(err);
          }
      });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
