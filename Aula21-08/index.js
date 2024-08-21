const express = require('express')
const app = express()

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true})); //trata requisições POST

app.get('/',(req,res)=>{
    res.render('form')
})
app.post('/cadastro',(req, res)=>{
    const nome = req.body.nome 
    const sobrenome = req.body.sobrenome
    res.render('cadastro',{
        nomePagina: nome,
        sobrenomePagina: sobrenome
    })
})
app.listen(8080,(err)=>{
    if (err){
        console.log(err)
    }else{
        console.log("sevidor online")
    }
})