import mongoose, { Document } from 'mongoose'

export interface IPost extends Document {
	author: `0x${string}`
	text: string
	picture?: string
	date: string
	signature: string
}

const Post = new mongoose.Schema<IPost>({
	author: { type: String, required: true },
	text: { type: String, required: true },
	date: { type: String, required: true },
	signature: { type: String, required: true },
	picture: { type: String },
})

export default mongoose.model('Post', Post)
