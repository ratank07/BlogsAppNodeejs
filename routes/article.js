const express = require("express");
const Articlemodel = require("../models/articlemodel");
const router = express.Router();
const marked = require('marked')
const slugify =  require('slugify')
router.get('/:slug', async (req, res) => {
  console.log("article requested");
  article = await Articlemodel.findOne({slug:req.params.slug})
  if(article == null) {
      res.redirect('/')
  }
  console.log('article',article);
  
  res.render('show', {article: article})
//   res.send(req.params.id)

//   res.render("new");
});
router.get("/", (req, res) => {
    console.log("article requested");
  
    res.render("new",{article: new Articlemodel()});
  });

router.post("/new", async (req, res) => {
  console.log(" req.body", req.body);
  let article = new Articlemodel({
    title: req.body.title,
    discription: req.body.discription,
    markdown: req.body.markdown
  });
  try {
    article = await article.save();
    console.log("data saved",article);
    res.redirect(`/article/${article.slug}`)
  } catch (e) {
       res.render('article/', {article: article})
    console.log("exception", e);
  }
});
// method="GET"
router.delete('/:id', async (req, res)=> {
    await Articlemodel.findByIdAndDelete(req.params.id)
    res.redirect('/')
})
router.get('/edit/:id', async (req, res) => {
    console.log('artivlcr in edit','params',req.params.id);

    const article = await Articlemodel.findById(req.params.id)
    console.log('artivlcr in edit', article.title);
    
    res.render('edit', {article: article})
})

router.put('/:id', async (req, res,next)=> {
    req.article = await Articlemodel.findById(req.params.id)
    next();

}, saveArticleAndRedirect('edit'))

function saveArticleAndRedirect(path){
    return async (req, res) => {
        let article = req.article
        article.title = req.body.title
        article.discription = req.body.discription
        article.markdown = req.body.markdown
        try {
            article = await article.save()
            res.redirect(`/article/${article.slug}`)
        }
        catch(e) {
            res.redirect(`article/{path}`, {article: article})
        }
    }
}
module.exports = router;
