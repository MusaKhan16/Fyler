import databases
import orm

database = databases.Database("sqlite+aiosqlite:///database.sqlite")
model_registry = orm.ModelRegistry(database=database)


class Users(orm.Model):
    """Schema for user objects"""

    name = "Users"
    registry = model_registry

    fields = {
        "id": orm.Integer(primary_key=True),
        "name": orm.String(min_length=3, max_length=40, unique=True, allow_null=False),
        "password": orm.String(min_length=64, max_length=64, allow_null=False),
        "root_path": orm.Text(unique=True, allow_null=True),
    }
