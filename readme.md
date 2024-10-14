# Assignment: INSPIREHEP Search & Summarization Web App

## Setup Instructions

### Backend (Django)
To run the backend, you can execute:
```bash
    make up
    make bootstrap
    # visit localhost:8000/api/search
```
This will start the Django app and use the default literature fixtures.

Alternatively, you can also run:
```bash
    make up
    make bootstrap-full
    # visit localhost:8000/api/search
```
This will generate a larger list of literature fixtures to test the UI more easily.

If you want to add fixtures using the Celery task, you can run it manually. The task will harvest the INSPIREHEP REST API and ingest the required data.
To run the Celery task manually please visit this url http://localhost:8000/trigger-task/

The Celery task responsible for harvesting INSPIREHEP REST API is running every day at midnight.

To run the tests, you can execute:
```bash
    make test
```
For simplicity, this requires the Django app to be running.

### Frontend (React)
The frontend was built using Create React App with TypeScript. It also uses Ant Design.

To run the frontend:
```bash
    cd ui/
    npm i
    npm start
    # visit localhost:3000
```

To run the UI tests, you can execute:
```bash
    cd ui/
    npm run test
```

### Task description
For the purpose of the exercise, the created task assumes that the project is using Datadog for monitoring.

You can check the created issue here: https://github.com/ioannistsanaktsidis/sis-exercise/issues/7

## Notes

Due to the lack of credentials and quota, the OpenAI summarization was mocked as per the instructions.

## Prerequisites

- Node(>=v18.19.0). Application was developed using version v.18.19.0
- Docker
- Docker-compose

## Videos & Screenshots
### Celery task manual trigger
![trigger-task](https://github.com/user-attachments/assets/4e1ca315-4b78-4036-8cd7-6736184d5dd2)

### Celery beat
<img width="1723" alt="Screenshot 2024-10-14 at 08 26 15" src="https://github.com/user-attachments/assets/03028c87-17e3-4d63-9ad7-55cce6475126">


### Search UI
![search](https://github.com/user-attachments/assets/4d4bb2c9-b4d3-4f3a-be8c-2704c3c8012d)


### API Endpoint
![Screenshot 2024-10-13 at 17 27 20](https://github.com/user-attachments/assets/b3c3cb6b-7730-4a5b-9a4d-4c999b041e09)
