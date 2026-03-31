import { collection, doc, addDoc, updateDoc, deleteDoc, Timestamp, getDocs, query, where, orderBy, onSnapshot, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';

const COLLECTION_NAME = 'products';

export const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...productData,
    purchaseDate: Timestamp.fromDate(productData.purchaseDate),
    saleDate: productData.saleDate ? Timestamp.fromDate(productData.saleDate) : null,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateProduct = async (id: string, productData: Partial<Omit<Product, 'id' | 'uid' | 'createdAt'>>) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const updateData: any = { ...productData };
  
  if (productData.purchaseDate) {
    updateData.purchaseDate = Timestamp.fromDate(productData.purchaseDate);
  }
  if (productData.saleDate !== undefined) {
    updateData.saleDate = productData.saleDate ? Timestamp.fromDate(productData.saleDate) : null;
  }

  await updateDoc(docRef, updateData);
};

export const deleteProduct = async (id: string) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};

export const syncProducts = async (uid: string, products: Omit<Product, 'id' | 'uid' | 'createdAt'>[]) => {
  const batch = writeBatch(db);
  const productsCollection = collection(db, COLLECTION_NAME);

  for (const productData of products) {
    const docRef = doc(productsCollection);
    batch.set(docRef, {
      ...productData,
      uid,
      purchaseDate: Timestamp.fromDate(productData.purchaseDate),
      saleDate: productData.saleDate ? Timestamp.fromDate(productData.saleDate) : null,
      createdAt: Timestamp.now(),
    });
  }

  await batch.commit();
};

export const subscribeToProducts = (uid: string, callback: (products: Product[]) => void) => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
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
    callback(products);
  }, (error) => {
    console.error("Error fetching products:", error);
  });
};
