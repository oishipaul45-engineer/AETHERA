from typing import Literal, Annotated

from pydantic import BaseModel, Field, ConfigDict

Category = Literal[
    "Ideas",
    "Thoughts",
    "Notes",
    "Projects",
    "Goals",
]

Coordinate = Annotated[
    float,
    Field(allow_inf_nan=False),
]

Position = tuple[Coordinate, Coordinate, Coordinate]


class PlanetSchema(BaseModel):
    id: str = Field(min_length=1, max_length=100)
    title: str = Field(max_length=100)
    category: Category
    content: str
    position: Position


class ConnectionSchema(BaseModel):
    id: str = Field(min_length=1, max_length=100)
    sourceId: str
    targetId: str


class UniverseSchema(BaseModel):
    planets: list[PlanetSchema]
    connections: list[ConnectionSchema]


class HealthResponse(BaseModel):
    status: str
    application: str
    database: str


class MessageResponse(BaseModel):
    message: str


class UniverseResponse(UniverseSchema):
    model_config = ConfigDict(from_attributes=True)
