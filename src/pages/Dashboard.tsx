import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { motion } from 'motion/react';
import { TrendingUp, DollarSign, Package, ShoppingBag, Shirt, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch all products, not just for a specific user
    const q = query(
      collection(db, 'products'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const products: Product[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          uid: data.uid,
          title: data.title,
          description: data.description,
          category: data.category,
          brand: data.brand,
          size: data.size,
          purchasePrice: data.purchasePrice,
          isSold: data.isSold,
          salePrice: data.salePrice,
          purchaseDate: data.purchaseDate?.toDate(),
          saleDate: data.saleDate?.toDate(),
          createdAt: data.createdAt?.toDate(),
        };
      });
      setProducts(products);
    });
    return () => unsubscribe();
  }, []);

  const totalProducts = products.length;
  const soldProducts = products.filter(p => p.isSold);
  const totalRevenue = soldProducts.reduce((sum, p) => sum + (p.salePrice || 0), 0);
  const totalCost = products.reduce((sum, p) => sum + p.purchasePrice, 0);
  const totalProfit = totalRevenue - totalCost;

  // Group by category for chart
  const categoryData = products.reduce((acc, p) => {
    const existing = acc.find(c => c.name === p.category);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ name: p.category, count: 1 });
    }
    return acc;
  }, [] as { name: string, count: number }[]);

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="glass-panel p-6 rounded-[2rem] flex items-center gap-5"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${color}`}>
        <Icon size={28} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800 font-display">{value}</h3>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-4xl font-bold tracking-tight text-gray-800 font-display">Pulpit</h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard 
          title="Przychód" 
          value={`${totalRevenue.toFixed(2)} zł`} 
          icon={DollarSign} 
          color="bg-gradient-to-br from-pink-300 to-rose-400" 
        />
        <StatCard 
          title="Koszty" 
          value={`${totalCost.toFixed(2)} zł`} 
          icon={ShoppingBag} 
          color="bg-gradient-to-br from-pink-200 to-pink-300" 
        />
        <StatCard 
          title="Zysk netto" 
          value={`${totalProfit.toFixed(2)} zł`} 
          icon={TrendingUp} 
          color="bg-gradient-to-br from-rose-300 to-pink-400" 
        />
        <StatCard 
          title="Ilość produktów" 
          value={totalProducts} 
          icon={Package} 
          color="bg-gradient-to-br from-pink-300 to-purple-300" 
        />
        <StatCard 
          title="Sprzedane" 
          value={soldProducts.length} 
          icon={CheckCircle} 
          color="bg-gradient-to-br from-pink-400 to-rose-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-8 rounded-[2rem]"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 font-display">Produkty według kategorii</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,182,193,0.3)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(255,182,193,0.3)' }}
                  cursor={{ fill: 'rgba(255,182,193,0.1)' }}
                />
                <Bar dataKey="count" fill="#f472b6" radius={[12, 12, 12, 12]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-8 rounded-[2rem] flex flex-col"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 font-display">Ostatnio dodane</h3>
          <div className="flex-1 overflow-y-auto space-y-4">
            {products.slice(0, 5).map(product => (
              <div key={product.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/50 border border-pink-100/50 hover:bg-white/80 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600">
                    <Shirt size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{product.title}</p>
                    <p className="text-xs text-gray-500">{product.brand || 'Brak marki'} • {product.size || 'Brak rozmiaru'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{product.purchasePrice.toFixed(2)} zł</p>
                  {product.isSold ? (
                    <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">Sprzedane</span>
                  ) : (
                    <span className="text-xs font-bold text-pink-700 bg-pink-100 px-3 py-1 rounded-full">Dostępne</span>
                  )}
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                Brak produktów. Dodaj swój pierwszy produkt!
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
