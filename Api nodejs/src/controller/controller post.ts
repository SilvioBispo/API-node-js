import { Request, response, Response } from "express";
import { repository } from "../repositories/repository";
import { GoogleGenerativeAI} from "@google/generative-ai";
import 'dotenv/config'
import {promises as fs, PathLike} from 'fs';

const apiKey = process.env.GEMINI_API_KEY as string

const genIA = new GoogleGenerativeAI(apiKey);

export class controllerpost {

    async create(req: Request,res: Response){


        const url = req.body
        const {cmcode,dt} = req.body

        if (!url){

            return res.status(400).json({message:'Os dados fornecidos no corpo da requisição são inválidos'})
        }

        else if(await repository.findBy(url) ){

            return res.status(409).json({message:'Já existe uma leitura para este tipo no mês atual'})

        }

        else {
        const model = genIA.getGenerativeModel({model: "gemini-pro-vision"});

            const imgdata = await fs.readFile(url);
            const img64 = imgdata.toString('base64')

            
            const result = await model.generateContent([{

                fileData:{
                    mimeType: "image/jpg",
                    fileUri: img64
                }
             },
             {text:"measure type water or gas"}
         ])
            const tp = result.response.text()
           
            const crypto = require('crypto');
            const uuid = crypto.randomUUID();


         const newImage = repository.create({url,uuid,dt,tp,cmcode})

         await repository.save(newImage)
    

         return res.status(200).json(newImage)
        }  


    }

    async list(req: Request,res: Response){

        const {url,cmcode,tp} = req.body

        if(!tp || tp != 'WATER' || tp != 'GAS'){

            return res.status(400).json({message:'Parâmetro measure type diferente de WATER ou GAS'})
        }

        const read = await repository.findBy({tp,url,cmcode})

        if(read == null){

            return res.status(404).json({message:'Nenhum registro encontrado'})
        }

        return res.status(200).send(read)


    }

    async update(req:Request,res:Response){
        
        const {uuid,tp} = req.body

        if (!uuid){

            res.status(400).json({message:'Os dados fornecidos no corpo da requisição são inválidos'})
        }

        else if(await !repository.findBy(uuid)){

            return res.status(404).json({message:'Leitura não encontrada'})

        }

        else if(await !repository.findBy(uuid)){

            return res.status(409).json({message:'Leitura já confirmada'})
        }

        else {
        const upImage = repository.create({uuid,tp})

        await repository.save(upImage)

        return res.status(200).json({message:'success: true'})
        }
    }
}