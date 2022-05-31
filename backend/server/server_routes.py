from server.utils.storage_manager import UserManager
from fastapi import Depends, File, Form, Request, UploadFile
from fastapi.responses import JSONResponse, FileResponse
from server.models import User
from fastapi.routing import APIRouter
from hashlib import sha256

import asyncio
import aiosqlite
import pathlib
import logging

server_router = APIRouter()

logger = logging.getLogger(__name__)

root_manager = UserManager.create_manager(
    (pathlib.Path(__file__).parent / ".." / "root").resolve()
)


def manager():
    """
    Dependency Injecting function to pass UserManager objects to endpoints

    Yields
    ______
    UserManager
        The object that will manager users folders and perform validation, etc.
    """

    yield root_manager


@server_router.post("/createUser")
async def create_user(user: User):
    """
    create_user endpoint registers a new user to the application

    Parameters
    ----------
    user : User
        The user to be created and saved in the database

    Returns
    -------
    JSONResponse
       If the user already exists
    dict
        The user if sucessfully created
    """

    logger.info("Endpoint createUser is triggered CREATING USER")

    try:
        created_user = await user.create_user()
    except aiosqlite.IntegrityError:
        logger.error("Creation of user failed, person already exists")
        return JSONResponse({"message": "This person already exists!"}, status_code=409)

    logger.debug("User succesfully created")
    logger.info(f"id: {created_user.id} name: {created_user.name}")

    return {
        "id": created_user.id,
        "name": created_user.name,
    }


@server_router.post("/createUserRoot")
async def create_user_root(
    request: Request, user_manager: UserManager = Depends(manager)
):
    """
    Endpoint that creates a user root folder where all files are stored

    Parameters
    ----------
    request : Request
            The incoming request object
    user_manager: UserManager
        A dependency injected by manager

    Returns
    -------
    JSONResponse
        If the body params are invalid status_code=403
    JSONResponse
            If the user was not found status_code=409
    JSONResponse
        If the users root_file already exists status_code=409
    dict
        The path of the root folder if created successfully
    """

    logger.debug(
        "Endpoint create_user_root has been triggered, Creation of user root BEGINS"
    )

    user_id = (await request.json()).get("user_id")

    if not user_id:
        logger.error("User_id unavailable")
        return JSONResponse({"message": "Invalid body params"}, status_code=403)

    logger.warn("user_id is available, validation is in process")

    user = await User.get_user(id=user_id)

    if user is None:
        logger.error(f"user_id is invalid, no user exists with id: {user_id}")
        return JSONResponse(
            {"message": f"User with {user_id=} not found!"}, status_code=409
        )

    logger.debug("Creating the users root folder")
    logger.warn("The corresponding folder for user_id might already exist")

    try:
        user_root_folder = await user_manager.create_user_root(str(user_id))
    except FileExistsError:
        logger.error(f"User root folder for id: {user_id} already exists")
        return JSONResponse(
            {"message": "The root for the current user already exists!"},
            status_code=409,
        )

    logger.info(
        f"Users root folder has been created successfully path: {user_root_folder} for id: {user_id}"
    )

    logger.debug("Updating the root folder path in the corresponding table")

    await user.update(root_path=str(user_root_folder.root))

    logger.debug("root folder updated on user")

    return {"root_path": str(user_root_folder.root)}


@server_router.post("/loginUser")
async def login(request: Request):
    """
    Endpoint to verify and return user credentials for login

    Parameters
    ----------
    request : Request
            The incoming request object

    Returns
    -------
    JSONResponse
        If the body params are invalid status_code=403
    JSONResponse
            If the user was not found status_code=409
    JSONResponse
        If the users root_file already exists status_code=409
    dict
        The user if successfully found
    """
    logger.debug("Endpoint Login has started")

    request_data = await request.json()

    username, password = request_data.get("name"), request_data.get("password")

    if not (username and password):
        logger.error(
            "user and password fields havent been supplied to authenticate")
        return JSONResponse(
            {"message": "username and password fields are missing"}, status_code=400
        )

    logger.debug(
        "Going to retrieve users data with given username and password")
    logger.info(f"{username=} {password=}")

    user_data = await User.get_user(
        name=username, password=sha256(password.encode()).hexdigest()
    )

    logger.warn("User might not exist in database")

    if not user_data:
        logger.error("User isnt in databse login failed")
        return JSONResponse({"message": "User not found"}, status_code=409)

    logger.debug("User sucessfully logged in")
    logger.info(
        f"The user who logged in: {user_data.id=} {user_data.name=} {user_data.password=}"
    )

    return {
        "id": user_data.id,
        "name": user_data.name,
    }


