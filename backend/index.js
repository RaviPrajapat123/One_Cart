import Fastify from "fastify";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import cors from '@fastify/cors';
import * as yup from "yup"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { authenticateToken } from './authenticateToken.js';
import fastifyCookie from '@fastify/cookie';
import { imageUploadRoute } from './uploadRoute.js';
import fastifyMultipart from '@fastify/multipart';
const fastify = Fastify({ logger: true });
await fastify.register(fastifyCookie, {
  secret: "my-secret-key", // optional: for signed cookies
});
dotenv.config();


await fastify.register(cors, {
  origin: ["http://localhost:5173","http://localhost:5174"], // ✅ frontend ka exact origin
  credentials: true,    
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']           // ✅ allow cookies
});

await fastify.register(fastifyMultipart);
await fastify.register(imageUploadRoute);
const client = new MongoClient(process.env.MONGO_URI);
await client.connect();
const db = client.db("oneCart");
const users = db.collection("users");
 const products = db.collection("products");
 const orders = db.collection("order");

const yupOptions = {
  strict: false,
  abortEarly: false,
  stripUnknown: true,
  recursive: true,
};

const userSchema=yup.object({
    username:yup.string().required("UserName is required"),
    email:yup.string().email("Invalid email format").required("Email is required"),
    password:yup.string().min(6,"Password must be at least 6 characters").required("password is required"),
    cartData:yup.object().default({})
})

fastify.get("/all-users", async (req, reply) => {
  try {
    const all = await users.find().toArray();
    reply.send(all);
  } catch (err) {
    fastify.log.error(err);
    reply.status(500).send({ error: "Failed to fetch users" });
  }
});

fastify.post("/register", async (req, reply) => {
  try {
    const validatedUser = await userSchema.validate(req.body, yupOptions);
    const exitsEmail=await users.findOne({email:validatedUser.email})
    if(exitsEmail){
        return reply.code(400).send({error:"email already exists"})
    }
    let hashpassword=await bcrypt.hash(validatedUser.password, 10)
    const userToInsert={
        ...validatedUser,
        password: hashpassword,
        createdAt:new Date(),
        updatedAt:new Date()
    }
    await users.insertOne(userToInsert);
    reply.send({ success: true, user: userToInsert });
  } catch (err) {
    reply.status(400).send({
      error: "Validation failed",
      errors: err.errors, // ✅ Correct key
    });
  }
});

const loginSchema = yup.object({
  email: yup.string().email().required('Email is required'),
  password: yup.string().required('Password is required'),
});

