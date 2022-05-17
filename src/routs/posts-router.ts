import {Request, Response, Router} from "express";
import {bloggers} from "../repositories/bloggers-repository";
import {postsRepository} from "../repositories/posts-repository";
import {authMiddleware} from "../middlewares/auth-middleware";

export const postsRouter = Router({})



//Получить все посты
postsRouter.get('/', (req: Request, res: Response) => {
    const allPosts = postsRepository.getAllPosts()
    res.status(200).send(allPosts)
})

//Получить один пост
postsRouter.get('/:id', (req: Request, res: Response) => {
    const post = postsRepository.getPostById(+req.params.id)
    if (post) {
        res.status(200).send(post)
    } else {
        res.send(404)
    }
})

//Удалить пост
postsRouter.delete('/:id', authMiddleware, (req: Request, res: Response) => {
    const isDeleted = postsRepository.deletePost(+req.params.id)
    if (isDeleted) {
        res.send(204)
    } else {
        res.send(404)
    }
})

//Добавить пост
postsRouter.post('/', authMiddleware, (req: Request, res: Response) => {
    const errors = [];
    const postVal = {...req.body};
    const arrayPosts = Object.keys(postVal).filter(el => el === 'title' || el === 'shortDescription'
        || el === 'content' || el === 'bloggerId' )

    if (!arrayPosts.includes('title')) {
        errors.push({message: 'field is required', field: 'title'})
    }

    if (!arrayPosts.includes('shortDescription')) {
        errors.push({message: 'field is required', field: 'shortDescription'})
    }

    if (!arrayPosts.includes('content')) {
        errors.push({message: 'field is required', field: 'content'})
    }

    if (!arrayPosts.includes('bloggerId')) {
        errors.push({message: 'field is required', field: 'bloggerId'})
    }

    if (req.body.title.trim() === "" || req.body.title.length >= 30) {
        errors.push({message: 'invalid title', field: 'title'})
    }
    if (req.body.shortDescription?.trim() === "" || req.body.shortDescription?.length >= 100) {
        errors.push({message: 'invalid shortDescription', field: 'shortDescription'})
    }
    if (req.body.content.trim() === "" || req.body.content.length >= 1000) {
        errors.push({message: 'invalid content', field: 'content'})
    }

    if (bloggers.find(b => b.id === req.body.bloggerId)) {
    } else {
        errors.push({message: 'invalid bloggerId', field: 'bloggerId'})
    }


    if (errors.length) {
        return res.status(400).send((
            {
                errorsMessages: [
                    ...errors
                ],
                resultCode: 1
            }
        ))
    }

    const newPost = postsRepository.createPost(+req.params.id, req.body.title, req.body.shortDescription, req.body.content, +req.body.bloggerId)
    res.status(201).send(newPost)

})

//Обновить пост
postsRouter.put('/:id', authMiddleware, (req: Request, res: Response) => {
    const errors = [];
    const postVal = {...req.body};
    const arrayPosts = Object.keys(postVal).filter(el => el === 'title' || el === 'shortDescription'
        || el === 'content' || el === 'bloggerId' )

    if (!arrayPosts.includes('title')) {
        errors.push({message: 'field is required', field: 'title'})
    }

    if (!arrayPosts.includes('shortDescription')) {
        errors.push({message: 'field is required', field: 'shortDescription'})
    }

    if (!arrayPosts.includes('content')) {
        errors.push({message: 'field is required', field: 'content'})
    }

    if (!arrayPosts.includes('bloggerId')) {
        errors.push({message: 'field is required', field: 'bloggerId'})
    }

    if (req.body.title && (req.body.title.trim() === "" || req.body.title.length >= 30)) {
        errors.push({message: 'invalid title', field: 'title'})
    }
    if (req.body.shortDescription?.trim() === "" || req.body.shortDescription?.length >= 100) {
        errors.push({message: 'invalid shortDescription', field: 'shortDescription'})
    }
    if (req.body.content.trim() === "" || req.body.content.length >= 1000) {
        errors.push({message: 'invalid content', field: 'content'})
    }

    if (bloggers.find(b => b.id === req.body.bloggerId)) {
    } else {
        errors.push({message: 'invalid bloggerId', field: 'bloggerId'})
    }


    if (errors.length) {
        return res.status(400).send((
            {
                errorsMessages: [
                    ...errors
                ],
                resultCode: 1
            }
        ))
    }

    const isUpdated = postsRepository.updatePost(+req.params.id, req.body.title, req.body.shortDescription, req.body.content, +req.body.bloggerId)
    if (isUpdated) {
        const post = postsRepository.getPostById(+req.params.id)
        res.status(204).send(post)
    } else {
        res.send(404)
    }

})