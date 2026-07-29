#!/usr/bin/env python3
"""Aplica los SQL de migrations/ una vez y registra cada versión en PostgreSQL."""
import os
from pathlib import Path
from time import perf_counter
from urllib.parse import quote, urlunparse

import psycopg

ROOT = Path(__file__).resolve().parents[1]


def is_railway():
    return any(
        os.environ.get(name)
        for name in (
            "RAILWAY_ENVIRONMENT",
            "RAILWAY_ENVIRONMENT_ID",
            "RAILWAY_PROJECT_ID",
            "RAILWAY_SERVICE_ID",
            "RAILWAY_DEPLOYMENT_ID",
            "RAILWAY_REPLICA_ID",
        )
    )


def load_env():
    path = ROOT / ".env"
    if not path.exists():
        return
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if line and not line.startswith("#") and "=" in line:
            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def database_url():
    """Usa el proxy TCP público cuando se ejecuta fuera de Railway."""
    private_url = os.environ.get("DATABASE_URL")
    public_url = os.environ.get("DATABASE_PUBLIC_URL")
    if is_railway():
        return private_url

    tcp_host = os.environ.get("RAILWAY_TCP_PROXY_DOMAIN")
    tcp_port = os.environ.get("RAILWAY_TCP_PROXY_PORT")
    user = os.environ.get("PGUSER")
    password = os.environ.get("RAILWAY_TCP_PROXY_PASSWORD") or os.environ.get("PGPASSWORD")
    database = os.environ.get("PGDATABASE")
    if not is_railway() and all((tcp_host, tcp_port, user, password, database)):
        return urlunparse((
            "postgresql",
            "{}:{}@{}:{}".format(quote(user, safe=""), quote(password, safe=""), tcp_host, tcp_port),
            "/" + quote(database, safe=""),
            "",
            "sslmode=require",
            "",
        ))
    return public_url or private_url


def main():
    load_env()
    url = database_url()
    if not url:
        raise SystemExit("Falta DATABASE_URL o DATABASE_PUBLIC_URL.")
    files = sorted((ROOT / "migrations").glob("[0-9][0-9][0-9]_*.sql"))
    # 002 es sólo diagnóstico y no debe registrarse como cambio de esquema.
    files = [path for path in files if "checks" not in path.name]
    with psycopg.connect(url) as conn, conn.cursor() as cur:
        # Evita que dos réplicas de Railway apliquen el mismo archivo al mismo
        # tiempo durante un rolling deploy.
        cur.execute("SELECT pg_advisory_lock(hashtext('uzumaki-schema-migrations'))")
        cur.execute("CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())")
        cur.execute("SELECT name FROM schema_migrations")
        done = {row[0] for row in cur.fetchall()}
        for path in files:
            if path.name in done:
                print(f"Ya aplicada: {path.name}")
                continue
            started_at = perf_counter()
            print(f"Aplicando: {path.name}", flush=True)
            cur.execute(path.read_text(encoding="utf-8"))
            cur.execute("INSERT INTO schema_migrations (name) VALUES (%s)", (path.name,))
            print(f"Aplicada: {path.name} ({(perf_counter() - started_at) * 1000:.1f} ms)", flush=True)
        conn.commit()
        cur.execute("SELECT pg_advisory_unlock(hashtext('uzumaki-schema-migrations'))")
    print("Migraciones completadas.")


if __name__ == "__main__":
    main()
