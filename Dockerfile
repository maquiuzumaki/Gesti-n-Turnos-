FROM python:3.13-slim

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    HOST=0.0.0.0 \
    DATA_DIR=/app/data

EXPOSE 8080

# Ejecuta las migraciones antes de iniciar el servidor
RUN mkdir -p /app/data

CMD ["sh", "-c", "python scripts/migrate_postgres.py && python server.py"]

