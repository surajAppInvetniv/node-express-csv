const express = require("express");
const app = express();

// Require NPM modules for CSV
const csvParser = require("csv-parser");
const fs = require("fs");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

// Express Middleware to Fetching Data from Req.body()
app.use(express.json());

// Global Array which will added to the FILE
const userDetails = [];

// Defining Headers for CSV file.
const csvWriter = createCsvWriter({
  path: "./data/UserDetails.csv",
  header: [
    { id: "userId", title: "userId" },
    { id: "firstName", title: "firstName" },
    { id: "lastName", title: "lastName" },
    { id: "address", title: "address" },
    { id: "pincode", title: "pincode" },
    { id: "mobileNumber", title: "mobileNumber" }
  ]
});

// Post Data to appending data to CSV File.
app.post("/api/v1/users", (req, res) => {
  let body = {
    userId: userDetails.length + 1,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    address: req.body.address,
    pincode: req.body.pincode,
    mobileNumber: req.body.mobileNumber
  };
  userDetails.push(body);
  csvWriter
    .writeRecords(userDetails)
    .then(() => {
      res.status(200).json({
        statusCode: 200,
        message: `Updated Successfully `
      });
    })
    .catch(err => {
      res.status(400).json({
        statusCode: 400,
        message: err
      });
    });
});

// GET Data from CSV File.
app.get("/api/v1/users", (req, res) => {
  let tempData = [];
  fs.createReadStream("./data/UserDetails.csv")
    .pipe(csvParser())
    .on("data", row => {
      tempData.push(row);
    })
    .on("end", () => {
      console.log(tempData);
      res.status(200).json({
        statusCode: 200,
        message: `Updated Successfully `,
        data: tempData
      });
    });
});

// Server Config
const PORT_NUMBER = 8000;
app.listen(PORT_NUMBER, () => {
  console.log(`Server is running on ${PORT_NUMBER}`);
});
