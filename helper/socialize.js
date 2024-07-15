import fs from "node:fs";

const lerDados = (callback) => {
    fs.readFile('social.json', 'utf-8', (err, data)=>{
        if(err){
            callback(err);
        }
        try{
            callback(null, JSON.parse(data));
        }
        catch(error){
            callback(error);
        }
    });
}

export default lerDados;
