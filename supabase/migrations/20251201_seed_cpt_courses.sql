-- Seed CPT courses data
-- First, clean up existing demo data (optional, but good for clean state if we want only the new ones)
-- DELETE FROM public.cpt_courses; 

-- Insert new courses
INSERT INTO public.cpt_courses (title, description, image_url, category, language, hours, price, external_link) VALUES
-- 1. Family Office
('【粵語】全球家族辦公室戰略：香港樞紐與未來趨勢', '探討香港作為家族辦公室樞紐的戰略地位與未來發展趨勢。', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', 'Family Office', 'Cantonese', 1.0, 0, 'https://appx5lm2o5a3336.h5.xiaoeknow.com/p/course/middle_page/v_68f9773fe4b0694ca1319eeb?resource_type=3'),
('【普通话】全球家族办公室战略：香港枢纽与未来趋势', '探讨香港作为家族办公室枢纽的战略地位与未来发展趋势。', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', 'Family Office', 'Mandarin', 1.0, 0, 'https://appx5lm2o5a3336.h5.xiaoeknow.com/p/course/middle_page/v_68f9f4a4e4b0694ca1323c57?resource_type=3'),

-- 2. KYC/DD
('【粵語】投資人KYC與DD盡職調查：香港資本市場最佳實踐與虛擬資產案例研究', '深入解析KYC與DD在香港資本市場的應用及虛擬資產案例。', 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80', 'Compliance', 'Cantonese', 1.5, 0, 'https://appx5lm2o5a3336.h5.xiaoeknow.com/p/course/middle_page/v_68f972fde4b0694ca1319df0?resource_type=3'),
('【普通话】投资人KYC与DD尽职调查：香港资本市场最佳实践与虚拟资产案例研究', '深入解析KYC与DD在香港资本市场的应用及虚拟资产案例。', 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80', 'Compliance', 'Mandarin', 1.5, 0, 'https://appx5lm2o5a3336.h5.xiaoeknow.com/p/course/middle_page/v_68f97e25e4b0694ca131a2bf?resource_type=3'),

-- 3. IPO
('【粵語】香港IPO市場深度剖析：最新規則、實務案例、全球對比與前景預測', '全面剖析香港IPO市場規則、案例及未來前景。', 'https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&w=800&q=80', 'IPO', 'Cantonese', 1.2, 0, 'https://appx5lm2o5a3336.h5.xiaoeknow.com/p/course/middle_page/v_68f23e53e4b0694ca12e12d8?resource_type=3'),
('【普通话】香港IPO市场深度剖析：最新规则、实务案例、全球对比与前景预测', '全面剖析香港IPO市场规则、案例及未来前景。', 'https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&w=800&q=80', 'IPO', 'Mandarin', 1.2, 0, 'https://appx5lm2o5a3336.h5.xiaoeknow.com/p/course/middle_page/v_68f2cf3ce4b0694ca12e29ef?resource_type=3'),

-- 4. RWA
('【粵語】真實世界資產(RWA)代幣化深度解析與前瞻', '解析RWA代幣化的機制、應用與未來發展。', 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=800&q=80', 'FinTech', 'Cantonese', 0.8, 0, 'https://appx5lm2o5a3336.h5.xiaoeknow.com/p/course/middle_page/v_68f2141de4b0694c5b3e1959?resource_type=3'),
('【普通话】真实世界资产(RWA)代币化深度解析与前瞻', '解析RWA代币化的机制、应用与未来发展。', 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=800&q=80', 'FinTech', 'Mandarin', 0.8, 0, 'https://appx5lm2o5a3336.h5.xiaoeknow.com/p/course/middle_page/v_68f2f0bfe4b0694ca12e3308?resource_type=3'),

-- 5. Wealth Management
('【粵語】香港財富管理新篇章：全球視野下的策略與前瞻', '探討全球視野下的香港財富管理策略。', 'https://images.unsplash.com/photo-1565514020176-db70525b9244?auto=format&fit=crop&w=800&q=80', 'Wealth Management', 'Cantonese', 1.0, 0, 'https://appx5lm2o5a3336.h5.xiaoeknow.com/p/course/middle_page/v_68f20a9ae4b0694ca12ded20?resource_type=3'),
('【普通话】香港财富管理新篇章：全球视野下的策略与前瞻', '探讨全球视野下的香港财富管理策略。', 'https://images.unsplash.com/photo-1565514020176-db70525b9244?auto=format&fit=crop&w=800&q=80', 'Wealth Management', 'Mandarin', 1.0, 0, 'https://appx5lm2o5a3336.h5.xiaoeknow.com/p/course/middle_page/v_68f330e6e4b0694ca12e560f?resource_type=3'),

-- 6. ESG
('【粵語】ESG投資與永續發展：香港現狀、全球比較及未來趨勢', '分析ESG投資在香港的現狀及未來趨勢。', 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=800&q=80', 'ESG', 'Cantonese', 1.3, 0, 'https://appx5lm2o5a3336.h5.xiaoeknow.com/p/course/middle_page/v_68f257e0e4b0694ca12e1d4a?resource_type=3'),
('【普通话】ESG投資與永續發展：香港現狀、全球比較及未來趨勢', '分析ESG投资在香港的现状及未来趋势。', 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=800&q=80', 'ESG', 'Mandarin', 1.3, 0, 'https://appx5lm2o5a3336.h5.xiaoeknow.com/p/course/middle_page/v_68f2cf0fe4b0694ca12e29ec?resource_type=3'),

-- 7. AML
('【粵語】香港反洗錢與反恐怖融資(AML&CFT)全面培訓課程', '全面講解香港反洗錢與反恐怖融資法規與實務。', 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80', 'Compliance', 'Cantonese', 1.5, 0, 'https://appx5lm2o5a3336.h5.xiaoeknow.com/p/course/middle_page/v_68f20a46e4b0694ca12decac?resource_type=3'),
('【普通话】香港反洗錢與反恐怖融資(AML&CFT)全面培訓課程', '全面讲解香港反洗钱与反恐怖融资法规与实务。', 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80', 'Compliance', 'Mandarin', 1.5, 0, 'https://appx5lm2o5a3336.h5.xiaoeknow.com/p/course/middle_page/v_68f2d33ee4b0694ca12e2a81?resource_type=3');
