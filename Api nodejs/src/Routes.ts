import { Router } from "express";
import { controllerpost } from "./controller/controller post";
import {upload} from "./config/multer"


const routes = Router()

routes.post('/controller post',upload.single('file'), new controllerpost().create)
routes.get('/controller post', new controllerpost().list)
routes.patch('/controller post', new controllerpost().update)
export default routes