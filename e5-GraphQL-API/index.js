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
        addBook(title: String!, author: String!): Book
    }
`);

let books = [
    { id: 1, title: "GraphQL", author: "John" },
    { id: 2, title: "Nodejs", author: "Alice" }
];

const root = {
    books: () => books,
    book: ({ id }) => {
        return books.find(book => book.id == id);
    },
    addBook: ({ title, author }) => {
        const newBook = {
            id: books.length + 1,
            title,
            author
        };
        books.push(newBook);
        return newBook;
    }
};m

app.use("/graphql", graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(port, () => {
    console.log(`port ${port} is running`);
});