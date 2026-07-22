FROM python:3.13-slim

WORKDIR /app

COPY . /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=53123 \
    HOST=0.0.0.0 \
    DATA_DIR=/app/data

EXPOSE 53123

CMD ["python", "server.py"]
