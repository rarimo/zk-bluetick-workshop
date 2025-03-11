import express from 'express'
import { connectDatabase } from './database'
import filedUpload from 'express-fileupload'
import postRouter from './routes/post'
import { logger } from './utils/logger'
import { config } from './config'

const app = express()

app.use(express.json())
app.use(express.static('static'))
app.use(
	filedUpload({
		createParentPath: true,
		limits: { fileSize: 10 * 1024 * 1024 },
	})
)
app.use('/api', postRouter)

async function bootstrap() {
	try {
		await connectDatabase()
		app.listen(config.PORT, () => {
			logger.info(`Server started at ${config.PORT}`)
		})
	} catch (error) {
		logger.error(`Server started at ${config.PORT}`)
		process.exit(1)
	}
}

bootstrap()
