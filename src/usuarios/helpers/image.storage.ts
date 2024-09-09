import { diskStorage } from 'multer'
import { v4 as uuidv4 } from 'uuid'

import fs = require('fs')

import path = require('path')

import { Body, HttpStatus, Patch, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { UsuarioDto } from '../usuarios.dto'

const validMimeType = ['image/png' , 'image/jpg' , 'image/jpeg']

export const saveImagesToStorage = (destination) => {
    return {
        storage: diskStorage({
            destination: `./uploads/${destination}`,
            filename: (req, file, callback) => {
                const fileExtension: string = path.extname(file.originalname);
                const filename: string = uuidv4() + fileExtension;
                callback(null, filename)
            },
        }),
        fileFilter: (req, file, callback) => {
            const allowedMimeTypes = validMimeType;
            allowedMimeTypes.includes(file.mimetype)
            ? callback(null, true)
            : callback(null, false);
        },
    };
};

export const removeFile = (fullFilePath: string) => {
    try {
        fs.unlinkSync(fullFilePath);
    } catch (e) {
        console.error(new Date(), e);
    }
}


