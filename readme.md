# Assignment: INSPIREHEP Search & Summarization Web App

## Setup Instructions

### Backend (Django)
To run the backend, you can execute:
```bash
    make up
    make bootstrap
    # visit localhost:8000
```
This will start the Django app and use the default literature fixtures.

You can also run
```bash
    make up
    make bootstrap-full
    # visit localhost:8000
```
This will generate a larger list of literature fixtures to test the UI more easily.

Alternatively, you can run the Celery task manually, which will harvest the INSPIREHEP REST API and ingest the required data.
To run the Celery task manually please visit this url http://localhost:8000/trigger-task/

The Celery task responsible for harvesting INSPIREHEP REST API is running everyday at midnight.

### Frontend (React)
In order to run the frontend
```bash
    cd ui/
    npm i
    npm start
    # visit localhost:3000
```


## Notes

Due to the lack of credentials and quota, the OpenAI summarization was mocked as per the instructions.

## Prerequisites

- Node(>=v18.19.0). Application was developed using version v.18.19.0
- Docker
- Docker-compose

## Videos
### Celery task manual trigger 
![trigger-task](https://github.com/user-attachments/assets/4e1ca315-4b78-4036-8cd7-6736184d5dd2)


### Search 
![search](https://github.com/user-attachments/assets/4d4bb2c9-b4d3-4f3a-be8c-2704c3c8012d)

