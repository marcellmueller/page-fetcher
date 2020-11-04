const request = require("request");
const requestUrl = process.argv.slice(2);
const fs = require("fs");
const readline = require("readline");
let responseContent = "";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const writeFile = (responseContent, body) => {
  fs.writeFile("responseContent.txt", (responseContent += body), function (
    err
  ) {
    if (err) throw err;
    console.log("Wrote response body to responseContent.txt!");
  });
  rl.close();
};

//make sure url is string and longer than 3 chars
if (requestUrl[0].length < 3) {
  console.log("Try a proper URL in the command line!");
  process.exit();
} else if (requestUrl.length > 1) {
  console.log("Please enter only one URL at a time.");
  process.exit();
}
request(requestUrl[0], (error, response, body) => {
  console.log("error:", error); // Print the error if one occurred
  console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received

  //check if responseContent.txt exists
  if (fs.existsSync("responseContent.txt")) {
    rl.question("File exists. Press y to overwrite, n to exit\n", function (y) {
      if (y === "y") {
        writeFile(responseContent, body);
      } else {
        console.log("File not overwritten!");
        rl.close();
      }
    });
  } else {
    writeFile(responseContent, body);
    rl.close();
  }
});
