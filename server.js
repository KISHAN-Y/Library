const express = require('express')
const app = express()
const port = 5959
const path = require('path')

app.use(express.static('Component_public'));
app.use(express.static(path.join(__dirname)));

app.use(express.json())

app.get('/',(req,res) => {
    res.sendFile(__dirname + '/Component_public/html/INDEX.HTML')
})

app.get('/login',(req,res) => {
    res.sendFile(__dirname + '/Component_public/html/login.html')
})

app.get('/signin',(req,res) => {
    res.sendFile(__dirname + '/Component_public/html/signin.html')
})

app.get('/cartDetails',(req,res) => {
    res.sendFile(__dirname + '/Component_public/html/cartDetails.html')
})

app.get('/checkout',(req,res) => {
    res.sendFile(__dirname + '/Component_public/html/checkout.html')
})

app.get('/viewallbooks',(req,res) => {
    res.sendFile(__dirname + '/Component_public/html/viewallbooks.html')
})

app.get('/admin',(req,res) => {
    res.sendFile(__dirname + '/Component_public/html/admin/adminView.html')
})

app.get('/add',(req,res) => {
    res.sendFile(__dirname + '/Component_public/html/admin/addBooks.html')
})

app.get('/edit',(req,res) => {
    res.sendFile(__dirname + '/Component_public/html/admin/editBooks.html')
})

app.get('/view',(req,res) => {
    res.sendFile(__dirname + '/Component_public/html/admin/viewBook.html')
})


app.listen(5959,()=>{
    console.log("Server is running on http://localhost:5959")
})
