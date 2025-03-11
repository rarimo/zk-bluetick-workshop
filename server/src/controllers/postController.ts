import { IPost } from '../schemas/post'
import { Request, Response } from 'express'
import postService from '../services/postService'
import { errorHandler } from '../utils/errorHandler'
import { verifyMessage } from 'ethers'
import { config } from '../config'
import zkRegistryService from '../services/zkRegistryService'
import { ZERO_HANDLE_HASH } from '../constants'

class PostController {
	async create(req: Request, res: Response) {
		try {
			const { signature, author, text }: IPost = req.body

			if (!text || text.trim() === '') {
				return res.status(400).json({
					errors: [
						{
							status: '400',
							title: 'Bad Request',
							detail: 'Text is required and cannot be empty.',
						},
					],
				})
			}

			if (!signature || signature.trim() === '') {
				return res.status(400).json({
					errors: [
						{
							status: '400',
							title: 'Bad Request',
							detail: 'Signed message is required and cannot be empty.',
						},
					],
				})
			}

			if (!config.MESSAGE) throw new Error('Message not set')

			const address = verifyMessage(config.MESSAGE, signature)

			if (address.toLowerCase() !== author.toLowerCase()) {
				return res.status(401).json({
					errors: [
						{
							status: '401',
							title: 'Unauthorized',
							detail:
								'Signature verification failed. Author does not match the signature.',
						},
					],
				})
			}

			const handleHash = await zkRegistryService.contract.userHandles(author)
			if (handleHash === ZERO_HANDLE_HASH) {
				return res.status(403).json({
					errors: [
						{
							status: '403',
							title: 'Forbidden',
							detail: 'User has not completed the zkPass verification.',
						},
					],
				})
			}

			const post = await postService.create(req.body, req?.files?.picture)
			res.json(post)
		} catch (error) {
			errorHandler(error, res)
		}
	}

	async getAll(req: Request, res: Response) {
		try {
			const posts: IPost[] = await postService.getAll()
			res.json(posts)
		} catch (error) {
			errorHandler(error, res)
		}
	}

	async getOne(req: Request, res: Response) {
		try {
			const post: IPost | null = await postService.getOne(req.params.id)
			if (!post) {
				return res.status(404).json({
					errors: [
						{
							status: '404',
							title: 'Not Found',
							detail: 'Post not found',
						},
					],
				})
			}
			res.json(post)
		} catch (error) {
			errorHandler(error, res)
		}
	}

	async update(req: Request, res: Response) {
		try {
			const updatedPost = await postService.update(req.body)
			if (!updatedPost) {
				return res.status(404).json({
					errors: [
						{
							status: '404',
							title: 'Not Found',
							detail: 'Post not found',
						},
					],
				})
			}
			res.json(updatedPost)
		} catch (error) {
			errorHandler(error, res)
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const post = await postService.delete(req.params.id)
			if (!post) {
				return res.status(404).json({
					errors: [
						{
							status: '404',
							title: 'Not Found',
							detail: 'Post not found',
						},
					],
				})
			}
			res.json(post)
		} catch (error) {
			errorHandler(error, res)
		}
	}
}

export default new PostController()
