
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();

  // Helper to generate dates
  const daysAgo = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString();
  };

  // Seed Business Listings
  const businessListings = [
    {
      name: "Global Fintech Solutions",
      description: "Leading provider of blockchain payment gateways seeking strategic partnerships in APAC region.",
      type: ["business"],
      category: ["licensed_corp"],
      contact_email: "partners@fintech.com",
      is_pinned: true,
      views: 1250,
      created_at: daysAgo(1)
    },
    {
      name: "Alpha Asset Management",
      description: "Established Type 9 firm looking for introductory brokers for new fund launch.",
      type: ["introduction"],
      category: ["licensed_corp"],
      contact_email: "info@alphaam.com",
      views: 850,
      created_at: daysAgo(2)
    },
    {
      name: "TechStart Consulting",
      description: "Compliance consulting services for newly licensed corporations. We specialize in regulatory technology.",
      type: ["other"],
      category: ["compliance"],
      contact_email: "hello@techstart.com",
      views: 450,
      created_at: daysAgo(5)
    },
    {
      name: "Asia Legal Partners",
      description: "Top-tier law firm offering specialized services for crypto-exchanges and VASP licensing.",
      type: ["introduction"],
      category: ["law_firm"],
      contact_email: "legal@asialegal.com",
      views: 320,
      created_at: daysAgo(10)
    },
    {
      name: "Prime Accounting Services",
      description: "Audit and tax services for financial institutions. Experienced with FRR reporting.",
      type: ["business"],
      category: ["cpa"],
      contact_email: "audit@prime.com",
      views: 150,
      created_at: daysAgo(12)
    },
    {
      name: "Blockchain Ventures",
      description: "Early stage VC fund looking for DeFi projects to incubate.",
      type: ["introduction"],
      category: ["other"],
      contact_email: "dealflow@ventures.com",
      views: 980,
      created_at: daysAgo(3),
      is_pinned: true
    },
    {
      name: "Compliance First Ltd",
      description: "Outsourced compliance officer services for Type 1, 4, 9 firms.",
      type: ["other"],
      category: ["compliance"],
      contact_email: "help@compliancefirst.com",
      views: 210,
      created_at: daysAgo(8)
    },
    {
      name: "Market Data Systems",
      description: "Real-time market data feeds for HKEX and US markets. Low latency solutions.",
      type: ["business"],
      category: ["other"],
      contact_email: "sales@marketdata.com",
      views: 600,
      created_at: daysAgo(15)
    }
  ];

  for (const item of businessListings) {
    await supabase.from('business_listings').insert(item);
  }

  // Seed License Acquisitions
  const licenseAcquisitions = [
    {
      acquirer_name: "Capital Ventures Ltd",
      budget: "5M HKD",
      license_types_sought: ["type1", "type4"],
      acquisition_method: ["buy_company"],
      acquirer_type: "company",
      contact_phone: "12345678",
      email: "buy@capital.com",
      is_pinned: true,
      views: 400,
      created_at: daysAgo(1)
    },
    {
      acquirer_name: "John Doe",
      budget: "Negotiable",
      license_types_sought: ["type9"],
      acquisition_method: ["buy_company"],
      acquirer_type: "individual",
      contact_phone: "87654321",
      email: "john@example.com",
      views: 120,
      created_at: daysAgo(4)
    },
    {
      acquirer_name: "Pacific Trading Co",
      budget: "8M HKD",
      license_types_sought: ["type1", "type2", "type4"],
      acquisition_method: ["buy_company", "setup_new"],
      acquirer_type: "company",
      contact_phone: "22334455",
      email: "expansion@pacific.com",
      views: 350,
      created_at: daysAgo(7)
    },
    {
      acquirer_name: "Wealth Manage Group",
      budget: "3M HKD",
      license_types_sought: ["type4", "type9"],
      acquisition_method: ["buy_company"],
      acquirer_type: "company",
      contact_phone: "66778899",
      email: "mna@wealth.com",
      views: 280,
      created_at: daysAgo(10)
    },
    {
      acquirer_name: "Private Investor",
      budget: "Open",
      license_types_sought: ["type9"],
      acquisition_method: ["buy_company"],
      acquirer_type: "individual",
      contact_phone: "99887766",
      email: "investor@private.com",
      views: 90,
      created_at: daysAgo(20)
    }
  ];

  for (const item of licenseAcquisitions) {
    await supabase.from('license_acquisitions').insert(item);
  }

  // Seed License Sales
  const licenseSales = [
    {
      company_name: "Retiring Brokerage Firm",
      license_types: ["type1"],
      asking_price: "3M HKD",
      description: "Clean record, 10 years operation. Owner retiring.",
      contact_phone: "23456789",
      email: "sale@brokerage.com",
      is_pinned: true,
      views: 800,
      created_at: daysAgo(2)
    },
    {
      company_name: "Asset Mgmt Shell",
      license_types: ["type4", "type9"],
      asking_price: "6M HKD",
      description: "Ready to operate, ROs available. Bank account active.",
      contact_phone: "98765432",
      email: "shell@assets.com",
      views: 650,
      created_at: daysAgo(5)
    },
    {
      company_name: "Full Service Broker",
      license_types: ["type1", "type2", "type4", "type9"],
      asking_price: "15M HKD",
      description: "Fully operational, 20 staff, active client base.",
      contact_phone: "33445566",
      email: "corpdev@fullservice.com",
      views: 1200,
      created_at: daysAgo(1)
    },
    {
      company_name: "Inactive Type 9",
      license_types: ["type9"],
      asking_price: "4.5M HKD",
      description: "Clean shell, no AUM, perfect for new entrant.",
      contact_phone: "77889900",
      email: "owner@type9.com",
      views: 400,
      created_at: daysAgo(15)
    },
    {
      company_name: "Futures Broker",
      license_types: ["type2"],
      asking_price: "5M HKD",
      description: "Specialized in commodities futures.",
      contact_phone: "11223344",
      email: "futures@sale.com",
      views: 200,
      created_at: daysAgo(30)
    }
  ];

  for (const item of licenseSales) {
    await supabase.from('license_sales').insert(item);
  }

  // Seed RO Profiles
  const roProfiles = [
    {
      name_en: "David Wong",
      name_zh: "王大伟",
      license_types: ["type1", "type4"],
      industry_experience: 15,
      expected_salary: "80k/month",
      contact_info: { email: "david@wong.com", phone: "55551111" },
      is_pinned: true,
      views: 600,
      created_at: daysAgo(1)
    },
    {
      name_en: "Sarah Lee",
      name_zh: "李莎拉",
      license_types: ["type9"],
      industry_experience: 8,
      expected_salary: "60k/month",
      contact_info: { email: "sarah@lee.com", phone: "55552222" },
      views: 450,
      created_at: daysAgo(3)
    },
    {
      name_en: "Michael Chen",
      name_zh: "陈迈克",
      license_types: ["type1", "type2", "type4"],
      industry_experience: 20,
      expected_salary: "100k/month",
      contact_info: { email: "mike@chen.com", phone: "55553333" },
      is_pinned: true,
      views: 800,
      created_at: daysAgo(2)
    },
    {
      name_en: "Jessica Zhang",
      name_zh: "张洁",
      license_types: ["type4", "type9"],
      industry_experience: 5,
      expected_salary: "45k/month",
      contact_info: { email: "jess@zhang.com", phone: "55554444" },
      views: 300,
      created_at: daysAgo(7)
    },
    {
      name_en: "Robert Liu",
      name_zh: "刘罗伯特",
      license_types: ["type6"],
      industry_experience: 12,
      expected_salary: "70k/month",
      contact_info: { email: "rob@liu.com", phone: "55555555" },
      views: 150,
      created_at: daysAgo(14)
    }
  ];

  for (const item of roProfiles) {
    await supabase.from('ro_profiles').insert(item);
  }

  return NextResponse.json({ message: "Enhanced seeding completed" });
}
