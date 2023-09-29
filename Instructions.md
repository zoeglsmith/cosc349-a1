# Project Name README

Welcome to the Project Name project. This README provides instructions on how to set up and run the project using Docker and Docker Compose.

## Table of Contents

- [Project Name README](#project-name-readme)
  - [Table of Contents](#table-of-contents)
    - [Step 1: Clone the Project Repository](#step-1-clone-the-project-repository)
    - [Step 2: Navigate to the Project Directory](#step-2-navigate-to-the-project-directory)
    - [Step 3: Install dependencies](#step-3-install-dependencies)
    - [Step 4: Build and Start the Docker Containers](#step-4-build-and-start-the-docker-containers)
    - [Step 5: Access the Application](#step-5-access-the-application)
    - [Step 6: Manage the Docker Containers](#step-6-manage-the-docker-containers)
  - [Step 7: Troubleshooting](#step-7-troubleshooting)
  - [Step 8: Cleaning Up](#step-8-cleaning-up)

---

### Step 1: Clone the Project Repository

1. Open a terminal or command prompt.

2. Navigate to the directory where you want to clone the project.

3. Run the following command to clone the project repository:

   `git clone https://github.com/zoeglsmith/cosc349-a1.git``


### Step 2: Navigate to the Project Directory

1. Change your current directory to the project directory:

`cd cosc349-a1``

### Step 3: Install dependencies

1. Read the software componenets in the other readMe.md to see what version of dependencies I used
2. Type `npm install` in these directories
- cosc-349-a1(root)
- cd frontend
- cd ../backend

### Step 4: Build and Start the Docker Containers
1. Run the following command to build and start the Docker containers defined in your docker-compose.yml file: `docker-compose up -d-build``
   (This command will start the containers in build and detatched mode, meaning they will run in the background.)

### Step 5: Access the Application
1. Go into Docker Desktop and click the containers tab
2. Click on the nginx URL in the ngnix container to opent he web application


### Step 6: Manage the Docker Containers
You can manage the Docker containers using various Docker and Docker Compose commands. For example: 
- To view running containers: docker ps
- To stop the containers: docker-compose down
- To rebuild the containers after making changes: docker-compose up --build

## Step 7: Troubleshooting

If you encounter any issues during the setup or deployment of your project, refer to the Docker and Docker Compose documentation for troubleshooting guidance. Additionally, check the logs of your containers for error messages.

## Step 8: Cleaning Up

1. To stop and remove all containers, networks, and volumes defined in your docker-compose.yml file, run: `docker-compose down -v``