#!/bin/sh
MONGO_HOST=db
MONGO_PORT=27017
MONGO_DB=todoapp
MONGO_USER=admin
MONGO_PASS=6AVA9RtZD9F3gfTv
# Wait for MongoDB to be ready
until nc -z -v -w30 $MONGO_HOST $MONGO_PORT
do
  echo "Waiting for MongoDB to start..."
  sleep 5
done



# # Preload test data into MongoDB
# $MONGO_HOST:$MONGO_PORT/admin -u $MONGO_USER -p $MONGO_PASS <<EOF
# use $MONGO_DB
# EOF

# Preload test data into MongoDB
 "mongodb+srv://admin:6AVA9RtZD9F3gfTv@cluster0.myynpss.mongodb.net/?retryWrites=true&w=majority" <<EOF
db.todos.insert({ text: "Do shopping" })
db.todos.insert({ text: "Make Bread" })
EOF

# Start the backend server
node server.js
