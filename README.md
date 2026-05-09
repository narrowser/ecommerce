# StyleShop E-Commerce

全栈微服务电商平台，包含商城前台、管理后台、供应商门户。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Next.js 15 (App Router) + Tailwind CSS + Radix UI |
| 后端 | Node.js + Express + TypeScript |
| 数据库 | MySQL 8.0 |
| 缓存 | Redis 7 |
| 网关 | nginx |
| 容器 | Docker Compose |
| ORM | Prisma |

## 项目结构

```
├── gateway/              # nginx 反向代理配置
├── services/             # 微服务
│   ├── user-service/     # 用户、认证、地址、供应商管理 (3001)
│   ├── product-service/  # 商品、分类、库存、图片上传 (3002)
│   ├── order-service/    # 购物车、订单、优惠券、物流 (3003)
│   ├── payment-service/  # 支付、退款 (3004)
│   ├── notification-service/ # 通知消息 (3005)
│   └── review-service/   # 商品评价 (3006)
├── web/                  # Next.js 前端
│   ├── app/(shop)/       # 商城前台页面
│   ├── app/(admin)/      # 管理后台页面
│   ├── app/(supplier)/   # 供应商门户页面
│   ├── components/       # 共享组件
│   └── lib/              # 工具库、认证上下文
├── docker-compose.yml    # 容器编排
└── package/              # 部署打包
```

## 快速启动

### 前置条件

- [Docker Desktop](https://www.docker.com/products/docker-desktop)

### 开发环境

```bash
# 启动所有服务
docker compose up -d --build

# 访问
#   商城: http://localhost
#   管理后台: http://localhost/admin
#   供应商门户: http://localhost/supplier
```

### 测试账号

| 角色 | 邮箱 | 密码 |
|------|------|------|
| 管理员 | admin@styleshop.com | 123456 |
| 供应商 | supplier@styleshop.com | 123456 |
| 物流管理 | logistics@styleshop.com | 123456 |

## 功能清单

### 商城前台 (/)
- 商品浏览、搜索、分类筛选
- 商品详情（图片、评价、供应商信息）
- 购物车管理
- 下单结算（地址选择、优惠券、支付方式）
- 订单管理（待支付/待收货/已完成 Tab）
- 物流追踪（快递公司、单号、状态）
- 个人中心（头像上传、用户名修改、地址管理、注销账号）
- 帮助中心（配送政策、退换货、联系我们）

### 管理后台 (/admin)
- 仪表盘（营收、订单、用户、商品统计）
- 商品管理（新增、编辑、上架/下架、批量操作、图片上传）
- 分类管理
- 订单管理（发货、取消、物流信息录入）
- 用户管理（角色切换、删除、导出 CSV、按角色统计）
- 供应商管理（审核、解约、续约、搜索筛选）
- 优惠券管理
- 评价管理
- 通知消息

### 供应商门户 (/supplier)
- 仪表盘（商品数、订单数统计）
- 商品管理（发布、上下架）
- 订单查看
- 收入统计

## 微服务 API

全部通过 nginx 网关 (port 80) 统一入口：

| 前缀 | 服务 | 说明 |
|------|------|------|
| `/api/auth` | user-service | 注册、登录、刷新 Token |
| `/api/users` | user-service | 用户管理、个人信息 |
| `/api/addresses` | user-service | 收货地址 CRUD |
| `/api/suppliers` | user-service | 供应商注册、审核 |
| `/api/products` | product-service | 商品 CRUD、列表 |
| `/api/categories` | product-service | 分类管理 |
| `/api/inventory` | product-service | 库存扣减/恢复 |
| `/api/upload` | product-service | 图片上传 |
| `/api/cart` | order-service | 购物车 |
| `/api/orders` | order-service | 订单管理 |
| `/api/coupons` | order-service | 优惠券 |
| `/api/shipments` | order-service | 物流发货 |
| `/api/payments` | payment-service | 支付、退款 |
| `/api/notifications` | notification-service | 通知消息 |
| `/api/reviews` | review-service | 商品评价 |

## 订单状态流转

```
PENDING_PAYMENT → PAID → SHIPPED → COMPLETED
           ↘ CANCELLED           ↗ DELIVERED
```

- 管理员：发货 (PAID→SHIPPED)、取消
- 用户：确认收货 (SHIPPED→COMPLETED)、确认完成 (DELIVERED→COMPLETED)

## 常用命令

```bash
# 重建并启动服务
docker compose up -d --build

# 重建单个服务
docker compose up -d --build order-service

# 查看日志
docker compose logs -f user-service

# 停止所有服务
docker compose down

# 进入容器
docker exec -it ecommerce-mysql mysql -uroot -prootpassword
```

## 部署

参见 `package/` 目录，包含镜像文件和一键部署脚本。

```bash
# 目标机器上
双击 部署.bat      # Windows
bash deploy.sh     # Linux/Mac
```
