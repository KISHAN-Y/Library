var app = angular.module("bookstoreApp", []);

// File upload directive
app.directive('fileModel', ['$parse', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;
      
      element.bind('change', function() {
        scope.$apply(function() {
          modelSetter(scope, element[0].files[0]);
          
          // Create image preview
          if (element[0].files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
              scope.$apply(function() {
                scope.imagePreview = e.target.result;
              });
            };
            reader.readAsDataURL(element[0].files[0]);
          }
        });
      });
    }
  };
}]);

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
    description:
      "A powerful coming-of-age story of a young, Black, gay man...",
    price: 24.5,
    originalPrice: 27.99,
    genre: "Biography",
    coverImage: "images/My Government Means to Kill Me .jpeg",
  },
  {
    id: 1004,
    title: "The Last Thing He Told Me",
    author: "Laura Dave",
    description:
      "A gripping mystery about a woman who thinks shes found the love of her life...",
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
    description:
      "A dazzling novel about all the choices that go into a life well lived...",
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
    description:
      "A life no one will remember. A story you will never forget...",
    price: 25.99,
    originalPrice: 28.99,
    genre: "Fiction",
    coverImage: "images/The Invisible Life of Addie LaRue .jpeg",
  },
  {
    id: 1010,
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    description:
      "From the Nobel Prize-winning author, a novel about artificial intelligence...",
    price: 26.95,
    originalPrice: 29.95,
    genre: "Sci-Fi",
    coverImage: "images/Klara and the Sun.jpeg",
  },
];

