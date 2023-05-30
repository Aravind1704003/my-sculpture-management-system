const mysql=require ("mysql");
const express=require("express");
const session = require('express-session');
const bodyParser =require("body-parser");
const encoder = bodyParser.urlencoded();
const app=express();
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const multer = require('multer');



app.use(session({ secret: 'your_secret_key', resave: true, saveUninitialized: true }));
app.use(cookieParser());
const upload = multer({ storage: multer.memoryStorage() });


// Set the view engine to EJS
app.set('view engine', 'ejs');


app.use(express.static("public"))

const connection=mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"aravind",
  database:"login_db"

});

//connect to the database

connection.connect(function(error){
    if(error) throw error
    else console.log("connected to the database successfully");

});
// user login

app.get("/",function(req,res){

    res.sendFile(__dirname + "/homewithlogindropdown.html");

});

app.get("/login.html",function(req,res){

    res.sendFile(__dirname + "/login.html")
});
app.get("/adminlogin.html",function(req,res){

    res.sendFile(__dirname + "/adminlogin.html")
});

app.get("/templelogin.html",function(req,res){

    res.sendFile(__dirname + "/templelogin.html")
});


// user login
app.post("/login.html", encoder, function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  connection.query("SELECT * FROM loginuser WHERE user_name = ? AND user_pass = ?", [username, password], function(error, results, fields) {
      console.log("SELECT * FROM loginuser WHERE user_name = " + username + " AND user_pass = " + password);

      if (results.length > 0) {
          req.session.user = results[0];
          res.redirect("/userhome");
      } else {
          res.redirect("/login.html?error=Invalid%20username%20or%20password");
      }
      res.end();
  });
});

// Set up a route for the logout option
app.get('/logout', (req, res) => {
  // Clear the session data
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      // Redirect to the login page
      res.redirect('/homewithlogindropdown');
    }
  });
});






  // Set up the search route
  app.get('/search', (request, response) => {
    const search = request.query.search;
    const search1 = request.query.search1;
    const searchBy = request.query.searchBy;
    console.log(searchBy);
    console.log(search);
    let sql = '';
  
    switch (searchBy) {
      case 'keyword':
        sql = `SELECT * FROM viewsculpture1 WHERE keyword LIKE '%${search}%'`;
        break;
      case 'state':
        sql = `SELECT * FROM viewsculpture1 WHERE keyword LIKE '%${search}%' AND state LIKE '%${search1}%'`;
        break;
      case 't_name':
        sql = `SELECT * FROM viewsculpture1 WHERE t_name LIKE '%${search}%'`;
        break;
      default:
        sql = `SELECT * FROM viewsculpture1 WHERE keyword LIKE '%${search}%'`;
        break;
    }
  
    // execute query
    connection.query(sql, (err, result) => {
      if (err) {
        throw err;
      }
      //decode the image
      result.forEach((result)=> {
        result.image = Buffer.from(result.image, 'base64');
      });

      //render the search page
      response.render('search', { results: result });
    });
  });
  

//when login  is success
app.get("/userhome",function(req,res){

    res.sendFile(__dirname + "/userhome.html")
});


app.get("/homewithlogindropdown",function(req,res){

    res.sendFile(__dirname + "/homewithlogindropdown.html")
});

app.get("/imagepage",function(req,res){

  res.sendFile(__dirname + "/imagepage.html")
});

app.get("/imagegallery",function(req,res){

  res.sendFile(__dirname + "/imagegallery.html")
});



// admin login


app.post("/login2.html",encoder,function(req,res){
    var adminname = req.body.adminname;
    var password = req.body.password;

    connection.query("select * from admin where adminname =? and password =?",[adminname,password],function(error,results,fields){
        console.log("select * from admin where adminname ="+ adminname+ "and user_pass ="+ password);

        if(results.length > 0){
            res.redirect("/adminhome");
        }else{
            res.redirect("/homewithlogindropdown");

        }
        res.end();
    })
})

app.get("/login2.html",function(req,res){

    res.sendFile(__dirname + "/login2.html")
});

//when login  is success
app.get("/adminhome",function(req,res){

    res.sendFile(__dirname + "/adminhome.html")
});

