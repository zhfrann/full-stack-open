const dummy = (blogs) => {
    const blogLists = [...blogs]

    if (blogLists.length === 0) {
        return 1
    }

    return blogLists
}

const totalLikes = (blogs) => {
    const blogLists = [...blogs]
    let totalLikes = 0

    blogLists.map(blog => {
        totalLikes += blog.likes
    })

    return totalLikes
}

const favoriteBlog = (blogs) => {
    const blogLists = [...blogs]

    let likes = []
    blogLists.map(blog => {
        likes.push(blog.likes)
    })
    const maxLike = Math.max(...likes)

    const favoriteBlog = blogLists.find(blog => blog.likes === maxLike)

    return {
        title: favoriteBlog.title,
        author: favoriteBlog.author,
        likes: favoriteBlog.likes
    }
}

const mostBlogs = (blogs) => {
    const blogLists = [...blogs]

    const authorBlogsCount = {}

    blogLists.map((blog) => {
        if (authorBlogsCount[blog.author]) {
            authorBlogsCount[blog.author]++
        } else {
            authorBlogsCount[blog.author] = 1
        }
    })

    let mostBlogAuthor = ''
    let maxBlogs = 0

    for (let author in authorBlogsCount) {
        if (authorBlogsCount[author] > maxBlogs) {
            maxBlogs = authorBlogsCount[author]
            mostBlogAuthor = author
        }
    }

    return {
        author: mostBlogAuthor,
        blogs: maxBlogs
    }
}

const mostLikes = (blogs) => {
    const blogLists = [...blogs]

    const authorLikes = {}

    blogLists.map(blog => {
        if (authorLikes[blog.author]) {
            authorLikes[blog.author] += blog.likes
        } else {
            authorLikes[blog.author] = blog.likes
        }
    })

    let authorMostLikes = ''
    let likes = 0

    for (let author in authorLikes) {
        if (authorLikes[author] > likes) {
            authorMostLikes = author
            likes = authorLikes[author]
        }
    }

    return {
        author: authorMostLikes,
        likes: likes
    }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }