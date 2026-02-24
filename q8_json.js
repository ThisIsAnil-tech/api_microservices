let user = { name: "Anil", age: 20 };

let jsonString = JSON.stringify(user);
console.log(jsonString);

let parsed = JSON.parse(jsonString);
console.log(parsed.name);