app.get("/homewithlogindropdown",function(req,res){

    res.sendFile(__dirname + "/homewithlogindropdown.html")
});

app.get("/home.html",function(req,res){

    res.sendFile(__dirname + "/home.html")
});

//temple login


app.get("/templehome",function(req,res){
 


  res.sendFile(__dirname + "/templehome.html")
});
// temple administrator 
//temple login
app.post("/templelogin.html",encoder,function(req,res){
  const templeid = req.body.templeid;
  const password = req.body.password;

  // execute MySQL query to validate user credentials
  const sql = ` SELECT * FROM templelogin WHERE templeid = ${templeid} AND password = '${password}'`;
  console.log("")
  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error validating user credentials');
    } else {
      if (results.length > 0) {
        // user found with the given credentials
        const user = results[0];
        res.cookie('templeid', user.templeid);
        res.redirect('/templehome');
      } else {
        // no user found with the given credentials
        res.status(401).send('Invalid username or password');
      }
    }
  });
});
//when login  is success
app.get("/templehome",function(req,res){

    res.sendFile(__dirname + "/templehome.html")
});

app.get("/homewithlogindropdown",function(req,res){

    res.sendFile(__dirname + "/homewithlogindropdown.html")
});

app.get("/master.html",function(req,res){

    res.sendFile(__dirname + "/master.html")
});


/*app.get("/getsculptureintemple",function(req,res){

  res.sendFile(__dirname + "/getsculptureintemple.html")
 });*/

// temple sculpture page

app.get('/getsculptureintemple', (req, res) => {
  const templeid = req.cookies.templeid;
  if (!templeid) {
    res.redirect('/');
    return;
  }

  res.render('getsculptureintemple', { templeid : templeid });
});

app.post('/getsculptureintemple', (req, res) => {
  const sculptureid = req.body.sculptureid;
  const sculpturename = req.body.sculpturename;
  const templeid = req.cookies.templeid;
  const materialid = req.body.materialid;
  const image = req.body.image;
  const description = req.body.description;
  const keyword = req.body.keyword;

  // execute MySQL query to insert sculpture details
  const sql = `INSERT INTO sculpture (sculptureid, sculpturename, templeid, materialid,image, description, keyword) 
               VALUES (${sculptureid}, '${sculpturename}', ${templeid}, ${materialid}, '${image}','${description}', '${keyword}')`;
  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error adding sculpture details');
    } else {
      res.redirect('/thankyou.html');
    }
  });
});

app.get("/gettemplelogin.html",function(req,res){

  res.sendFile(__dirname + "/gettemplelogin.html")
});

app.post("/gettemplelogin.html",encoder,function(req,res){
  const { templeid,password } = req.body;
    const sql = 'INSERT INTO templelogin (templeid,password) VALUES (?,?)';
    
    const values = [templeid,password];
    
    connection.query(sql, values, (err, result) => {
      if (err) {
        throw err;
      }
      console.log("Message from ${templename}  saved to database...");
      res.redirect('/thankyou.html');
    });
   });
    // when sucess
  app.get("/thankyou.html",function(req,res){
  
      res.sendFile(__dirname + "/thankyou.html")
  });



app.get("/templehome.html",function(req,res){

  res.sendFile(__dirname + "/templehome.html")
});

//when login  is success
app.get("/home",function(req,res){

    res.sendFile(__dirname + "/home.html")
});

app.get("/homewithlogindropdown",function(req,res){

    res.sendFile(__dirname + "/homewithlogindropdown.html")
});





app.get("/master.html",function(req,res){

    res.sendFile(__dirname + "/master.html")
});

//view city

