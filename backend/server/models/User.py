from typing import Any
from pydantic import BaseModel
from server.database import Users
from hashlib import sha256
from orm import NoMatch


class User(BaseModel):
    """
    Base model used in API to perform some database transactions with Users Model
    """

    name: str
    password: str
    root_path: str | None = None

    async def create_user(self):
        """
        Creates a user secureley in the database

        Raises
        ------
        aiosqlite.InterityError
            When there is conflict in the intergrity and validity of data

        Returns
        -------
        user_db_instance
            The newly created users data form the database, type unkown
        """

        user_db_instance = await Users.objects.create(
            name=self.name,
            password=sha256(self.password.encode()).hexdigest(),
        )

        return user_db_instance

    @staticmethod
    async def get_user(**field_details) -> None | Any:
        """
        Gets a single user based off of field details

        Parameters
        ----------
        field_details : dict[str, Any]
            The field details that will be passed to
            the orm for querying

        Returns
        -------
        None
            If no users was found
        user
            The user, type is unkown
        """

        try:
            user = await Users.objects.get(**field_details)
        except NoMatch:
            return None

        return user
