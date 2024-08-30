import { AppDataSource } from "../data-source";
import { Image } from "../entities/image";

export const repository = AppDataSource.getRepository(Image)