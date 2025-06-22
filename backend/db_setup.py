
from sqlalchemy.orm import sessionmaker
from models import Base
from sqlalchemy import create_engine
from urllib.parse import quote_plus
import os
from dotenv import load_dotenv

load_dotenv()

USER =os.getenv('USER')
PASSWORD =os.getenv('PASSWORD') 
HOST = os.getenv('HOST')
PORT = os.getenv('PORT')
DBNAME =os.getenv('DBNAME')

USER_ENC = quote_plus(USER)
PASSWORD_ENC = quote_plus(PASSWORD)

DATABASE_URL = f"postgresql+psycopg2://{USER_ENC}:{PASSWORD_ENC}@{HOST}:{PORT}/{DBNAME}?sslmode=require"

engine = create_engine(DATABASE_URL)

try:
    with engine.connect() as connection:
        print("✅ Connection successful!")
        Base.metadata.create_all(bind=engine)
        Session=sessionmaker(bind=engine)
        session=Session()
        
except Exception as e:
    print(f"❌ Failed to connect: {e}")
    
