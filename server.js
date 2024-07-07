import express from "express";
import dotenv from "dotenv";
import Stripe from "stripe";
//carregando variaveis
dotenv.config();
// start server
const app = express();

app.use(express.static("public"));
app.use(express.json());
// rota de teste
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});
//sucesso
app.get("/succsess", (req, res) => {
    res.sendFile("success.html", { root: "public" });
  });
//cancelamento
app.get("/cancel", (req, res) => {
    res.sendFile("cancel.html", { root: "public" });
  });
//stripe
let stripeGateway = Stripe(process.env.stripe_api);
let DOMAIN = process.env.DOMAIN;

app.post('/stripe-checkout',async (req,res)=>{
    const lineItems = req.body.items.map((item)=>{
        const unitAmount= parseInt(item.price.replace(/[^0-9.-]+/g, '')* 100);
        console.log('item-price = ', item.price);
        console.log('unitAmount = ', unitAmount);
        return{
            price_data:{
                currency:'usd',
                product_data:{
                    name:item.title,
                    images: [item.productImg],


                },
                unit_amount:unitAmount,
            },
            quantity:item.quantity,
        }
    });
    console.log('lineItems = ', lineItems);
    //criando o checkout
    const session = await stripeGateway.checkout.sessions.create({
        payment_method_types:['card'],
       
        mode:'payment',
        success_url:`${DOMAIN}/success.html`,
        cancel_url:`${DOMAIN}/cancel.html`,
        line_items:lineItems,
        //procurando endereço stripe no checkout page
        billing_andress_colection:'required'
    });
    res.json(session.url);
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
