let R = require("ramda")
let dbFile = "./todo.json"
let FS = require("fs")

//parse init

let operation = process.argv[2]  //operation with task
let task = process.argv[3]  //task description

//commands

let commands = {}

commands.init = function () {
  FS.writeFileSync(dbFile, "[]")
}

commands.add = function (todo) {
  let todos = require(dbFile)
  FS.writeFileSync(dbFile, JSON.stringify(R.append(todo, todos), null, 2))
}

commands.delete = function (index) {
  let todos = require(dbFile)
  FS.writeFileSync(dbFile, R.remove(index, 1, todos));
}

commands.delete = function (index) {
  let todos = require(dbFile)
  let todos2 = R.remove(index, 1, todos)
  let str = JSON.stringify(todos2, null, 2)
  FS.writeFileSync(dbFile, str);
  console.log(str)
}
//command manager

switch (operation) {
  case "init":
    return commands.init()
  case "add":
    return commands.add({
      task,
      done: false,
      archived: false,
    })
    break;
  default:

}
