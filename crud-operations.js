// CRUD Operations for Products
import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Referencia a la colección de productos
const productsCollection = collection(db, 'products');

// Función para crear un nuevo producto
async function createProduct(productData) {
    try {
        console.log('Datos recibidos:', productData);
        
        // Asegurarse de que los datos del producto sean válidos
        const validData = {
            productName: productData.productName,
            regularPrice: parseFloat(productData.regularPrice),
            price: parseFloat(productData.price),
            description: productData.description,
            status: productData.status,
            dateCreated: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };

        console.log('Datos validados:', validData);
        
        // Validar los datos antes de guardar
        if (!validData.productName || 
            isNaN(validData.regularPrice) || 
            isNaN(validData.price) || 
            !validData.description || 
            !['activo', 'inactivo', 'pendiente'].includes(validData.status)) {
            throw new Error('Datos del producto inválidos');
        }

        // Guardar el producto en Firebase
        console.log('Guardando producto...');
        const docRef = await addDoc(productsCollection, validData);
        console.log('Producto guardado con ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error detallado al crear producto:", error);
        throw error;
    }
}

// Función para obtener todos los productos
async function getProducts() {
    try {
        console.log('Obteniendo productos...');
        const querySnapshot = await getDocs(productsCollection);
        const products = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        console.log('Productos obtenidos:', products);
        return products;
    } catch (error) {
        console.error("Error al obtener productos:", error);
        throw error;
    }
}

// Función para eliminar un producto
async function deleteProduct(productId) {
    try {
        console.log('Eliminando producto con ID:', productId);
        await deleteDoc(doc(productsCollection, productId));
        console.log('Producto eliminado');
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        throw error;
    }
}

// Función para actualizar un producto
async function updateProduct(productId, updatedData) {
    try {
        console.log('Actualizando producto con ID:', productId);
        console.log('Datos actualizados:', updatedData);
        
        // Asegurarse de que los datos actualizados sean válidos
        const validData = {
            ...updatedData,
            lastUpdated: new Date().toISOString()
        };

        // Validar los datos antes de actualizar
        if (validData.regularPrice !== undefined && isNaN(parseFloat(validData.regularPrice))) {
            throw new Error('Precio regular inválido');
        }
        if (validData.price !== undefined && isNaN(parseFloat(validData.price))) {
            throw new Error('Precio inválido');
        }
        if (validData.status !== undefined && !['activo', 'inactivo', 'pendiente'].includes(validData.status)) {
            throw new Error('Estado inválido');
        }

        const productRef = doc(productsCollection, productId);
        await updateDoc(productRef, validData);
        console.log('Producto actualizado');
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        throw error;
    }
}

// Exportar funciones
export { createProduct, getProducts, deleteProduct, updateProduct };
