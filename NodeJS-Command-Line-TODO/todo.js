let R = require("ramda")
let dbFile = "./todo.json"
let FS = require("fs-extra")

//parse init

let operation = process.argv[2]  //operation with task
let task = process.argv[3]  //task description

//commands

let commands = {}

commands.init = function () {
  FS.writeFileSync(dbFile, "[]")
}

/*let writeFileX = R.curry((file, content) => {
  let str = typeof content == "string" ? content : JSON.stringify(content, null, 2)
  FS.outputFileSync(file, str, "utf-8")
  return content
})*/

commands.add = function (todo) {
  let todos = require(dbFile)
  FS.writeFileSync(dbFile, JSON.stringify(R.append(todo, todos), null, 2))
}

commands.delete = function (index) {
  let todos = require(dbFile)
  let todos1 = R.remove(index, 1, todos)
  let str = JSON.stringify(todos1, null, 2)
  FS.writeFileSync(dbFile, str);
  console.log(str)
}

commands.done = function (index) {
  let todos = require(dbFile)
  let todos2 = R.update(index, R.assoc("done", true, todos[index]), todos)
  let str1 = JSON.stringify(todos2, null, 2)
  FS.writeFileSync(dbFile, str1);
  console.log(str1)
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
  case "delete":
    return commands.delete(task)
  case "done":
    return commands.done(task)
    break;
  default:

}
