import React, { useEffect, useRef } from 'react';
import { addProduct } from '../services/productService';

export const InitialDataAdder: React.FC = () => {
  const hasAdded = useRef(false);

  useEffect(() => {
    if (hasAdded.current) return;
    hasAdded.current = true;

    const products = [
      { uid: 'anonymous', title: 'Anime Crop Top Y2K Slim #1', description: '', category: 'Crop top / top', brand: 'Y2K Streetwear', size: 'S', purchasePrice: 24.21, isSold: false, purchaseDate: new Date('2025-07-04') },
      { uid: 'anonymous', title: 'Anime Crop Top Y2K Slim #2', description: '', category: 'Crop top / top', brand: 'Y2K Streetwear', size: 'S', purchasePrice: 24.21, isSold: false, purchaseDate: new Date('2025-07-04') },
      { uid: 'anonymous', title: 'Anime Crop Top Y2K Slim #3', description: '', category: 'Crop top / top', brand: 'Y2K Streetwear', size: 'S', purchasePrice: 24.21, isSold: false, purchaseDate: new Date('2025-07-04') },
      { uid: 'anonymous', title: 'Wide Leg Leopard Pants Grey #1', description: '', category: 'Spodnie damskie', brand: 'Y2K Casual', size: 'M', purchasePrice: 52.27, isSold: false, purchaseDate: new Date('2025-06-25') },
      { uid: 'anonymous', title: 'Wide Leg Leopard Pants Grey #2', description: '', category: 'Spodnie damskie', brand: 'Y2K Casual', size: 'M', purchasePrice: 52.27, isSold: false, purchaseDate: new Date('2025-06-25') },
      { uid: 'anonymous', title: 'Wide Leg Leopard Pants Grey #3', description: '', category: 'Spodnie damskie', brand: 'Y2K Casual', size: 'M', purchasePrice: 52.27, isSold: false, purchaseDate: new Date('2025-06-25') },
      { uid: 'anonymous', title: 'Y2K Graphic Tee Harajuku Retro', description: '', category: 'Koszulka', brand: 'Y2K Harajuku', size: 'S', purchasePrice: 22.20, isSold: false, purchaseDate: new Date('2025-06-10') },
      { uid: 'anonymous', title: 'Vintage Heavy Jeans Y2K #1', description: '', category: 'Jeans', brand: 'Y2K Hip Hop', size: 'L', purchasePrice: 182.99, isSold: false, purchaseDate: new Date('2025-06-10') },
      { uid: 'anonymous', title: 'Gothpunk Oversized Jeans', description: '', category: 'Jeans', brand: 'Harajuku Gothpunk', size: 'L', purchasePrice: 89.59, isSold: false, purchaseDate: new Date('2025-06-10') },
      { uid: 'anonymous', title: 'Y2K Baggy Flare Jeans Patchwork', description: '', category: 'Jeans', brand: 'Harajuku 2000s', size: 'XXXL', purchasePrice: 117.40, isSold: false, purchaseDate: new Date('2025-11-14') },
      { uid: 'anonymous', title: 'Vintage Heavy Jeans Y2K #2', description: '', category: 'Jeans', brand: 'Y2K Hip Hop', size: 'L', purchasePrice: 173.36, isSold: false, purchaseDate: new Date('2025-09-20') },
      { uid: 'anonymous', title: 'Irregular Denim Patchwork Y2K', description: '', category: 'Jeans', brand: 'American Retro Y2K', size: 'L', purchasePrice: 76.83, isSold: false, purchaseDate: new Date('2025-07-25') },
      { uid: 'anonymous', title: 'Wide Leg Leopard Pants Grey #4', description: '', category: 'Spodnie damskie', brand: 'Y2K Casual', size: 'M', purchasePrice: 67.74, isSold: false, purchaseDate: new Date('2025-07-14') },
      { uid: 'anonymous', title: 'Wide Leg Leopard Pants Grey #5', description: '', category: 'Spodnie damskie', brand: 'Y2K Casual', size: 'M', purchasePrice: 67.74, isSold: false, purchaseDate: new Date('2025-07-14') },
      { uid: 'anonymous', title: 'Aphex Twin Graphic T-shirt White #1', description: '', category: 'Koszulka damska', brand: 'Y2K Streetwear', size: 'L', purchasePrice: 17.20, isSold: false, purchaseDate: new Date('2025-07-04') },
      { uid: 'anonymous', title: 'Aphex Twin Graphic T-shirt White #2', description: '', category: 'Koszulka damska', brand: 'Y2K Streetwear', size: 'L', purchasePrice: 17.20, isSold: false, purchaseDate: new Date('2025-07-04') },
      { uid: 'anonymous', title: 'Letter Embroidered Loose Jeans #1', description: '', category: 'Jeans', brand: 'American Street Y2K', size: 'L', purchasePrice: 91.99, isSold: false, purchaseDate: new Date('2025-06-10') },
      { uid: 'anonymous', title: 'Letter Embroidery Denim Shorts', description: '', category: 'Szorty denim', brand: 'American Fashion', size: 'L', purchasePrice: 98.79, isSold: false, purchaseDate: new Date('2025-06-10') },
      { uid: 'anonymous', title: 'Gothic Skull Chain T-shirt', description: '', category: 'Koszulka', brand: 'Retro Gothic', size: 'L', purchasePrice: 60.64, isSold: false, purchaseDate: new Date('2025-06-10') },
      { uid: 'anonymous', title: 'Playboy Carti Death Wish T-shirt', description: '', category: 'Koszulka', brand: 'Hip Hop Retro', size: 'L', purchasePrice: 39.19, isSold: false, purchaseDate: new Date('2025-05-31') },
      { uid: 'anonymous', title: 'Logo Printed T-shirt Black', description: '', category: 'Koszulka', brand: 'Harajuku', size: 'S', purchasePrice: 33.09, isSold: false, purchaseDate: new Date('2025-05-31') },
      { uid: 'anonymous', title: 'Summer Y2K Personalized Top', description: '', category: 'Top damski', brand: 'American Y2K', size: 'L', purchasePrice: 41.59, isSold: false, purchaseDate: new Date('2025-05-31') },
      { uid: 'anonymous', title: 'Affliction Y2K Oversized T-shirt', description: '', category: 'Koszulka', brand: 'Y2K Hip Hop', size: 'L', purchasePrice: 29.64, isSold: false, purchaseDate: new Date('2025-05-31') },
      { uid: 'anonymous', title: 'Aphex Twin Graphic T-shirt White #3', description: '', category: 'Koszulka damska', brand: 'Y2K Streetwear', size: 'L', purchasePrice: 18.99, isSold: false, purchaseDate: new Date('2025-05-31') },
      { uid: 'anonymous', title: 'Black Graphic Tee Y2K', description: '', category: 'Koszulka', brand: 'Y2K Streetwear', size: '—', purchasePrice: 41.69, isSold: false, purchaseDate: new Date('2025-05-24') },
      { uid: 'anonymous', title: 'White Graphic Tee 2024 Y2K', description: '', category: 'Koszulka', brand: 'Y2K Streetwear', size: '—', purchasePrice: 41.69, isSold: false, purchaseDate: new Date('2025-05-24') },
      { uid: 'anonymous', title: 'Graffiti Hooded Sweatshirt', description: '', category: 'Bluza z kapturem', brand: 'Casual Graffiti', size: 'L', purchasePrice: 87.39, isSold: false, purchaseDate: new Date('2025-05-24') },
      { uid: 'anonymous', title: 'Vintage Heavy Jeans Y2K #3', description: '', category: 'Jeans', brand: 'Y2K Hip Hop', size: 'L', purchasePrice: 182.99, isSold: false, purchaseDate: new Date('2025-05-24') },
      { uid: 'anonymous', title: 'Letter Embroidered Loose Jeans #2', description: '', category: 'Jeans', brand: 'American Street Y2K', size: 'L', purchasePrice: 86.38, isSold: false, purchaseDate: new Date('2025-05-24') },
    ];

    products.forEach(async (product) => {
      await addProduct(product);
    });
  }, []);

  return null;
};
