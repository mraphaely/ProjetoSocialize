import fs from "node:fs";

const lerDados = (callback) => {
    fs.readFile('usuarios.json', 'utf-8', (err, data)=>{
        if(err){
            callback(err);
        }try{
            const social = JSON.parse(data);
            callback(null, social);
        }catch(error){
            callback(error);
        }
    });
}

export default lerDados;