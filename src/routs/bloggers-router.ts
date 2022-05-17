import {Request, Response, Router} from "express";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {authMiddleware} from "../middlewares/auth-middleware";

export const bloggersRouter = Router({})


//Получить всех блоггеров
bloggersRouter.get('/', (req: Request, res: Response) => {
    const allBloggers = bloggersRepository.getAllBloggers()
    res.status(200).send(allBloggers)
})

//Получить одного блоггера
bloggersRouter.get('/:id', (req: Request, res: Response) => {
    let blogger = bloggersRepository.getBloggerById(+req.params.id)
    if (blogger) {
        res.status(200).send(blogger)
    } else {
        res.send(404)
    }
})

//Удалить блоггера
bloggersRouter.delete('/:id', authMiddleware, (req: Request, res: Response) => {
    const isDeleted = bloggersRepository.deleteBlogger(+req.params.id)
    if (isDeleted) {
        res.send(204)
    } else {
        res.send(404)
    }
})

//Добавить Блоггера
bloggersRouter.post('/', authMiddleware, (req: Request, res: Response) => {

    const errors = [];
    const regex = new RegExp(/^https:\/\/([a-zA-Z\d_-]+\.)+[a-zA-Z\d_-]+(\/[a-zA-Z\d_-]+)*\/?$/)
    const blogger = {...req.body};
    const ArrayBlogger = Object.keys(blogger).filter(el => el === 'name' || el === 'youtubeUrl')

    if (blogger.youtubeUrl && !regex.test(blogger.youtubeUrl)) {
        errors.push({ message: 'Invalid URL', field: "youtubeUrl" })
    }

    if (ArrayBlogger.length < 2) {
        if (ArrayBlogger[0] === 'youtubeUrl') {
            errors.push({message: 'field name is required', field: 'name'})
        } else {
            errors.push({message: 'field is required', field: 'youtubeUrl'})
        }
    }

    if (req.body.name && (req.body.name.trim() === "" || req.body.name.length >= 15)) {
        errors.push({message: 'invalid name', field: 'name'})
    }

    if (req.body.youtubeUrl && (req.body.youtubeUrl?.trim() === "" || req.body.youtubeUrl?.length >= 100)) {
        errors.push({message: 'invalid Url', field: 'youtubeUrl'})
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

    const newBlogger = bloggersRepository.createBlogger(req.body.name, req.body.youtubeUrl)
    res.status(201).send(newBlogger)
})

//Обновить блоггера
bloggersRouter.put('/:id', authMiddleware, (req: Request, res: Response) => {
    const errors = [];
    const regex = new RegExp(/^https:\/\/([a-zA-Z\d_-]+\.)+[a-zA-Z\d_-]+(\/[a-zA-Z\d_-]+)*\/?$/)
    const bloggerVal = {...req.body};
    const ArrayBlogger = Object.keys(bloggerVal).filter(el => el === 'name' || el === 'youtubeUrl')

    if (!regex.test(bloggerVal.youtubeUrl)) {
        errors.push({ message: 'Invalid URL', field: "youtubeUrl" })
    }

    if (ArrayBlogger.length < 2) {
        if (ArrayBlogger[0] === 'youtubeUrl') {
            errors.push({message: 'field name is required', field: 'name'})
        } else {
            errors.push({message: 'field is required', field: 'youtubeUrl'})
        }
    }

    if (req.body.name.trim() === "" || req.body.name.length >= 15) {
        errors.push({message: 'invalid name', field: 'name'})
    }
    if (req.body.youtubeUrl?.trim() === "" || req.body.youtubeUrl?.length >= 100) {
        errors.push({message: 'invalid Url', field: 'youtubeUrl'})
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

    const isUpdated = bloggersRepository.updateBlogger(+req.params.id, req.body.name, req.body.youtubeUrl)
    if (isUpdated) {
        const blogger = bloggersRepository.getBloggerById(+req.params.id)
        res.status(204).send(blogger)
    } else {
        res.send(404)
    }
})