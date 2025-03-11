import mongoose from 'mongoose'
import { logger } from '../utils/logger'

let isConnected = false

export const connectDatabase = async () => {
	if (isConnected) {
		logger.info('Database already connected')
		return
	}

	try {
		await mongoose.connect(process.env.DB_URL as string)
		isConnected = true
		logger.info('Database connected successfully')
	} catch (error) {
		logger.error('Failed to connect database', error)
	}
}