@server_router.get("/getFiles/{user_id}")
async def get_files(user_id: int, user_manager: UserManager = Depends(manager)):
    """
    Endpoint to get files of a user from user_id or a path if given

    Parameters
    ----------
    user_id : int
            The id of the user performing an action
    path : str | None
        The path supplied if any, prioritized over the user_id which is used to get the root folder
    user_manager : UserManager
        UserManager dependency injected by manager to retrieve root folder with user_id

    Returns
    -------
    JSONResponse
            If the root_folder was not found status_code=409
    JSONResponse
        If the path supplied to list the fiels is at a illegal location status_code=423
    dict
        the filenames requested if all goes well
    """

    logger.debug("Endpoint Get files has been executed")

    logger.debug("path hasnt been supplied, so continuing with user_id")
    logger.warn("given user_id might not exist in filesystem")

    directory_path = await user_manager.get_user_root(str(user_id))

    if not directory_path:
        logger.error(f"The {user_id=} didnt exist in the filesystem")
        return JSONResponse(
            {"message": f"No such root folder exists with id={user_id}!"},
            status_code=409,
        )

    logger.debug("User is to recieve list of files in root directory")
    logger.info(f"User who accessed: {user_id=}")

    return {"files": [file.name for file in directory_path.list_dir()]}


@server_router.post("/uploadFiles")
async def upload_files(
    files: list[UploadFile] = File(...),
    user_id: str = Form(...),
    user_manager: UserManager = Depends(manager),
):
    """
    Endpoint to upload files in bulk with folder_path as destination

    Parameters
    ----------
    files : list[UploadFile]
            The list of files to be uploaded
    folder_path : str
        The path supplied to store the uploaded files at

    Returns
    -------
    dict
        If all goes well
    """

    uploading_file_tasks = []

    logger.debug("Endpoint upload_files has been triggered")
    logger.info(f"User to write to {user_id=}")

    user_folder = await user_manager.get_user_root(user_id)

    if not user_folder:
        return JSONResponse({"message": "user root dir doesnt exist!"}, status_code=409)

    for file in files:
        logger.info(f"Writing {file.filename} to {user_folder.root}")

        uploading_file_tasks.append(
            asyncio.create_task(
                user_folder.write_file(file.filename, await file.read())
            )
        )

    await asyncio.gather(*uploading_file_tasks)

    logger.debug("upload_files endpoint ends file uploading was successfull")

    return {"message": "success"}


@server_router.delete("/files/{user_id}/{filename}")
async def delete_file(
    user_id: str, filename: str, user_manager: UserManager = Depends(manager)
):
    """
    Endpoint to delete a file

    Parameters
    ----------
    user_id : str
        The id of the user
    filename : str
        The name of the file to be deleted

    Returns
    -------
    JSONResponse
        If all goes well, a file will be deleted
    JSONResponse
        if a directory of the user wasnt found, with the corresponding message

    """
    logger.info("Endpoint delete file has been invoked")

    user_folder = await user_manager.get_user_root(user_id)

    logger.warn("User might not exist")

    if not user_folder:
        logger.error(f"User with id {user_id} doesn't exist in file system")
        return JSONResponse({"message": "user directory not found!"}, status_code=403)

    logger.info(f"User with id {user_id} was found")
    logger.warn(
        "The file specificed might not exist in the root folder of the user")

    try:
        await user_folder.remove_file(filename)
    except FileNotFoundError:
        logger.error(
            f"The file with name {filename} doesnt exist in users directory")
        return JSONResponse(
            {"message": "The given file doesnt exist in the users directory"},
            status_code=403,
        )

    logger.info(f"File delete successful by {user_id=} {filename=}")

    return JSONResponse({"message": "succsseful file deletion"})


@server_router.get("/files/{user_id}/{filename}")
async def download_file(
    user_id: str, filename: str, user_manager: UserManager = Depends(manager)
):
    """
    Endpoint to download a file

    Parameters
    ----------
    user_id : str
        The id of the user
    filename : str
        The name of the file to be downloaded

    Returns
    -------
    FileResponse
        The file to be streamed to the user for download
    JSONResponse
        if a directory of the user wasnt found, with the corresponding message

    """

    logger.debug(f"Endpoint files/{user_id}/{filename} has been invoked")

    user_folder = await user_manager.get_user_root(user_id)

    logger.warn("User might not exist")

    if not user_folder:
        logger.error(f"User wasnt found with {user_id=}")
        return JSONResponse({"message": "user directory not found!"}, status_code=403)

    logger.info(f"User found {user_id=}")

    return FileResponse(str(user_folder.root / filename), filename=filename)