fastify.post("/login", async (req, reply) => {
  try {
    const validatedUser = await loginSchema.validate(req.body, yupOptions);

    const { email, password } = validatedUser;
    const user = await users.findOne({ email });

    if (!user) {
      return reply.code(400).send({ error: "Email not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return reply.code(400).send({ error: "Incorrect password" });
    }

   const authClaims = {
  id: user._id.toString(),
  email: user.email,
  role: "user"   // ✅ user ke liye
};

    const token = jwt.sign(authClaims, process.env.JWT_SECRET || "oneCart123", {
      expiresIn: "30d",
    });

    // ✅ Set JWT as cookie
    reply.setCookie("token_user", token, {
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
    });

    return reply.send({
      success: true,
      message: "Login successful",
    });

  } catch (err) {
    if (err.name === "ValidationError") {
      return reply.status(400).send({
        error: "Validation failed",
        errors: err.errors, // frontend will show field-wise
      });
    }
    return reply.status(400).send({ error: err.message });
  }
});


// fastify.get("/logout", async (req, reply) => {
//   reply.clearCookie("token", {
//     path: "/",
//     httpOnly: true,
//     secure: false,
//     sameSite: "lax",
//   });

//   reply.send({
//     success: true,
//     message: "Logged out successfully",
//   });
// });

fastify.get("/userLogout", async (req, reply) => {
  reply.clearCookie("token_user", { path: "/" });
  reply.send({ success: true, message: "User logged out" });
});

fastify.get("/adminLogout", async (req, reply) => {
  reply.clearCookie("token_admin", { path: "/" });
  reply.send({ success: true, message: "Admin logged out" });
});


fastify.post("/googleLogin", async (req, reply) => {
  try {
    const { name, email } = req.body;

    // Check if user already exists
    let user = await users.findOne({ email });

    // If not, create a new user
    if (!user) {
      const newUser = {
        name: name,
        email,
        cartData: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await users.insertOne(newUser);
      user = newUser;
    }

    // Generate JWT token
    const authClaims = { email: user.email };
    const token = jwt.sign(authClaims, process.env.JWT_SECRET || "oneCart123", {
      expiresIn: "30d",
    });

    // Set token as cookie
    reply.setCookie("token_user", token, {
      path: "/",
      httpOnly: true,
      secure: false, // use true in production with HTTPS
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
    });

    return reply.send({
      success: true,
      message: "Google Login successful",
      token,
    });

  } catch (err) {
    console.error("Google login error:", err);
    reply.status(500).send({ error: "Internal Server Error" });
  }
});




fastify.get("/currentUser", { preHandler: authenticateToken("user") }, async (req, reply) => {
  try {
    const userEmail = req.user.email;
    const user = await users.findOne({ email: userEmail }, { projection: { password: 0 } }); // hide password

    if (!user) {
      return reply.status(404).send({ error: "User not found" });
    }

    return reply.send({ success: true, user });
  } catch (err) {
    console.error("Get current user failed:", err);
    reply.status(500).send({ error: "Internal Server Error" });
  }
});


fastify.post("/adminLogin", async (req, reply) => {
  try{
  const validateAdmin = await loginSchema.validate(req.body, yupOptions); 
  const { email, password } = validateAdmin;

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign(
      { email, role: "admin" },
      process.env.JWT_SECRET || "oneCart123",
      { expiresIn: "30d" }
    );

    reply.setCookie("token_admin", token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: false, // set true in production (https)
      maxAge: 30 * 24 * 60 * 60,
    });

    return reply.send({ success: true, message: "Admin login successful" });
  }else{
    return reply.send({error:"Invalid admin credentials"})
  }
}
  catch(err){
     if (err.name === "ValidationError") {
      return reply.status(400).send({
        error: "Validation failed",
        errors: err.errors, // frontend will show field-wise
      });
    }
    return reply.status(400).send({ error: err.message });
  }
});

fastify.get("/currentAdmin", { preHandler: authenticateToken("admin") }, async (req, reply) => {
  if (req.user.role !== "admin") {
    return reply.status(403).send({ error: "Forbidden: Not an admin" });
  }
  reply.send({ admin: { email: req.user.email } });
});


// import * as yup from 'yup';

const productSchema = yup.object({
  name: yup.string().required("Product name is required"),
  image1: yup.string().required("Image 1 is required"),
  image2: yup.string().required("Image 2 is required"),
  image3: yup.string().required("Image 3 is required"),
  image4: yup.string().required("Image 4 is required"),
  description: yup.string().required("Description is required"),
  price: yup.number()
    .typeError("Price must be a number")
    .positive("Price must be positive")
    .required("Price is required"),
    category:yup.string().required("Category is required"),
  subCategory: yup.string().required("Subcategory is required"),

  sizes: yup.array()
    .of(yup.string())
    .min(1, "At least one size is required")
    .required("Sizes are required"),

  // date: yup.date()
  //   .typeError("Date must be a valid date")
  //   .required("Date is required"),

  bestSeller: yup.boolean()
    // .required("Best Seller field is required"),
});

fastify.post("/addProduct", async (req, reply) => {
  try {
    
    const validatedProduct = await productSchema.validate(req.body, yupOptions);


    const result = await products.insertOne({
      ...validatedProduct,
      createdAt: new Date(),
      updatedAt:new Date()
    });

    return reply.send({ success: true, id: result.insertedId });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return reply.status(400).send({
        error: "Validation Failed",
        errors: error.errors,
      });
    }

    console.error("Add Product Error:", error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
});

fastify.get("/allProducts", async (req, reply) => {
  try {
    const result = await products.find().toArray();

    reply.send({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Fetch all products error:", error);
    reply.code(500).send({
      success: false,
      message: "Failed to fetch products",
    });
  }
});


fastify.delete("/removeProduct/:id",async(req,reply)=>{
  try{
      const {id}=req.params
      const result=await products.deleteOne({_id: new ObjectId(id)})
      if(result.deletedCount===0){
        return reply.code(404).send({success:false,message:"product not found"})
      }
      return reply.send({success:true,message:"Product deleted Successfully"})
    }
    catch(error){
       console.error("Delete Error:", error);
    return reply.code(500).send({ success: false, message: "Server error" });
    }
})

 fastify.post("/addToCart", { preHandler: [authenticateToken("user")] }, async (req, reply) => {
  try {
    const userId = req.user.id;
    const { itemId, size, quantity = 1 } = req.body;

    if (!itemId || !size) {
      return reply.code(400).send({ success: false, message: "Product ID and size are required." });
    }

    // 🧠 Get user
    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return reply.code(404).send({ success: false, message: "User not found" });
    }

    // 🛒 Clone existing cartData or initialize
    const cartData = user.cartData || {};

    // ✅ If product not exists in cart
    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    // ✅ If size not exists, set it
    if (!cartData[itemId][size]) {
      cartData[itemId][size] = quantity;
    } else {
      // ✅ Else increase quantity
      cartData[itemId][size] += quantity;
    }

    // 💾 Update user cart
    await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          cartData,
          updatedAt: new Date()
        }
      }
    );

    reply.send({ success: true, message: "Item added to cart", cartData });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    reply.code(500).send({ success: false, message: "Server error while adding to cart." });
  }
});




