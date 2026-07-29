#!/usr/bin/env python3
"""Diagnóstico seguro y de solo lectura para PostgreSQL/Railway."""

import json
from pathlib import Path
from statistics import mean
from time import perf_counter

import psycopg

from migrate_postgres import ROOT, database_url, load_env


def timed_select(cur, samples=5):
    durations = []
    for _ in range(samples):
        started_at = perf_counter()
        cur.execute("SELECT 1")
        cur.fetchone()
        durations.append((perf_counter() - started_at) * 1000)
    return {
        "samples": samples,
        "min_ms": round(min(durations), 1),
        "avg_ms": round(mean(durations), 1),
        "max_ms": round(max(durations), 1),
    }


def pending_migrations(applied):
    files = sorted(
        path.name
        for path in (Path(ROOT) / "migrations").glob("[0-9][0-9][0-9]_*.sql")
        if "checks" not in path.name
    )
    return [name for name in files if name not in applied]


def main():
    load_env()
    url = database_url()
    if not url:
        raise SystemExit("Falta DATABASE_URL o DATABASE_PUBLIC_URL.")

    started_at = perf_counter()
    with psycopg.connect(url, connect_timeout=5) as conn, conn.cursor() as cur:
        cur.execute("SET TRANSACTION READ ONLY")
        connect_ms = (perf_counter() - started_at) * 1000
        cur.execute("SELECT current_database(), current_setting('server_version')")
        database_name, server_version = cur.fetchone()
        cur.execute("SELECT name FROM schema_migrations ORDER BY name")
        applied = [row[0] for row in cur.fetchall()]
        cur.execute("""SELECT relname, n_live_tup
                       FROM pg_stat_user_tables
                       ORDER BY n_live_tup DESC, relname""")
        tables = [{"table": row[0], "estimated_rows": row[1]} for row in cur.fetchall()]
        cur.execute("""SELECT count(*) FILTER (WHERE state='active') active,
                              count(*) FILTER (WHERE state='active' AND wait_event IS NOT NULL) waiting,
                              count(*) FILTER (WHERE state='idle') idle,
                              count(*) total
                       FROM pg_stat_activity WHERE datname=current_database()""")
        active, waiting, idle, total = cur.fetchone()
        cur.execute("""SELECT relname, indexrelname, idx_scan
                       FROM pg_stat_user_indexes
                       ORDER BY idx_scan ASC, relname, indexrelname
                       LIMIT 30""")
        low_usage_indexes = [
            {"table": row[0], "index": row[1], "scans": row[2]}
            for row in cur.fetchall()
        ]
        result = {
            "ok": True,
            "database": database_name,
            "server_version": server_version,
            "connect_ms": round(connect_ms, 1),
            "round_trip": timed_select(cur),
            "connections": {"active": active, "waiting": waiting, "idle": idle, "total": total},
            "latest_migration": applied[-1] if applied else None,
            "pending_migrations": pending_migrations(set(applied)),
            "tables": tables,
            "lowest_usage_indexes": low_usage_indexes,
        }
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
