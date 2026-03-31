import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { deleteProduct, updateProduct } from '../services/productService';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Trash2, CircleCheck as CheckCircle, Circle as XCircle, Shirt, ShoppingBag, Layers, Package, CreditCard as Edit3, Sparkles } from 'lucide-react';

export const Library: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'sold' | 'available'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'confirm' | 'prompt' | 'edit';
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
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    category: '',
    brand: '',
    size: '',
    purchasePrice: '',
    purchaseDate: '',
  });

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

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  const brands = ['all', ...Array.from(new Set(products.map(p => p.brand).filter(Boolean)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' ||
                          (statusFilter === 'sold' && product.isSold) ||
                          (statusFilter === 'available' && !product.isSold);
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesBrand = brandFilter === 'all' || product.brand === brandFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesBrand;
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

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setEditFormData({
      title: product.title,
      description: product.description || '',
      category: product.category,
      brand: product.brand || '',
      size: product.size || '',
      purchasePrice: product.purchasePrice.toString(),
      purchaseDate: product.purchaseDate.toISOString().split('T')[0],
    });
    setModalState({
      isOpen: true,
      type: 'edit',
      title: 'Edytuj produkt',
      message: '',
      onConfirm: async () => {
        if (editingProduct) {
          await updateProduct(editingProduct.id, {
            title: editFormData.title,
            description: editFormData.description,
            category: editFormData.category,
            brand: editFormData.brand,
            size: editFormData.size,
            purchasePrice: parseFloat(editFormData.purchasePrice),
            purchaseDate: new Date(editFormData.purchaseDate),
          });
        }
        setModalState(prev => ({ ...prev, isOpen: false }));
        setEditingProduct(null);
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
    if (category.includes('Koszulka') || category.includes('T-shirt') || category.includes('Top')) return <Shirt size={24} />;
    if (category.includes('Spodnie') || category.includes('Jeans')) return <ShoppingBag size={24} />;
    if (category.includes('Sweter') || category.includes('Bluza')) return <Layers size={24} />;
    return <Package size={24} />;
  };

  return (
    <div className="space-y-6 h-full flex flex-col relative">
      <motion.div
        className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none"
        animate={{
          rotate: [0, 10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Sparkles size={120} className="text-pink-400" />
      </motion.div>

      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-display">Biblioteka produktów</h1>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Szukaj produktów..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input pl-12 pr-4 py-3 rounded-2xl w-full text-sm"
            />
          </div>

          <div className="glass-panel p-1 rounded-2xl flex items-center">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${statusFilter === 'all' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Wszystkie
            </button>
            <button
              onClick={() => setStatusFilter('available')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${statusFilter === 'available' ? 'bg-white shadow-sm text-pink-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Dostępne
            </button>
            <button
              onClick={() => setStatusFilter('sold')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${statusFilter === 'sold' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Sprzedane
            </button>
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="glass-input px-4 py-3 rounded-2xl text-sm font-medium"
          >
            <option value="all">Wszystkie kategorie</option>
            {categories.filter(c => c !== 'all').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="glass-input px-4 py-3 rounded-2xl text-sm font-medium"
          >
            <option value="all">Wszystkie marki</option>
            {brands.filter(b => b !== 'all').map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredProducts.map((product) => {
              const profit = product.isSold && product.salePrice ? product.salePrice - product.purchasePrice : 0;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="glass-panel p-6 rounded-[2rem] flex flex-col gap-4 relative overflow-hidden"
                >
                  <motion.div
                    className="absolute -top-4 -right-4 w-24 h-24 bg-pink-200/20 rounded-full blur-2xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />

                  <div className="flex items-center justify-between">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-200 to-rose-300 flex items-center justify-center text-pink-700 shadow-lg"
                    >
                      {getCategoryIcon(product.category)}
                    </motion.div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(product)}
                        className="p-2.5 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all"
                        title="Edytuj"
                      >
                        <Edit3 size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleToggleSold(product)}
                        className={`p-2.5 rounded-xl transition-all ${product.isSold ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-pink-100 text-pink-700 hover:bg-pink-200'}`}
                        title={product.isSold ? "Cofnij sprzedaż" : "Oznacz jako sprzedane"}
                      >
                        {product.isSold ? <XCircle size={18} /> : <CheckCircle size={18} />}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(product.id)}
                        className="p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-all"
                        title="Usuń"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800 text-lg font-display line-clamp-2">{product.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{product.brand || 'Brak marki'} • {product.size || 'Brak rozmiaru'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{product.category}</p>
                  </div>

                  <div className="mt-auto pt-4 border-t border-pink-100/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Zakup:</span>
                      <p className="font-bold text-gray-800">{product.purchasePrice.toFixed(2)} zł</p>
                    </div>

                    {product.isSold && product.salePrice && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Sprzedaż:</span>
                          <p className="font-bold text-green-700">{product.salePrice.toFixed(2)} zł</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Zysk:</span>
                          <p className={`font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {profit >= 0 ? '+' : ''}{profit.toFixed(2)} zł
                          </p>
                        </div>
                      </>
                    )}

                    <div className="pt-2">
                      <span className={`inline-block w-full text-center px-3 py-1.5 rounded-xl text-xs font-bold ${product.isSold ? 'bg-green-100 text-green-700' : 'bg-pink-100 text-pink-700'}`}>
                        {product.isSold ? 'Sprzedane' : 'Dostępne'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-64 text-gray-500"
          >
            <Sparkles size={48} className="mb-4 text-pink-300" />
            <p className="text-lg font-medium">Brak produktów do wyświetlenia</p>
            <p className="text-sm">Zmień filtry lub dodaj nowy produkt.</p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {modalState.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl max-w-md w-full border border-white/50"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">{modalState.title}</h3>

              {modalState.type === 'confirm' && (
                <p className="text-gray-600 mb-6">{modalState.message}</p>
              )}

              {modalState.type === 'prompt' && (
                <>
                  <p className="text-gray-600 mb-4">{modalState.message}</p>
                  <input
                    type="number"
                    step="0.01"
                    value={promptValue}
                    onChange={(e) => setPromptValue(e.target.value)}
                    className="glass-input w-full px-4 py-3 rounded-2xl mb-4"
                    autoFocus
                  />
                </>
              )}

              {modalState.type === 'edit' && (
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Tytuł</label>
                    <input
                      type="text"
                      value={editFormData.title}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="glass-input w-full px-4 py-2 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Kategoria</label>
                    <input
                      type="text"
                      value={editFormData.category}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="glass-input w-full px-4 py-2 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Marka</label>
                    <input
                      type="text"
                      value={editFormData.brand}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, brand: e.target.value }))}
                      className="glass-input w-full px-4 py-2 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Rozmiar</label>
                    <input
                      type="text"
                      value={editFormData.size}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, size: e.target.value }))}
                      className="glass-input w-full px-4 py-2 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Cena zakupu (zł)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editFormData.purchasePrice}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, purchasePrice: e.target.value }))}
                      className="glass-input w-full px-4 py-2 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Data zakupu</label>
                    <input
                      type="date"
                      value={editFormData.purchaseDate}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                      className="glass-input w-full px-4 py-2 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Opis</label>
                    <textarea
                      value={editFormData.description}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="glass-input w-full px-4 py-2 rounded-xl resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setModalState(prev => ({ ...prev, isOpen: false }));
                    setEditingProduct(null);
                  }}
                  className="px-5 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Anuluj
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => modalState.onConfirm(modalState.type === 'prompt' ? promptValue : undefined)}
                  className="px-5 py-2.5 rounded-xl font-medium bg-gradient-to-r from-pink-400 to-rose-500 text-white hover:from-pink-500 hover:to-rose-600 transition-all shadow-lg shadow-pink-500/30"
                >
                  Potwierdź
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
