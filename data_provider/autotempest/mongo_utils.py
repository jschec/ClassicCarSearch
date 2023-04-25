# import pymongo
from typing import Any
import os
from pymongo import MongoClient

# from gridfs import GridFS

DATABASE = "metadb"
LIST_COLLECTION = "list"

def get_mongo_connect_string() -> str:
    username = os.environ.get("MONGO_USER", "master")
    password = os.environ.get("MONGO_PASS", "password")
    hostname = os.environ.get("MONGO_HOST", "mongodb")
    port = os.environ.get("MONGO_PORT", "27017")
    return f"mongodb://{username}:{password}@{hostname}:{port}"

def update_record(record: Any):
    connect_string = get_mongo_connect_string()
    with MongoClient(connect_string) as client:
        db = client[DATABASE]
        # print(db.list_collection_names())
        col = db[LIST_COLLECTION]
        col.insert(record)
