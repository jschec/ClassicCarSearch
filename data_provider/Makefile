
.PHONY: format
format:
	python -m black .
	python -m isort .

.PHONY: autotempest
autotempest:
	python autotempest/main.py

.PHONY: up
up:
	docker-compose -f dockerized/docker-compose.yaml up --build

.PHONY: down
down:
	docker-compose -f dockerized/docker-compose.yaml down
