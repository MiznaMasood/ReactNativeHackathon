
import 'dotenv/config'
const app = express()
const DBURI = process.env.MONGODB_URI
const PORT = process.env.PORT
import express from "express"; 
import mongoose from "mongoose"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";  
import cors from "cors"; 
import userModel from './Models/userSchema.js';
import userVerifyMiddle from './middleware/userVerify.js';
import menuItemModel from './Models/menuItemSchema.js';
import Order from './Models/orderSchema.js'; // Ensure correct relative path
import cartModel from './Models/cartScheme.js';
import paymentModel from './Models/paymentSchema.js';

// import postModel from "./Models/postSchema.js";

// Middleware

const port = process.env.PORT ;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

//  mongodb configuration 
mongoose.connect(DBURI)
mongoose.connection.on("connected", ()=> console.log("MonoDB Connected"))

mongoose.connection.on("error",(err) => console.log("MongoDB Error", err))

// Signup route

app.post('/register' , async(req,res)=>{
    const {name, email, password} = req.body
    if(!name || !email || !password){
        res.json({
            message: "Please enter all fields",
            status : false
        });
        return;
    }

    const existingUser = await userModel.findOne({email});
    if(existingUser){
        res.json({
            message: "Email already exists",
            status : false
        });
        return;
    }

    // Hash the Password

    const hashedPassword = await bcrypt.hash(password,10)
    console.log("hashpassword", hashedPassword)

    
    // Create the user in the db

    const newUser = await userModel.create({
        name,
        email,
        password: hashedPassword})
        res.json({
            message: "User registered successfully",
            status : true
        });
    
})

// Login route

app.post('/login', async(req,res)=>{
    const {email, password} = req.body
    if(!email ||!password){
        res.json({
            message: "Please enter all fields",
            status : false
        });
        return;
    }
      // Check if user exists
      const user = await userModel.findOne({email});
      if(!user){
        res.json({
          message: "User not found",
          status : false
        });
        return;
      }
      // Check if password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch){
        res.json({
          message: "Invalid password",
          status : false
        });
        return;
      }
   
var token = jwt.sign({email: user.email, name: user.name,} , process.env.SECRET_KEY );

       // Login successful
       res.json({
        message: "Login successful",
        status : true,
        token: token
      });
    })

    app.get("/api/getusers", userVerifyMiddle, async(req,res)=>{
      try{
      const users = await userModel.find({});
      res.json({
        message: "all users get",
        status: true,
        users: users
      })
    }catch(error){
      console.log("Error", error)
      res.json({
        message: "Error fetching users",
        status: false
      })
    }
    })



    // -------------------------------------------------------------------------

    // Menu items Route
    app.get("/api/getmenuitems", userVerifyMiddle, async(req,res)=>{
      try{
        const menuItems = await menuItemModel.find({});
        res.status(200).json({
          message: "All menu items fetched successfully",
          status: true,
          menuItems: menuItems
        });
      } catch (error) {
        console.log("Error", error);
        res.status(500).json({
          message: "Error fetching menu items",
          status: false
        });
      }
    });
   

// Single Menu item Route
app.get("/api/getmenuitem/:id", userVerifyMiddle, async (req, res) => {
  try {
    const menuItem = await menuItemModel.findById(req.params.id); 
    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found",
        status: false
      });
    }
    res.status(200).json({
      message: "Single menu item fetched successfully",
      status: true,
      menuItem: menuItem
    });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({
      message: "Error fetching menu item",
      status: false
    });
  }
});

// Create Menu item Route

app.post("/api/createmenuitem", userVerifyMiddle, async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    // Validate required fields
    if (!name || !description || !price || !image || !category) {
      return res.status(400).json({
        message: "Please provide all required fields",
        status: false
      });
    }

    // Create new menu item in the database
    const newMenuItem = new menuItemModel({
      name,
      description,
      price,
      image,
      category
    });

    await newMenuItem.save();

    res.status(201).json({
      message: "Menu item created successfully",
      status: true,
      menuItem: newMenuItem
    });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({
      message: "Error creating menu item",
      status: false
    });
  }
});

