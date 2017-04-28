# NodeJS Command Line TODO
command-line todo list manager
# Add a Task
To add task, use `add "Task description"`
```
$ node todo.js add "Buy more juice"
$ node todo.js add "Go for a walk with the ferret"
$ node todo.js add "Time to finish picture"
```
# List your Tasks
Listing your tasks, use `todo.js`
```
$ node todo.js
[ ] 1. Buy more juice
[ ] 2. Go for a walk with the ferret
[ ] 3. Time to finish picture
```
# Complete a Task
After you're done with something, use `done ID`
```
$ node todo.js done 1
[X] 1. Buy more juice
[ ] 2. Go for a walk with the ferret
[ ] 3. Time to finish picture
```
# Deleting a Task
If you're wanna delete a task not completing it, use `delete ID`
```
$ node todo.js delete 1
[ ] 2. Go for a walk with the ferret
[ ] 3. Time to finish picture
```
# Archiving a Task
If you want to delete a complete task, it enters the archive, use `delete ID`
# Archive your Tasks
Use `archive` to see the archive of your completed tasks
# Deleting an archive
Use `delete archive` to delete the archive of your completed tasks
# An example todo stored in todos.json
```
[{
  "id": 2,
  "task": "Go for a walk with the ferret",
  "done": false,
  "archived": false
}]
  ```
