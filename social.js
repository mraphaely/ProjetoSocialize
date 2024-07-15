import { createServer, Server } from "node:http";
import fs from "node:fs";
import { v4 as uuidv4 } from "uuid";
import { URLSearchParams } from "node:url";
import lerDados from "./helper/socialize";

const social = [];
const PORT = 3333;

//link:https://obsidian-canopy-a33.notion.site/Atividade-04-5e0ecd8c0c48489e9c36cd56dbaaffb5
const server = createServer((request, response) => {
    const { url, method } = request;
    if (method === "POST" && url === "/usuarios") {//route:01
        //nome, email, ingredientes e modo de preparo.
        let body = '';
        request.on('data', (chunk) => {
            body += chunk;
        });
        request.on('end', () => {
            const novoUsuario = JSON.parse(body)
            lerDadosReceita((err, social) => {
                if (err) {
                    response.writeHead(500, { "Content-Type": "application/json" });
                    response.end(JSON.stringify({ message: "Erro ao ler dados" }));
                    return
                }
            })
            // novoUsuario.id = social.length + 1
            novoUsuario.id = uuidv4();
            social.push(novoUsuario)
            fs.writeFile("social.json", JSON.stringify(social, null, 2), (err) => {
                if (err) {
                    response.writeHead(500, { "Content-Type": "application/json" });
                    response.end(JSON.stringify({ message: "Erro ao ler dados" }));
                    return
                }
                if (novoUsuario.Email === social.Email){
                    response.writeHead(401, { "Content-Type": "application/json" });
                    response.end(JSON.stringify({ message: "Esse email está cadastrado." }));
                    return
                }
                response.writeHead(201, { "Content-Type": "application/json" })
                response.end(JSON.stringify({ novoUsuario }));
            })

        })
    } else if (method === "POST" && url === "/perfil") {//route:02

    } else if (method === "POST" && url === "/login") {//route:03

    } else if (method === "GET" && url === "/usuarios") {//route:07
        lerDados((err, social) => {
            if (err) {
              response.writeHead(500, { "Content-Type": "application/json" });
              response.end(JSON.stringify({ message: "Erro ao ler dados" }));
              return
            }
            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(JSON.stringify(social));
          })
    } else if (method === "PUT" && url === "/perfil") {//route:05

    } else if (method === "POST" && url.startsWith("/perfil/imagem")) {//route:06

    } else if (method === "GET" && url.startsWith("/perfil/{id_usuario}")) {//route:04

    } else {
        response.writeHead(404, { "Content-Type": "application/json" });
        response.end("Rota não encontrada");
    }
});

server.listen(PORT, () => {
    console.log("Server is running on port http://localhost:" + PORT);
});