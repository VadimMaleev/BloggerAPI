import express, {Request, Response} from 'express'
import bodyParser from "body-parser";

const app = express()
const port = process.env.PORT || 3000

const bloggers: Array<{ id: number, name: string, youtubeUrl: string}> = [/*{id: 1, name: 'Pasha', youtubeUrl: 'https://youtube.com/pasha-first'},
    {id: 2, name: 'Sasha', youtubeUrl: 'https://youtube.com/sasha-second'},
    {id: 3, name: 'Dasha', youtubeUrl: 'https://youtube.com/dasha-third'},
    {id: 4, name: 'Masha', youtubeUrl: 'https://youtube.com/masha-fourth'},
    {id: 5, name: 'Kolya', youtubeUrl: 'https://youtube.com/kolya-fifth'}*/]

const posts: Array<{ id: number, title: string, shortDescription: string,
 content: string, bloggerId: number, bloggerName: string }> =
    [/*{
        id: 1,
        title: 'post1',
        shortDescription: 'Обо мне',
        content: 'Привет я блоггер.',
        bloggerId: 1,
        bloggerName: 'Pasha'
    },
        {
            id: 2,
            title: 'post2',
            shortDescription: 'О тебе',
            content: 'Привет ты Юзер.',
            bloggerId: 2,
            bloggerName: 'Sasha'
        },
        {
            id: 3,
            title: 'post3',
            shortDescription: 'О собаке',
            content: 'Привет моя собака.',
            bloggerId: 3,
            bloggerName: 'Dasha'
        },
        {
            id: 4,
            title: 'post4',
            shortDescription: 'О кошке',
            content: 'Привет моя кошка',
            bloggerId: 4,
            bloggerName: 'Masha'
        },
        {
            id: 5,
            title: 'post5',
            shortDescription: 'О работе',
            content: 'Привет моя работа.',
            bloggerId: 5,
            bloggerName: 'Kolya'
        },
   */ ]

app.use(bodyParser())

//Получить всех блоггеров
app.get('/bloggers', (req: Request, res: Response) => {
    res.status(200).send(bloggers)
})

//Получить одного блоггера
app.get('/bloggers/:id', (req: Request, res: Response) => {
    let blogger = bloggers.find(b => b.id === +req.params.id)
    if (blogger) {
        res.status(200).send(blogger)
    } else {
        res.send(404)
    }
})

//Удалить блоггера
app.delete('/bloggers/:id', (req: Request, res: Response) => {
    for (let i = 0; i < bloggers.length; i++) {
        if (bloggers[i].id === +req.params.id) {
            bloggers.splice(i, 1);
            res.send(204)
            return;
        }
    }
    res.send(404)
})

//Добавить Блоггера
app.post('/bloggers', (req: Request, res: Response) => {

    const errors = [];
    const regex = new RegExp(/^https:\/\/([a-zA-Z\d_-]+\.)+[a-zA-Z\d_-]+(\/[a-zA-Z\d_-]+)*\/?$/)
   const blogger = {...req.body};
   const ArrayBlogger = Object.keys(blogger).filter(el => el === 'name' || el === 'youtubeUrl')

       if (!regex.test(blogger.youtubeUrl)) {
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
        res.status(400).send((
            {
                errorsMessages: [
                    ...errors
                ],
                resultCode: 1
            }
            ))
    }



    const newBlogger = {
        id: +(new Date()),
        name: req.body.name,
        youtubeUrl: req.body.youtubeUrl
    }
    bloggers.push(newBlogger)
    res.status(201).send(newBlogger)
})

//Обновить блоггера
app.put('/bloggers/:id', (req: Request, res: Response) => {
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

    if (req.body.name && (req.body.name.trim() === "" || req.body.name.length >= 15)) {
        errors.push({message: 'invalid name', field: 'name'})
    }
    if (req.body.youtubeUrl && (req.body.youtubeUrl?.trim() === "" || req.body.youtubeUrl?.length >= 100)) {
        errors.push({message: 'invalid Url', field: 'youtubeUrl'})
    }

    if (errors.length) {
        res.status(400).send((
            {
                errorsMessages: [
                    ...errors
                ],
                resultCode: 1
            }
        ))
    }

    let blogger = bloggers.find(p => p.id === +req.params.id)
    if (blogger) {
        blogger.name = req.body.name
        blogger.youtubeUrl = req.body.youtubeUrl
        res.status(204).send(blogger)
    } else {
        res.send(404)
    }
})


//Получить все посты
app.get('/posts', (req: Request, res: Response) => {
    res.status(200).send(posts)
})

//Получить один пост
app.get('/posts/:id', (req: Request, res: Response) => {
    let post = posts.find(p => p.id === +req.params.id)
    if (post) {
        res.status(200).send(post)
    } else {
        res.send(404)
    }
})

//Удалить пост
app.delete('/posts/:id', (req: Request, res: Response) => {
    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id === +req.params.id) {
            posts.splice(i, 1);
            res.send(204)
            return;
        }
    }
    res.send(404)
})

//Добавить пост
app.post('/posts', (req: Request, res: Response) => {
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
    if (req.body.shortDescription && (req.body.shortDescription?.trim() === "" || req.body.shortDescription?.length >= 100)) {
        errors.push({message: 'invalid shortDescription', field: 'shortDescription'})
    }
    if (req.body.content && (req.body.content.trim() === "" || req.body.content.length >= 1000)) {
        errors.push({message: 'invalid content', field: 'content'})
    }

    if (bloggers.find(b => b.id === req.body.bloggerId)) {
    } else {
        errors.push({message: 'invalid bloggerId', field: 'bloggerId'})
    }


    if (errors.length) {
        res.status(400).send((
            {
                errorsMessages: [
                    ...errors
                ],
                resultCode: 1
            }
        ))
    }



    let bloggerPostName = bloggers.find(b => b.id === +req.body.bloggerId)?.name
    if (bloggerPostName) {
        const newPost = {
            id: +(new Date()),
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            bloggerId: +req.body.bloggerId,
            bloggerName: bloggerPostName
        }
        posts.push(newPost)
        res.status(201).send(newPost)
    } else {
        res.status(400).send({errorsMessages: [{message: 'string', field: "title"}], resultCode: 1})
    }
})

//Обновить пост
app.put('/posts/:id', (req: Request, res: Response) => {
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
    if (req.body.shortDescription && (req.body.shortDescription?.trim() === "" || req.body.shortDescription?.length >= 100)) {
        errors.push({message: 'invalid shortDescription', field: 'shortDescription'})
    }
    if (req.body.content && (req.body.content.trim() === "" || req.body.content.length >= 1000)) {
        errors.push({message: 'invalid content', field: 'content'})
    }

    if (bloggers.find(b => b.id === req.body.bloggerId)) {
    } else {
        errors.push({message: 'invalid bloggerId', field: 'bloggerId'})
    }


    if (errors.length) {
        res.status(400).send((
            {
                errorsMessages: [
                    ...errors
                ],
                resultCode: 1
            }
        ))
    }

    let bloggerPostName = bloggers.find(b => b.id === +req.body.bloggerId)?.name

    let post = posts.find(p => p.id === +req.params.id)
    if (post && bloggerPostName) {
        post.title = req.body.title
        post.shortDescription = req.body.shortDescription
        post.content = req.body.content
        post.bloggerId = +req.body.bloggerId
        post.bloggerName = bloggerPostName
        res.status(204).send(post)
    } else {
        res.send(404)
    }

})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})