const http = require("http");
const host = "127.0.0.1";
const port = 8080;

const servidor = http.createServer((req, res)=>{
    res.statusCode = 200; //ok
    res.setHeader("Content-Type","text/plain");
    res.end("Hello World!")
});

function soma20A(x){ // função assincrona
    return new Promise((x, reject)=>{
        setTimeout(()=>{
            console.log(x + 20);
            return x + 20
        },3000)
    });
}
console.log(soma20A(10)
                .then((resultado)=>{
                    console.log(resultado)
                })
                .catch()

);
console.log("teste");

// servidor.listen(port,host,()=>{
//     console.log(`Servidor on-line na porta ${port} endereço ${host}`)
// });