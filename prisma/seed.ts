import { PrismaClient, Role, ScoringType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create KPI Categories
  const categories = [
    { name: 'Commercial', sortOrder: 1, weight: 25 },
    { name: 'Compliance', sortOrder: 2, weight: 20 },
    { name: 'Store Hygiene / Operations', sortOrder: 3, weight: 15 },
    { name: 'Training & People', sortOrder: 4, weight: 10 },
    { name: 'Customer Engagement', sortOrder: 5, weight: 15 },
    { name: 'Private Label', sortOrder: 6, weight: 15 },
  ]

  for (const cat of categories) {
    await prisma.kpiCategory.upsert({
      where: { name: cat.name },
      update: cat,
      create: cat,
    })
  }

  const cats = await prisma.kpiCategory.findMany()

  // Create KPIs
  const kpis = [
    // Commercial
    { name: 'Revenue vs Budget', category: 'Commercial', unit: '%', scoringType: ScoringType.NUMERIC },
    { name: 'GP %', category: 'Commercial', unit: '%', scoringType: ScoringType.NUMERIC },
    { name: 'GP $ Absolute', category: 'Commercial', unit: '$', scoringType: ScoringType.NUMERIC },
    { name: 'Average Basket Size', category: 'Commercial', unit: '$', scoringType: ScoringType.NUMERIC },
    { name: 'Wages as % of Sales', category: 'Commercial', unit: '%', scoringType: ScoringType.NUMERIC },
    
    // Compliance
    { name: 'Core Range Compliance', category: 'Compliance', unit: '%', scoringType: ScoringType.NUMERIC },
    { name: 'Promotional Execution', category: 'Compliance', unit: '%', scoringType: ScoringType.NUMERIC },
    { name: 'Planogram Compliance', category: 'Compliance', unit: '%', scoringType: ScoringType.NUMERIC },
    { name: 'NPD & Bespoke Activation', category: 'Compliance', unit: '%', scoringType: ScoringType.NUMERIC },
    
    // Store Hygiene
    { name: 'Stock Turn Ratio', category: 'Store Hygiene / Operations', unit: 'weeks', scoringType: ScoringType.NUMERIC },
    { name: 'Shrinkage %', category: 'Store Hygiene / Operations', unit: '%', scoringType: ScoringType.NUMERIC },
    { name: 'SLOB Stock Value', category: 'Store Hygiene / Operations', unit: '%', scoringType: ScoringType.NUMERIC },
    { name: 'Delivery Receipt SLA', category: 'Store Hygiene / Operations', unit: 'hours', scoringType: ScoringType.NUMERIC },
    { name: 'Store Cleanliness Score', category: 'Store Hygiene / Operations', unit: 'score', scoringType: ScoringType.SCALE_1_5 },
    { name: 'Stocktake Execution', category: 'Store Hygiene / Operations', unit: '%', scoringType: ScoringType.NUMERIC },
    { name: 'OH&S Compliance', category: 'Store Hygiene / Operations', unit: 'incidents', scoringType: ScoringType.NUMERIC },
    
    // Training
    { name: 'Staff Training Completion', category: 'Training & People', unit: '%', scoringType: ScoringType.NUMERIC },
    { name: 'Training Quiz Score', category: 'Training & People', unit: '%', scoringType: ScoringType.NUMERIC },
    { name: 'Mystery Shopper Score', category: 'Training & People', unit: '%', scoringType: ScoringType.NUMERIC },
    { name: 'Safety Culture Training Compliance', category: 'Training & People', unit: 'PASS/FAIL', scoringType: ScoringType.RAG },
    
    // Customer Engagement
    { name: 'Google Review Rating', category: 'Customer Engagement', unit: 'stars', scoringType: ScoringType.NUMERIC },
    { name: 'New Google Reviews', category: 'Customer Engagement', unit: 'count', scoringType: ScoringType.NUMERIC },
    { name: 'Review Response Rate', category: 'Customer Engagement', unit: '%', scoringType: ScoringType.NUMERIC },
    { name: 'Loyalty Sign-ups', category: 'Customer Engagement', unit: 'count', scoringType: ScoringType.NUMERIC },
    { name: 'Loyalty Scan Rate', category: 'Customer Engagement', unit: '%', scoringType: ScoringType.NUMERIC },
    { name: 'Local Engagement Score', category: 'Customer Engagement', unit: 'score', scoringType: ScoringType.SCALE_1_5 },
    { name: 'Customer Satisfaction', category: 'Customer Engagement', unit: '%', scoringType: ScoringType.NUMERIC },
    
    // Private Label
    { name: 'Own Label Sales $', category: 'Private Label', unit: '$', scoringType: ScoringType.NUMERIC },
    { name: 'Own Label % Revenue', category: 'Private Label', unit: '%', scoringType: ScoringType.NUMERIC },
    { name: 'Own Label GP %', category: 'Private Label', unit: '%', scoringType: ScoringType.NUMERIC },
    { name: 'Staff Own Label Knowledge', category: 'Private Label', unit: '%', scoringType: ScoringType.NUMERIC },
    { name: 'Customer Conversion Count', category: 'Private Label', unit: 'count', scoringType: ScoringType.NUMERIC },
  ]

  for (const kpi of kpis) {
    const category = cats.find(c => c.name === kpi.category)
    if (category) {
      await prisma.kpi.upsert({
        where: { name: kpi.name },
        update: { ...kpi, categoryId: category.id },
        create: { ...kpi, categoryId: category.id },
      })
    }
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash('ChangeMe123!', 10)
  
  await prisma.user.upsert({
    where: { email: 'admin@paramount.com' },
    update: {},
    create: {
      email: 'admin@paramount.com',
      name: 'GM Admin',
      role: Role.GM,
      hashedPassword,
    },
  })

  // Create sample AMs
  const am1 = await prisma.user.upsert({
    where: { email: 'am-vic@paramount.com' },
    update: {},
    create: {
      email: 'am-vic@paramount.com',
      name: 'Area Manager VIC',
      role: Role.AREA_MANAGER,
      hashedPassword: await bcrypt.hash('ChangeMe123!', 10),
    },
  })

  const am2 = await prisma.user.upsert({
    where: { email: 'am-nsw@paramount.com' },
    update: {},
    create: {
      email: 'am-nsw@paramount.com',
      name: 'Area Manager NSW',
      role: Role.AREA_MANAGER,
      hashedPassword: await bcrypt.hash('ChangeMe123!', 10),
    },
  })

  // Create sample stores
  const stores = [
    { name: 'Southbank', state: 'VIC', areaManagerId: am1.id },
    { name: 'Prahran', state: 'VIC', areaManagerId: am1.id },
    { name: 'Brunswick', state: 'VIC', areaManagerId: am1.id },
    { name: 'Richmond', state: 'VIC', areaManagerId: am1.id },
    { name: 'Paddington', state: 'NSW', areaManagerId: am2.id },
    { name: 'Darlinghurst', state: 'NSW', areaManagerId: am2.id },
    { name: 'Alexandria', state: 'NSW', areaManagerId: am2.id },
    { name: 'Surry Hills', state: 'NSW', areaManagerId: am2.id },
  ]

  for (const store of stores) {
    await prisma.store.upsert({
      where: { name: store.name },
      update: store,
      create: store,
    })
  }

  // Create sample suppliers for supplier scorecards
  const suppliers = [
    { name: 'Diageo Australia', code: 'DIAGEO', contactEmail: 'accounts@diageo.com.au' },
    { name: 'Treasury Wine Estates', code: 'TWE', contactEmail: 'trade@tweglobal.com' },
    { name: 'Pernod Ricard', code: 'PERNOD', contactEmail: 'sales@pernod-ricard.com.au' },
    { name: 'Lion Pty Ltd', code: 'LION', contactEmail: 'liquor@lionco.com' },
    { name: 'Brown-Forman', code: 'BF', contactEmail: 'customerservice@brown-forman.com' },
    { name: 'Moët Hennessy', code: 'MH', contactEmail: 'info@moethennessy.com.au' },
  ]

  for (const supplier of suppliers) {
    await prisma.supplier.upsert({
      where: { code: supplier.code },
      update: supplier,
      create: supplier,
    })
  }

  // Create sample promotions
  const createdSuppliers = await prisma.supplier.findMany()
  const now = new Date()
  
  for (const supplier of createdSuppliers.slice(0, 3)) {
    await prisma.promotion.create({
      data: {
        supplierId: supplier.id,
        name: `Q1 2026 ${supplier.name} Promo`,
        description: 'Key promotional period display execution',
        startDate: new Date(now.getFullYear(), now.getMonth(), 1),
        endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0),
        skus: ['SKU001', 'SKU002', 'SKU003'],
        displayRequirements: 'End cap display, minimum 3 facings per SKU, POS material visible',
        complianceTarget: 95,
      }
    })
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
