import 'dotenv/config'

export const config = {
	PORT: process.env.PORT,
	DB_URL: process.env.DB_URL,
	LOG_LEVEL: process.env.LOG_LEVEL || 'info',
	MESSAGE: process.env.MESSAGE,
}