app.controller("BookController", function ($scope, $window, $http) {

  $scope.books = [];
  $scope.book = {};
  $scope.searchQuery = '';
  $scope.filterGenre = '';

  $scope.currentUser = JSON.parse(localStorage.getItem("currentUser"));

  $scope.logout = function() {
    localStorage.removeItem("currentUser");
    $scope.currentUser = null;
    $window.location.href = "/";
  };

  $scope.cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  // Fetch books from the API
  $scope.loadBooks = function() {
    $http.get('/api/books')
      .then(function(response) {
        if (response.data.success) {
          $scope.books = response.data.books;
          console.log('Books loaded from MongoDB:', $scope.books.length);
        }
      })
      .catch(function(error) {
        console.error('Error fetching books:', error);
        // Fallback to localStorage if API fails
        const storedBooks = JSON.parse(localStorage.getItem("books")) || [];
        $scope.books = defaultBooks.concat(storedBooks);
      });
  };
  
  // Load books when controller initializes
  $scope.loadBooks();

  $scope.deleteBook = function (book) {
    if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
      // Delete from MongoDB
      $http.delete(`/api/books/${book.id}`)
        .then(function(response) {
          if (response.data.success) {
            console.log('Book deleted from MongoDB');
          }
        })
        .catch(function(error) {
          console.error('Error deleting book from MongoDB:', error);
        });
      
      // Update UI and localStorage (for backward compatibility)
      $scope.books = $scope.books.filter(b => b.id !== book.id);
      let storedBooks = JSON.parse(localStorage.getItem("books")) || [];
      storedBooks = storedBooks.filter(b => b.id !== book.id);
      localStorage.setItem("books", JSON.stringify(storedBooks));
      
      alert("Book deleted successfully!");

      if (window.location.pathname.includes('viewBook.html') || 
          window.location.pathname.includes('editBooks.html')) {
        window.location.href = "/admin";
      }
    }
  };

  $scope.addToCart = function (book) {
    let existingBook = $scope.cart.find((item) => item.title === book.title);
    if (existingBook) {
      existingBook.quantity++;
    } else {
      book.quantity = 1;
      $scope.cart.push(book);
    }
    localStorage.setItem("cart", JSON.stringify($scope.cart));
    alert("Book added to cart!");
  };

  $scope.getCartCount = function () {
    return $scope.cart.reduce((total, book) => total + book.quantity, 0);
  };

  $scope.addBook = function () {
    if (
      !$scope.newBook ||
      !$scope.newBook.title ||
      !$scope.newBook.author ||
      !$scope.newBook.price
    ) {
      alert("Title, author, and price are required.");
      return;
    }

    // Handle file upload first if there's a file
    if ($scope.coverImageFile) {
      // Create FormData object for file upload
      var formData = new FormData();
      formData.append('coverImage', $scope.coverImageFile);
      
      // Upload the file first
      $http.post('/api/upload', formData, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      })
      .then(function(response) {
        if (response.data.success) {
          // After successful upload, create the book with the image path
          createBook(response.data.filePath);
        }
      })
      .catch(function(error) {
        console.error('Error uploading file:', error);
        alert("Error uploading image. Please try again.");
      });
    } else {
      // No file uploaded, use default image
      createBook("images/9.jpg");
    }
  };
  
  // Helper function to create a book after image upload
  function createBook(imagePath) {
    const newId = Math.max(...$scope.books.map(b => b.id)) + 1;
    const newBook = {
      id: newId,
      title: $scope.newBook.title,
      author: $scope.newBook.author,
      description: $scope.newBook.description || "",
      price: parseFloat($scope.newBook.price),
      originalPrice: parseFloat($scope.newBook.originalPrice || $scope.newBook.price),
      genre: $scope.newBook.genre || "Fiction",
      coverImage: imagePath
    };

    // Save to MongoDB if we're using the API
    $http.post('/api/books', newBook)
      .then(function(response) {
        if (response.data.success) {
          console.log('Book saved to MongoDB:', response.data.book);
        }
      })
      .catch(function(error) {
        console.error('Error saving to MongoDB:', error);
      });

    // Also maintain localStorage for backward compatibility
    $scope.books.push(newBook);
    let storedBooks = JSON.parse(localStorage.getItem("books")) || [];
    storedBooks.push(newBook);
    localStorage.setItem("books", JSON.stringify(storedBooks));

    alert("Book added successfully!");
    window.location.href = "/admin";
  }

  $scope.editBook = function (book) {
    window.location.href = "/edit?id=" + book.id;
  };

  $scope.viewBook = function (id) {
    window.location.href = "/view?id=" + id;
  };

  $scope.loadBookDetails = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = parseInt(urlParams.get('id'));

    if (bookId) {
      // Fetch the specific book from MongoDB
      $http.get(`/api/books/${bookId}`)
        .then(function(response) {
          if (response.data.success) {
            $scope.book = response.data.book;
            console.log('Book details loaded from MongoDB:', $scope.book);
          } else {
            console.error('Book not found in MongoDB');
            // Fallback to local books array if API fails
            const book = $scope.books.find(b => b.id === bookId);
            if (book) {
              $scope.book = book;
            } else {
              console.error('Book not found in local array either');
            }
          }
        })
        .catch(function(error) {
          console.error('Error fetching book details:', error);
          // Fallback to local books array if API fails
          const book = $scope.books.find(b => b.id === bookId);
          if (book) {
            $scope.book = book;
          }
        });
    }
  };

  $scope.loadBookToUpdate = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = parseInt(urlParams.get('id'));

    if (bookId) {
      // Fetch the specific book from MongoDB for editing
      $http.get(`/api/books/${bookId}`)
        .then(function(response) {
          if (response.data.success) {
            $scope.book = response.data.book;
            console.log('Book loaded for editing from MongoDB:', $scope.book);
          } else {
            console.error('Book not found in MongoDB');
            // Fallback to local books array if API fails
            const book = $scope.books.find(b => b.id === bookId);
            if (book) {
              $scope.book = book;
            } else {
              alert("Book not found!");
              window.location.href = "/admin";
            }
          }
        })
        .catch(function(error) {
          console.error('Error fetching book for editing:', error);
          // Fallback to local books array if API fails
          const book = $scope.books.find(b => b.id === bookId);
          if (book) {
            $scope.book = book;
          } else {
            alert("Book not found!");
            window.location.href = "/admin";
          }
        });
    }
  };

  $scope.updateBook = function() {
    if (!$scope.book || !$scope.book.id) {
      alert("No book selected for update.");
      return;
    }

    const index = $scope.books.findIndex(b => b.id === $scope.book.id);
    if (index === -1) {
      alert("Book not found!");
      return;
    }

    // Update in MongoDB
    $http.put(`/api/books/${$scope.book.id}`, $scope.book)
      .then(function(response) {
        if (response.data.success) {
          console.log('Book updated in MongoDB');
        }
      })
      .catch(function(error) {
        console.error('Error updating book in MongoDB:', error);
      });

    // Update in UI and localStorage (for backward compatibility)
    $scope.books[index] = $scope.book;

    let storedBooks = JSON.parse(localStorage.getItem("books")) || [];
    const storedIndex = storedBooks.findIndex(b => b.id === $scope.book.id);

    if (storedIndex !== -1) {
      storedBooks[storedIndex] = $scope.book;
    } else {
      storedBooks.push($scope.book);
    }

    localStorage.setItem("books", JSON.stringify(storedBooks));
    alert("Book updated successfully!");
    window.location.href = "/admin";
  };
});

app.controller("CartController", function ($scope) {
  $scope.cart = JSON.parse(localStorage.getItem("cart")) || [];

  $scope.getTotalPrice = function () {
    return $scope.cart.reduce(
      (total, book) => total + book.price * book.quantity,
      0
    );
  };

  $scope.removeFromCart = function (book) {
    $scope.cart = $scope.cart.filter((item) => item.title !== book.title);
    localStorage.setItem("cart", JSON.stringify($scope.cart));
  };

  $scope.increaseQuantity = function (book) {
    book.quantity++;
    localStorage.setItem("cart", JSON.stringify($scope.cart));
  };

  $scope.decreaseQuantity = function (book) {
    if (book.quantity > 1) {
      book.quantity--;
    } else {
      $scope.removeFromCart(book);
    }
    localStorage.setItem("cart", JSON.stringify($scope.cart));
  };
});

