const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect('mongodb+srv://admin-jatin:9873804639@cluster0.ktbyq.mongodb.net/RestApi', {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = new mongoose.Schema({
    title:String,
    content:String,
})

const Article  = mongoose.model('Article',articleSchema);

app.route('/articles')

    .get((req,res)=>{
        Article.find((err,foundArticle)=>{
            err?console.log(err):res.send(foundArticle);
        })
    }) 
    .post((req,res)=>{
        const title = req.body.title;
        const content = req.body.content;
        const newArticle = new Article({
            title,
            content
        })
        newArticle.save((err)=>{
            err?console.log(err):res.send('Success');
        })
    }) 
    .delete((req,res)=>{
        Article.deleteMany((err)=>{
            err?console.log(err):res.send("Succesfully deleted all entries");
        })
    });

    app.route('/articles/:articleName')
    .get((req,res)=>{
        Article.findOne({title:req.params.articleName},(err,found)=>{
            err?res.send('no result found'):res.send(found);
        })
    })
    .put((req,res)=>{
        Article.update(
            {title:req.params.articleName},
            {
                title:req.body.title,
                content:req.body.content
            },
            {overwrite:true},
            (err)=>{
                err?res.send(err):res.send('updated');
            }

        )
    })
    .patch((req,res)=>{
        Article.update(
            {title:req.params.articleName},
            {
                $set:req.body,
            },

            (err)=>{
                err?res.send(err):res.send('updated');
            }

        )
    })

    .delete((req,res)=>{
        Article.deleteOne({title:req.params.articleName},(err)=>{
            err?res.send(err):res.send("Succesfully deleted");
        })

    })

app.listen(process.env.PORT || 3000,()=>{
    console.log("server running on port 3000");
})