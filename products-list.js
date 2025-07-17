import { getProducts, deleteProduct } from './crud-operations.js';

document.addEventListener('DOMContentLoaded', async () => {
    const tbody = document.querySelector('tbody');
    
    // Función para mostrar los productos en la tabla
    async function displayProducts() {
        try {
            const products = await getProducts();
            tbody.innerHTML = '';
            
            products.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.productName}</td>
                    <td>$${product.regularPrice.toFixed(2)}</td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td>${product.description}</td>
                    <td>${product.status}</td>
                    <td>
                        <button onclick="editProduct('${product.id}')" class="edit-btn">Editar</button>
                        <button onclick="deleteProduct('${product.id}')" class="delete-btn">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error('Error al cargar productos:', error);
        }
    }

    // Función para eliminar un producto
    async function deleteProduct(productId) {
        if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            try {
                await deleteProduct(productId);
                displayProducts(); // Actualizar la lista
            } catch (error) {
                console.error('Error al eliminar producto:', error);
                alert('Error al eliminar el producto');
            }
        }
    }

    // Función para editar un producto
    function editProduct(productId) {
        // Aquí puedes implementar la lógica para editar el producto
        // Por ejemplo, podrías redirigir a una página de edición o abrir un modal
        alert('Funcionalidad de edición no implementada aún');
    }

    // Cargar productos al cargar la página
    displayProducts();
});
