/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
@Controller('uploads')
export class UploadsController {

    @Get(':filename')
    serveFile(@Param('filename') filename: string, @Res() res: Response) {
        const filePath = path.join(__dirname, '../..', 'uploads', filename);
        return res.sendFile(filePath);
    }
}
