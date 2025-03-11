import 'dotenv/config'

export const config = {
	PORT: process.env.PORT,
	DB_URL: process.env.DB_URL,
	LOG_LEVEL: process.env.LOG_LEVEL || 'info',
	MESSAGE: process.env.MESSAGE,
	ZK_REGISTRY_CONTRACT_ADDRESS: process.env.ZK_REGISTRY_CONTRACT_ADDRESS,
	PUBLIC_RPC_URL: process.env.PUBLIC_RPC_URL,
}
