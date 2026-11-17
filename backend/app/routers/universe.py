from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Planet, PlanetConnection
from ..schemas import (
    UniverseSchema,
    UniverseResponse,
    MessageResponse,
)

router = APIRouter(prefix="/api", tags=["Universe"])


def build_universe(db: Session):
    planets = db.scalars(
        select(Planet).order_by(Planet.created_at, Planet.id)
    ).all()

    connections = db.scalars(
        select(PlanetConnection).order_by(
            PlanetConnection.id
        )
    ).all()

    return {
        "planets": [
            {
                "id": planet.id,
                "title": planet.title,
                "category": planet.category,
                "content": planet.content,
                "position": [
                    planet.x,
                    planet.y,
                    planet.z,
                ],
            }
            for planet in planets
        ],
        "connections": [
            {
                "id": connection.id,
                "sourceId": connection.source_id,
                "targetId": connection.target_id,
            }
            for connection in connections
        ],
    }


@router.get("/universe", response_model=UniverseResponse)
def get_universe(db: Session = Depends(get_db)):
    return build_universe(db)


@router.put("/universe", response_model=MessageResponse)
def save_universe(
    data: UniverseSchema,
    db: Session = Depends(get_db),
):
    planet_ids = [planet.id for planet in data.planets]

    if len(planet_ids) != len(set(planet_ids)):
        raise HTTPException(
            status_code=400,
            detail="Duplicate planet IDs are not allowed",
        )

    connection_ids = [
        connection.id for connection in data.connections
    ]

    if len(connection_ids) != len(set(connection_ids)):
        raise HTTPException(
            status_code=400,
            detail="Duplicate connection IDs are not allowed",
        )

    valid_ids = set(planet_ids)
    seen_pairs = set()

    for connection in data.connections:
        if (
            connection.sourceId not in valid_ids
            or connection.targetId not in valid_ids
        ):
            raise HTTPException(
                status_code=400,
                detail="Connection references a missing planet",
            )

        if connection.sourceId == connection.targetId:
            raise HTTPException(
                status_code=400,
                detail="A planet cannot connect to itself",
            )

        pair = tuple(
            sorted([connection.sourceId, connection.targetId])
        )

        if pair in seen_pairs:
            raise HTTPException(
                status_code=400,
                detail="Duplicate planet connection",
            )

        seen_pairs.add(pair)

    try:
        # Replace the complete universe in one transaction.
        # Flush deletions before inserting new records.
        db.query(PlanetConnection).delete(
            synchronize_session=False
        )
        db.query(Planet).delete(
            synchronize_session=False
        )
        db.flush()

        for planet in data.planets:
            db.add(
                Planet(
                    id=planet.id,
                    title=planet.title,
                    category=planet.category,
                    content=planet.content,
                    x=planet.position[0],
                    y=planet.position[1],
                    z=planet.position[2],
                )
            )

        db.flush()

        for connection in data.connections:
            source_id, target_id = sorted(
                [connection.sourceId, connection.targetId]
            )

            db.add(
                PlanetConnection(
                    id=connection.id,
                    source_id=source_id,
                    target_id=target_id,
                )
            )

        db.commit()

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to save universe",
        )

    return {"message": "Universe saved successfully"}
