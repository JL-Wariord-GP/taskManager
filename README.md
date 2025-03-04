```markdown
# Task Management System

This project is a REST API for task management that implements authentication and authorization using Node.js, Express, TypeScript, and MongoDB. It was developed using a TDD (Test-Driven Development) approach to ensure quality, robustness, and maintainability of the code.

---

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Architecture and Design Decisions](#architecture-and-design-decisions)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
  - [Cloning the Repository](#cloning-the-repository)
  - [Installing Dependencies](#installing-dependencies)
  - [Environment Configuration (.env)](#environment-configuration-env)
    - [General Configuration](#general-configuration)
    - [SMTP Configuration](#smtp-configuration)
- [Running the Project](#running-the-project)
  - [Production Mode](#production-mode)
  - [Development Mode](#development-mode)
- [Running Tests](#running-tests)
- [API Documentation](#api-documentation)
  - [Swagger](#swagger)
  - [Postman](#postman)
- [Prompts and Automation](#prompts-and-automation)

---

## Project Description

The **Task Management System** is a REST API designed to efficiently manage user tasks. It allows users to create, update, delete, and retrieve tasks while incorporating authentication and authorization mechanisms based on JWT. The adoption of TDD ensures that every feature is validated through unit and integration tests, providing a high level of reliability and facilitating early error detection.

---

## Features

- **Task Management:** Create, read, update, and delete tasks.
- **Authentication and Authorization:** Implements JWT for secure API access control.
- **Data Validation:** Utilizes `express-validator` and `joi` to ensure data integrity.
- **Automated Documentation:** Integrates Swagger to document and test endpoints interactively.
- **Automated Testing:** Tests are implemented using Jest and Supertest following the TDD methodology.
- **Email Support:** Configures and sends emails using Nodemailer.
- **SMTP Configuration:** Enables integration and customization of the email service.

---

## Architecture and Design Decisions

The project was developed following these principles:

- **TDD (Test-Driven Development):** Tests were written before implementing the functionalities, allowing each part of the system to be validated early and continuously.
- **Modularity:** Responsibilities are divided into modules and layers to facilitate scalability and maintenance.
- **Use of TypeScript:** Provides static typing, increasing code safety and robustness during development.
- **Continuous Documentation:** Integration with Swagger ensures that the API documentation remains updated and accessible to all developers.
- **Security and Validation:** Solid data validation techniques and authentication mechanisms are implemented to protect data integrity.
- **SMTP Configuration:** Email sending configuration is included to enable account verification and validation functionalities.

This architecture was adopted to create a robust, scalable, and easily maintainable system that fosters collaboration and long-term project evolution.

---

## Technologies Used

- **Node.js & Express:** Execution engine and primary framework for building the API.
- **TypeScript:** A language that adds static typing to development.
- **MongoDB & Mongoose:** NoSQL database used for data persistence.
- **JWT:** For secure authentication and authorization.
- **Swagger:** Tool for generating and interactively viewing API documentation.
- **Jest & Supertest:** Frameworks for implementing unit and integration tests.
- **Nodemailer:** Library for sending emails.
- **Other Dependencies:**
  - `bcrypt` / `bcryptjs`: Password encryption.
  - `cors`: Handling CORS policies.
  - `dotenv`: Environment variable management.
  - `express-validator` and `joi`: Data input validation.
  - `uuid`: Unique identifier generation.

---

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (version 14 or higher)
- **npm** or **yarn**
- **MongoDB:** You can use a local or remote instance.
- **Git:** For cloning the repository.

---

## Installation and Setup

### Cloning the Repository

Clone the repository to your local machine using Git:

```bash
git clone https://github.com/your-username/your-repository.git
cd your-repository
```

### Installing Dependencies

Install the project dependencies using npm or yarn:

```bash
npm install
# or
yarn install
```

### Environment Configuration (.env)

Create a `.env` file in the root of the project and configure the necessary environment variables. Below is the required configuration:

#### General Configuration

```env
# Port on which the application will run
PORT=3000

# MongoDB connection URI (can be a local or remote instance)
MONGODB_URI=mongodb://localhost:27017/taskmanager

# Secret key for generating and verifying JWT
JWT_SECRET=your_secret_key

# Execution environment (development, production, etc.)
NODE_ENV=development
```

#### SMTP Configuration

For sending emails, you need to configure the following variables in your `.env` file. These variables will be used by Nodemailer to establish the SMTP connection and send emails:

```env
#! Email Configuration
EMAIL_HOST=your_smtp_server          # Example: smtp.gmail.com
EMAIL_PORT=587                       # Example: 587 for TLS, 465 for SSL
EMAIL_USER=your_email@domain.com     # Your email address configured in GMAIL / API - GMAIL
EMAIL_PASS=your_password             # Password or application token
EMAIL_FROM_NAME="Sender Name"        # Name that will appear as the sender in the emails
```

> **Note:** Ensure you use valid and secure values for each variable. For providers like Gmail, you may need to generate an application password or adjust your account's security settings.

---

## Running the Project

### Production Mode

To run the server in production mode:

```bash
npm run start
```

### Development Mode

During development, it is recommended to use the "dev" mode to enable automatic reloading of the application:

```bash
npm run dev
```

The server will start and listen on the port defined in the `.env` file.

---

## Running Tests

The project includes automated tests implemented with Jest and Supertest following the TDD philosophy. To run the tests, use the following command:

```bash
npm run test
```

It is recommended to run the tests continuously during development to ensure every change meets the established requirements.

---

## API Documentation

### Swagger

The API includes interactive documentation generated with Swagger. Once the server is running, access the following URL in your browser to view and test the endpoints:

```
http://localhost:3000/api-docs
```

Swagger allows you to explore the API intuitively, making it easy to understand the routes, parameters, and responses.

### Postman

A Postman collection has also been created to test the API. This collection includes sample requests and test scenarios that reflect the main use cases of the system. You can import the `TaskManager.postman_collection.json` file into Postman to quickly start interacting with the API.

---

## Prompts and Automation

During the project development, automated prompts and scripts were used to:

- Generate code skeletons following best practices.
- Quickly configure new endpoints and unit tests.
- Facilitate the integration of Swagger and real-time documentation generation.
- Automate recurring tasks that optimize workflow and ensure high-quality standards.

---

This documentation provides a comprehensive and structured guide to clone, configure, run, and test the project. It emphasizes the TDD architecture, data validation, Swagger integration, Postman usage, and SMTP configuration for sending emails, ensuring excellent understanding and implementation of the system.