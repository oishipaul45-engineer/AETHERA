from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    String,
    Text,
    Float,
    DateTime,
    ForeignKey,
    CheckConstraint,
    UniqueConstraint,
)

from .database import Base


def utc_now():
    return datetime.now(timezone.utc)


class Planet(Base):
    __tablename__ = "planets"

    id = Column(String(100), primary_key=True)

    title = Column(String(100), nullable=False)
    category = Column(String(30), nullable=False)
    content = Column(Text, nullable=False, default="")

    x = Column(Float, nullable=False)
    y = Column(Float, nullable=False)
    z = Column(Float, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        default=utc_now,
        onupdate=utc_now,
        nullable=False,
    )


class PlanetConnection(Base):
    __tablename__ = "planet_connections"

    id = Column(String(100), primary_key=True)

    source_id = Column(
        String(100),
        ForeignKey("planets.id"),
        nullable=False,
    )

    target_id = Column(
        String(100),
        ForeignKey("planets.id"),
        nullable=False,
    )

    __table_args__ = (
        CheckConstraint(
            "source_id < target_id",
            name="ordered_connection_endpoints",
        ),
        UniqueConstraint(
            "source_id",
            "target_id",
            name="unique_planet_connection",
        ),
    )
