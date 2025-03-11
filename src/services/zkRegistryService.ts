import { ethers } from 'ethers'
import { config } from '../config'
import { ZKRegistry, ZKRegistry__factory } from '../types/contracts'

class ZKRegistryService {
	static instance: ZKRegistryService
	provider: ethers.JsonRpcProvider
	contract: ZKRegistry

	private constructor() {
		this.provider = new ethers.JsonRpcProvider(config.PUBLIC_RPC_URL)
		this.contract = ZKRegistry__factory.connect(
			config.ZK_REGISTRY_CONTRACT_ADDRESS ?? '',
			this.provider
		) as ZKRegistry
	}

	static getInstance(): ZKRegistryService {
		if (!ZKRegistryService.instance) {
			ZKRegistryService.instance = new ZKRegistryService()
		}
		return ZKRegistryService.instance
	}
}

export default ZKRegistryService.getInstance()
