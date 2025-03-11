import { IPost } from '../schemas/post'
import { Request, Response } from 'express'
import postService from '../services/postService'
import { errorHandler } from '../utils/errorHandler'

class PostController {
	async create(req: Request, res: Response) {
		try {
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
