const express = require('express')
const fs = require('fs')
const app = express()

app.set('view engine','ejs')
// isso serve pra usa POST
app.use(express.urlencoded({extended: true}))
app.use(express.static('public')) //

function carregaArquivo(){
    try{
        const lista = fs.readFileSync('todoList.json')
        return JSON.parse(lista)
    }catch(err){
        console.log(err)
        return []
    }
}
function salvaArquivo(lista){
    fs.writeFileSync('todoList.json', JSON.stringify(lista, null, 2))
}
app.get('/',(req, res)=>{
    const lista = carregaArquivo()
    res.render('index',{
        lista: lista
    })
})
app.post('/',(req, res)=>{
    const descricao = req.body.description
    const lista = carregaArquivo()
    const novaTarefa = {
        id: Date.now().toString(),
        descricao: descricao,
        estado: false 
    };
    lista.push(novaTarefa)     
    salvaArquivo(lista);
    res.render('index',{
        lista: lista
    })
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