fastify.post("/updateCart", { preHandler: [authenticateToken("user")] }, async (req, reply) => {
  try {
    const userId = req.user.id;
    const { itemId, size, quantity } = req.body;

    // 🧪 Validation
    if (!itemId || !size || typeof quantity !== "number") {
      return reply.code(400).send({ success: false, message: "Invalid data" });
    }

    // 🔍 Find user
    const user = await users.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return reply.code(404).send({ success: false, message: "User not found" });
    }

    // 📦 Clone cartData
    const cartData = user.cartData || {};

    // 👇 Update logic
    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    if (quantity <= 0) {
      // ❌ Remove size if qty is 0 or less
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId]; // remove productId if no size left
      }
    } else {
      // ✅ Set new quantity
      cartData[itemId][size] = quantity;
    }

    // 💾 Update in DB
    await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          cartData,
          updatedAt: new Date()
        }
      }
    );

    return reply.send({
      success: true,
      message: "Cart updated successfully",
      cartData
    });

  } catch (err) {
    console.error("Cart update error:", err);
    return reply.code(500).send({ success: false, message: "Server error while updating cart." });
  }
});


// })
fastify.get("/userCart", { preHandler: [authenticateToken("user")] }, async (req, reply) => {
  try {
    const userId = req.user.id;

    const userData = await users.findOne({ _id: new ObjectId(userId) });

    if (!userData) {
      return reply.code(404).send({ success: false, message: "User not found" });
    }

    const cartData = userData.cartData || {};
    return reply.send({ success: true, cartData });
  } catch (error) {
    console.error("Error fetching user cart:", error);
    return reply.code(500).send({ success: false, message: "Server error" });
  }
});


const orderSchema=yup.object({
  userId:yup.string().required("userId is required"),
 items: yup.array().min(1, "At least one item is required").required("Items is required"),

  amount:yup.number().required("Amount is required"),
  address: yup.object().required("Address is required"),
   status: yup.string().required("Status is required"),

  paymentMethod: yup.string().required("Payment Method is required"),

  payment: yup.boolean().required("Payment is required"),

  date: yup.date().default(() => new Date()).required("Date is required")
})

fastify.post('/placeOrder', { preHandler: [authenticateToken("user")] }, async (req, reply) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.user.id;

    // Validate
    if (!items || !amount || !Array.isArray(address)) {
      return reply.code(400).send({ success: false, message: 'Invalid order data' });
    }

    const orderData = {
      items,
      amount,
      userId: new ObjectId(userId),
      address,
      paymentMethod: 'COD',
      payment: false,
      status:"Order Placed",
      date: new Date(),
      createdAt:new Date(),
      updatedAt:new Date()
    };

    

    // Insert order
    await orders.insertOne(orderData);

    // Clear user cart
    await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { cartData: {} } }
    );

    return reply.code(201).send({ success: true, message: 'Order placed successfully' });

  } catch (error) {
    console.error('Place Order Error:', error);
    return reply.code(500).send({ success: false, message: 'Server error while placing order' });
  }
});


fastify.get("/userOrders", { preHandler: [authenticateToken("user")] },async(req,reply)=>{
  try {
      const userId=req.user.id
      const order=await orders.find({userId: new ObjectId(userId)}).toArray()
      return reply.code(200).send({success:true,data:order})
  } catch (error) {
     console.log(error)
     return reply.code(500).send({success:false,message:"Server error while getting user orders"})
  }
})


fastify.get("/allOrders", { preHandler: [authenticateToken("admin")] }, async (req, reply) => {
  try {
    // Optional: Check if user is admin
    const user = req.user;
    if (user.role !== 'admin') {
      return reply.code(403).send({ success: false, message: "Access denied: Admins only" });
    }

    const orderList = await orders.find().sort({ date: -1 }).toArray();

    return reply.code(200).send({ success: true, data: orderList });

  } catch (error) {
    console.error("Admin All Orders Error:", error);
    return reply.code(500).send({ success: false, message: "Admin All orders error" });
  }
});




fastify.put("/updateStatus", { preHandler: [authenticateToken("admin")] }, async (req, reply) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return reply.code(400).send({ success: false, message: "orderId and status are required" });
    }

    const result = await orders.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status, updatedAt: new Date() } }
    );

    if (result.modifiedCount === 0) {
      return reply.code(404).send({ success: false, message: "Order not found or already has this status" });
    }

    return reply.code(200).send({ success: true, message: "Order status updated" });

  } catch (error) {
    console.error("Error in updateStatus:", error);
    return reply.code(500).send({ success: false, message: "Server error while updating order status" });
  }
});


fastify.get('/admin/stats', { preHandler: [authenticateToken("admin")] }, async (req, reply) => {
  try {
    const totalUsers = await users.countDocuments();
    const totalOrders = await orders.countDocuments();

    const allOrders = await orders.find().toArray(); // 👈 Important: convert to array

    const totalRevenue = allOrders.reduce((sum, order) => {
      return sum + (order.amount || 0);
    }, 0);

    return {
      totalUsers,
      totalOrders,
      totalRevenue
    };
  } catch (error) {
    console.error("Error in /admin/stats:", error);
    return reply.status(500).send({ error: 'Internal Server Error' });
  }
});



fastify.listen({ port: process.env.PORT || 3000, host: "0.0.0.0" }, () => {
  console.log("Server running");
});
