FROM python:3.11-alpine

WORKDIR /app

COPY kanban_backend/requirements.txt .

RUN pip install --upgrade pip && pip install -r requirements.txt --no-cache-dir

COPY kanban_backend .

# Запускаем сервер
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]