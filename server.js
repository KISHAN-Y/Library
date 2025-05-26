const express = require('express')
const app = express()
const port = 5959
const path = require('path')
const mongoose = require('mongoose')
const multer = require('multer')
const fs = require('fs')

app.use(express.static('Component_public'));

app.use(express.static(path.join(__dirname)));

app.use(express.json())

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, 'Component_public/images')
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: function(req, file, cb) {
    // Use original filename
    cb(null, file.originalname)
  }
})

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    // Accept only image files
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false)
    }
    cb(null, true)
  }
})

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


// MongoDB Connection
const MONGODB_URI = 'mongodb://localhost:27017/casestudy'

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully')
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err)
  })

// Book Schema and Model
const bookSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  description: { type: String },
  genre: { type: String },
  coverImage: { type: String },
  quantity: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
})

// User Schema and Model
const userSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
})

const Book = mongoose.model('Book', bookSchema)
const User = mongoose.model('User', userSchema)

// Initialize default users if they don't exist
async function initializeUsers() {
  try {
    const count = await User.countDocuments()
    if (count === 0) {
      const defaultUsers = [
        { id: 1, username: "Kishan", password: "Kishan@123", role: "user" },
        { id: 2, username: "Mansi", password: "Mansi@123", role: "user" },
        { id: 3, username: "Shraddha", password: "Shraddha@123", role: "user" },
        { id: 4, username: "admin", password: "admin", role: "admin" }
      ]
      await User.insertMany(defaultUsers)
      console.log('Default users created successfully')
    }
  } catch (error) {
    console.error('Error initializing users:', error)
  }
}

// Default books data
const defaultBooks = [
  {
    id: 1001,
    title: "The Time Has Come",
    author: "Jane Smith",
    description: "Lindbergh's Pharmacy is an Athens, Georgia, institution...",
    price: 27.89,
    originalPrice: 30.99,
    genre: "Fiction",
    coverImage: "images/The Time Has Come.jpeg",
  },
  {
    id: 1002,
    title: "I Want a Better Catastrophe",
    author: "John Doe",
    description: "With global warming projected to rocket past the...",
    price: 26.99,
    originalPrice: 29.99,
    genre: "Non-Fiction",
    coverImage: "images/I Want A Better Catastrophe .jpeg",
  },
  {
    id: 1003,
    title: "My Government Means to Kill Me",
    author: "Sarah Johnson",
    description: "A powerful coming-of-age story of a young, Black, gay man...",
    price: 24.5,
    originalPrice: 27.99,
    genre: "Biography",
    coverImage: "images/My Government Means to Kill Me .jpeg",
  },
  {
    id: 1004,
    title: "The Last Thing He Told Me",
    author: "Laura Dave",
    description: "A gripping mystery about a woman who thinks shes found the love of her life...",
    price: 22.99,
    originalPrice: 25.99,
    genre: "Mystery",
    coverImage: "images/The Last Thing He Told Me .jpeg",
  },
  {
    id: 1005,
    title: "Pride and Protest",
    author: "Nikki Payne",
    description: "A woman goes head-to-head with the CEO of...",
    price: 15.5,
    originalPrice: 18.5,
    genre: "Fiction",
    coverImage: "images/Pride and Protest .jpeg",
  },
  {
    id: 1006,
    title: "Forget a Mentor, Find a Sponsor",
    author: "Sylvia Ann Hewlett",
    description: "In this powerful yet practical book, economist and...",
    price: 29.99,
    originalPrice: 32.99,
    genre: "Non-Fiction",
    coverImage: "images/Forget a Mentor, Find a Sponsor.jpeg",
  },
  {
    id: 1007,
    title: "The Midnight Library",
    author: "Matt Haig",
    description: "A dazzling novel about all the choices that go into a life well lived...",
    price: 21.99,
    originalPrice: 24.99,
    genre: "Fiction",
    coverImage: "images/The Midnight Library.jpeg",
  },
  {
    id: 1008,
    title: "Project Hail Mary",
    author: "Andy Weir",
    description: "A lone astronaut must save the earth from disaster...",
    price: 28.99,
    originalPrice: 32.99,
    genre: "Sci-Fi",
    coverImage: "images/Project Hail Mary.jpeg",
  },
  {
    id: 1009,
    title: "The Invisible Life of Addie LaRue",
    author: "V.E. Schwab",
    description: "A life no one will remember. A story you will never forget...",
    price: 25.99,
    originalPrice: 28.99,
    genre: "Fiction",
    coverImage: "images/The Invisible Life of Addie LaRue .jpeg",
  },
  {
    id: 1010,
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    description: "From the Nobel Prize-winning author, a novel about artificial intelligence...",
    price: 26.95,
    originalPrice: 29.95,
    genre: "Sci-Fi",
    coverImage: "images/Klara and the Sun.jpeg",
  },
];

