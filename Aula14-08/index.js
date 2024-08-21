const express = require('express')
const app = express()
app.get('/', (req, res)=>{
    res.send("Rota raiz")
})
app.get('/ifpi',(req,res)=>{
    res.send('Rota IFPI')
})
app.get('/busca/:conteudo',(req,res)=>{
    let busca = req.params.conteudo
    res.send(`Busca por: ${busca}`)
})
app.get('/buscaopcional/:conteudo?',(req,res)=>{
    let busca = req.params.conteudo
    res.send(`Busca opcional: ${busca}`)
})
app.get('/qp',(req,res)=>{
    let valor = req.query['campo']
    if (valor){
        res.send(`Valor do campo: ${valor}`)
    }else{
        res.send('Nenhum valor fornecido')
    }
})
app.listen(3000, (err) => {
    console.log('Servidor rodando na porta 3000!')
    if (err) console.error(err)
})