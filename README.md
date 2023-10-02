# Running the To-Do List Application

*By Zoe Smith - 2nd October 2023*

This documentation provides step-by-step instructions for new developers to set up and run the To-Do List application on their local development environment.

## Prerequisites

Before you begin, ensure you have the following software installed on your system:

- **Node.js**: Download and install Node.js from the official website. Ensure you have at least version 14.17.0 installed.

- **MySQL Database**: version 15
## Application URLs

- **Frontend**: [To-Do App](http://cosc349-a1-frontend.s3-website-us-east-1.amazonaws.com)
- **Backend SSH**: `ssh -i cosc349.pem ubuntu@3.211.24.87`

## Git access

To clone the source code of the frontend and backend please perform this command;

``
git clone https://github.com/zoeglsmith/cosc349-a1.git
``

## Software Components and Downloads

The application is built using the following software components:

### Frontend

- **React Framework**
  - **Source:** [React Official Website](https://reactjs.org/)
  - **Version:** 18.2.0

### Backend

- **Node.js**
  - **Source:** [Node.js Official Website](https://nodejs.org/)
  - **Version:** 14.17.0
- **Express.js**
  - **Source:** [Express.js Official Website](https://expressjs.com/)
  - **Version:** 4.18.2

### Database (MySQL)

- **MySQL Database**
  - **Source:** Provided as part of the AWS RDS (Amazon Relational Database Service)
  - **Credentials:**
    - **Host:** `todo1.cidtudnu7k64.us-east-1.rds.amazonaws.com`
    - **User:** `admin`
    - **Password:** `admin123`
    - **Database:** `todo1`

## Running the Application

### Frontend

To use the To-Do application frontend, visit the provided [URL](http://cosc349-a1-frontend.s3-website-us-east-1.amazonaws.com). You can create, view, edit, and delete tasks through the user-friendly interface.

### Backend

The backend of our application is powered by Node.js and Express.js. To run the backend, you need to access the AWS instance using SSH:

```bash
ssh -i cosc349.pem ubuntu@3.211.24.87
````
Once Logged in, perform this command

``````
cd backend
npm install
node server.js
``````

To access the MYSQL database RDS instance via terminal perform this command:

````
mysql -u admin -p -h todo1.cidtudnu7k64.us-east-1.rds.amazonaws.com -P 3306

````

Follwing, enter the database password which is provided above

To access relvent database perform this command:
````
Use todos1
``

This will give you access to the application database where the users data is stored, you can perform any needd database tasks from herex