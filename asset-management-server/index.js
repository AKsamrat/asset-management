const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
// const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const port = process.env.PORT || 5000;
const app = express();

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://asset-management-3fe08.web.app',
  ],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
// app.use(cookieParser());

// verify jwt middleware
const verifyToken = (req, res, next) => {
  console.log('inside verify token', req.headers.authorization);
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'unauthorized access' });
  }

  const token = req.headers.authorization.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).send({ message: 'unauthorized access' });
    }
    console.log(decoded);

    req.decoded = decoded;
    next();
  });
};

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nj7eiar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const userCollection = client.db('assetManagement').collection('users');
    const assetCollection = client.db('assetManagement').collection('assets');
    const paymentCollection = client
      .db('assetManagement')
      .collection('payments');
    const teamCollection = client.db('assetManagement').collection('teams');
    const requestCollection = client
      .db('assetManagement')
      .collection('requests');
    const messageCollection = client
      .db('assetManagement')
      .collection('messages');

    app.post('/jwt', async (req, res) => {
      const email = req.body;
      const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '365d',
      });
      res.send({ token });
    });

    // Clear token on logout
    app.get('/logout', (req, res) => {
      res
        .clearCookie('token', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
          maxAge: 0,
        })
        .send({ success: true });
    });

    //admin verify middleware======================
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      const isAdmin = user?.role === 'Hr Manager';
      if (!isAdmin) {
        return res.status(403).send({ message: 'forbidden access' });
      }
      next();
    };

    //================================================

    //user related

    //load all user
    app.get('/all-users', verifyToken, verifyAdmin, async (req, res) => {
      // console.log(req.headers);
      const size = parseInt(req.query.size);
      const page = parseInt(req.query.page);
      const filter = {
        role: 'employee',
      };
      const result = await userCollection
        .find(filter)
        .skip(page * size)
        .limit(size)
        .toArray();
      res.send(result);
    });
    //for pagination count
    app.get('/userCount', async (req, res) => {
      const count = await userCollection.estimatedDocumentCount();
      res.send({ count });
    });

    //for role check=====================
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    //add employee in my team
    app.post('/add-employee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const hrData = req.body;
      const email = hrData.hrEmail;

      const companyEmployee = await userCollection.findOne(query);
      const updateDoc = {
        ...companyEmployee,
        hrEmail: email,
      };
      const result = await teamCollection.insertOne(updateDoc);
      res.send(result);
    });

    //add employe info
    app.patch('/employee-infoAdd/:id', async (req, res) => {
      const hrData = req.body;
      const id = req.params.id;
      const email = hrData.hrEmail;
      console.log(email);
      const hrQuery = { email: email };
      const findHrData = await userCollection.findOne(hrQuery);
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          hrData,
          companyLogo: findHrData?.companyLogo,
        },
      };

      const result = await userCollection.updateOne(query, updateDoc);

      res.send(result);
    });

    //for employee count
    app.get('/employeeCount/:email', async (req, res) => {
      const email = req.params.email;
      const query = { hrEmail: email };
      const count = await teamCollection.find(query).toArray();
      res.send(count);
    });

    //get my employee===============<<<<<<<<<<<<<<<<<<hr manager
    app.get(
      '/my-employee/:email',
      verifyToken,
      verifyAdmin,

      async (req, res) => {
        const email = req.params.email;
        // console.log(req.headers);
        const size = parseInt(req.query.size);
        const page = parseInt(req.query.page);
        const query = { hrEmail: email };

        const result = await teamCollection
          .find(query)
          .skip(page * size)
          .limit(size)
          .toArray();
        res.send(result);
      }
    );
    //get my team===============<<<<<<<<<<<<<<<<<<for employee
    app.get('/my-team/:email', async (req, res) => {
      const empEmail = req.params.email;
      const empQuery = { email: empEmail };
      const userData = await userCollection.findOne(empQuery);
      const hrData = userData?.hrData;
      const email = hrData?.hrEmail;
      const size = parseInt(req.query.size);
      const page = parseInt(req.query.page);
      const query = { hrEmail: email };

      const result = await teamCollection
        .find(query)
        .skip(page * size)
        .limit(size)
        .toArray();
      res.send(result);
    });

    //delete my employee=============/myEmployee/
    app.delete('/myEmployee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const findUser = await userCollection.updateOne(
        { _id: new ObjectId(id) },
        { $unset: { hrData: '' } }
      );
      const result = await teamCollection.deleteOne(query);
      res.send(result);
    });

    //save user data in db hr and employee

    app.put('/user', async (req, res) => {
      const user = req.body;
      const query = { email: user?.email };
      //check if user already have

      const isExist = await userCollection.findOne(query);
      if (isExist) {
        return;
      }
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          ...user,
          timestamp: Date.now(),
        },
      };
      const result = await userCollection.updateOne(query, updateDoc, option);

      res.send(result);
    });

    //profile update================
    app.patch('/profile-update/:email', async (req, res) => {
      const email = req.params.email;
      const updateData = req.body;
      const query = { email: email };
      const updateDoc = {
        $set: {
          name: updateData.name,
          updateDate: new Date(),
        },
      };
      const result = await userCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    // app.post('/users', async (req, res) => {
    //   const user = req.body;
    //   const query = { email: user.email };
    //   const existingUser = await userCollection.findOne(query);
    //   if (existingUser) {
    //     return res.send({ message: 'user already exist' });
    //   }
    //   const result = await userCollection.insertOne(user);
    //   res.send(result);
    // });

    //make admin

    //asset add api =========================>>>>
    app.post('/addAsset', async (req, res) => {
      const assetData = req.body;
      const pName = assetData.productName;
      const query = { productName: pName };
      const isExist = await assetCollection.findOne(query);
      if (isExist) return 'Product Already exist';
      const result = await assetCollection.insertOne(assetData);
      res.send(result);
    });

    //get all asset api==========<<<<<<<<<<<<<<<
    app.get('/all-assets/:email', async (req, res) => {
      const email = req.params.email;
      const size = parseInt(req.query.size);
      const page = parseInt(req.query.page);
      const search = req.query.search;
      const filter = req.query.filter;
      const sort = req.query.sort;
      const availability = req.query.availability;
      let query = {
        posterEmail: email,
      };
      if (search) {
        query = { productName: { $regex: search, $options: 'i' } };
      }
      if (filter) query.productType = filter;
      if (availability) query.status = availability;
      let options = {};

      const result = await assetCollection
        .find(query)
        .sort({ productQty: sort === 'asc' ? 1 : -1 })
        .skip(page * size)
        .limit(size)
        .toArray();
      res.send(result);
    });
    //get top requested asset api==========<<<<<<<<<<<<<<<
    app.get('/topReq-items/:email', async (req, res) => {
      const size = parseInt(req.query.size);
      const email = req.params.email;
      const sort = req.query.sort;
      const query = { posterEmail: email };

      const result = await assetCollection
        .find(query)
        .sort({ reqCount: sort === 'dec' ? -1 : 1 })
        .limit(size)
        .toArray();
      res.send(result);
    });
    //get limited stock items api==========<<<<<<<<<<<<<<<
    app.get('/limitedStock-items/:email', async (req, res) => {
      const size = parseInt(req.query.size);
      const email = req.params.email;
      const sort = req.query.sort;

      const result = await assetCollection
        .find({ posterEmail: email, productQty: { $lt: 10 } })
        .sort({ productQty: sort === 'asc' ? 1 : -1 })
        .limit(size)
        .toArray();
      res.send(result);
    });

    ///pie chart data =============generate
    app.get('/hr-pieChart/:email', async (req, res) => {
      const email = req.params.email;
      const filter = req.query.filter;
      const filter2 = req.query.filter2;
      let query = { posterEmail: email };
      if (filter) query.assetType = filter;
      let query2 = { posterEmail: email };
      if (filter2) query2.assetType = filter2;
      const returnable = await requestCollection.find(query).toArray();
      const reCount = returnable.length;
      const nonReturnable = await requestCollection.find(query2).toArray();
      const nonCount = nonReturnable.length;
      // console.log(reCount);
      res.send({ reCount, nonCount });
    });

    //get all asset asset for employee ======<<<<<<<<<<<<<<

    app.get('/employee-assets', async (req, res) => {
      const size = parseInt(req.query.size);
      const page = parseInt(req.query.page);
      const search = req.query.search;
      const filter = req.query.filter;
      const sort = req.query.sort;
      let query = {
        productName: { $regex: search, $options: 'i' },
      };
      if (filter) query.productType = filter;
      if (sort) query.status = sort;

      const result = await assetCollection
        .find(query)
        .skip(page * size)
        .limit(size)
        .toArray();
      res.send(result);
    });
    //get all requested asset for employee ======<<<<<<<<<<<<<<

    app.get('/requested-assets/:email', async (req, res) => {
      const email = req.params.email;
      const size = parseInt(req.query.size);
      const page = parseInt(req.query.page);
      const search = req.query.search;
      const filter = req.query.filter;
      const sort = req.query.sort;
      let query = {
        reqEmail: email,
      };
      if (search) {
        query = {
          assetName: { $regex: search, $options: 'i' },
        };
      }
      if (filter) query.assetType = filter;
      if (sort) query.reqStatus = sort;

      const result = await requestCollection
        .find(query)
        .skip(page * size)
        .limit(size)
        .toArray();
      res.send(result);
    });
    //01777311537
    //get all pending asset for employee home page

    app.get('/pending-request/:email', async (req, res) => {
      const email = req.params.email;
      const filter = req.query.filter;
      const userQuery = { email: email };
      const query = { reqEmail: email };
      const userData = await userCollection.findOne(userQuery);
      if (filter) query.reqStatus = filter;
      const result = await requestCollection.find(query).toArray();
      res.send({ result, userData });
    });
    //get all pending asset for Hr manager home page

    app.get('/pending-requestHr/:email', async (req, res) => {
      const email = req.params.email;
      const filter = req.query.filter;
      const size = 5;
      let query = { posterEmail: email };
      if (filter) query.reqStatus = filter;
      const result = await requestCollection.find(query).limit(size).toArray();
      res.send(result);
    });
    //get all request  for employee home page

    app.get('/empAll-request/:email', async (req, res) => {
      const email = req.params.email;
      const query = { reqEmail: email };

      let currentDate = new Date();
      let lastMonthDate = new Date();
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

      const result = await requestCollection
        .find({
          reqEmail: email,
          reqDate: {
            $gte: lastMonthDate.toISOString(),
            $lt: currentDate.toISOString(),
          },
        })
        .toArray();
      // const result = await requestCollection.find(query).aggregate().toArray();
      res.send(result);
    });

    //get all requested asset for Hr manager ======<<<<<<<<<<<<<<

    app.get(
      '/requestedAssets-hrManger/:email',
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        const email = req.params.email;
        const size = parseInt(req.query.size);
        const page = parseInt(req.query.page);
        const search = req.query.search;

        let query = {
          posterEmail: email,
        };
        if (search) {
          query = { reqName: { $regex: search, $options: 'i' } };
        }

        const result = await requestCollection
          .find(query)
          .skip(page * size)
          .limit(size)
          .toArray();
        res.send(result);
      }
    );

    //delete asset from database======-----------------
    app.delete('/asset/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await assetCollection.deleteOne(query);
      res.send(result);
    });
    //load single asset for update
    app.get('/singleAsset/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await assetCollection.findOne(query);
      res.send(result);
    });

    //update asset data
    app.put('/updateAsset/:id', async (req, res) => {
      const id = req.params.id;
      const assetData = req.body;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: assetData,
      };
      const result = await assetCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    // message section========================........>>>>>>>>>>>>>
    app.post('/send-massage', async (req, res) => {
      const messageData = req.body;
      const email = messageData.empEmail;
      const query = { reqEmail: email };
      const empDetails = await requestCollection.findOne(query);
      console.log(empDetails);
      const updateDoc = {
        ...messageData,
        hrEmail: empDetails.posterEmail,
      };
      const result = await messageCollection.insertOne(updateDoc);
      res.send(result);
    });
    app.patch('/message-reply/:id', async (req, res) => {
      const id = req.params.id;
      const messageData = req.body;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          ...messageData,
          status: 'replied',
        },
      };

      const result = await messageCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    //load employee query message=================,<<<<<<<<<<<<
    app.get('/query-empMessage/:email', async (req, res) => {
      const email = req.params.email;
      const query = { hrEmail: email };
      const result = await messageCollection.find(query).toArray();
      res.send(result);
    });
    //load employee query reply message=================,<<<<<<<<<<<<
    app.get('/reply-empMessage/:email', async (req, res) => {
      const email = req.params.email;
      const query = { empEmail: email };
      const result = await messageCollection.find(query).toArray();
      res.send(result);
    });

    //pagination asset----------------------

    app.get('/assetsCount', async (req, res) => {
      const count = await assetCollection.estimatedDocumentCount();
      res.send({ count });
    });

    //for hr=====================
    app.get('/requestAssetsCount', async (req, res) => {
      const count = await requestCollection.estimatedDocumentCount();
      res.send({ count });
    });

    //for employee=======================
    app.get('/requestAssetsCountEmp/:email', async (req, res) => {
      const email = req.params.email;
      const query = { reqEmail: email };
      // const result = await requestCollection.find(query).toArray();

      const count = await requestCollection.estimatedDocumentCount();
      res.send({ count });
      // res.send(result);
    });
    ///check employee affiliation===============
    app.get('/employee-check/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };

      const count = await teamCollection.findOne(query);
      res.send(count);
      // res.send(result);
    });

    //request for asset=================>>>>>>>>>>>
    app.post('/requestAsset', async (req, res) => {
      const requesterData = req.body;
      const id = requesterData.assetId;
      const query = { _id: new ObjectId(id) };
      const updateData = {
        $inc: { reqCount: 1 },
      };
      const countPlus = await assetCollection.updateOne(query, updateData);

      const result = await requestCollection.insertOne(requesterData);
      res.send(result);
    });

    //reject request from hr manager==================
    app.delete('/reject-request/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await requestCollection.deleteOne(query);
      res.send(result);
    });

    //approve request===========================
    app.patch('/approve-request/:id', async (req, res) => {
      const id = req.params.id;
      const piD = req.body.assetId;
      console.log(piD);
      const pQuery = { _id: new ObjectId(piD) };
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          reqStatus: 'approved',
          appDate: new Date(),
        },
      };
      const updateData = {
        $inc: { productQty: -1 },
      };

      const PData = await assetCollection.updateOne(pQuery, updateData);

      const result = await requestCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    // return policy and increase asset quantity===========================

    app.patch('/increase-qty/:id', async (req, res) => {
      const id = req.params.id;
      const piD = req.body.assetId;
      // console.log(piD);
      const pQuery = { _id: new ObjectId(piD) };
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          reqStatus: 'returned',
        },
      };
      const updateData = {
        $inc: { productQty: 1 },
      };

      const PData = await assetCollection.updateOne(pQuery, updateData);

      const result = await requestCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    //payment system implementation========================

    app.post('/create-payment-intent', async (req, res) => {
      const { price } = req.body;
      const amount = parseInt(price * 100);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd',
        payment_method_types: ['card'],
      });
      res.send({ clientSecret: paymentIntent.client_secret });
    });

    app.post('/payments', async (req, res) => {
      const payment = req.body;
      const email = req.body.email;
      const query = { email };
      // payment.menuItemId = payment.menuItemId.map(id => new ObjectId(id));
      // payment.cartId = payment.cartId.map(id => new ObjectId(id));
      const result = await paymentCollection.insertOne(payment);

      res.send(result);
    });

    //mr manager payment check
    app.get('/payment-check/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await paymentCollection.find(query).toArray();

      res.send(result);
    });

    //count employee==================<<<<<<<<<<<<<<<<<<
    app.get('/employee-count/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const myPayment = await paymentCollection.find(query).toArray();
      res.send(myPayment);
    });

    // app.get('/payments/:email', verifyToken, async (req, res) => {
    //   const query = { email: req.params.email };
    //   if (req.params.email !== req.decoded.email) {
    //     return res.status(403).send({ message: 'forbidden access' });
    //   }
    //   const result = await paymentCollection.find(query).toArray();
    //   res.send(result);
    // });

    //statistics ans analytics

    // app.get('/admin-stats', verifyToken, verifyAdmin, async (req, res) => {
    //   const user = await userCollection.estimatedDocumentCount();
    //   const menuItems = await menuCollection.estimatedDocumentCount();
    //   const orders = await paymentCollection.estimatedDocumentCount();
    //   // const payment = await paymentCollection.find().toArray();
    //   // const revenue = await payment.reduce(
    //   //   (total, payment) => total + payment.price,
    //   //   0
    //   // );
    //   const result = await paymentCollection
    //     .aggregate([
    //       {
    //         $group: {
    //           _id: null,
    //           totalRevenue: {
    //             $sum: '$price',
    //           },
    //         },
    //       },
    //     ])
    //     .toArray();
    //   const revenue = result.length > 0 ? result[0].totalRevenue : 0;
    //   res.send({ user, menuItems, orders, revenue });
    // });

    //order status=============
    // app.get('/order-stats', async (req, res) => {
    //   const result = await paymentCollection
    //     .aggregate([
    //       {
    //         $unwind: '$menuItemId',
    //       },
    //       {
    //         $lookup: {
    //           from: 'menu',
    //           localField: 'menuItemId',
    //           foreignField: '_id',
    //           as: 'menuItems',
    //         },
    //       },
    //       {
    //         $unwind: '$menuItems',
    //       },
    //       {
    //         $group: {
    //           _id: '$menuItems.category',
    //           quantity: { $sum: 1 },
    //           revenue: { $sum: '$menuItems.price' },
    //         },
    //       },
    //       {
    //         $project: {
    //           _id: 0,
    //           category: '$_id',
    //           quantity: '$quantity',
    //           revenue: '$revenue',
    //         },
    //       },
    //     ])
    //     .toArray();
    //   res.send(result);
    // });

    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('Hello from asset management Server....');
});

app.listen(port, () => console.log(`Server running on port ${port}`));
