import { UploadedFile } from 'express-fileupload'
import Post, { IPost } from '../schemas/post'
import fileService from './fileService'

class PostService {
	async create(post: IPost, picture?: UploadedFile | UploadedFile[]) {
		const fileName = fileService.saveFile(picture)
		const date = new Date().toISOString()
		const createdPost = await Post.create({ ...post, picture: fileName, date })
		return createdPost
	}

	async getAll() {
		const posts: IPost[] = await Post.find()
		return posts
	}

	async getOne(id: IPost['_id']) {
		if (!id) throw new Error('Id is missing')

		const post: IPost | null = await Post.findById(id)
		return post
	}

	async update(newPost: IPost) {
		if (!newPost._id) throw new Error('Id is missing')
		const updatedPost = await Post.findByIdAndUpdate(newPost._id, newPost, {
			new: true,
		})
		return updatedPost
	}

	async delete(id: IPost['_id']) {
		if (!id) throw new Error('Id is missing')
		const post = await Post.findByIdAndDelete(id)
		return post
	}
}

export default new PostService()
