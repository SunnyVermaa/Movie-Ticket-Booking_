import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import 'dotenv/config';
import {clerkMiddleware, requireAuth, getAuth} from '@clerk/express'
import { serve } from 'inngest/express'
import { inngest, functions } from "./inngest/index.js"

const app = express();
const port = 3000;

await connectDB()

//middlewares
app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())


//api routes
app.get('/',(req,res)=>res.send('server is live'));
// Set up the "/api/inngest" (recommended) routes with the serve handler
app.use("/api/inngest", serve({ client: inngest, functions }));


app.listen(port, () =>console.log(`app is listen on port https://localhost:${port}`));
