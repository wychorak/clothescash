import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { deleteProduct, updateProduct, syncProducts } from '../services/productService';
import { productsToSync } from '../lib/data';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Trash2, CheckCircle, XCircle, Shirt, ShoppingBag, Layers, Package } from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

export const Library: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'sold' | 'available'>('all');
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'confirm' | 'prompt';
    title: string;
    message: string;
    defaultValue?: string;
    onConfirm: (value?: string) => void;
  }>({
    isOpen: false,
    type: 'confirm',
    title: '',
    message: '',
    onConfirm: () => {}
  });
  const [promptValue, setPromptValue] = useState('');

  useEffect(() => {
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

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filter === 'sold') return matchesSearch && product.isSold;
    if (filter === 'available') return matchesSearch && !product.isSold;
    return matchesSearch;
  });

  const handleDelete = (id: string) => {
    setModalState({
      isOpen: true,
      type: 'confirm',
      title: 'Potwierdzenie',
      message: 'Czy na pewno chcesz usunąć ten produkt?',
      onConfirm: async () => {
        await deleteProduct(id);
        setModalState(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleToggleSold = (product: Product) => {
    if (!product.isSold) {
      setPromptValue(product.purchasePrice.toString());
      setModalState({
        isOpen: true,
        type: 'prompt',
        title: 'Sprzedaż produktu',
        message: 'Podaj cenę sprzedaży (zł):',
        defaultValue: product.purchasePrice.toString(),
        onConfirm: async (price) => {
          if (price) {
            await updateProduct(product.id, {
              isSold: true,
              salePrice: parseFloat(price) || 0,
              saleDate: new Date()
            });
          }
          setModalState(prev => ({ ...prev, isOpen: false }));
        }
      });
    } else {
      updateProduct(product.id, {
        isSold: false,
        salePrice: undefined,
        saleDate: undefined
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes('Koszulka') || category.includes('T-shirt')) return <Shirt size={24} />;
    if (category.includes('Spodnie')) return <ShoppingBag size={24} />;
    if (category.includes('Sweter')) return <Layers size={24} />;
    return <Package size={24} />;
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-display">Biblioteka</h1>
        <div className="flex items-center gap-4">
          <button 
            onClick={async () => {
              await syncProducts('anonymous', productsToSync);
              alert('Zsynchronizowano!');
            }}
            className="bg-pink-100 text-pink-700 px-4 py-2 rounded-full font-bold"
          >
            Sync
          </button>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Szukaj produktów..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input pl-12 pr-4 py-3 rounded-2xl w-64 text-sm"
            />
          </div>
          <div className="glass-panel p-1 rounded-2xl flex items-center">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'all' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Wszystkie
            </button>
            <button
              onClick={() => setFilter('available')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'available' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Dostępne
            </button>
            <button
              onClick={() => setFilter('sold')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'sold' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Sprzedane
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass-panel p-8 rounded-[2rem] flex flex-col gap-6"
              >
                <div className="flex items-center justify-between">
                  <div className="w-16 h-16 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600 shadow-lg">
                    {getCategoryIcon(product.category)}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleToggleSold(product)}
                      className={`p-3 rounded-2xl transition-all ${product.isSold ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-pink-100 text-pink-700 hover:bg-pink-200'}`}
                      title={product.isSold ? "Cofnij sprzedaż" : "Oznacz jako sprzedane"}
                    >
                      {product.isSold ? <XCircle size={20} /> : <CheckCircle size={20} />}
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-3 rounded-2xl bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-all"
                      title="Usuń"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold text-gray-800 text-xl font-display">{product.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{product.brand || 'Brak marki'} • {product.size || 'Brak rozmiaru'}</p>
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-pink-100/50">
                  <p className="font-bold text-gray-800 text-lg">{product.purchasePrice.toFixed(2)} zł</p>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${product.isSold ? 'bg-green-100 text-green-700' : 'bg-pink-100 text-pink-700'}`}>
                    {product.isSold ? 'Sprzedane' : 'Dostępne'}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Filter size={48} className="mb-4 text-gray-300" />
            <p className="text-lg font-medium">Brak produktów do wyświetlenia</p>
            <p className="text-sm">Zmień filtry lub dodaj nowy produkt.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalState.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl max-w-sm w-full border border-white/50"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">{modalState.title}</h3>
              <p className="text-gray-600 mb-4">{modalState.message}</p>
              
              {modalState.type === 'prompt' && (
                <input
                  type="number"
                  step="0.01"
                  value={promptValue}
                  onChange={(e) => setPromptValue(e.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-2xl mb-4"
                  autoFocus
                />
              )}
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setModalState(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Anuluj
                </button>
                <button
                  onClick={() => modalState.onConfirm(modalState.type === 'prompt' ? promptValue : undefined)}
                  className="px-4 py-2 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                >
                  Potwierdź
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