app.get("/viewcity",function(req,res){
              
  connection.query('SELECT * FROM city', function (error, results, fields) {
    if (error) throw error;

    // Create an HTML table to display the results
    let html = '<h1 style="text-align: center;">CITY TABLE</h1><table style="border-collapse: collapse; width: 100%; max-width: 800px; margin: 0 auto; background: #f5b5f3 url(\'table-bg.jpg\') center center no-repeat; background-size: cover; border: 1px solid #ccc;">';

    // Create the header row
    html += '<tr style="background-color: #b5cef5; color: #333;">';
    for (let i = 0; i < fields.length; i++) {
        html += '<th style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + fields[i].name + '</th>';
    }
    html += '</tr>';

    // Create a row for each result
    for (let i = 0; i < results.length; i++) {
        html += '<tr style="background-color: #fff; color: #333;">';
        for (let j = 0; j < fields.length; j++) {
            html += '<td style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + results[i][fields[j].name] + '</td>';
        }
        html += '</tr>';
    }

    html += '</table>';

    // Send the HTML code to the client
    res.send(html);
});
});

// view temple

app.get("/viewtemple",function(req,res){
              
  connection.query('SELECT * FROM temple', function (error, results, fields) {
    if (error) throw error;

    // Create an HTML table to display the results
    let html = '<h1 style="text-align: center;">TEMPLE TABLE</h1><table style="border-collapse: collapse; width: 100%; max-width: 800px; margin: 0 auto; background: #f5b5f3 url(\'table-bg.jpg\') center center no-repeat; background-size: cover; border: 1px solid #ccc;">';

    // Create the header row
    html += '<tr style="background-color: #b5cef5; color: #333;">';
    for (let i = 0; i < fields.length; i++) {
        html += '<th style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + fields[i].name + '</th>';
    }
    html += '</tr>';

    // Create a row for each result
    for (let i = 0; i < results.length; i++) {
        html += '<tr style="background-color: #fff; color: #333;">';
        for (let j = 0; j < fields.length; j++) {
            html += '<td style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + results[i][fields[j].name] + '</td>';
        }
        html += '</tr>';
    }

    html += '</table>';

    // Send the HTML code to the client
    res.send(html);
});
});

// view material

app.get("/viewmaterial",function(req,res){
              
  connection.query('SELECT * FROM material', function (error, results, fields) {
    if (error) throw error;

    // Create an HTML table to display the results
    let html = '<h1 style="text-align: center;">MATERIAL TABLE</h1><table style="border-collapse: collapse; width: 100%; max-width: 800px; margin: 0 auto; background: #f5b5f3 url(\'table-bg.jpg\') center center no-repeat; background-size: cover; border: 1px solid #ccc;">';

    // Create the header row
    html += '<tr style="background-color: #b5cef5; color: #333;">';
    for (let i = 0; i < fields.length; i++) {
        html += '<th style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + fields[i].name + '</th>';
    }
    html += '</tr>';

    // Create a row for each result
    for (let i = 0; i < results.length; i++) {
        html += '<tr style="background-color: #fff; color: #333;">';
        for (let j = 0; j < fields.length; j++) {
            html += '<td style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + results[i][fields[j].name] + '</td>';
        }
        html += '</tr>';
    }

    html += '</table>';

    // Send the HTML code to the client
    res.send(html);
});
});




// get city details 
app.get("/getcity.html",function(req,res){

    res.sendFile(__dirname + "/getcity.html")
});

app.post("/getcity.html",encoder,function(req,res){
    const { City_ID, CITY } = req.body;
      const sql = 'INSERT INTO city (cityid, city) VALUES (?,?)';
      
      const values = [City_ID, CITY];
      
      connection.query(sql, values, (err, result) => {
        if (err) {
          throw err;
        }
        console.log(`Message from ${CITY}  saved to database...`);
        res.redirect('/thankyou.html');
    });
});
     // when sucess  
    app.get("/thankyou.html",function(req,res){
    
        res.sendFile(__dirname + "/thankyou.html")
    });


// regstration details
app.get("/register",function(req,res){

    res.sendFile(__dirname + "/Registration.html");
});

app.post("/register",encoder,function(req,res){
const { name,age,gender,phonenumber, emailid,username,password } = req.body;
  const sql = 'INSERT INTO newlogin (name,age,gender,phonenumber,emailid,username,password) VALUES (?,?, ?, ?,?,?,?)';
  
  const values = [name,age,gender,phonenumber, emailid, username,password];
  
  connection.query(sql, values, (err, result) => {
    if (err) {
      throw err;
    }
    console.log(`Message from ${name} (${emailid}) saved to database...`);
    res.redirect('/thankyou.html');
  });
 });
    // when sucess 
    app.get("/thankyou.html",function(req,res){

    res.sendFile(__dirname + "/thankyou.html")
});



