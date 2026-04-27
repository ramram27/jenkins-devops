const express = require('express');

const app = express();


app.get('/', async (req , res)=>{
    res.send(`
        <h1>Welcome to the app</h1>
        <h2>Name: Rohit Kumar</h2>
        `)
})

module.exports = app;


if (require.main === module) {
  app.listen(8000, () => {
    console.log("Server is running on port 8000");
  });
}
