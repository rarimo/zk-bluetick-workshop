import { UploadedFile } from 'express-fileupload'
import * as uuid from 'uuid'
import path from 'path'

class FileService {
	saveFile(file?: UploadedFile | UploadedFile[]) {
		try {
			if (file) {
				const fileName = uuid.v4() + '.jpg'
				const filePath = path.resolve('static', fileName)
				Array.isArray(file) ? file[0].mv(filePath) : file.mv(filePath)
				return fileName
			}
		} catch (error) {
			console.log(error)
		}
	}
}

export default new FileService()
