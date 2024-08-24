const express = require('express')
const app = express()

app.set('view engine','ejs')
// isso serve pra usa POST
app.use(express.urlencoded({extended: true}))
app.use(express.static('public')) //

app.get('/',(req, res)=>{
    //carregar lista a partir de um arquivo
    res.render('index')
})
app.post('/',(req, res)=>{
    //carregar a lista
    //adiocionar a tarefa nova na lista
    console.log(req.body.description)
    res.render('index')
})
app.get('/novaTarefa',(req, res)=>{
    res.render('cadastro')
})
app.post('/update',(req, res)=>{
    //carregar a lista
    //buscar a tarefa na lista
    //modificar o item da lista
    //salvar
    res.redirect('/')
})
app.post('/delete',(req, res)=>{
    //carregar a lista
    //buscar a tarefa na lista
    //apagar o item da lista
    //salvar
    res.redirect('/')
})

app.listen(8080,(err)=>{
    if (err) {
        console.log(err)
    }else{
        console.log('Servidor online')
    }
})