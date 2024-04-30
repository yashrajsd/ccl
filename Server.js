const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3001
const http = require('http')
const httpserver = http.createServer(app);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const pool = require('./dbconfig/dbconfig')
const mysql =  require("mysql");
const { v4: uuidv4 } = require('uuid');
// const serverSocket = require('./socket');

// serverSocket(httpserver)

const db = mysql.createConnection({
    user: 'admin',
    host: 'db.claky8uci7yd.us-east-1.rds.amazonaws.com',
    database: 'DB',
    password: 'YDArchu77',
})
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database');
  }
});

app.use(
    cors({
      origin: '*', 
      methods: ['GET', 'POST', 'PUT', 'DELETE'], 
      allowedHeaders: ['Content-Type', 'Authorization'], 
    })
  );
app.use(express.json());

app.listen(PORT,(req,res)=>{
    console.log(`Server listening to port ${PORT}`);
})

function generateSerial() {
  const randomNum = Math.floor(Math.random() * 9000) + 1000; // Random number between 1000 and 9999
  const timestampStr = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3); // Current timestamp in YYYYMMDDHHMMSS format
  const serial = timestampStr + randomNum;
  return serial;
}



app.get('/api/getposts', (req, res) => {
  try {
    const getPostsQuery = 'SELECT * FROM posts';
    db.query(getPostsQuery, (err, result) => {
      if (err) {
        console.error('Error retrieving posts:', err);
        res.status(500).json({ success: false, message: 'Error retrieving posts' });
      } else {
        res.status(200).json({ posts: result });
      }
    });
  } catch (error) {
    console.error('Error retrieving posts:', error);
    res.status(500).json({ success: false, message: 'Error retrieving posts' });
  }
});







app.post('/api/post', async (req, res) => {
  const { username, tweet } = req.body;

  try {
    const createPostQuery = 'INSERT INTO posts (username, tweet, created_at) VALUES (?, ?, NOW())';
    db.query(createPostQuery, [username, tweet], (err, result) => {
      if (err) {
        console.error('Error creating post:', err);
        res.status(500).json({ success: false, message: 'Error creating post' });
      } else {
        console.log('posted');
        res.status(200).json({msg:'hurray'});
      }
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ success: false, message: 'Error creating post' });
  }
});



app.post('/api/usersignup', async (req, res) => {
  const { username, gmail, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const createUserQuery = 'INSERT INTO users (id,username, email, password) VALUES (?, ?, ?,?)';
    const serialNumber = 6
    db.query(createUserQuery, [serialNumber,username, gmail, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ success: false, message: 'Error creating user' });
      } else {
        console.log('working')
        res.status(200).json({ success: true, user: { username, email: gmail } });
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, message: 'Error creating user' });
  }
});

app.post('/api/userlogin', async (req, res) => {
  const { username, password } = req.body;

  try {
    const getUserQuery = 'SELECT * FROM users WHERE username = ?';
    db.query(getUserQuery, [username], async (err, result) => {
      if (err) {
        console.error('Error fetching user:', err);
        return res.status(500).json({ success: false, message: 'Error fetching user' });
      }

      if (result.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const hashedPassword = result[0].password;
      const isMatch = await bcrypt.compare(password, hashedPassword);

      if (isMatch) {
        const payload = {
          userId: result[0].id,
          username: result[0].username,
          email: result[0].email,
        };
        const token = jwt.sign(payload, "sduvhe77");
        console.log('workingggg')
        res.status(200).json({ token: token });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Error during login' });
  }
});



