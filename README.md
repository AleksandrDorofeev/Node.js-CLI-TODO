# Node.js-CLI-TODO
command-line todo list manager
# Add a Task
To add task, use `add "Task description"`
```
$ node todo.js add "Buy more juice"
$ node todo.js add "Go for a walk with the ferret"
$ node todo.js add "Time to finish picture"
```
# List your tasks
Listing your tasks, use `todo.js`
```
$ node todo.js
[ ] 1. Buy more juice
[ ] 2. Go for a walk with the ferret
[ ] 3. Time to finish picture
```
# Finish a Task
After you're done with something, use `done ID`
```
$ node todo.js done 1
$ node todo.js
[X] 1. Buy more juice
[ ] 2. Go for a walk with the ferret
[ ] 3. Time to finish picture
```
