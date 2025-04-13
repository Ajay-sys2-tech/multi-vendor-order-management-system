const request = require('supertest');
let http = require("http");
const { vendorAuth } = require('../middlewares/auth');

const app = require("../app");
const { getProducts, createProduct } = require('../services/product');



jest.mock('../services/product', () => {
    return {
        getProducts: jest.fn(), 
        createProduct: jest.fn(),
    };
  });


  let server;

  beforeAll((done) => {
    server = http.createServer(app);
    server.listen(3008, done);
  });
  
  afterAll((done) => {
    server.close(done);
  });
  

describe('GET /products', () => {
    it('should return a 200 status and products', async () => {
        const products = [
            {
              _id: "67f81d5e45aeb385e75c423c",
              name: "Shirt",
              price: 360,
              stock: 43,
              vendorId: "67f8090bd7beee2483d6723e",
              category: "clothing",
              createdAt: "2025-04-10T19:34:54.037Z",
              updatedAt: "2025-04-12T05:56:20.915Z",
              __v: 0
            },
            {
              _id: "67f92577526bce1f548330e5",
              name: "Sneakers",
              price: 750,
              stock: 17,
              vendorId: "67f924fd526bce1f548330db",
              category: "footwear",
              createdAt: "2025-04-11T14:21:43.525Z",
              updatedAt: "2025-04-12T14:15:34.955Z",
              __v: 0
            },
            {
              _id: "67f92584526bce1f548330e7",
              name: "Backpack",
              price: 540,
              stock: 21,
              vendorId: "67f924fd526bce1f548330db",
              category: "accessories",
              createdAt: "2025-04-11T14:21:56.377Z",
              updatedAt: "2025-04-11T18:53:59.069Z",
              __v: 0
            },
            {
              _id: "67f9258e526bce1f548330e9",
              name: "Jeans",
              price: 690,
              stock: 26,
              vendorId: "67f924fd526bce1f548330db",
              category: "clothing",
              createdAt: "2025-04-11T14:22:06.275Z",
              updatedAt: "2025-04-11T19:47:14.222Z",
              __v: 0
            },
            {
              _id: "67f925ae526bce1f548330ec",
              name: "Wristwatch",
              price: 1200,
              stock: 10,
              vendorId: "67f92509526bce1f548330de",
              category: "accessories",
              createdAt: "2025-04-11T14:22:38.990Z",
              updatedAt: "2025-04-11T14:22:38.990Z",
              __v: 0
            },
            {
              _id: "67f925b8526bce1f548330ee",
              name: "Jacket",
              price: 980,
              stock: 15,
              vendorId: "67f92509526bce1f548330de",
              category: "clothing",
              createdAt: "2025-04-11T14:22:48.862Z",
              updatedAt: "2025-04-11T19:47:14.222Z",
              __v: 0
            },
            {
              _id: "67f925c4526bce1f548330f0",
              name: "Sandals",
              price: 420,
              stock: 18,
              vendorId: "67f92509526bce1f548330de",
              category: "footwear",
              createdAt: "2025-04-11T14:23:00.006Z",
              updatedAt: "2025-04-11T14:23:00.006Z",
              __v: 0
            },
            {
              _id: "67f925d2526bce1f548330f2",
              name: "Cap",
              price: 250,
              stock: 40,
              vendorId: "67f92509526bce1f548330de",
              category: "accessories",
              createdAt: "2025-04-11T14:23:14.227Z",
              updatedAt: "2025-04-11T14:23:14.227Z",
              __v: 0
            },
            {
              _id: "67f925ef526bce1f548330f5",
              name: "Sweater",
              price: 580,
              stock: 22,
              vendorId: "67f92513526bce1f548330e1",
              category: "clothing",
              createdAt: "2025-04-11T14:23:43.567Z",
              updatedAt: "2025-04-11T14:23:43.567Z",
              __v: 0
            },
            {
              _id: "67f925f9526bce1f548330f7",
              name: "Socks",
              price: 120,
              stock: 100,
              vendorId: "67f92513526bce1f548330e1",
              category: "clothing",
              createdAt: "2025-04-11T14:23:53.030Z",
              updatedAt: "2025-04-11T14:23:53.030Z",
              __v: 0
            },
            {
              _id: "67f92604526bce1f548330f9",
              name: "Boots",
              price: 1100,
              stock: 8,
              vendorId: "67f92513526bce1f548330e1",
              category: "footwear",
              createdAt: "2025-04-11T14:24:04.057Z",
              updatedAt: "2025-04-11T14:24:04.057Z",
              __v: 0
            },
            {
              _id: "67fa828a957c0441070fd3bc",
              name: "Leather Belt",
              price: 700,
              stock: 38,
              vendorId: "67f92513526bce1f548330e1",
              category: "accessories",
              createdAt: "2025-04-12T15:11:06.389Z",
              updatedAt: "2025-04-12T17:19:41.898Z",
              __v: 0
            }
          ];
          
        getProducts.mockResolvedValue(products);
        const response = await request(app).get('/products');
        
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return a 404 status', async () => {
        getProducts.mockResolvedValue([]);
        const response = await request(app).get('/products');
        
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "No products found." });
    });
  });



  describe('POST /products', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 403 when auth token is not present', async () => {
        const response = await request(app).post('/products');
        expect(response.status).toBe(403);
        expect(response.body).toEqual({ error: "Access denied. No token provided." });
    });

    it('should return 401 for invalid auth token', async () => {
        let token = "invalidToken";
        const response = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'New Product' });
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ error: "Invalid or expired token." });
    });


    it('should create a product and return 201 status code', async () => {
        let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjkyNTEzNTI2YmNlMWY1NDgzMzBlMSIsImVtYWlsIjoidmVuZG9yNEBnbWFpbC5jb20iLCJyb2xlIjoidmVuZG9yIiwiaWF0IjoxNzQ0MzgxNDAxfQ.t0Whkw6Oe3gKyUFgTkcwo-snbgGchTyqHNDcLZU5g2E"
        createProduct.mockResolvedValue({
            _id: "67f81d5e45aeb385e75c423c",
            name: "New Product",
            price: 500,
            stock: 10,
            vendorId: "123",
            category: "electronics",
            createdAt: "2025-04-12T19:34:54.037Z",
            updatedAt: "2025-04-12T19:34:54.037Z",
            __v: 0
        });
        const response = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send({  
            name: "New Product",
            price: 500,
            stock: 10,
            category: "electronics",
        });
        expect(response.status).toBe(201);
        expect(response.body.message).toEqual("Product created");
        expect(response.body.product.name).toEqual("New Product")
    });

    it('should return 400 validation error when a field is missing', async () => {
      let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjkyNTEzNTI2YmNlMWY1NDgzMzBlMSIsImVtYWlsIjoidmVuZG9yNEBnbWFpbC5jb20iLCJyb2xlIjoidmVuZG9yIiwiaWF0IjoxNzQ0MzgxNDAxfQ.t0Whkw6Oe3gKyUFgTkcwo-snbgGchTyqHNDcLZU5g2E"
      createProduct.mockResolvedValue({
          _id: "67f81d5e45aeb385e75c423c",
          name: "New Product",
          price: 500,
          stock: 10,
          vendorId: "123",
          category: "electronics",
          createdAt: "2025-04-12T19:34:54.037Z",
          updatedAt: "2025-04-12T19:34:54.037Z",
          __v: 0
      });
      const response = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({  
          name: "New Product",
          price: 500,
          stock: 10,
      });
      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual([{"message": "Required", "path": "category"}]);
  });


   
  });