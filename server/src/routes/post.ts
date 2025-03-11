import { RequestHandler, Router } from 'express'
import postController from '../controllers/postController'

const router = Router()

router.post('/posts', postController.create as RequestHandler)
router.put('/posts', postController.update as RequestHandler)
router.get('/posts', postController.getAll as RequestHandler)
router.get('/posts/:id', postController.getOne as RequestHandler)
router.delete('/posts/:id', postController.delete as RequestHandler)

export default router
