let fs = require('fs');
let todo = require('./todo.json');


let td = process.argv.slice(3);  //task description
let operation = process.argv.slice(2, 3);  //operation with task

function writeTasks(){
     try{
         fs.writeFileSync("./todo.json",'{ "tasks":' + JSON.stringify(td) + '}')
     } catch (err) {
         throw err;
         process.exit();
     }
 }
writeTasks(td)

/*let add = fs.writeFile("./todo.json",'{ "task":' + JSON.stringify(td) + '}', "utf-8", (err) => {
  if (err) throw err;
  console.log("file has been created")
})


let read = fs.readFile('./todo.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    readTasks = JSON.parse(data);
    console.log(readTasks);
    }
  });*/


/*  function addTask(text,duedate){
      var task = {name:text,date:duedate||""};
      td.push(task);
      writeTasks();
  }*/
