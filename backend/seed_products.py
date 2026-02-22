import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

products = [
    {
        "id": "prod-001",
        "name": "Nike Air Max 270 React",
        "price": 12999.00,
        "category": "Sneakers",
        "gender": "Men",
        "image": "https://images.unsplash.com/photo-1610664676282-55c8de64f746?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHw0fHxzbmVha2VyJTIwcHJvZHVjdCUyMHNob3QlMjB3aGl0ZSUyMGJhY2tncm91bmQlMjBuaWtlJTIwYWRpZGFzJTIwaGlnaCUyMHRvcHxlbnwwfHx8fDE3NzE3NDk3OTh8MA&ixlib=rb-4.1.0&q=85",
        "description": "Imported Nike Air Max 270 React with premium cushioning and bold style. Perfect for everyday wear and street fashion.",
        "stock": 10,
        "created_at": "2025-01-15T10:00:00Z"
    },
    {
        "id": "prod-002",
        "name": "Adidas Forum Low Classic",
        "price": 9999.00,
        "category": "Casuals",
        "gender": "Unisex",
        "image": "https://images.unsplash.com/photo-1715773408837-b7074beb12d5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwxfHxzbmVha2VyJTIwcHJvZHVjdCUyMHNob3QlMjB3aGl0ZSUyMGJhY2tncm91bmQlMjBuaWtlJTIwYWRpZGFzJTIwaGlnaCUyMHRvcHxlbnwwfHx8fDE3NzE3NDk3OTh8MA&ixlib=rb-4.1.0&q=85",
        "description": "Classic Adidas Forum Low with vintage basketball heritage. Imported quality leather construction.",
        "stock": 8,
        "created_at": "2025-01-15T10:00:00Z"
    },
    {
        "id": "prod-003",
        "name": "Air Jordan 3 Retro White Cement",
        "price": 18999.00,
        "category": "Sneakers",
        "gender": "Men",
        "image": "https://images.pexels.com/photos/10112911/pexels-photo-10112911.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "description": "Iconic Air Jordan 3 Retro in the legendary White Cement colorway. A must-have for any sneaker collection.",
        "stock": 5,
        "created_at": "2025-01-15T10:00:00Z"
    },
    {
        "id": "prod-004",
        "name": "Puma RS-X Tech",
        "price": 8499.00,
        "category": "Sports",
        "gender": "Men",
        "image": "https://images.unsplash.com/photo-1715694031128-3ca9662a387b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwzfHxzbmVha2VyJTIwcHJvZHVjdCUyMHNob3QlMjB3aGl0ZSUyMGJhY2tncm91bmQlMjBuaWtlJTIwYWRpZGFzJTIwaGlnaCUyMHRvcHxlbnwwfHx8fDE3NzE3NDk3OTh8MA&ixlib=rb-4.1.0&q=85",
        "description": "Puma RS-X Tech with bold colorways and chunky silhouette. Perfect for the modern sneaker enthusiast.",
        "stock": 12,
        "created_at": "2025-01-15T10:00:00Z"
    },
    {
        "id": "prod-005",
        "name": "New Balance 327 Vintage",
        "price": 10999.00,
        "category": "Casuals",
        "gender": "Women",
        "image": "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500&h=600&fit=crop",
        "description": "New Balance 327 with retro-inspired design and modern comfort. Imported premium quality.",
        "stock": 15,
        "created_at": "2025-01-15T10:00:00Z"
    },
    {
        "id": "prod-006",
        "name": "Converse Chuck 70 High Top",
        "price": 7499.00,
        "category": "Casuals",
        "gender": "Unisex",
        "image": "https://images.unsplash.com/photo-1605408499391-6368c628ef42?w=500&h=600&fit=crop",
        "description": "Classic Converse Chuck 70 High with premium canvas and vintage details. Timeless style.",
        "stock": 20,
        "created_at": "2025-01-15T10:00:00Z"
    },
    {
        "id": "prod-007",
        "name": "Asics Gel-Lyte III OG",
        "price": 11499.00,
        "category": "Sports",
        "gender": "Men",
        "image": "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&h=600&fit=crop",
        "description": "Asics Gel-Lyte III OG with signature split tongue design. Imported Japanese quality.",
        "stock": 8,
        "created_at": "2025-01-15T10:00:00Z"
    },
    {
        "id": "prod-008",
        "name": "Reebok Club C 85 Vintage",
        "price": 6999.00,
        "category": "Casuals",
        "gender": "Women",
        "image": "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500&h=600&fit=crop",
        "description": "Clean and minimal Reebok Club C 85 with soft leather upper. Perfect for any casual outfit.",
        "stock": 18,
        "created_at": "2025-01-15T10:00:00Z"
    },
    {
        "id": "prod-009",
        "name": "Vans Old Skool Platform",
        "price": 5999.00,
        "category": "Fashion",
        "gender": "Women",
        "image": "https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=500&h=600&fit=crop",
        "description": "Elevated Vans Old Skool Platform with signature side stripe. Street style essential.",
        "stock": 25,
        "created_at": "2025-01-15T10:00:00Z"
    },
    {
        "id": "prod-010",
        "name": "Nike Dunk Low Retro",
        "price": 13999.00,
        "category": "Sneakers",
        "gender": "Unisex",
        "image": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&h=600&fit=crop",
        "description": "Nike Dunk Low Retro in classic colorways. Highly sought-after imported release.",
        "stock": 6,
        "created_at": "2025-01-15T10:00:00Z"
    },
    {
        "id": "prod-011",
        "name": "Adidas Yeezy Boost 350",
        "price": 24999.00,
        "category": "Sneakers",
        "gender": "Unisex",
        "image": "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=500&h=600&fit=crop",
        "description": "Limited edition Adidas Yeezy Boost 350 with Primeknit upper. Premium imported quality.",
        "stock": 3,
        "created_at": "2025-01-15T10:00:00Z"
    },
    {
        "id": "prod-012",
        "name": "Fila Disruptor II Premium",
        "price": 7999.00,
        "category": "Fashion",
        "gender": "Women",
        "image": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=600&fit=crop",
        "description": "Chunky Fila Disruptor II with bold platform sole. Fashion-forward imported design.",
        "stock": 14,
        "created_at": "2025-01-15T10:00:00Z"
    }
]

async def seed_database():
    try:
        await db.products.delete_many({})
        print("Cleared existing products")
        
        await db.products.insert_many(products)
        print(f"Successfully seeded {len(products)} products")
        
        count = await db.products.count_documents({})
        print(f"Total products in database: {count}")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
