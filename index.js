const express = require("express");
const cors = require("cors");
const { QuestionRouter } = require("./Routes/question.routes");
const { connection } = require("./db");
const OpenAI = require("openai");
require("dotenv").config();
const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cors());
app.use("/questions", QuestionRouter)

app.get("/", async(req, res) =>{
    res.setHeader("Content-type", "text/html");
    res.send("<h1>Welcome to the Interview Question Server Api</h1>")
})

const openai = new OpenAI({
    apiKey: process.env.API_KEY 
}); 

app.post("/find", async(req, res) =>{
    const Prompt = req.body.prompt;
    try {
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{"role": "user", "content": Prompt}],
          });
          res.status(200).json({message:chatCompletion.choices[0].message.content})
    } catch (error) {
        res.status(400).json({error});
    }
})

app.listen(PORT, async() =>{
    try {
        await connection;
        console.log("Connected to the database");
        console.log("Server is Running on port 8080");
    } catch (error) {
        console.log(error);
    }
})