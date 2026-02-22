from fastapi import FastAPI, APIRouter, HTTPException, Request, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY')


class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    price: float
    category: str
    gender: str
    image: str
    description: str
    stock: int = 10
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ProductCreate(BaseModel):
    name: str
    price: float
    category: str
    gender: str
    image: str
    description: str
    stock: int = 10


class ContactFormSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ContactFormCreate(BaseModel):
    name: str
    email: str
    phone: str
    message: str


class CheckoutRequest(BaseModel):
    cart_items: List[Dict]
    origin_url: str


class PaymentTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    amount: float
    currency: str
    cart_items: List[Dict]
    payment_status: str
    status: str
    metadata: Optional[Dict] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


@api_router.get("/")
async def root():
    return {"message": "Bad Monkey API"}


@api_router.get("/products", response_model=List[Product])
async def get_products(category: Optional[str] = None, gender: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    if gender:
        query["gender"] = gender
    
    products = await db.products.find(query, {"_id": 0}).to_list(1000)
    
    for product in products:
        if isinstance(product.get('created_at'), str):
            product['created_at'] = datetime.fromisoformat(product['created_at'])
    
    return products


@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if isinstance(product.get('created_at'), str):
        product['created_at'] = datetime.fromisoformat(product['created_at'])
    
    return product


@api_router.post("/products", response_model=Product)
async def create_product(product_input: ProductCreate):
    product_dict = product_input.model_dump()
    product = Product(**product_dict)
    
    doc = product.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.products.insert_one(doc)
    return product


@api_router.post("/contact", response_model=ContactFormSubmission)
async def submit_contact_form(form: ContactFormCreate):
    form_dict = form.model_dump()
    submission = ContactFormSubmission(**form_dict)
    
    doc = submission.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.contact_submissions.insert_one(doc)
    return submission


@api_router.post("/checkout/session")
async def create_checkout_session(checkout_req: CheckoutRequest, request: Request):
    try:
        cart_items = checkout_req.cart_items
        origin_url = checkout_req.origin_url
        
        if not cart_items or len(cart_items) == 0:
            raise HTTPException(status_code=400, detail="Cart is empty")
        
        total_amount = sum(item['price'] * item['quantity'] for item in cart_items)
        
        host_url = str(request.base_url).rstrip('/')
        webhook_url = f"{host_url}/api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
        
        success_url = f"{origin_url}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}"
        cancel_url = f"{origin_url}/cart"
        
        checkout_request = CheckoutSessionRequest(
            amount=float(total_amount),
            currency="inr",
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={
                "source": "bad_monkey_store",
                "items_count": str(len(cart_items))
            }
        )
        
        session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(checkout_request)
        
        payment_transaction = PaymentTransaction(
            session_id=session.session_id,
            amount=float(total_amount),
            currency="inr",
            cart_items=cart_items,
            payment_status="pending",
            status="initiated",
            metadata={"items_count": len(cart_items)}
        )
        
        doc = payment_transaction.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        
        await db.payment_transactions.insert_one(doc)
        
        return {"url": session.url, "session_id": session.session_id}
    
    except Exception as e:
        logger.error(f"Error creating checkout session: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/checkout/status/{session_id}")
async def get_checkout_status(session_id: str, request: Request):
    try:
        host_url = str(request.base_url).rstrip('/')
        webhook_url = f"{host_url}/api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
        
        checkout_status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)
        
        existing_transaction = await db.payment_transactions.find_one(
            {"session_id": session_id},
            {"_id": 0}
        )
        
        if existing_transaction:
            if existing_transaction.get('payment_status') != 'paid' and checkout_status.payment_status == 'paid':
                await db.payment_transactions.update_one(
                    {"session_id": session_id},
                    {
                        "$set": {
                            "payment_status": checkout_status.payment_status,
                            "status": checkout_status.status,
                            "updated_at": datetime.now(timezone.utc).isoformat()
                        }
                    }
                )
            elif checkout_status.status == 'expired' and existing_transaction.get('status') != 'expired':
                await db.payment_transactions.update_one(
                    {"session_id": session_id},
                    {
                        "$set": {
                            "status": "expired",
                            "updated_at": datetime.now(timezone.utc).isoformat()
                        }
                    }
                )
        
        return {
            "status": checkout_status.status,
            "payment_status": checkout_status.payment_status,
            "amount_total": checkout_status.amount_total,
            "currency": checkout_status.currency
        }
    
    except Exception as e:
        logger.error(f"Error getting checkout status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    try:
        body = await request.body()
        signature = request.headers.get("Stripe-Signature")
        
        host_url = str(request.base_url).rstrip('/')
        webhook_url = f"{host_url}/api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
        
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        if webhook_response.payment_status == 'paid':
            existing_transaction = await db.payment_transactions.find_one(
                {"session_id": webhook_response.session_id},
                {"_id": 0}
            )
            
            if existing_transaction and existing_transaction.get('payment_status') != 'paid':
                await db.payment_transactions.update_one(
                    {"session_id": webhook_response.session_id},
                    {
                        "$set": {
                            "payment_status": "paid",
                            "status": "complete",
                            "updated_at": datetime.now(timezone.utc).isoformat()
                        }
                    }
                )
        
        return {"status": "success"}
    
    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()