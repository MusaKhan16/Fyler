import server.utils.storage_manager as storage_manager
import shutil
import pytest

from pathlib import Path


ROOT_DIR = Path(__file__).parent / "root"
DIR_NAME = "john"


@pytest.fixture
def manager():
    """Creates a user manager"""

    yield storage_manager.UserManager.create_manager(ROOT_DIR)

    shutil.rmtree(ROOT_DIR)


@pytest.mark.asyncio
async def test_manager_create_user(manager: storage_manager.UserManager):
    """tests the creation of a user"""

    directory = await manager.create_user_root(DIR_NAME)

    assert directory == storage_manager.UserFolder(
        ROOT_DIR / DIR_NAME
    ), f"The equivalent of the directory should be UserFolder(ROOT_DIR / {DIR_NAME})"

    assert (
        str(directory.root.absolute()) in manager.root_folders
    ), "john should be inside of the root directory that stores all users"


@pytest.mark.asyncio
async def test_manager_get_user(manager: storage_manager.UserManager):
    """Testing simple get interface of the user"""

    await manager.create_user_root(DIR_NAME)

    user = await manager.get_user_root(DIR_NAME)

    assert user, "User doesnt exist"

    assert user == (
        expected_object := storage_manager.UserFolder(ROOT_DIR / DIR_NAME)
    ), f"User object had changed, expected path: {expected_object.root}"


@pytest.mark.asyncio
async def test_user_folder_write_file(manager: storage_manager.UserManager):
    """Testing writing to a file for a user"""

    filename, file_data = "hello.txt", bytearray(
        [104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]
    )

    user_folder = await manager.create_user_root(DIR_NAME)

    await user_folder.write_file(filename, file_data)

    assert (
        len(user_folder.list_dir()) == 1
    ), "More than one file exists in the diretory eventhough one file was made"

    assert (
        user_folder.root / filename
    ).absolute() in user_folder.list_dir(), "The file is not in the expected directory"

    with open(user_folder.root / filename, "rb") as file:
        assert "".join(map(chr, file.read())) == "hello world", "Data is malformed"


@pytest.mark.asyncio
async def test_user_folder_remove_file(manager: storage_manager.UserManager):
    """Tests the removal of a file"""
    filename, file_data = "hello.txt", bytearray(
        [104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]
    )

    user_root = await manager.create_user_root(DIR_NAME)

    await user_root.write_file(filename, file_data)

    assert len(user_root.list_dir()) == 1, "File doesnt exist"

    await user_root.remove_file(filename)

    assert len(user_root.list_dir()) == 0, "File didnt get deleted"
