import express from 'express'
import bodyParser from "body-parser";
import {bloggersRouter} from "./routs/bloggers-router";
import {postsRouter} from "./routs/posts-router";


export const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser())
app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})