app.controller("CheckoutController", function ($scope) {
  $scope.cart = JSON.parse(localStorage.getItem("cart")) || [];
  $scope.currentUser = JSON.parse(localStorage.getItem("currentUser"));

  $scope.fetchUserInfo = function() {
    if ($scope.currentUser) {
      $scope.order = {
        name: $scope.currentUser.username,
        email: $scope.currentUser.username + '@example.com',
        address: "",
        paymentMethod: "Credit Card",
      };
    } else {
      $scope.order = {
        name: "",
        email: "",
        address: "",
        paymentMethod: "Credit Card",
      };
    }
  };

  $scope.getTotalPrice = function () {
    return $scope.cart.reduce(
      (total, book) => total + book.price * book.quantity,
      0
    );
  };

  $scope.placeOrder = function () {
    if ($scope.cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    let orderDetails = {
      name: $scope.order.name,
      email: $scope.order.email,
      address: $scope.order.address,
      paymentMethod: $scope.order.paymentMethod,
      cart: $scope.cart,
      total: $scope.getTotalPrice() + 5, 
    };

    console.log("Order Placed:", orderDetails);
    alert("Order placed successfully! Thank you for shopping.");
    localStorage.removeItem("cart");
    window.location.href = "/";
  };
});

app.controller("ViewBookController", function ($scope, $http) {
  function getQueryParam(param) {
    let params = new URLSearchParams(window.location.search);
    return params.get(param);
  }

  const bookId = parseInt(getQueryParam("id"));
  
  // Fetch the specific book from MongoDB
  $http.get(`/api/books/${bookId}`)
    .then(function(response) {
      if (response.data.success) {
        $scope.book = response.data.book;
        console.log('Book loaded from MongoDB:', $scope.book);
      } else {
        console.error('Book not found in MongoDB');
        // Fallback to localStorage if API fails
        const storedBooks = JSON.parse(localStorage.getItem("books")) || [];
        const allBooks = defaultBooks.concat(storedBooks);
        $scope.book = allBooks.find((book) => book.id === bookId);
      }
      
      if (!$scope.book) {
        alert("Book not found!");
        window.location.href = "/admin";
      }
    })
    .catch(function(error) {
      console.error('Error fetching book:', error);
      // Fallback to localStorage if API fails
      const storedBooks = JSON.parse(localStorage.getItem("books")) || [];
      const allBooks = defaultBooks.concat(storedBooks);
      $scope.book = allBooks.find((book) => book.id === bookId);
      
      if (!$scope.book) {
        alert("Book not found!");
        window.location.href = "/admin";
      }
    });
});

app.controller("AuthController", function ($scope, $window, $http) {

  $scope.loginData = { username: "", password: "" };
  $scope.signupData = { username: "", email: "", password: "", confirmPassword: "" };

  $scope.loginError = null;
  $scope.signupError = null;
  $scope.currentUser = JSON.parse(localStorage.getItem("currentUser"));

  $scope.login = function() {
    if (!$scope.loginData.username || !$scope.loginData.password) {
      $scope.loginError = "Please fill in all fields";
      return;
    }

    // Use the API endpoint for authentication
    $http.post('/api/login', {
      username: $scope.loginData.username,
      password: $scope.loginData.password
    })
    .then(function(response) {
      if (response.data.success) {
        const userData = response.data.user;
        
        // Store user data in localStorage
        localStorage.setItem("currentUser", JSON.stringify(userData));
        
        // Redirect based on role
        if (userData.role === "admin") {
          $window.location.href = "/admin";
        } else {
          $window.location.href = "/";
        }
      }
    })
    .catch(function(error) {
      console.error('Login error:', error);
      $scope.loginError = "Invalid username or password";
    });
  };

  $scope.signup = function() {
    if (!$scope.signupData.username || !$scope.signupData.email || 
        !$scope.signupData.password || !$scope.signupData.confirmPassword) {
      $scope.signupError = "Please fill in all fields";
      return;
    }

    if ($scope.signupData.password !== $scope.signupData.confirmPassword) {
      $scope.signupError = "Passwords do not match";
      return;
    }

    // Use the API endpoint for user registration
    $http.post('/api/register', {
      username: $scope.signupData.username,
      email: $scope.signupData.email,
      password: $scope.signupData.password
    })
    .then(function(response) {
      if (response.data.success) {
        alert("Account created successfully! Please login.");
        $window.location.href = "/login";
      }
    })
    .catch(function(error) {
      console.error('Registration error:', error);
      if (error.status === 409) {
        $scope.signupError = "Username already exists";
      } else {
        $scope.signupError = "Error creating account. Please try again.";
      }
    });
  };

  $scope.logout = function() {
    localStorage.removeItem("currentUser");
    $scope.currentUser = null;
    $window.location.href = "/";
  };
});

app.run(function($rootScope) {
  $rootScope.currentUser = JSON.parse(localStorage.getItem("currentUser"));

  $rootScope.$watch('currentUser', function(newValue) {
    $rootScope.currentUser = newValue;
  });
});