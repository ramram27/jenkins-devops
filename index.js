const express = require('express');

const app = express();


app.get('/', async (req , res)=>{
    res.send(`
        <h1>Welcome to the app</h1>
        <h2>Name: Rohit Kumar</h2>
        `)
})

app.get('/add',async(req,res)=>{
  const {num1,num2} = req.body;

  if(num1 !== Number || num2 !== Number){
    res.status(400).json({error: 
      "Invalid input. Both num1 and num2 should be numbers."});
  }
  return res.json({result : num1 + num2})
})


module.exports = app;


if (require.main === module) {
  app.listen(8000, () => {
    console.log("Server is running on port 8000");
  });
}