//temple details
app.get("/gettemple.html",function(req,res){

    res.sendFile(__dirname + "/gettemple.html")
});
app.post("/gettemple.html",encoder,function(req,res){
    const { Temple_ID,Temple,ADDRESS,CITY,PINCODE,STATE } = req.body;
      const sql = 'INSERT INTO temple (temple_id,t_name,address,city,pincode,state) VALUES (?,?, ?,?,?,?)';
      
      const values = [Temple_ID,Temple,ADDRESS,CITY,PINCODE,STATE ];
      
      connection.query(sql, values, (err, result) => {
        if (err) {
          throw err;
        }
        console.log(`Message from ${Temple} (${CITY}) saved to database...`);
        res.redirect('/thankyou.html');
      });
     });
      // when sucess
    app.get("/thankyou.html",function(req,res){
    
        res.sendFile(__dirname + "/thankyou.html")
    });


// get material details 
    app.get("/getmaterial.html",function(req,res){
          
          res.sendFile(__dirname + "/getmaterial.html")
        });
  
app.post("/getmaterial.html",encoder,function(req,res){
        const { materialid,material } = req.body;
          const sql = 'INSERT INTO material (materialid, material) VALUES (?,?)';
          
          
          const values = [materialid,material];
          
          connection.query(sql, values, (err, result) => {
            if (err) {
              throw err;
            }
            console.log(`Message from ${material}  saved to database...`);
            res.redirect('/thankyou.html');
        });
    });
         // when sucess  
        app.get("/thankyou.html",function(req,res){
        
            res.sendFile(__dirname + "/thankyou.html")
        });

        app.get("/aboutus.html",function(req,res){
        
          res.sendFile(__dirname + "/aboutus.html")
      });

