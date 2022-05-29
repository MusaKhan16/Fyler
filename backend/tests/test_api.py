from server import app
import pytest_asyncio
import httpx
import pytest


@pytest_asyncio.fixture()
async def client():
    async with httpx.AsyncClient(app=app, base_url="http://test") as test_client:
        yield test_client


@pytest.mark.asyncio
async def test_app_index(client: httpx.AsyncClient):
    response = await client.get("/")
    assert response.text == "'Hello world'"
