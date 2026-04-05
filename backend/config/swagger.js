const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'EzyOrder API',
    version: '1.0.0',
    description: 'REST API + Socket.IO สำหรับระบบ EzyOrder — สั่งอาหารผ่าน QR Code',
  },
  servers: [{ url: 'http://localhost:8080', description: 'Development server' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token จาก POST /api/auth/login หรือ POST /api/auth/register',
      },
    },
    schemas: {
      // ─── Auth ────────────────────────────────────────────────
      RegisterRequest: {
        type: 'object',
        required: ['restaurantName', 'name', 'email', 'password'],
        properties: {
          restaurantName: { type: 'string', example: 'ร้านอาหารของฉัน' },
          name: { type: 'string', example: 'สมชาย ใจดี' },
          email: { type: 'string', format: 'email', example: 'somchai@example.com' },
          password: { type: 'string', minLength: 8, example: 'password123' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'somchai@example.com' },
          password: { type: 'string', example: 'password123' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '664abc123000000000000001' },
              name: { type: 'string', example: 'สมชาย ใจดี' },
              email: { type: 'string', example: 'somchai@example.com' },
              role: { type: 'string', enum: ['admin', 'staff'] },
              restaurantId: { type: 'string', example: '664def456000000000000001' },
            },
          },
        },
      },
      // ─── Restaurant ──────────────────────────────────────────
      Restaurant: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '664def456000000000000001' },
          name: { type: 'string', example: 'ร้านอาหารของฉัน' },
          logo: { type: 'string', example: '/uploads/logo.jpg' },
          address: { type: 'string', example: '123 ถนนสุขุมวิท กรุงเทพฯ' },
          phone: { type: 'string', example: '02-123-4567' },
          openingHours: {
            type: 'object',
            example: { mon: '09:00-21:00', tue: '09:00-21:00', wed: 'closed' },
          },
          promptPayQR: { type: 'string', example: 'data:image/png;base64,...' },
          tableCount: { type: 'integer', example: 10 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      UpdateRestaurantRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'ชื่อร้านใหม่' },
          address: { type: 'string', example: 'ที่อยู่ใหม่' },
          phone: { type: 'string', example: '02-999-8888' },
          openingHours: { type: 'object', example: { mon: '10:00-22:00' } },
          promptPayQR: { type: 'string', example: 'data:image/png;base64,...' },
          tableCount: { type: 'integer', example: 15 },
        },
      },
      // ─── Category ────────────────────────────────────────────
      Category: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '664cat001000000000000001' },
          restaurantId: { type: 'string', example: '664def456000000000000001' },
          name: { type: 'string', example: 'อาหารจานหลัก' },
          sortOrder: { type: 'integer', default: 0, example: 1 },
          isActive: { type: 'boolean', default: true, example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CategoryRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', example: 'เครื่องดื่ม' },
          sortOrder: { type: 'integer', default: 0, example: 2 },
        },
      },
      UpdateCategoryRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'เครื่องดื่มและของหวาน' },
          sortOrder: { type: 'integer', example: 3 },
          isActive: { type: 'boolean', example: false },
        },
      },
      // ─── MenuItem ────────────────────────────────────────────
      MenuItemOption: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'ความเผ็ด' },
          required: { type: 'boolean', example: true },
          choices: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'เผ็ดมาก' },
                extraPrice: { type: 'number', example: 5 },
              },
            },
          },
        },
      },
      MenuItem: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '664menu001000000000000001' },
          restaurantId: { type: 'string', example: '664def456000000000000001' },
          categoryId: { type: 'string', example: '664cat001000000000000001' },
          name: { type: 'string', example: 'ข้าวผัดกุ้ง' },
          description: { type: 'string', example: 'ข้าวผัดกุ้งสูตรพิเศษ' },
          price: { type: 'number', example: 89 },
          image: { type: 'string', example: '/uploads/fried-rice.jpg' },
          options: { type: 'array', items: { $ref: '#/components/schemas/MenuItemOption' } },
          isAvailable: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      // ─── Table ───────────────────────────────────────────────
      Table: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '664tbl001000000000000001' },
          restaurantId: { type: 'string', example: '664def456000000000000001' },
          tableNumber: { type: 'integer', example: 1 },
          status: { type: 'string', enum: ['available', 'occupied', 'payment'], example: 'available' },
          currentSessionId: { type: 'string', nullable: true, example: 'a1b2c3d4-uuid' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      // ─── Order ───────────────────────────────────────────────
      OrderItem: {
        type: 'object',
        properties: {
          menuItemId: { type: 'string', example: '664menu001000000000000001' },
          name: { type: 'string', example: 'ข้าวผัดกุ้ง' },
          price: { type: 'number', example: 89 },
          quantity: { type: 'integer', example: 2 },
          options: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'ความเผ็ด' },
                choice: { type: 'string', example: 'เผ็ดมาก' },
                extraPrice: { type: 'number', example: 5 },
              },
            },
          },
          note: { type: 'string', example: 'ไม่ใส่ผัก' },
        },
      },
      Order: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '664ord001000000000000001' },
          restaurantId: { type: 'string', example: '664def456000000000000001' },
          tableId: { type: 'string', example: '664tbl001000000000000001' },
          sessionId: { type: 'string', example: 'a1b2c3d4-uuid' },
          items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
          status: {
            type: 'string',
            enum: ['pending', 'accepted', 'cooking', 'ready', 'served'],
            example: 'pending',
          },
          totalAmount: { type: 'number', example: 188 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      PlaceOrderRequest: {
        type: 'object',
        required: ['items'],
        properties: {
          items: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              required: ['menuItemId'],
              properties: {
                menuItemId: { type: 'string', example: '664menu001000000000000001' },
                quantity: { type: 'integer', minimum: 1, default: 1, example: 2 },
                options: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string', example: 'ความเผ็ด' },
                      choice: { type: 'string', example: 'เผ็ดมาก' },
                      extraPrice: { type: 'number', example: 5 },
                    },
                  },
                },
                note: { type: 'string', example: 'ไม่ใส่ผัก' },
              },
            },
          },
        },
      },
      // ─── Bill ────────────────────────────────────────────────
      Bill: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '664bill01000000000000001' },
          restaurantId: { type: 'string', example: '664def456000000000000001' },
          tableId: { type: 'string', example: '664tbl001000000000000001' },
          sessionId: { type: 'string', example: 'a1b2c3d4-uuid' },
          orders: { type: 'array', items: { type: 'string' }, example: ['664ord001...'] },
          totalAmount: { type: 'number', example: 376 },
          paymentMethod: { type: 'string', enum: ['cash', 'promptpay'], example: 'cash' },
          paymentStatus: { type: 'string', enum: ['pending', 'paid'], example: 'paid' },
          paidAt: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      TableBillResponse: {
        type: 'object',
        properties: {
          tableId: { type: 'string', example: '664tbl001000000000000001' },
          tableNumber: { type: 'integer', example: 1 },
          sessionId: { type: 'string', example: 'a1b2c3d4-uuid' },
          orders: { type: 'array', items: { $ref: '#/components/schemas/Order' } },
          totalAmount: { type: 'number', example: 376 },
        },
      },
      // ─── Error ───────────────────────────────────────────────
      Error: {
        type: 'object',
        properties: { message: { type: 'string', example: 'Not found' } },
      },
      ValidationError: {
        type: 'object',
        properties: {
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string' },
                message: { type: 'string' },
              },
            },
          },
        },
      },
    },
    responses: {
      Unauthorized: {
        description: '401 — ไม่มี token หรือ token หมดอายุ',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
      Forbidden: {
        description: '403 — Role ไม่พอ หรือไม่ใช่ของร้านตัวเอง',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
      NotFound: {
        description: '404 — ไม่พบข้อมูล',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
    },
  },
  tags: [
    { name: 'Public', description: 'Endpoints สาธารณะ — ลูกค้าใช้ดูเมนู/หมวดหมู่/ข้อมูลร้าน โดยไม่ต้อง login' },
    { name: 'Auth', description: 'ลงทะเบียน / เข้าสู่ระบบ / ข้อมูลผู้ใช้' },
    { name: 'Restaurant', description: 'จัดการข้อมูลร้านอาหาร' },
    { name: 'Category', description: 'จัดการหมวดหมู่เมนู' },
    { name: 'Menu', description: 'จัดการรายการเมนู' },
    { name: 'Table', description: 'จัดการโต๊ะและ QR Code' },
    { name: 'Order', description: 'สั่งอาหาร / อัพเดตสถานะออเดอร์' },
    { name: 'Bill', description: 'ดูบิล / ชำระเงิน' },
    { name: 'Report', description: 'รายงานยอดขาย (Admin เท่านั้น)' },
  ],
  paths: {
    // ═══════════════════════════════════════════════════════════
    // PUBLIC (no auth required)
    // ═══════════════════════════════════════════════════════════
    '/api/public/restaurant/{id}': {
      get: {
        tags: ['Public'],
        summary: 'ข้อมูลพื้นฐานของร้าน (ชื่อ / เบอร์ / ที่อยู่)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Restaurant ObjectId' }],
        responses: {
          200: {
            description: 'ข้อมูลร้าน',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    _id: { type: 'string', example: '664def456000000000000001' },
                    name: { type: 'string', example: 'ร้านอาหารของฉัน' },
                    phone: { type: 'string', example: '02-123-4567' },
                    address: { type: 'string', example: '123 ถนนสุขุมวิท กรุงเทพฯ' },
                  },
                },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/api/public/restaurant/{id}/categories': {
      get: {
        tags: ['Public'],
        summary: 'หมวดหมู่เมนูที่เปิดใช้งาน (isActive = true)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Restaurant ObjectId' }],
        responses: {
          200: {
            description: 'รายการหมวดหมู่',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Category' } } } },
          },
        },
      },
    },
    '/api/public/restaurant/{id}/menu': {
      get: {
        tags: ['Public'],
        summary: 'รายการเมนูที่พร้อมขาย (isAvailable = true)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Restaurant ObjectId' }],
        responses: {
          200: {
            description: 'รายการเมนู',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/MenuItem' } } } },
          },
        },
      },
    },
    '/api/public/restaurant/{id}/table-by-number/{num}': {
      get: {
        tags: ['Public'],
        summary: 'ค้นหาโต๊ะด้วยหมายเลขโต๊ะ — ใช้ตอนสแกน QR Code',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Restaurant ObjectId' },
          { name: 'num', in: 'path', required: true, schema: { type: 'integer' }, description: 'หมายเลขโต๊ะ', example: 3 },
        ],
        responses: {
          200: {
            description: 'ข้อมูลโต๊ะ',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Table' } } },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    // ═══════════════════════════════════════════════════════════
    // AUTH
    // ═══════════════════════════════════════════════════════════
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'ลงทะเบียนร้านอาหารใหม่ (สร้าง Admin account)',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } },
        },
        responses: {
          201: {
            description: 'ลงทะเบียนสำเร็จ — คืน token + ข้อมูล user + restaurant',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/AuthResponse' },
                    {
                      type: 'object',
                      properties: {
                        restaurant: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', example: '664def456000000000000001' },
                            name: { type: 'string', example: 'ร้านอาหารของฉัน' },
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: { description: '400 — Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationError' } } } },
          409: { description: '409 — Email already in use', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'เข้าสู่ระบบ',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
        },
        responses: {
          200: {
            description: 'เข้าสู่ระบบสำเร็จ — คืน token + ข้อมูล user',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } },
          },
          400: { description: '400 — Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationError' } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'ดูข้อมูล user ของตัวเอง',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'ข้อมูล user',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    _id: { type: 'string' },
                    restaurantId: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                    role: { type: 'string', enum: ['admin', 'staff'] },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    // ═══════════════════════════════════════════════════════════
    // RESTAURANT
    // ═══════════════════════════════════════════════════════════
    '/api/restaurant/{id}': {
      get: {
        tags: ['Restaurant'],
        summary: 'ดูข้อมูลร้านอาหาร',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Restaurant ObjectId', example: '664def456000000000000001' }],
        responses: {
          200: { description: 'ข้อมูลร้านอาหาร', content: { 'application/json': { schema: { $ref: '#/components/schemas/Restaurant' } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Restaurant'],
        summary: 'แก้ไขข้อมูลร้านอาหาร (Admin เท่านั้น)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Restaurant ObjectId' }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateRestaurantRequest' } } },
        },
        responses: {
          200: { description: 'ข้อมูลร้านที่อัพเดตแล้ว', content: { 'application/json': { schema: { $ref: '#/components/schemas/Restaurant' } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    // ═══════════════════════════════════════════════════════════
    // CATEGORY
    // ═══════════════════════════════════════════════════════════
    '/api/restaurant/{id}/categories': {
      get: {
        tags: ['Category'],
        summary: 'ดูหมวดหมู่เมนูทั้งหมดของร้าน',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Restaurant ObjectId' }],
        responses: {
          200: { description: 'รายการหมวดหมู่', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Category' } } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
      post: {
        tags: ['Category'],
        summary: 'สร้างหมวดหมู่ใหม่ (Admin เท่านั้น)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Restaurant ObjectId' }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoryRequest' } } },
        },
        responses: {
          201: { description: 'หมวดหมู่ที่สร้างแล้ว', content: { 'application/json': { schema: { $ref: '#/components/schemas/Category' } } } },
          400: { description: '400 — Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationError' } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/api/categories/{id}': {
      put: {
        tags: ['Category'],
        summary: 'แก้ไขหมวดหมู่ (Admin เท่านั้น) — name / sortOrder / isActive',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Category ObjectId' }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateCategoryRequest' } } },
        },
        responses: {
          200: { description: 'หมวดหมู่ที่อัพเดตแล้ว', content: { 'application/json': { schema: { $ref: '#/components/schemas/Category' } } } },
          400: { description: '400 — Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationError' } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Category'],
        summary: 'ลบหมวดหมู่ (Admin เท่านั้น)',
        description: 'ไม่สามารถลบหมวดหมู่ที่ยังมีเมนูอยู่ได้ — ต้องลบเมนูออกก่อน',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Category ObjectId' }],
        responses: {
          200: { description: 'ลบสำเร็จ', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: 'Category deleted' } } } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
          409: { description: '409 — หมวดหมู่ยังมีเมนูอยู่ ไม่สามารถลบได้', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    // ═══════════════════════════════════════════════════════════
    // MENU
    // ═══════════════════════════════════════════════════════════
    '/api/restaurant/{id}/menu': {
      get: {
        tags: ['Menu'],
        summary: 'ดูรายการเมนูทั้งหมดของร้าน',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Restaurant ObjectId' }],
        responses: {
          200: { description: 'รายการเมนู', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/MenuItem' } } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
      post: {
        tags: ['Menu'],
        summary: 'เพิ่มเมนูใหม่ (Admin เท่านั้น) — รองรับ upload รูป',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Restaurant ObjectId' }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['name', 'price', 'categoryId'],
                properties: {
                  name: { type: 'string', example: 'ข้าวผัดกุ้ง' },
                  price: { type: 'number', example: 89 },
                  categoryId: { type: 'string', example: '664cat001000000000000001' },
                  description: { type: 'string', example: 'ข้าวผัดกุ้งสูตรพิเศษ' },
                  image: { type: 'string', format: 'binary', description: 'ไฟล์รูป (jpg/png)' },
                  options: {
                    type: 'string',
                    description: 'JSON string ของ array options',
                    example: '[{"name":"ความเผ็ด","required":true,"choices":[{"name":"ไม่เผ็ด","extraPrice":0},{"name":"เผ็ดมาก","extraPrice":5}]}]',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'เมนูที่สร้างแล้ว', content: { 'application/json': { schema: { $ref: '#/components/schemas/MenuItem' } } } },
          400: { description: '400 — Validation error หรือ Invalid category', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/api/menu/{id}': {
      put: {
        tags: ['Menu'],
        summary: 'แก้ไขเมนู (Admin เท่านั้น) — รองรับ upload รูป',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'MenuItem ObjectId' }],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'ข้าวผัดกุ้งสูตรใหม่' },
                  price: { type: 'number', example: 99 },
                  categoryId: { type: 'string' },
                  description: { type: 'string' },
                  isAvailable: { type: 'boolean' },
                  image: { type: 'string', format: 'binary', description: 'ไฟล์รูปใหม่ (จะลบรูปเก่าอัตโนมัติ)' },
                  options: { type: 'string', description: 'JSON string ของ array options' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'เมนูที่อัพเดตแล้ว', content: { 'application/json': { schema: { $ref: '#/components/schemas/MenuItem' } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Menu'],
        summary: 'ลบเมนู และไฟล์รูป (Admin เท่านั้น)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'MenuItem ObjectId' }],
        responses: {
          200: { description: 'ลบสำเร็จ', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: 'Menu item deleted' } } } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/api/menu/{id}/availability': {
      patch: {
        tags: ['Menu'],
        summary: 'เปิด/ปิดการขายเมนู (Admin เท่านั้น)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'MenuItem ObjectId' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['isAvailable'],
                properties: { isAvailable: { type: 'boolean', example: false } },
              },
            },
          },
        },
        responses: {
          200: { description: 'เมนูที่อัพเดตแล้ว', content: { 'application/json': { schema: { $ref: '#/components/schemas/MenuItem' } } } },
          400: { description: '400 — isAvailable is required', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    // ═══════════════════════════════════════════════════════════
    // TABLE
    // ═══════════════════════════════════════════════════════════
    '/api/restaurant/{id}/tables': {
      get: {
        tags: ['Table'],
        summary: 'ดูโต๊ะทั้งหมดของร้าน',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Restaurant ObjectId' }],
        responses: {
          200: { description: 'รายการโต๊ะ', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Table' } } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/api/tables/{id}/status': {
      patch: {
        tags: ['Table'],
        summary: 'อัพเดตสถานะโต๊ะ (Admin/Staff)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Table ObjectId' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', enum: ['available', 'occupied', 'payment'], example: 'available' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'โต๊ะที่อัพเดตแล้ว', content: { 'application/json': { schema: { $ref: '#/components/schemas/Table' } } } },
          400: { description: '400 — Invalid status value', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/api/restaurant/{id}/qr/{tableNo}': {
      get: {
        tags: ['Table'],
        summary: 'ดึง QR Code สำหรับโต๊ะ (Admin เท่านั้น)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Restaurant ObjectId' },
          { name: 'tableNo', in: 'path', required: true, schema: { type: 'integer' }, description: 'หมายเลขโต๊ะ', example: 1 },
        ],
        responses: {
          200: {
            description: 'QR Code data URL และ URL ปลายทาง',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    qr: { type: 'string', description: 'Base64 PNG data URL', example: 'data:image/png;base64,iVBORw0KGgo...' },
                    url: { type: 'string', description: 'URL ปลายทางใน Frontend', example: 'http://localhost:3000/r/664def456.../table/1' },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    // ═══════════════════════════════════════════════════════════
    // ORDER
    // ═══════════════════════════════════════════════════════════
    '/api/tables/{id}/orders': {
      post: {
        tags: ['Order'],
        summary: 'สั่งอาหาร — ลูกค้าไม่ต้อง login',
        description: '- ถ้าโต๊ะว่าง (`available`) ระบบสร้าง session ใหม่ และเปลี่ยนสถานะเป็น `occupied` อัตโนมัติ\n- ราคาดึงจาก DB เสมอ (client ส่งมาเฉพาะ `menuItemId`)\n- Socket.IO: emit `new_order` ไปยัง `restaurant:<restaurantId>`',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Table ObjectId' }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/PlaceOrderRequest' } } },
        },
        responses: {
          201: { description: 'ออเดอร์ที่สร้างแล้ว', content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } } },
          400: {
            description: '400 — โต๊ะรอชำระ / ไม่มี items / เมนูไม่พร้อมให้บริการ',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      get: {
        tags: ['Order'],
        summary: 'ดูออเดอร์ทั้งหมดของโต๊ะ (session ปัจจุบัน) — ลูกค้าไม่ต้อง login',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Table ObjectId' }],
        responses: {
          200: {
            description: 'รายการออเดอร์ (คืน [] ถ้าไม่มี session)',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Order' } } } },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/api/orders/{id}/status': {
      patch: {
        tags: ['Order'],
        summary: 'อัพเดตสถานะออเดอร์ (Admin/Staff)',
        description: 'Status flow: `pending` → `accepted` → `cooking` → `ready` → `served`\n\nSocket.IO: emit `order_status_updated` ไปยัง `table:<tableId>`',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Order ObjectId' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: {
                    type: 'string',
                    enum: ['pending', 'accepted', 'cooking', 'ready', 'served'],
                    example: 'cooking',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'ออเดอร์ที่อัพเดตแล้ว', content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } } },
          400: { description: '400 — Invalid status value', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/api/restaurant/{id}/orders': {
      get: {
        tags: ['Order'],
        summary: 'ดูออเดอร์ทั้งหมดของร้าน (Admin/Staff)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Restaurant ObjectId' }],
        responses: {
          200: { description: 'รายการออเดอร์ทั้งหมดของร้าน', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Order' } } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    // ═══════════════════════════════════════════════════════════
    // BILL
    // ═══════════════════════════════════════════════════════════
    '/api/tables/{id}/bill': {
      get: {
        tags: ['Bill'],
        summary: 'ดูบิลสรุปของโต๊ะ — ลูกค้าไม่ต้อง login',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Table ObjectId' }],
        responses: {
          200: { description: 'บิลสรุปพร้อมรายการออเดอร์ทั้งหมด', content: { 'application/json': { schema: { $ref: '#/components/schemas/TableBillResponse' } } } },
          404: { description: '404 — Table not found หรือ No active session', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/tables/{id}/bill/checkout': {
      post: {
        tags: ['Bill'],
        summary: 'ชำระเงินและปิดโต๊ะ (Admin/Staff)',
        description: 'หลัง checkout โต๊ะจะกลับเป็น `available` และ session จะถูก clear\n\nSocket.IO: emit `bill_paid` ไปยัง `table:<tableId>`',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Table ObjectId' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['paymentMethod'],
                properties: {
                  paymentMethod: { type: 'string', enum: ['cash', 'promptpay'], example: 'cash' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Bill ที่สร้างแล้ว — ชำระเงินสำเร็จ', content: { 'application/json': { schema: { $ref: '#/components/schemas/Bill' } } } },
          400: {
            description: '400 — paymentMethod ไม่ถูกต้อง / ไม่มี session / ไม่มีออเดอร์',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    // ═══════════════════════════════════════════════════════════
    // REPORT
    // ═══════════════════════════════════════════════════════════
    '/api/restaurant/{id}/reports/daily': {
      get: {
        tags: ['Report'],
        summary: 'รายงานยอดขายรายวัน (Admin เท่านั้น)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Restaurant ObjectId' },
          { name: 'date', in: 'query', required: false, schema: { type: 'string', format: 'date' }, description: 'วันที่ต้องการ (YYYY-MM-DD) — default: วันนี้', example: '2026-04-05' },
        ],
        responses: {
          200: {
            description: 'รายงานยอดขายรายวัน',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    date: { type: 'string', format: 'date', example: '2026-04-05' },
                    totalBills: { type: 'integer', example: 15 },
                    totalRevenue: { type: 'number', example: 8750 },
                    bills: { type: 'array', items: { $ref: '#/components/schemas/Bill' } },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/api/restaurant/{id}/reports/popular-items': {
      get: {
        tags: ['Report'],
        summary: 'รายงานเมนูขายดี — เรียงตามจำนวนที่ขายได้ (Admin เท่านั้น)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Restaurant ObjectId' },
          { name: 'limit', in: 'query', required: false, schema: { type: 'integer', default: 10 }, description: 'จำนวน item สูงสุดที่แสดง', example: 5 },
        ],
        responses: {
          200: {
            description: 'รายการเมนูขายดี',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      _id: { type: 'string', example: '664menu001000000000000001' },
                      name: { type: 'string', example: 'ข้าวผัดกุ้ง' },
                      totalQuantity: { type: 'integer', example: 142 },
                      totalRevenue: { type: 'number', example: 12638 },
                    },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
  },
}

export default swaggerDefinition
