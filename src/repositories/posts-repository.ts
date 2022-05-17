import {bloggers} from "./bloggers-repository";

const posts: Array<{ id: number, title: string, shortDescription: string,
    content: string, bloggerId: number, bloggerName: string }> = []

export const postsRepository = {
    getAllPosts() {
        return posts
    },
    getPostById(id: number) {
        let post = posts.find(p => p.id === id)
        if (post) {
            return post
        }
    },
    deletePost(id:number) {
        for (let i = 0; i < posts.length; i++) {
            if (posts[i].id === id) {
                posts.splice(i, 1);
                return true;
            }
        }
        return false
    },
    createPost(id:number, title: string, shortDescription: string, content: string, bloggerId: number) {
        let bloggerPostName = bloggers.find(b => b.id === bloggerId)?.name
        if (bloggerPostName) {
        const newPost = {
            id: +(new Date()),
            title: title,
            shortDescription: shortDescription,
            content: content,
            bloggerId: bloggerId,
            bloggerName: bloggerPostName
        }
        posts.push(newPost)
        return newPost
        }
    },
    updatePost(id:number, title: string, shortDescription: string, content: string, bloggerId: number) {
        let bloggerPostName = bloggers.find(b => b.id === bloggerId)?.name

        let post = posts.find(p => p.id === id)
        if (post && bloggerPostName) {
            post.title = title
            post.shortDescription = shortDescription
            post.content = content
            post.bloggerId = bloggerId
            post.bloggerName = bloggerPostName
            return true
        } else {
            return false
        }
    }
}