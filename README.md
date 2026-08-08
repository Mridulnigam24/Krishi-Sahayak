# KRISHI SHAYAK

Build a complete web app called DukaanMitra — AI-powered assistant for Indian kirana stores. Use React + TypeScript + Tailwind CSS + shadcn/ui. NO authentication, NO Supabase, NO login — pure frontend with localStorage for data persistence.

MODE SWITCHER

Top navbar mein do buttons:

Shopkeeper mode (green #16a34a theme)

Customer mode (purple #7c3aed theme)

Default: Shopkeeper mode open hoga.

SHOPKEEPER MODE (Green theme)

Dashboard

Header: "Namaste! Krishna General Store" + aaj ki date

4 metric cards: Aaj ka Profit, Monthly Profit, Total Udhaar, Aaj ke Orders — all from localStorage data

Best selling product (green card)

Worst selling product (red card)

Quick action buttons: Bill Banao, Add Udhaar, Verify UPI

Recent orders list

Udhaar Tracker

List of customers with pending amount from localStorage

Each card: naam, amount, din pending, red badge if 30+ days

"WhatsApp Remind" button — opens wa.me/?text= with pre-filled Hinglish message

Add udhaar form: customer naam, amount, date

Partial payment entry: amount received → auto calculate remaining

Voice button (mock — show toast "Voice feature coming soon")

Search/filter

Menu Manager

Product list from localStorage: naam, price, stock, category

Toggle show/hide for customer view

Add/edit/delete product form

Low stock badge (red) when stock < 5

Pre-loaded with 6 sample products: Parle-G ₹10, Surf Excel ₹45, Maggi ₹14, Lays ₹20, Colgate ₹55, Dettol ₹85

Bill Generator

Customer naam input

Add items + quantity

Auto calculate: subtotal, GST 18%, total

Bill preview: Krishna General Store header, date, items, GST, total

"WhatsApp pe Bhejo" → wa.me/?text= with full bill in Hinglish

"Download as PDF" button using jsPDF

Fake Payment Detector

Upload screenshot area

Show loading for 2 seconds

Then randomly show:

VERIFIED ✅ (green) — "Payment real hai"

FAKE DETECTED ❌ (red) — show issues: "Font mismatch", "Invalid transaction ID", "Timestamp galat"

Analytics

Bar chart: last 7 days sales (recharts) — dummy data

Pie chart: category-wise sales

Top 5 products table

Monthly profit line chart

"Export CSV" button

Daily Summary Card

Aaj ka total: sales, profit, orders, udhaar collected

"WhatsApp pe Share" button with summary text

CUSTOMER MODE (Purple theme)

Store Discovery

Search bar: "Apne paas ki dukaan dhundo"

Location shown: "Greater Noida, UP"

3 store cards (hardcoded):

Krishna General Store — 0.2 km — Open — 4.2⭐ — GREEN badge

Sharma General Store — 0.5 km — Open — 4.0⭐

Gupta Kirana — 0.8 km — Closed

Click store → go to menu

Store Menu (Krishna General Store)

Store header: naam, timing 9AM-9PM, rating

Product grid (2 col mobile, 3 col desktop) from same localStorage products

Each product: naam, price, +/- quantity buttons

Floating cart button with count + total

Cart Page

Items list with quantity controls

Subtotal, GST 18%, Total

Order type: Walk-in Pickup — "FREE · 15 min mein ready hoga"

Customer naam + phone input

"Order Place Karo" button → saves to localStorage orders

Order Confirmation

Green checkmark animation

Order ID auto-generated

Items summary

"WhatsApp pe Confirmation" button → wa.me/?text= with order details

Status tracker: Placed → Preparing → Ready for Pickup

Order History

List of past orders from localStorage

Reorder button

WHATSAPP INTEGRATION (all via wa.me links)

Udhaar reminder: "Namaste [naam] Ji, Krishna General Store se yaad dila rahe hain — aapka ₹[amount] baaki hai. Suvidha ho toh aaj aa jaiye. Dhanyawaad! 🙏"

Order confirmation: "Aapka order #[ID] ready hai! 15 min mein aa jaiye. — Krishna General Store 🏪"

Daily summary: "Aaj ka report 📊 Bikri: ₹[X] | Profit: ₹[Y] | Orders: [Z]"

Bill: full itemized text

DATA (localStorage)

Pre-load sample udhaar data:

Ramesh Kumar — ₹600 — 38 din

Suresh Sharma — ₹1200 — 52 din

Pinki Devi — ₹350 — 15 din

Raju Bhaiya — ₹800 — 60 din

Pre-load sample products (6 items above)

Pre-load sample transactions for analytics

DESIGN

Mobile-first responsive

Shopkeeper: green #16a34a theme

Customer: purple #7c3aed theme

Hinglish text throughout

₹ symbol everywhere

Smooth modern UI like Swiggy/Zomato

Toast notifications for all actions

Loading skeletons

Empty states in Hinglish

No auth. No backend. No Supabase. Pure React + localStorage. Ship everything in one go.

Bhai yeh paste kar Lovable mein — kal credits reset honge tab daal dena. Yeh version:

✅ Login nahi — seedha app

✅ localStorage — data persist hoga

✅ Fast build — ek hi pass mein

✅ WhatsApp links — real integration

✅ Demo ready — kisi ko bhi dikhao 🚀

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/faf2fc32-c8d8-4812-b941-54c5f62ba1b6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
