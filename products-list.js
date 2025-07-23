import { getProducts, deleteProduct } from './crud-operations.js';

document.addEventListener('DOMContentLoaded', async () => {
    const tbody = document.getElementById('productsTableBody');
    let products = [];
    
    // Función para formatear el precio
    function formatPrice(price) {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2
        }).format(price);
    }
    
    // Función para mostrar los productos en la tabla
    async function displayProducts() {
        try {
            const loadingRow = document.createElement('tr');
            loadingRow.id = 'loadingRow';
            loadingRow.innerHTML = '<td colspan="7" style="text-align: center; padding: 20px;">Cargando productos...</td>';
            tbody.innerHTML = '';
            tbody.appendChild(loadingRow);
            
            products = await getProducts();
            tbody.innerHTML = '';
            
            if (products.length === 0) {
                const emptyRow = document.createElement('tr');
                emptyRow.innerHTML = '<td colspan="7" style="text-align: center; padding: 20px;">No hay productos registrados</td>';
                tbody.appendChild(emptyRow);
                return;
            }
            
            // Ordenar productos por fecha de creación (más recientes primero)
            products.sort((a, b) => {
                return new Date(b.dateCreated || 0) - new Date(a.dateCreated || 0);
            });
            
            products.forEach(product => {
                const row = document.createElement('tr');
                
                // Establecer clase según el estado del producto
                if (product.status === 'inactivo') {
                    row.classList.add('inactive-product');
                }
                
                row.innerHTML = `
                    <td class="product-image-cell">
                        ${product.imageUrl ? 
                            `<img src="${product.imageUrl}" alt="${product.productName}" class="product-image" 
                                  onerror="this.onerror=null; this.src='https://via.placeholder.com/60?text=Sin+imagen';" />` : 
                            '<div class="no-image">Sin imagen</div>'
                        }
                    </td>
                    <td class="product-name">${product.productName || 'N/A'}</td>
                    <td class="product-price">${product.regularPrice ? formatPrice(product.regularPrice) : 'N/A'}</td>
                    <td class="product-price">${product.price ? formatPrice(product.price) : 'N/A'}</td>
                    <td class="product-description">${product.description || 'Sin descripción'}</td>
                    <td class="product-status">
                        <span class="status-badge ${product.status || 'inactivo'}">
                            ${product.status === 'activo' ? 'Activo' : 
                              product.status === 'pendiente' ? 'Pendiente' : 'Inactivo'}
                        </span>
                    </td>
                    <td class="product-actions">
                        <button onclick="editProduct('${product.id}')" class="action-btn edit-btn" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="handleDelete('${product.id}')" class="action-btn delete-btn" title="Eliminar">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error('Error al cargar productos:', error);
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="error-message">
                        Error al cargar los productos. Por favor, intente nuevamente.
                    </td>
                </tr>
            `;
        }
    }

    // Función para eliminar un producto
    async function handleDelete(productId) {
        if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            try {
                const loadingRow = document.createElement('tr');
                loadingRow.id = 'loadingRow';
                loadingRow.innerHTML = '<td colspan="7" style="text-align: center; padding: 20px;">Eliminando producto...</td>';
                tbody.innerHTML = '';
                tbody.appendChild(loadingRow);
                
                await deleteProduct(productId);
                await displayProducts(); // Actualizar la lista
                
                // Mostrar mensaje de éxito
                const successRow = document.createElement('tr');
                successRow.innerHTML = `
                    <td colspan="7" class="success-message">
                        Producto eliminado correctamente
                    </td>
                `;
                tbody.insertBefore(successRow, tbody.firstChild);
                
                // Ocultar mensaje después de 3 segundos
                setTimeout(() => {
                    successRow.style.display = 'none';
                }, 3000);
                
            } catch (error) {
                console.error('Error al eliminar producto:', error);
                alert('Error al eliminar el producto');
                await displayProducts(); // Recargar la lista en caso de error
            }
        }
    }

    // Función para editar un producto
    function editProduct(productId) {
        // Redirigir a la página de edición con el ID del producto
        window.location.href = `edit-product.html?id=${productId}`;
    }
    
    // Hacer las funciones accesibles globalmente
    window.handleDelete = handleDelete;
    window.editProduct = editProduct;

    // Cargar productos al cargar la página
    displayProducts();
    
    // Agregar estilos dinámicamente
    const style = document.createElement('style');
    style.textContent = `
        .product-image {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 8px;
            border: 1px solid #ffd6e7;
            transition: transform 0.3s ease;
        }
        
        .product-image:hover {
            transform: scale(1.8);
            z-index: 10;
            position: relative;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .product-image-cell {
            text-align: center;
            padding: 8px !important;
        }
        
        .no-image {
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #fff0f5;
            border: 1px dashed #ffb6c1;
            border-radius: 8px;
            color: #d35d8a;
            font-size: 12px;
            text-align: center;
            padding: 5px;
        }
        
        .status-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .status-badge.activo {
            background-color: #d4edda;
            color: #155724;
        }
        
        .status-badge.inactivo {
            background-color: #f8d7da;
            color: #721c24;
        }
        
        .status-badge.pendiente {
            background-color: #fff3cd;
            color: #856404;
        }
        
        .product-actions {
            display: flex;
            gap: 8px;
            justify-content: center;
        }
        
        .action-btn {
            width: 32px;
            height: 32px;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            background: none;
        }
        
        .edit-btn {
            color: #0d6efd;
            border: 1px solid #0d6efd;
        }
        
        .edit-btn:hover {
            background-color: #0d6efd;
            color: white;
            transform: scale(1.1);
        }
        
        .delete-btn {
            color: #dc3545;
            border: 1px solid #dc3545;
        }
        
        .delete-btn:hover {
            background-color: #dc3545;
            color: white;
            transform: scale(1.1);
        }
        
        .inactive-product {
            opacity: 0.7;
            background-color: rgba(255, 214, 231, 0.1);
        }
        
        .inactive-product:hover {
            opacity: 1;
        }
        
        .success-message {
            background-color: #d4edda !important;
            color: #155724;
            text-align: center;
            padding: 10px !important;
            font-weight: 500;
        }
        
        .error-message {
            background-color: #f8d7da !important;
            color: #721c24;
            text-align: center;
            padding: 10px !important;
            font-weight: 500;
        }
        
        @media (max-width: 768px) {
            .product-image {
                width: 50px;
                height: 50px;
            }
            
            .no-image {
                width: 50px;
                height: 50px;
            }
        }
    `;
    document.head.appendChild(style);
});
