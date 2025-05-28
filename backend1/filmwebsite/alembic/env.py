from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
import os
import sys

# Menambahkan path ke folder utama agar bisa impor modul models
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Impor Base dan model-model agar metadata terdeteksi Alembic
from models import mymodel  # pastikan ini sesuai struktur kamu, misal: models.film
from models.mymodel import Base  # atau models.meta, tergantung kamu taruh Base di mana

# Alembic config
config = context.config

# Logging config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Metadata untuk autogenerate
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
