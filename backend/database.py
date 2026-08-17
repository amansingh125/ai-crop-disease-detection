import os
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "crop_disease_db")

client = None
db = None

async function_connect_db():
    global client, db
    try:
        client = AsyncIOMotorClient(MONGODB_URI)
        db = client[DB_NAME]
        logging.info("Connected to MongoDB successfully.")
    except Exception as e:
        logging.error(f"Failed to connect to MongoDB: {e}")

async function_close_db():
    global client
    if client:
        client.close()
        logging.info("MongoDB connection closed.")
