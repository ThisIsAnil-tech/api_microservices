const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();
const port = 4000;

const schema = buildSchema(`
    type Book {
        id: ID
        title: String
        author: String
    }

    type Query {
        books: [Book]
        book(id: ID!): Book
    }

    type Mutation {
        addBook(
            title: String!,
            author: String!
        ): Book

        updateBook(
            id: ID!,
            title: String,
            author: String
        ): Book

        deleteBook(
            id: ID!
        ): String
    }
`);

let books = [
    { id: 1, title: "GraphQL", author: "John" },
    { id: 2, title: "Nodejs", author: "Alice" }
];

const root = {

    // Read all books
    books: () => books,

    // Read one book
    book: ({ id }) => {
        return books.find(book => book.id == id);
    },

    // Create
    addBook: ({ title, author }) => {
        const newBook = {
            id: books.length + 1,
            title,
            author
        };

        books.push(newBook);
        return newBook;
    },

    // Update
    updateBook: ({ id, title, author }) => {
        const book = books.find(book => book.id == id);

        if (!book) {
            return null;
        }

        if (title) {
            book.title = title;
        }

        if (author) {
            book.author = author;
        }

        return book;
    },

    // Delete
    deleteBook: ({ id }) => {
        const index = books.findIndex(
            book => book.id == id
        );

        if (index === -1) {
            return "Book not found";
        }

        books.splice(index, 1);

        return "Book deleted successfully";
    }
};

app.use("/graphql", graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

/*
# READ ALL BOOKS
query {
  books {
    id
    title
    author
  }
}

# READ SINGLE BOOK
query {
  book(id: 1) {
    id
    title
    author
  }
}

# CREATE BOOK
mutation {
  addBook(
    title: "Python",
    author: "Anil"
  ) {
    id
    title
    author
  }
}

# UPDATE BOOK
mutation {
  updateBook(
    id: 1,
    title: "Advanced GraphQL",
    author: "John Doe"
  ) {
    id
    title
    author
  }
}

# DELETE BOOK
mutation {
  deleteBook(id: 1)
}
*/