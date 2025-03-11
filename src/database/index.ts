import mongoose from 'mongoose'

let isConnected = false

export const connectDatabase = async () => {
	if (isConnected) {
		console.log('Database already connected')
		return
	}

	try {
		await mongoose.connect(process.env.DB_URL as string)
		isConnected = true
		console.log('Database connected successfully')
	} catch (error) {
		console.log('Failed to connect database', error)
	}
}
