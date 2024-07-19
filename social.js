import { createServer, Server } from "node:http";
import fs from "node:fs";
import { v4 as uuidv4 } from "uuid";
import { URLSearchParams } from "node:url";
import formidable, { errors as formidableErrors } from 'formidable';
import lerDados from "./helper/socialize.js";

const PORT = 3333;

//link:https://obsidian-canopy-a33.notion.site/Atividade-04-5e0ecd8c0c48489e9c36cd56dbaaffb5
const server = createServer((request, response) => {
    const { url, method } = request;
    if (method === "POST" && url === "/usuarios") {//route:01
        //nome, email, senha.
        let body = '';
        request.on('data', (chunk) => {
            body += chunk;
        });
        request.on('end', () => {
            const novoUsuario = JSON.parse(body)
            lerDados((err, usuario) => {
                if (err) {
                    response.writeHead(500, { "Content-Type": "application/json" });
                    response.end(JSON.stringify({ message: "Erro ao ler dados" }));
                    return
                }
                if (novoUsuario.Email === usuario.Email) {
                    response.writeHead(401, { "Content-Type": "application/json" });
                    response.end(JSON.stringify({ message: "Esse email está cadastrado." }));
                    return
                }

                novoUsuario.id = usuario.length + 1
                // novoUsuario.id = uuidv4();
                usuario.push(novoUsuario)
                fs.writeFile("usuarios.json", JSON.stringify(usuario, null, 2), (err) => {
                    if (err) {
                        response.writeHead(500, { "Content-Type": "application/json" });
                        response.end(JSON.stringify({ message: "Erro interno" }));
                        return
                    }
                    response.writeHead(201, { "Content-Type": "application/json" })
                    response.end(JSON.stringify({ novoUsuario }));
                })
            })
        })
    } else if (method === "POST" && url === "/perfil") {//route:02
        const form = formidable({});

    } else if (method === "POST" && url === "/login") {//route:03
        //email, senha.
        let body = '';
        request.on('data', (chunk) => {
            body += chunk;
        });
        request.on('end', () => {
            const usuario = JSON.parse(body)
            lerDados((err, social) => {
                if (err) {
                    response.writeHead(500, { "Content-Type": "application/json" });
                    response.end(JSON.stringify({ message: "Erro ao ler dados" }));
                    return
                }
                if (usuario.Email === usuario.Email && usuario.Senha === usuario.Senha) {
                    response.writeHead(200, { "Content-Type": "application/json" });
                    response.end(JSON.stringify({ usuario }));
                    return
                }

                social.push(usuario)
                fs.writeFile("usuarios.json", JSON.stringify(social, null, 2), (err) => {
                    if (err) {
                        response.writeHead(500, { "Content-Type": "application/json" });
                        response.end(JSON.stringify({ message: "Erro interno" }));
                        return
                    }
                    response.writeHead(200, { "Content-Type": "application/json" })
                    response.end(JSON.stringify({ usuario }));
                })
            })
        })
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
        const id = parseInt(url.split('/')[2]);
        let body = ''
        request.on("data", (chunk) => {
            body += chunk;
        })
        request.on('end', () => {
            const usuarioAtual = JSON.parse(body)

            const indexUsuario = usuarios.findIndex((usuario) => usuario.id === id);

            if (indexUsuario === -1) {
                response.writeHead(404, { 'Content-Type': 'application/json' })
                response.end(JSON.stringify({ message: "Perfil selecionado não existe." }));
                return;
            }

            usuarios[indexUsuario] = { ...usuarios[indexUsuario], ...usuarioAtual };

            response.writeHead(200, { 'Content-Type': 'application/json' })
            response.end(JSON.stringify(usuarioAtual));
        });
    } else if (method === "POST" && url.startsWith("/perfil/imagem")) {//route:06

    } else if (method === "GET" && url.startsWith("/perfil/")) {//route:04"/perfil/{id_usuario}"
        const urlParams = new URLSearchParams(url.split("?")[1]);
        const perfil = urlParams.get("perfil");
    
        lerDadosReceita((err, usuario) => {
          if (err) {
            response.writeHead(500, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ message: "Erro ao ler dados." }));
            return
          }
    
          const resultado = usuarios.filter((usuario) => perfil.usuario.some((perfil) => perfil.includes("usuario")));
    
          if (resultadoFiltrado.length === 0) {
            response.writeHead(404, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ message: "Nada foi encontrado"}));
            return
          }
          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(JSON.stringify(resultado))
        })
    } else {
        response.writeHead(404, { "Content-Type": "application/json" });
        response.end("Rota não encontrada");
    }
});

server.listen(PORT, () => {
    console.log("Server is running on port http://localhost:" + PORT);
});