const Blog = require("../models/Blog")

const readBlog = async (req, res) => {
    try {
        const result= await Blog.find()
        res.json({ message: "fetch success",result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong" })
    }
}

const createBlog = async (req, res) => {
    try {
        console.log(req.body)
       await Blog.create(req.body)
        res.json({ message: "blog create success" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong" })
    }
}

const updateBlog = async (req, res) => {
    try {
        const {id}=req.params
        await Blog.findByIdAndUpdate(id,req.body)
        res.json({ message: "blog update success" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong" })
    }
}

const deleteBlog = async (req, res) => {
    try {
        const{id}=req.params
        console.log(id)
        await Blog.findByIdAndDelete(id)
        res.json({ message: "blog delete success" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong" })
    }
}

module.exports = {
    readBlog,
    createBlog,
    updateBlog,
    deleteBlog
}