// Delete Menu Item Route
app.delete("/api/deletemenuitem/:id", userVerifyMiddle, async (req, res) => {
  try {
    const { id } = req.params; 
    
    // Find and delete the menu item by ID
    const deletedItem = await menuItemModel.findByIdAndDelete(id);
    
    if (!deletedItem) {
      return res.status(404).json({
        message: "Menu item not found",
        status: false
      });
    }
    
    res.json({
      message: "Menu item deleted successfully",
      status: true,
      deletedItem: deletedItem
    });
  } catch (error) {
    console.log("Error", error);
    res.json({
      message: "Error deleting menu item",
      status: false
    });
  }
});

// Update Menu Item Route
app.put("/api/updatemenuitem/:id", userVerifyMiddle, async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the request params
    const { name, description, price, image, category } = req.body; // Fields to update

    // Find the menu item by ID and update it
    const updatedItem = await menuItemModel.findByIdAndUpdate(id, {
      name,
      description,
      price,
      image,
      category
    }, { new: true }); 
    if (!updatedItem) {
      return res.status(404).json({
        message: "Menu item not found",
        status: false
      });
    }

    res.json({
      message: "Menu item updated successfully",
      status: true,
      updatedItem: updatedItem
    });
  } catch (error) {
    console.log("Error", error);
    res.json({
      message: "Error updating menu item",
      status: false
    });
  }
});


// Route to create a new order
app.post("/api/createorder", userVerifyMiddle, async (req, res) => {
  try {
    const { userId, products, totalPrice } = req.body;

    // Validate required fields
    if (!userId || !products || !totalPrice) {
      return res.status(400).json({
        message: "Please provide all required fields",
        status: false
      });
    }

    // Create new order in the database
    const newOrder = new orderModel({
      userId,
      products,
      totalPrice
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order created successfully",
      status: true,
      order: newOrder
    });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({
      message: "Error creating order",
      status: false
    });
  }
});


// Order Details Route
app.get("/api/getorder/:id", userVerifyMiddle, async (req, res) => {
  try {
    const orderId = req.params.id; // Order ID from request parameters
    const order = await Order.findById(orderId).populate('products.productId'); 

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        status: false
      });
    }

    res.json({
      message: "Order details fetched successfully",
      status: true,
      order: order
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: "Error fetching order details",
      status: false
    });
  }
});

// Add to Cart Route
app.post("/api/addtocart", userVerifyMiddle, async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", status: false });
    }

    // Check if the cart exists
    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      cart = new cartModel({ userId, items: [] });
    }

    // Check if product already in cart
    const existingProduct = cart.items.find(item => item.productId.toString() === productId);
    if (existingProduct) {
      existingProduct.quantity += quantity; 
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(200).json({ message: "Item added to cart", status: true, cart });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Error adding to cart", status: false });
  }
});

// Remove from Cart Route
app.delete("/api/removefromcart/:userId/:productId", userVerifyMiddle, async (req, res) => {
  try {
    const { userId, productId } = req.params;

    // Find cart by userId
    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found", status: false });
    }

    // Remove product from cart
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();

    res.status(200).json({ message: "Item removed from cart", status: true, cart });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Error removing from cart", status: false });
  }
});

// Get Cart Items Route
app.get("/api/getcartitems/:userId", userVerifyMiddle, async (req, res) => {
  try {
    const { userId } = req.params;

    // Find cart by userId
    const cart = await cartModel.findOne({ userId }).populate('items.productId');

    if (!cart) {
      return res.status(404).json({ message: "Cart not found", status: false });
    }

    res.status(200).json({ message: "Cart items fetched successfully", status: true, cart });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Error fetching cart items", status: false });
  }
});

// Payment Status Route
app.get("/api/paymentstatus/:paymentId", userVerifyMiddle, async (req, res) => {
  try {
    const { paymentId } = req.params;

   
    const payment = await paymentModel.findById(paymentId);


    res.status(200).json({ message: "Payment status fetched successfully", status: true, payment });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Error fetching payment status", status: false });
  }
});









    

app.listen(port, () => console.log('Server running'));