// Initialize default books if they don't exist
async function initializeBooks() {
  try {
    console.log('Checking for existing books in database...')
    const count = await Book.countDocuments()
    console.log(`Found ${count} existing books in database`)
    
    if (count === 0) {
      console.log('No books found, initializing with default books...')
      console.log(`Preparing to insert ${defaultBooks.length} default books`)
      
      // Make sure each book has proper fields initialized
      // Use the original IDs from the default books
      const booksToInsert = defaultBooks.map(book => ({
        ...book,
        quantity: 1
      }))
      
      const result = await Book.insertMany(booksToInsert)
      console.log(`Default books created successfully: ${result.length} books inserted`)
    } else {
      console.log('Books already exist in database, skipping initialization')
      
      // Check if any existing books are missing the id field
      const booksWithoutId = await Book.find({ id: { $exists: false } })
      if (booksWithoutId.length > 0) {
        console.log(`Found ${booksWithoutId.length} books without ID, fixing...`)
        
        // Get the highest existing ID
        const highestBook = await Book.findOne().sort('-id')
        let nextId = highestBook && highestBook.id ? highestBook.id + 1 : 1001
        
        // Update each book without an ID
        for (const book of booksWithoutId) {
          await Book.updateOne({ _id: book._id }, { $set: { id: nextId++ } })
        }
        
        console.log('Fixed books without IDs')
      }
    }
  } catch (error) {
    console.error('Error initializing books:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
  }
}

// Function to reset and reinitialize the books collection - commented out to preserve existing books
/* 
async function resetBooksCollection() {
  try {
    console.log('Completely resetting books collection...')
    
    // Delete all books from the collection
    await Book.deleteMany({})
    console.log('All books deleted successfully')
    
    // Reinitialize with default books
    console.log('Reinitializing with default books...')
    const booksToInsert = defaultBooks.map(book => ({
      ...book,
      quantity: 1
    }))
    
    const result = await Book.insertMany(booksToInsert)
    console.log(`Books reinitialized successfully: ${result.length} books inserted`)
    return true
  } catch (error) {
    console.error('Error resetting books collection:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
  }
}*/

// Function to reset and reinitialize the books collection
async function initializeDefaultBooks() {
  try {
    // Check if books collection is empty
    const count = await Book.countDocuments()
    
    if (count === 0) {
      console.log('Books collection is empty, initializing with default books...')
      
      // Prepare default books with quantity
      const booksToInsert = defaultBooks.map(book => ({
        ...book,
        quantity: 1
      }))
      
      // Insert default books
      const result = await Book.insertMany(booksToInsert)
      console.log(`Default books initialized successfully: ${result.length} books inserted`)
    } else {
      console.log(`Books collection already has ${count} books, skipping initialization`)
    }
    return true
  } catch (error) {
    console.error('Error initializing default books:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return false
  }
}

// Call the functions to initialize users and books
mongoose.connection.once('open', async () => {
  await initializeUsers()
  
  // Initialize books only if collection is empty
  await initializeBooks()
  
  // The following code resets all books - commented out to preserve existing books
  /*
  console.log('Ensuring books collection has correct data...')
  await resetBooksCollection()
  */
})

// Login API endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body
    
    // Find user by username and password
    const user = await User.findOne({ username, password })
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }
    
    // Return user info (excluding password)
    const userInfo = {
      id: user.id,
      username: user.username,
      role: user.role
    }
    
    res.json({ success: true, user: userInfo })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// Registration API endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body
    
    // Check if username already exists
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Username already exists' })
    }
    
    // Get the highest existing user ID and increment by 1
    const highestUser = await User.findOne().sort('-id')
    const newId = highestUser ? highestUser.id + 1 : 1
    
    // Create new user
    const newUser = new User({
      id: newId,
      username,
      password,
      role: 'user' // Default role for new registrations
    })
    
    await newUser.save()
    
    res.status(201).json({ success: true, message: 'User registered successfully' })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// File upload endpoint
