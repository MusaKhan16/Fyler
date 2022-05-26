import pathlib
import aiofiles, aiofiles.os


class UserFolder:
    """A users isolated filesystem"""

    def __init__(self, path: pathlib.Path | str):
        self._root = pathlib.Path(path)

    @property
    def root(self):
        """Encapsulation for self._root"""
        return self._root

    def list_dir(self, path: str | pathlib.Path | None = None):
        """
        Get contents of a directory as a tuple

        Parameters
        ----------
        path : str | pathlib.Path | None
            The path of the directory

        Returns
        -------
        tuple
            A sequence containing all the files in the path directory
        """

        if not path:
            return self.list_dir(self._root)
        return tuple((self._root / path).iterdir())

    async def write_file(
        self,
        path: str | pathlib.Path,
        data: bytes | str,
        buffer_size: int = -1,
        *,
        mode: str = "wb",
    ):
        """
        Asynchronously write to a file

        Parameters
        ----------
        path : str | pathlib.Path
            The path to write the file
        data: bytes | str
            The data to write to the file
        buffer_size: int
            the buffer size to write to the file, this defaults to system defaults

        Returns
        -------
        None
        """

        async with aiofiles.open(
            self._root / path, mode, buffering=buffer_size
        ) as file:
            await file.write(data)

    async def remove_file(self, path: str):
        """
        Asynchronously removes a file

        Parameters
        ----------
        path : str
            The path to the file

        Returns
        -------
        None
        """
        await aiofiles.os.remove(self._root / path)

    async def create_dir(self, path: str):
        """
        Asynchronously creates a directory

        Parameters
        ----------
        path : str
            The path to the dir to be created

        Returns
        -------
        None
        """
        await aiofiles.os.mkdir(self._root / path)

    async def remove_dir(self, path: str):
        """
        Asynchronously removes a directory

        Parameters
        ----------
        path : str
            The path to the directory

        Returns
        -------
        None
        """
        await aiofiles.os.rmdir(self._root / path)


class UserManager:
    """A UserManager that manages user filesystems"""

    def __init__(self, root: str | pathlib.Path):
        self._root = pathlib.Path(root)

    @property
    def root(self):
        """Encapsulating self._root"""
        return self._root

    @property
    def root_folders(self) -> tuple[str, ...]:
        """All folders in the current root directory"""
        return tuple(map(str, self._root.iterdir()))

    def setup_manager(self):
        """
        Sets up the root manager

        Parameters
        ----------
        None

        Returns
        -------
        None
        """
        if self._root.exists():
            return
        self._root.mkdir()

    async def create_user_root(self, dir_name: str) -> UserFolder:
        """
        Creates a root directory for a user

        Parameters
        ----------
        dir_name: str
            The path of the directory

        Raises
        ------
        UserFolderExists
            When the directory given is already existent in the root folder
        IllegalFolderLocation
            When the path of the directory given exists outside the root folder
        IllegalFolderLocation
            If the path of the directory given lives too deep within the root.
            For example someone elses root dir.

        Returns
        -------
        UserFolder
        """

        user_root_dir_path = (self._root / dir_name).resolve()

        if user_root_dir_path.exists():
            raise UserFolderExists(user_root_dir_path)

        if not user_root_dir_path.is_relative_to(self._root.absolute()):
            raise IllegalFolderLocation(
                location=user_root_dir_path, expected_location=self._root
            )

        if len(user_root_dir_path.parents) > len(self._root.parents) + 1:
            raise IllegalFolderLocation(
                location=user_root_dir_path,
                expected_location=self._root / "[folder-name]",
            )

        await aiofiles.os.mkdir(user_root_dir_path)

        return UserFolder(user_root_dir_path)

    async def get_user_root(self, dir_name: str) -> UserFolder | None:
        """
        Looks up the user root from a dir_name

        Parameters
        ----------
        dir_name: str
            The name of the directory

        Returns
        -------
        UserFolder
            If the directory was found
        None
            If the directory wasn't found
        """
        directory_path = (self._root / dir_name).resolve()

        if not directory_path.exists():
            return None

        return UserFolder(directory_path)

    @classmethod
    def create_manager(cls, path: str | pathlib.Path) -> "UserManager":
        """
        Class method to create the manager and set it up automatically

        Parameters
        ----------
        path: str
            The parent path for the root dir

        Returns
        -------
        UserManager

        """
        manager = cls(path)
        manager.setup_manager()
        return manager


class UserFolderExists(FileExistsError):
    """User Folder Exists Error"""

    def __init__(self, path: pathlib.Path):
        super().__init__(f"The path {path} already exists!")


class IllegalFolderLocation(Exception):
    """Illegal File or Folder Location"""

    def __init__(
        self, location: pathlib.Path | str, expected_location: pathlib.Path | str
    ):
        super().__init__(
            f"The location of the file should be within {expected_location}\n"
            f"however remains at {location}"
        )
