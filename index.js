const express = require("express");
const cors = require("cors");
const stripe = require("stripe")("sk_test_51PtCcVK5jVVbqZFBN09dkL2zaQpZ6XIuWmJmybjsBZHmKun8Ym4ezIiEfcLCByEdeuqb1NE3hZZXGyCtWrqDedPe00SdekH9xv"); // replace with your own secret key

const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.get('/', async(req, res) => {
    res.json({message: "Hello from nodejs server"});
})

app.post('/create-checkout-session', async(req, res) => {
    try {
        const { items } = req.body;
        const line_items = await items.map(item => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity
        }));
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: "https://food-app-9bfed.web.app/success",
            cancel_url: "https://food-app-9bfed.web.app/cancel",
        });
        res.json({id: session.id});
    } catch(error){
        console.log(error);
    }
})
app.listen(4242, () => {
    console.log("server is running on port 4242");
})