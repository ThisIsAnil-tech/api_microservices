function fetchUser() {
  return new Promise(resolve => {
    setTimeout(() => resolve({ name: "Anil", age: 20 }), 2000);
  });
}

async function getUser() {
  const user = await fetchUser();
  console.log(user);
}

getUser();
