import { PrismaClient } from "@prisma/client"
import bcrypt           from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding SRM Platform...")

  const password = await bcrypt.hash("Admin@1234", 12)

  // Users
  const admin = await prisma.user.upsert({
    where:  { email: "admin@srm.com" },
    update: {},
    create: { name: "Mohammed Sherif", email: "admin@srm.com", password, role: "SUPER_ADMIN", isActive: true }
  })

  await prisma.user.upsert({
    where:  { email: "manager@srm.com" },
    update: {},
    create: { name: "Ahmed Hassan",    email: "manager@srm.com", password, role: "MANAGER", isActive: true }
  })

  // Suppliers
  const suppliers = [
    {
      name: "TechCore Solutions", code: "SUP-001", category: "TECHNOLOGY" as const,
      status: "ACTIVE" as const, email: "contact@techcore.com", phone: "+1 555-0101",
      country: "USA", city: "New York", contactPerson: "John Smith",
      avgRating: 4.8, totalOrders: 24, totalSpent: 125000,
      onTimeDelivery: 96, qualityScore: 4.7, isPreferred: true,
      tags: ["technology", "preferred", "enterprise"],
    },
    {
      name: "Global Supplies Co.", code: "SUP-002", category: "GOODS" as const,
      status: "ACTIVE" as const, email: "info@globalsupplies.com", phone: "+44 20-7946-0958",
      country: "UK", city: "London", contactPerson: "Sarah Johnson",
      avgRating: 4.5, totalOrders: 38, totalSpent: 89000,
      onTimeDelivery: 91, qualityScore: 4.4, isPreferred: false,
      tags: ["goods", "bulk", "international"],
    },
    {
      name: "FastLog Logistics",   code: "SUP-003", category: "LOGISTICS" as const,
      status: "ACTIVE" as const, email: "ops@fastlog.com", phone: "+49 30-1234-5678",
      country: "Germany", city: "Berlin", contactPerson: "Hans Mueller",
      avgRating: 4.2, totalOrders: 15, totalSpent: 45000,
      onTimeDelivery: 88, qualityScore: 4.1, isPreferred: false,
      tags: ["logistics", "shipping"],
    },
    {
      name: "RawMat Industries",   code: "SUP-004", category: "RAW_MATERIALS" as const,
      status: "INACTIVE" as const, email: "sales@rawmat.com", phone: "+86 10-8888-8888",
      country: "China", city: "Shanghai", contactPerson: "Li Wei",
      avgRating: 3.8, totalOrders: 8, totalSpent: 32000,
      onTimeDelivery: 78, qualityScore: 3.9, isPreferred: false,
      tags: ["raw-materials"],
    },
    {
      name: "ServicePro Inc.",     code: "SUP-005", category: "SERVICES" as const,
      status: "ACTIVE" as const, email: "hello@servicepro.com", phone: "+971 4-555-0101",
      country: "UAE", city: "Dubai", contactPerson: "Omar Al-Rashid",
      avgRating: 4.6, totalOrders: 20, totalSpent: 78000,
      onTimeDelivery: 94, qualityScore: 4.5, isPreferred: true,
      tags: ["services", "consulting", "preferred"],
    },
  ]

  const createdSuppliers = []
  for (const s of suppliers) {
    const sup = await prisma.supplier.upsert({
      where:  { code: s.code },
      update: s,
      create: s,
    })
    createdSuppliers.push(sup)
    console.log(`✅ Supplier: ${sup.name}`)
  }

  // Purchase Orders
  const orders = [
    {
      number: "PO-2025-001", supplierId: createdSuppliers[0].id, createdById: admin.id,
      status: "RECEIVED" as const, priority: "HIGH" as const,
      title: "Software Licenses Q2", currency: "USD",
      subtotal: 15000, taxAmount: 1500, totalAmount: 16500,
      orderDate: new Date("2025-03-01"), expectedDate: new Date("2025-03-15"),
      deliveredDate: new Date("2025-03-14"),
    },
    {
      number: "PO-2025-002", supplierId: createdSuppliers[1].id, createdById: admin.id,
      status: "APPROVED" as const, priority: "MEDIUM" as const,
      title: "Office Supplies Bulk Order", currency: "USD",
      subtotal: 8500, taxAmount: 850, totalAmount: 9350,
      orderDate: new Date("2025-04-01"), expectedDate: new Date("2025-04-20"),
    },
    {
      number: "PO-2025-003", supplierId: createdSuppliers[2].id, createdById: admin.id,
      status: "PENDING" as const, priority: "URGENT" as const,
      title: "Express Shipping Services", currency: "USD",
      subtotal: 3200, taxAmount: 0, totalAmount: 3200,
      orderDate: new Date("2025-04-04"), expectedDate: new Date("2025-04-10"),
    },
    {
      number: "PO-2025-004", supplierId: createdSuppliers[4].id, createdById: admin.id,
      status: "DRAFT" as const, priority: "LOW" as const,
      title: "IT Consulting Services", currency: "USD",
      subtotal: 25000, taxAmount: 2500, totalAmount: 27500,
      orderDate: new Date("2025-04-05"), expectedDate: new Date("2025-05-05"),
    },
  ]

  for (const order of orders) {
    await prisma.purchaseOrder.upsert({
      where:  { number: order.number },
      update: {},
      create: {
        ...order,
        items: {
          create: [
            { name: `${order.title} - Item 1`, quantity: 10, unit: "pcs", unitPrice: order.subtotal * 0.6 / 10, totalPrice: order.subtotal * 0.6 },
            { name: `${order.title} - Item 2`, quantity: 5,  unit: "pcs", unitPrice: order.subtotal * 0.4 / 5,  totalPrice: order.subtotal * 0.4 },
          ]
        }
      }
    })
  }

  console.log("✅ Purchase Orders created")

  // Contracts
  const contracts = [
    {
      number: "CON-2025-001", supplierId: createdSuppliers[0].id, createdById: admin.id,
      title: "Annual Software License Agreement", status: "ACTIVE" as const,
      value: 60000, currency: "USD",
      startDate: new Date("2025-01-01"), endDate: new Date("2025-12-31"),
      autoRenew: true, paymentTerms: "Net 30",
    },
    {
      number: "CON-2025-002", supplierId: createdSuppliers[4].id, createdById: admin.id,
      title: "IT Consulting Services Contract", status: "ACTIVE" as const,
      value: 120000, currency: "USD",
      startDate: new Date("2025-01-01"), endDate: new Date("2025-12-31"),
      autoRenew: false, paymentTerms: "Net 60",
    },
    {
      number: "CON-2024-003", supplierId: createdSuppliers[1].id, createdById: admin.id,
      title: "Supply Agreement 2024", status: "EXPIRED" as const,
      value: 45000, currency: "USD",
      startDate: new Date("2024-01-01"), endDate: new Date("2024-12-31"),
      autoRenew: false, paymentTerms: "Net 30",
    },
  ]

  for (const contract of contracts) {
    await prisma.contract.upsert({
      where:  { number: contract.number },
      update: {},
      create: contract,
    })
  }

  console.log("✅ Contracts created")

  // Payments
  const payments = [
    {
      reference: "PAY-2025-001", supplierId: createdSuppliers[0].id, createdById: admin.id,
      status: "PAID" as const, method: "BANK_TRANSFER" as const,
      amount: 16500, currency: "USD",
      dueDate: new Date("2025-03-30"), paidAt: new Date("2025-03-28"),
      invoiceNumber: "INV-TC-2025-042",
    },
    {
      reference: "PAY-2025-002", supplierId: createdSuppliers[1].id, createdById: admin.id,
      status: "PENDING" as const, method: "BANK_TRANSFER" as const,
      amount: 9350, currency: "USD",
      dueDate: new Date("2025-05-01"),
      invoiceNumber: "INV-GS-2025-018",
    },
    {
      reference: "PAY-2025-003", supplierId: createdSuppliers[4].id, createdById: admin.id,
      status: "OVERDUE" as const, method: "CREDIT_CARD" as const,
      amount: 5000, currency: "USD",
      dueDate: new Date("2025-03-15"),
      invoiceNumber: "INV-SP-2025-007",
    },
    {
      reference: "PAY-2025-004", supplierId: createdSuppliers[0].id, createdById: admin.id,
      status: "PROCESSING" as const, method: "BANK_TRANSFER" as const,
      amount: 8000, currency: "USD",
      dueDate: new Date("2025-04-30"),
      invoiceNumber: "INV-TC-2025-055",
    },
  ]

  for (const payment of payments) {
    await prisma.payment.upsert({
      where:  { reference: payment.reference },
      update: {},
      create: payment,
    })
  }

  console.log("✅ Payments created")

  // Ratings
  await prisma.supplierRating.createMany({
    data: [
      { supplierId: createdSuppliers[0].id, userId: admin.id, overall: 4.8, quality: 4.9, delivery: 4.7, communication: 4.8, pricing: 4.6, comment: "Excellent service and quality!" },
      { supplierId: createdSuppliers[1].id, userId: admin.id, overall: 4.5, quality: 4.4, delivery: 4.6, communication: 4.3, pricing: 4.7, comment: "Good value for money."            },
      { supplierId: createdSuppliers[4].id, userId: admin.id, overall: 4.6, quality: 4.7, delivery: 4.5, communication: 4.8, pricing: 4.4, comment: "Professional team."               },
    ],
    skipDuplicates: true,
  })

  console.log("✅ Ratings created")
  console.log("\n📋 Demo Accounts:")
  console.log("  👑 Admin:   admin@srm.com   / Admin@1234")
  console.log("  👔 Manager: manager@srm.com / Admin@1234")
  console.log("\n🎉 Seed complete!")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())