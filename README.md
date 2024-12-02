# Shipment Management

This project is a shipment management application that consists of a back-end server built with **Node.js** and **Express**, and a front-end built with **React** using **Vite**. The app allows users to manage shipments, upload files, and view shipment details.

## Prerequisites

Before you can run this project, make sure you have the following tools installed based on your platform:

### 1. **Node.js and npm**

This project uses **Node.js** and **npm** to manage dependencies and run the server.

#### Installation on **Windows/Mac/Linux**:

1. Go to the [Node.js website](https://nodejs.org/) and download the installer for your platform (Windows, macOS, or Linux).
2. Follow the installation instructions for your operating system.
3. Once installed, you can verify the versions of **Node.js** and **npm** by running the following commands in your terminal:

```bash
node -v
npm -v
```

### 2. **Mongo DB**

This project uses MongoDB as the database. You need to have MongoDB installed locally or use a cloud-based MongoDB service.

#### Installation on **Windows**:

1.	Download the MongoDB installer from the MongoDB Download Center.
2.	Follow the installation instructions for Windows on the MongoDB website.
3.	After installation, you can start the MongoDB server by running the following command in your terminal:

```bash
mongod
```

#### Installation on **macOs**:

1.	Install MongoDB using brew

```bash
brew tap mongodb/brew
brew install mongodb-community
```

2.	Start the MongoDB service:

```bash
brew services start mongodb/brew/mongodb-community
```

#### Installation on **Linux**:

1.	Install MongoDB using the package manager. For example, on Ubuntu:

```bash
sudo apt install -y mongodb
```

2.	Start the MongoDB service:

```bash
sudo systemctl start mongodb
```

## Running the project

Once you have Node.js and MongoDB installed, you can run both the back-end and front-end servers by following these steps:
1.	Clone the repository:

```bash
git clone https://github.com/djabiridrissou/shipment-management.git
cd shipment-management
```

2.	Install the dependencies for both the back-end and front-end:
•	For the back-end (Node.js/Express):

```bash
cd backend
npm i
```

•	For the front-end (React/Vite):

```bash
cd frontend
npm i
```

3. In the backend directory create a file named ".env" and paste the code below inside:
```bash
DB_URI = mongodb://127.0.0.1:27017/zovu
```

4. Enter the backend and frontend directories and start the servers:

```bash
npm run dev
```