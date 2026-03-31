import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../services/productService';
import { motion } from 'motion/react';
import { Save, ArrowLeft } from 'lucide-react';

export const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    brand: '',
    size: '',
    purchasePrice: '',
    purchaseDate: new Date().toISOString().split('T')[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      await addProduct({
        uid: 'anonymous', // Placeholder for public access
        title: formData.title,
        description: formData.description,
        category: formData.category,
        brand: formData.brand,
        size: formData.size,
        purchasePrice: parseFloat(formData.purchasePrice),
        isSold: false,
        purchaseDate: new Date(formData.purchaseDate),
      });
      navigate('/library');
    } catch (error) {
      console.error("Error adding product:", error);
      setError("Wystąpił błąd podczas dodawania produktu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 rounded-2xl glass-button text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dodaj nowy produkt</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-8 font-display">Dodaj nowy produkt</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 ml-1">Tytuł produktu *</label>
              <input
                required
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="glass-input w-full px-4 py-3"
                placeholder="np. Czarna bluza z kapturem"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 ml-1">Kategoria *</label>
              <select
                required
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="glass-input w-full px-4 py-3 appearance-none"
              >
                <option value="" disabled>Wybierz kategorię</option>
                <option value="Buty">Buty</option>
                <option value="Bluzy">Bluzy</option>
                <option value="Koszulki">Koszulki</option>
                <option value="Spodnie">Spodnie</option>
                <option value="Kurtki">Kurtki</option>
                <option value="Akcesoria">Akcesoria</option>
                <option value="Inne">Inne</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 ml-1">Marka</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="glass-input w-full px-4 py-3"
                placeholder="np. Nike, Zara"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 ml-1">Rozmiar</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="glass-input w-full px-4 py-3"
                placeholder="np. M, 42"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 ml-1">Cena zakupu (zł) *</label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                name="purchasePrice"
                value={formData.purchasePrice}
                onChange={handleChange}
                className="glass-input w-full px-4 py-3"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 ml-1">Data zakupu *</label>
              <input
                required
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                className="glass-input w-full px-4 py-3"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 ml-1">Opis</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="glass-input w-full px-4 py-3 resize-none"
                placeholder="Dodatkowe informacje o produkcie..."
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-pink-400 to-rose-500 text-white px-8 py-4 font-bold rounded-2xl hover:from-pink-500 hover:to-rose-600 transition-all shadow-lg shadow-pink-500/30 disabled:opacity-70 flex items-center gap-3"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={20} />
              )}
              Zapisz produkt
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