// get sculpture details 
        app.get("/getsculpture.html",function(req,res){

           // Select all items from the table
  connection.query('SELECT * FROM temple', function (error, results, fields) {
    if (error) throw error;

    // Check if any data was returned
    console.log('Results:', results);

    // Generate the HTML code for the dropdown list
    let options = '';
    for (let i = 0; i < results.length; i++) {
      options += `<option value="${results[i].temple_id}">${results[i].t_name}</option>`;
    }

    // Generate the complete HTML code for the form
    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>add sculpture</title>
      <link rel="stylesheet" href="styles.css">
      <style>
        body {
            
            font-family: Arial, sans-serif;
            background-color: #f0d1e5;
            margin: 0;
            padding: 0;
            background-image: url('sculpture.jpg');
          }
          
          h1 {
            text-align: center;
            margin-top: 50px;
          }
          
          form {
            max-width: 600px;
            margin: 0 auto;
            background-color: #eaf5fe;
            padding: 30px;
            border-radius: 5px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
          }
          
          label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
          }
          
          input[type="number"],
          input[type="text"],
          textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-bottom: 15px;
          }
          
          textarea {
            height: 150px;
          }
          
          button[type="submit"] {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
          
          button[type="submit"]:hover {
            background-color: #45a049;
          }
          
        
          </style>
    </head>
    <body>
      <h1>SCULPTURE</h1>
      <form method="post" action="/getsculpture.html">
      <label for="SCULPTURE_ID">SCULPTURE ID:</label>
      <input type="number" id="sculptureid" name="sculptureid" required><br>
      
    
        <label for="TEMPLEID">TEMPLE:</label>
        <select id="TEMPLEID" name="TEMPLEID">
        ${options}
      </select>
    
    
        <label for="MATERIAL_ID">MATERIAL ID:</label>
        <input type="number" id="MATERIAL_ID" name="MATERIAL_ID" required><br>
    
        <label for="IMAGEURL">IMAGE LINK:</label>
        <input type="file" id="IMAGEURL" name="IMAGEURL"  accept="image/*" required  ><br>
    
        <label for="DESCRYPTION">DESCRYPTION:</label>
        <input type="text" id="DESCRYPTION" name="DESCRYPTION" required><br>
    
        <label for="KEYWORD">SCULPTURE KEYWORD:</label>
        <input type="text" id="KEYWORD" name="KEYWORD" required><br>    
    
        <label for="SCULPTURE_NAME">SCULPTURE NAME:</label>
        <input type="text" id="SCULPTURE_NAME" name="SCULPTURE_NAME" required><br>
    
      
    
       
       
        <button type="submit">Submit</button>
      </form>
    </body>
    </html>
    
    `;

    // Send the HTML code to the client
    res.send(html);
  });
 });
       
 
 app.post('/getsculpture.html', upload.single('IMAGEURL'), function(req, res) {
  const { sculptureid, TEMPLEID, MATERIAL_ID, DESCRYPTION, KEYWORD, SCULPTURE_NAME } = req.body;
  
          const imageData = req.file.buffer;
          const sql = 'INSERT INTO sculpture (sculptureid, templeid, materialid, image, description, keyword, sculpturename) VALUES (?, ?, ?, ?, ?, ?, ?)';
          const values = [sculptureid, TEMPLEID, MATERIAL_ID, imageData, DESCRYPTION, KEYWORD, SCULPTURE_NAME];
          console.log(`Message from ${sculptureid} (${SCULPTURE_NAME}) saved to database...`);
            res.redirect('/thankyou.html');
          connection.execute(sql, values, (err, result) => {
            if (err) {
              throw err;
            }
            console.log(`Message from ${sculptureid} (${SCULPTURE_NAME}) saved to database...`);
            res.redirect('/thankyou.html');
          });
        });
              //when  success
            app.get("/thankyou.html",function(req,res){
            
                res.sendFile(__dirname + "/thankyou.html")
            });   
            
            app.get("/contact-us.html",function(req,res){

                res.sendFile(__dirname + "/contact-us.html")
            
            });


            // REPORT GENERATION ROUTES  
    
    
   // PART 1 for templeview 
 
 
   app.get("/templeview",function(req,res){ 
 
    connection.query('SELECT * FROM temple', function (error, results, fields) { 
        if (error) throw error; 
 
        // Create an HTML table to display the results 
        let html = '<h1 style="text-align: center;">TEMPLE DETAIL</h1><table style="border-collapse: collapse; width: 100%; max-width: 800px; margin: 0 auto; background: #f5b5f3 url(\'table-bg.jpg\') center center no-repeat; background-size: cover; border: 1px solid #ccc;">'; 
 
        // Create the header row 
        html += '<tr style="background-color: #b5cef5; color: #333;">'; 
        for (let i = 0; i < fields.length; i++) { 
            html += '<th style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + fields[i].name + '</th>'; 
        } 
        html += '</tr>'; 
 
        // Create a row for each result 
        for (let i = 0; i < results.length; i++) { 
            html += '<tr style="background-color: #fff; color: #333;">'; 
            for (let j = 0; j < fields.length; j++) { 
                html += '<td style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + results[i][fields[j].name] + '</td>'; 
            } 
            html += '</tr>'; 
        } 
 
        html += '</table>'; 
 
        // Send the HTML code to the client 
        res.send(html); 
    }); 
});
   
        //  PART *2 DROPDOWN report generation for temple view for particular state

app.get('/templestate', (req, res) => { 
  try { 
    // Your code here 
  } catch (err) { 
    if (res.headersSent) return; 
    // Your error handling code here 
    res.status(500).send('Internal server error'); 
  } 
connection.query('SELECT * FROM temple', (error, results, fields) => {
if (error) throw error;

// Create an HTML table to display the results
let html = '<h1 style="text-align: center;">TEMPLE DETAIL</h1><table style="border-collapse: collapse; width: 100%; max-width: 800px; margin: 0 auto; background: #f5b5f3 url(\'table-bg.jpg\') center center no-repeat; background-size: cover; border: 1px solid #ccc;">';

// Create the header row
html += '<tr style="background-color: #b5cef5; color: #333;">';
for (let i = 0; i < fields.length; i++) {
  html += '<th style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + fields[i].name + '</th>';
}
html += '</tr>';

// Create a row for each result
for (let i = 0; i < results.length; i++) {
  html += '<tr style="background-color: #fff; color: #333;">';
  for (let j = 0; j < fields.length; j++) {
    if (fields[j].name === 'state') {
      // If the current field is "state", create a hyperlink to the next page
      const stateValue = results[i][fields[j].name];
      html += `<td style="padding: 12px; text-align: left; border: 5px solid #ccc;"><a href="/templeview/${stateValue}">${stateValue}</a></td>`;
    } else {
      // If the current field is not "state", display the field value in the table cell
      html += '<td style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + results[i][fields[j].name] + '</td>';
    }
  }
  
  html += '</tr>';
  
}

html += '</table>';

// Send the HTML code to the client
res.send(html);
});
});
 // Retrieve specific rows from the "templeview" table based on state value
 app.get('/templeview/:state', (req, res) => {
  const stateValue = req.params.state;

  connection.query(`SELECT * FROM temple WHERE state = '${stateValue}'`, (error, results, fields) => {
    if (error) throw error;

    // Create an HTML table to display the results
    let html = `<h1 style="text-align: center;">TEMPLE DETAIL (${stateValue})</h1><table style="border-collapse: collapse; width: 100%; max-width: 800px; margin: 0 auto; background: #f5b5f3 url(\'table-bg.jpg\') center center no-repeat; background-size: cover; border: 1px solid #ccc;">`;

    // Create the header row
    html += '<tr style="background-color: #b5cef5; color: #333;">';
    for (let i = 0; i < fields.length; i++) {
      html += '<th style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + fields[i].name + '</th>';
    }
    html += '</tr>';

    // Create a row for each result
    for (let i = 0; i < results.length; i++) {
      html += '<tr style="background-color: #fff; color: #333;">';
      for (let j = 0; j < fields.length; j++) {
        if (fields[j].name === 'state') {
          // If the current field is "state", create a hyperlink to the next page
          const stateValue = results[i][fields[j].name];
          html += `<td style="padding: 12px; text-align: left; border: 5px solid #ccc;"><a href="/templeview/${stateValue}">${stateValue}</a></td>`;
        } else {
          // If the current field is not "state", display the field value in the table cell
          html += '<td style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + results[i][fields[j].name] + '</td>';
        }
      }
      html += '</tr>';
        }
        
        html += '</table>';
    
        // Send the HTML code to the client
        res.send(html);
      });
    });

// part -3  display  for sculptureview        
          app.get('/sculptureview', (req, res) => { 
              try { 
                // Your code here 
              } catch (err) { 
                if (res.headersSent) return; 
                // Your error handling code here 
                res.status(500).send('Internal server error'); 
              } 
            
              // Retrieve all rows from the "city" table 
              connection.query('SELECT * FROM viewsculpture1', function (error, results, fields) { 
                if (error) throw error;
            
                // Create an HTML table to display the results 
                let html = '<h1 style="text-align: center;">SCULPTURE DETAIL</h1><table style="border-collapse: collapse; width: 100%; max-width: 800px; margin: 0 auto; background: #f5b5f3 url(\'table-bg.jpg\') center center no-repeat; background-size: cover; border: 1px solid #ccc;">'; 
            
                // Create the header row 
                html += '<tr style="background-color: #b5cef5; color: #333;">'; 
                for (let i = 0; i < fields.length; i++) { 
                    html += '<th style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + fields[i].name + '</th>'; 
                } 
                html += '</tr>'; 
            
                // Loop through all the rows and create a row for each result 
                for (let i = 0; i < results.length; i++) { 
                  html += '<tr style="background-color: #fff; color: #333;">'; 
                  for (let j = 0; j < fields.length; j++) { 
                    if (fields[j].name === 'image') {
                      // If the current field is "image", get the image data and convert it to base64
                      const imageData = results[i][fields[j].name]; 
                      const imageBase64 = Buffer.from(imageData).toString('base64');
                      // Display the image in the table cell
                      html += `<td style="padding: 12px; text-align: left; border: 5px solid #ccc;"><img src="data:image/jpeg;base64,${imageBase64}" alt="image" height="200" width="200"/></td>`;
                    } else {
                      // If the current field is not "image", display the field value in the table cell
                      html += '<td style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + results[i][fields[j].name] + '</td>'; 
                    }
                  } 
                  html += '</tr>'; 
                } 
            
                html += '</table>'; 
            
                // Send the HTML code to the client 
                res.send(html); 
              }); 
            });
//part -4 state view for sculpture table 
app.get('/sculpturestate', (req, res) => { 
  try { 
    // Your code here 
  } catch (err) { 
    if (res.headersSent) return; 
    // Your error handling code here 
    res.status(500).send('Internal server error'); 
  } 
connection.query('SELECT * FROM viewsculpture1', (error, results, fields) => {
      if (error) throw error;

      // Create an HTML table to display the results
      let html = '<h1 style="text-align: center;">SCULPTURE DETAILS</h1><table style="border-collapse: collapse; width: 100%; max-width: 800px; margin: 0 auto; background: #f5b5f3 url(\'table-bg.jpg\') center center no-repeat; background-size: cover; border: 1px solid #ccc;">';
      // Create the header row
      html += '<tr style="background-color: #b5cef5; color: #333;">';
      for (let i = 0; i < fields.length; i++) {
          html += '<th style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + fields[i].name + '</th>';
       }
      html += '</tr>';
      // Create a row for each result
      for (let i = 0; i < results.length; i++) {
          html += '<tr style="background-color: #fff; color: #333;">';
          for (let j = 0; j < fields.length; j++) {
             if (fields[j].name === 'image') {
                      // If the current field is "image", get the image data and convert it to base64
                      const imageData = results[i][fields[j].name]; 
                      const imageBase64 = Buffer.from(imageData).toString('base64');
                      // Display the image in the table cell
                      html += `<td style="padding: 12px; text-align: left; border: 4px solid #ccc;"><img src="data:image/jpeg;base64,${imageBase64}" alt="image" height="200" width="200"/></td>`;
                    } else if (fields[j].name === 'state') {
                  // If the current field is "state", create a hyperlink to the next page
                  const stateValue = results[i][fields[j].name];
                  html += `<td style="padding: 12px; text-align: left; border: 5px solid #ccc;"><a href="/sculptureview/${stateValue}">${stateValue}</a></td>`;
              } else {
                  // If the current field is not "state", display the field value in the table cell
               html += '<td style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + results[i][fields[j].name] + '</td>';
              }
                 
          }
      }
     
  html += '</tr>';
  
  html += '</table>';

          // Send the HTML code to the client
          res.send(html);
      });
});

// Retrieve specific rows from the "sculptureview" table based on state value
  app.get('/sculptureview/:state', (req, res) => {
    const stateValue = req.params.state;
  
    connection.query(`SELECT * FROM viewsculpture1 WHERE state = '${stateValue}'`, (error, results, fields) => {
      if (error) throw error;
  
      // Create an HTML table to display the results
      let html = `<h1 style="text-align: center;">SCULPTURE  DETAIL (${stateValue})</h1><table style="border-collapse: collapse; width: 100%; max-width: 800px; margin: 0 auto; background: #f5b5f3 url(\'table-bg.jpg\') center center no-repeat; background-size: cover; border: 1px solid #ccc;">`;
  
      // Create the header row
      html += '<tr style="background-color: #b5cef5; color: #333;">';
      for (let i = 0; i < fields.length; i++) {
        html += '<th style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + fields[i].name + '</th>';
      }
      html += '</tr>';
  
      // Create a row for each result
      for (let i = 0; i < results.length; i++) {
        html += '<tr style="background-color: #fff; color: #333;">';
        for (let j = 0; j < fields.length; j++) {
              if (fields[j].name==='image') {
                  // If the current field is "image", get the image data and convert it to base64
                  const imageData = results[i][fields[j].name]; 
                  const imageBase64 = Buffer.from(imageData).toString('base64');
                  // Display the image in the table cell
                   html += `<td style="padding: 12px; text-align: left; border: 5px solid #ccc;"><img src="data:image/jpeg;base64,${imageBase64}" alt="image" height="200px" width="200px"/></td>`;
              }  else if (fields[j].name === 'state') {
                  // If the current field is "state", create a hyperlink to the next page
                  const stateValue = results[i][fields[j].name];
               html += `<td style="padding: 12px; text-align: left; border: 5px solid #ccc;"><a href="/sculptureview/${stateValue}">${stateValue}</a></td>`;
              } else {
              // If the current field is not "state", display the field value in the table cell
           html += '<td style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + results[i][fields[j].name] + '</td>';
          }
      }
        html += '</tr>';
          }
          
          html += '</table>';
      
          // Send the HTML code to the client
          res.send(html);
        });
      });

// part -5 final dropdown report generation for temple view for particular state

    app.get('/sculpturetemple', (req, res) => { 
  try { 
    // Your code here 
  } catch (err) { 
    if (res.headersSent) return; 
    // Your error handling code here 
    res.status(500).send('Internal server error'); 
  } 
connection.query('SELECT * FROM viewsculpture1', (error, results, fields) => {
      if (error) throw error;

      // Create an HTML table to display the results
      let html = '<h1 style="text-align: center;">SCULPTURE DETAILS</h1><table style="border-collapse: collapse; width: 100%; max-width: 800px; margin: 0 auto; background: #f5b5f3 url(\'table-bg.jpg\') center center no-repeat; background-size: cover; border: 1px solid #ccc;font:bolder">';
      // Create the header row
      html += '<tr style="background-color: #b5cef5; color: #333;">';
      for (let i = 0; i < fields.length; i++) {
          html += '<th style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + fields[i].name + '</th>';
       }
      html += '</tr>';
      // Create a row for each result
      for (let i = 0; i < results.length; i++) {
          html += '<tr style="background-color: #fff; color: #333;">';
          for (let j = 0; j < fields.length; j++) {
              if (fields[j].name==='image') {
                  // If the current field is "image", get the image data and convert it to base64
                  const imageData = results[i][fields[j].name]; 
                  const imageBase64 = Buffer.from(imageData).toString('base64');
                  // Display the image in the table cell
                   html += `<td style="padding: 12px; text-align: left; border: 5px solid #ccc;"><img src="data:image/jpeg;base64,${imageBase64}" alt="image" height="200px" width="200px"/></td>`;
              } else if (fields[j].name === 'state') {
                  // If the current field is "state", create a hyperlink to the next page
                  const stateValue = results[i][fields[j].name];
                  html += `<td style="padding: 12px; text-align: left; border: 5px solid #ccc;"><a href="/templeview/${stateValue}">${stateValue}</a></td>`;
              } else {
                  // If the current field is not "state", display the field value in the table cell
               html += '<td style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + results[i][fields[j].name] + '</td>';
              }
                 
          }
      }
     
  html += '</tr>';
  
  html += '</table>';

          // Send the HTML code to the client
          res.send(html);
      });
});

    // Retrieve specific rows from the "templeview" table based on state value
    app.get('/sculpturestate/temple', (req, res) => {
      connection.query('SELECT * FROM temple', function (error, results, fields) {
                  if (error) throw error;
          
                  // Create an HTML table to display the results
                  let html = '<h1 style="text-align: center;">TEMPLE DETAIL</h1><table style="border-collapse: collapse; width: 100%; max-width: 800px; margin: 0 auto; background: #f5b5f3 url(\'table-bg.jpg\') center center no-repeat; background-size: cover; border: 1px solid #ccc;">';
          
                  // Create the header row
                  html += '<tr style="background-color: #b5cef5; color: #333;">';
                  for (let i = 0; i < fields.length; i++) {
                      html += '<th style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + fields[i].name + '</th>';
                  }
                  html += '</tr>';
          
                  // Create a row for each result
                  for (let i = 0; i < results.length; i++) {
                      html += '<tr style="background-color: #fff; color: #333;">';
                      for (let j = 0; j < fields.length; j++) {
                          html += '<td style="padding: 12px; text-align: left; border: 5px solid #ccc;">' + results[i][fields[j].name] + '</td>';
                      }
                      html += '</tr>';
                  }
          
                  html += '</table>';
          
                  // Send the HTML code to the client
                  res.send(html);
              });
          });



    
  //set app port

app.listen(3000);


















































































