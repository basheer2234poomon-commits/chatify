# 🎯 Where to Paste MongoDB Connection String in Render

Visual step-by-step guide showing exactly where to put your connection string.

---

## **Your MongoDB Connection String**

After completing [FIND_MONGODB_VALUES.md](./FIND_MONGODB_VALUES.md), you should have:

```
mongodb+srv://john_dev:securePass123!@cluster0.5p2wx.mongodb.net/chatify
```

---

## **In Render - Step 3 (Deploy Backend)**

### **Step-by-Step:**

1. **You're on Render website** → Creating Web Service
2. **After selecting your repo**, you'll see this screen:

```
┌─────────────────────────────────────────────────┐
│  Configure Web Service                          │
├─────────────────────────────────────────────────┤
│                                                 │
│  Name:              chatify-backend             │
│  Root Directory:    backend                     │
│  Build Command:     npm install                 │
│  Start Command:     npm start                   │
│                                                 │
│  ─────────────────────────────────────────     │
│  Environment Variables                          │
│  ─────────────────────────────────────────     │
│                                                 │
│  [+ Add Environment Variable]                   │
│                                                 │
└─────────────────────────────────────────────────┘
```

3. **Click** `[+ Add Environment Variable]` button

---

## **Adding First Variable - MONGODB_URI**

### After you click the + button:

```
┌─────────────────────────────────────────────────┐
│  Add Environment Variable                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  Key:                                           │
│  ┌─────────────────────────────────────────┐   │
│  │ MONGODB_URI                             │   │ ← Type this
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Value:                                         │
│  ┌─────────────────────────────────────────┐   │
│  │ mongodb+srv://john_dev:securePass123!@..│   │ ← Paste HERE
│  │ cluster0.5p2wx.mongodb.net/chatify      │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  [Add]  [Cancel]                                │
│                                                 │
└─────────────────────────────────────────────────┘
```

### **What to Enter:**

| Field | Enter |
|-------|-------|
| **Key** | `MONGODB_URI` |
| **Value** | `mongodb+srv://john_dev:securePass123!@cluster0.5p2wx.mongodb.net/chatify` |

✅ **Click "Add" button**

---

## **Adding Second Variable - JWT_SECRET**

1. **Click** `[+ Add Environment Variable]` again

```
┌─────────────────────────────────────────────────┐
│  Add Environment Variable                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  Key:                                           │
│  ┌─────────────────────────────────────────┐   │
│  │ JWT_SECRET                              │   │ ← Type this
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Value:                                         │
│  ┌─────────────────────────────────────────┐   │
│  │ your_secret_key_change_this_12345       │   │ ← Type this
│  └─────────────────────────────────────────┘   │
│                                                 │
│  [Add]  [Cancel]                                │
│                                                 │
└─────────────────────────────────────────────────┘
```

| Field | Enter |
|-------|-------|
| **Key** | `JWT_SECRET` |
| **Value** | `your_secret_key_change_this_12345` |

✅ **Click "Add" button**

---

## **Adding Third Variable - NODE_ENV**

1. **Click** `[+ Add Environment Variable]` again

```
┌─────────────────────────────────────────────────┐
│  Add Environment Variable                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  Key:                                           │
│  ┌─────────────────────────────────────────┐   │
│  │ NODE_ENV                                │   │ ← Type this
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Value:                                         │
│  ┌─────────────────────────────────────────┐   │
│  │ production                              │   │ ← Type this
│  └─────────────────────────────────────────┘   │
│                                                 │
│  [Add]  [Cancel]                                │
│                                                 │
└─────────────────────────────────────────────────┘
```

| Field | Enter |
|-------|-------|
| **Key** | `NODE_ENV` |
| **Value** | `production` |

✅ **Click "Add" button**

---

## **Adding Fourth Variable - PORT**

1. **Click** `[+ Add Environment Variable]` one more time

```
┌─────────────────────────────────────────────────┐
│  Add Environment Variable                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  Key:                                           │
│  ┌─────────────────────────────────────────┐   │
│  │ PORT                                    │   │ ← Type this
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Value:                                         │
│  ┌─────────────────────────────────────────┐   │
│  │ 3000                                    │   │ ← Type this
│  └─────────────────────────────────────────┘   │
│                                                 │
│  [Add]  [Cancel]                                │
│                                                 │
└─────────────────────────────────────────────────┘
```

| Field | Enter |
|-------|-------|
| **Key** | `PORT` |
| **Value** | `3000` |

✅ **Click "Add" button**

---

## **Final Check**

After adding all 4 variables, your screen shows:

```
┌─────────────────────────────────────────────────┐
│  Configure Web Service                          │
├─────────────────────────────────────────────────┤
│                                                 │
│  Environment Variables                          │
│  ─────────────────────────────────────────     │
│                                                 │
│  ✓ MONGODB_URI = mongodb+srv://john_dev:...    │
│  ✓ JWT_SECRET = your_secret_key_changt...      │
│  ✓ NODE_ENV = production                       │
│  ✓ PORT = 3000                                  │
│                                                 │
│  [Deploy]                                       │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## **🎉 Final Step**

Click the **[Deploy]** button at the bottom!

✅ Wait 3-5 minutes for deployment to complete.

---

## **Summary**

| Variable | Where to Paste | What You Paste |
|----------|---|---|
| **MONGODB_URI** | Key=MONGODB_URI, Value field | `mongodb+srv://john_dev:securePass123!@cluster0.5p2wx.mongodb.net/chatify` |
| **JWT_SECRET** | Key=JWT_SECRET, Value field | `your_secret_key_change_this_12345` |
| **NODE_ENV** | Key=NODE_ENV, Value field | `production` |
| **PORT** | Key=PORT, Value field | `3000` |

---

**Next:** After deployment, go to Step 4 in [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) 🚀
