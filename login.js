const mysql=require ("mysql");
const express=require("express");
const bodyParser =require("body-parser");
const encoder = bodyParser.urlencoded();
const app=express();
const ejs = require('ejs');



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
app.post("/login.html",encoder,function(req,res){
    var username = req.body.username;
    var password = req.body.password;


    connection.query("select * from loginuser where user_name =? and user_pass =?",[username,password],function(error,results,fields){
        console.log("select * from loginuser where user_name ="+ username+ "and user_pass ="+ password);

        if(results.length > 0){
            res.redirect("/userhome");
        }else{
            res.redirect("/homewithlogindropdown");

        }
        res.end();
    });
});


  // Set up the search route
app.get('/search', (request, response) => {
  // Get the search query from the URL parameters
  const searchTerm = request.query.q;

  // Create the SQL query to search the database
  const query = `SELECT * FROM viewsculpture1 WHERE keyword LIKE '%${searchTerm}%'`;
  // Execute the query
  connection.query(query, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      // Render the search results page and pass in the results
      response.render('search', { results });
    }
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
app.post("/templelogin.html",encoder,function(req,res){
    var templeid = req.body.templeid;
    var keyword = req.body.password;

    connection.query("select * from sculpture where templeid =? and keyword =?",[templeid,keyword],function(error,results,fields){
        

        if(results.length > 0){
            res.redirect("/home");
        }else{
            res.redirect("/homewithlogindropdown");

        }
        res.end();
    })
})

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

app.get("/viewsculpture",function(req,res){
              
  connection.query('SELECT * FROM sculpture', function (error, results, fields) {
    if (error) throw error;

    // Create an HTML table to display the results
    let html = '<h1 style="text-align: center;">SCULPTURE TABLE</h1><table style="border-collapse: collapse; width: 100%; max-width: 800px; margin: 0 auto; background: #f5b5f3 url(\'table-bg.jpg\') center center no-repeat; background-size: cover; border: 1px solid #ccc;">';

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

// view material

app.get("/viewmaterial",function(req,res){
              
  connection.query('SELECT * FROM material', function (error, results, fields) {
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
        <input type="number" id="SCULPTURE_ID" name="SCULPTURE_ID" required><br>
    
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
            

            //res.sendFile(__dirname + "/getsculpture.html")
        
        });
app.post("/getsculpture.html",encoder,function(req,res){
         const { SCULPTURE_ID,TEMPLEID,MATERIAL_ID,IMAGEURL,DESCRYPTION,KEYWORD,SCULPTURE_NAME } = req.body;
            const sql = 'INSERT INTO sculpture (sculptureid,templeid,materialid,image,description,keyword,sculpturename) VALUES (?,?, ?, ?,?,?,?)';
              
            const values = [SCULPTURE_ID,TEMPLEID,MATERIAL_ID,IMAGEURL,DESCRYPTION,KEYWORD,SCULPTURE_NAME];
              
            connection.query(sql, values, (err, result) => {
            if (err) {
              throw err;
             }
             console.log(`Message from ${SCULPTURE_ID} (${SCULPTURE_NAME}) saved to database...`);
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
   
    
    
//set app port

app.listen(8000);

