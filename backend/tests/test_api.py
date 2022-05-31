import pathlib
from pydantic import Json
import pytest_asyncio
import httpx
import pytest
import json


@pytest.fixture()
def cwd():
    """Gets cwd from test config"""

    with open("backend/tests/testConfig.json", "r") as config:
        config_data = (
            json.loads(config.read())
            .get("globals", {})
            .get("working_directory", None)
        )

    if not config_data:
        raise ValueError(
            "Test config [working_directory] hasn't been supplied"
        )

    return config_data


@pytest_asyncio.fixture()
async def client():
    """Async client dependency injection for tests"""
    async with httpx.AsyncClient(base_url="http://localhost:8080/") as test_client:
        yield test_client


@pytest.mark.asyncio
async def test_app_index(client: httpx.AsyncClient):
    """Testing app index"""
    response = await client.get("/")
    print(response.text)
    assert response.text == '"Hello World"', "Unable to get correct output from index, something is terribly wrong!"


@pytest.mark.asyncio
async def test_app_sign_up(client: httpx.AsyncClient):
    """Testing sign up implementation"""

    user = {
        "name": "Johnathon",
        "password": "SECRET_PASS123"
    }

    response = await client.post("/createUser", json=user)

    assert response.status_code == 200, "server response wasnt good, should be 200 when creating a user with username and password"

    data = response.json()

    assert data == {
        'id': 1,
        'name': user.get('name')
    }


@pytest.mark.asyncio
async def test_app_log_in(client: httpx.AsyncClient):
    """Testing login endpoint for api"""

    user = {
        "name": "Johnathon",
        "password": "SECRET_PASS123"
    }

    response = await client.post("/loginUser", json=user)

    assert response.status_code == 200, "Login failed, code wasnt 200 should have passed"

    data = response.json()

    assert data == {
        "name": user.get("name"),
        "id": 1,
    }, "Users data has malformed"


@pytest.mark.asyncio
async def test_user_root_creation(client: httpx.AsyncClient, cwd: str):
    """Testing root creation endpoint"""

    user_id = 1

    response = await client.post("/createUserRoot", json={"user_id": user_id})

    assert response.status_code == 200, "createUserRoot didnt return with status 200!"

    data = response.json()

    assert data == {
        "root_path": str(pathlib.Path(cwd) / "backend" / "root" / str(user_id))
    }
