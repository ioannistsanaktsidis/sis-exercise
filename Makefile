.PHONY: build up down down-remove attach bootstrap bash shell migrate migrations test
build:
	docker compose build

up:
	make build
	docker compose up

down:
	docker compose down

down-remove:
	docker compose down -v

attach:
	docker attach django_app

bootstrap:
	docker exec -it django_app python manage.py migrate
	docker exec -it django_app python manage.py loaddata sis_exercise/fixtures/literature.json
	docker exec -it django_app python manage.py loaddata sis_exercise/fixtures/users.json
	docker exec -it django_app python manage.py search_index --rebuild -f

bash:
	docker exec -it django_app bash

shell:
	docker exec -it django_app python manage.py shell

migrate:
	docker exec -it django_app python manage.py migrate

migrations:
	docker exec -it django_app python manage.py makemigrations

search-index-rebuild:
	docker exec -it django_app python manage.py search_index --rebuild

test:
	docker exec -it django_app python manage.py test