app.post('/api/upload', upload.single('coverImage'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' })
    }
    
    // Return the file path that can be used in the book record
    const filePath = `images/${req.file.filename}`
    res.json({ success: true, filePath: filePath })
  } catch (error) {
    console.error('File upload error:', error)
    res.status(500).json({ success: false, message: 'Error uploading file' })
  }
})

// Book API endpoints
app.post('/api/books', async (req, res) => {
  try {
    const bookData = req.body
    
    // If no ID is provided, generate the next ID in sequence
    if (!bookData.id) {
      // Find the highest existing ID and increment by 1
      const highestBook = await Book.findOne().sort('-id')
      bookData.id = highestBook ? highestBook.id + 1 : 1001
      console.log(`Assigning new book ID: ${bookData.id}`)
    }
    
    const newBook = new Book(bookData)
    await newBook.save()
    res.status(201).json({ success: true, book: newBook })
  } catch (error) {
    console.error('Error creating book:', error)
    res.status(500).json({ success: false, message: 'Error creating book' })
  }
})

app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find()
    res.json({ success: true, books: books })
  } catch (error) {
    console.error('Error fetching books:', error)
    res.status(500).json({ success: false, message: 'Error fetching books' })
  }
})

app.get('/api/books/:id', async (req, res) => {
  try {
    const bookId = parseInt(req.params.id)
    const book = await Book.findOne({ id: bookId })
    
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' })
    }
    
    res.json({ success: true, book: book })
  } catch (error) {
    console.error('Error fetching book:', error)
    res.status(500).json({ success: false, message: 'Error fetching book' })
  }
})

app.delete('/api/books/:id', async (req, res) => {
  try {
    const bookId = parseInt(req.params.id)
    const result = await Book.deleteOne({ id: bookId })
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Book not found' })
    }
    
    res.json({ success: true, message: 'Book deleted successfully' })
  } catch (error) {
    console.error('Error deleting book:', error)
    res.status(500).json({ success: false, message: 'Error deleting book' })
  }
})

app.put('/api/books/:id', async (req, res) => {
  try {
    const bookId = parseInt(req.params.id)
    const bookData = req.body
    
    const result = await Book.updateOne({ id: bookId }, bookData)
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: 'Book not found' })
    }
    
    res.json({ success: true, message: 'Book updated successfully' })
  } catch (error) {
    console.error('Error updating book:', error)
    res.status(500).json({ success: false, message: 'Error updating book' })
  }
})

// Test endpoint to check books in database
app.get('/api/test/books', async (req, res) => {
  try {
    const books = await Book.find()
    console.log(`Found ${books.length} books in database`)
    res.json({
      success: true,
      count: books.length,
      books: books
    })
  } catch (error) {
    console.error('Error testing books:', error)
    res.status(500).json({ success: false, message: 'Error testing books' })
  }
})

// Start the server
app.listen(5959,()=>{
    console.log("Server is running on http://localhost:5959")
})
