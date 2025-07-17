import { createProduct } from './crud-operations.js';

// Obtener referencias a los elementos del DOM
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('productForm');
    const createBtn = document.getElementById('createProductBtn');
    const productNameInput = document.getElementById('productName');
    const regularPriceInput = document.getElementById('regularPrice');
    const priceInput = document.getElementById('price');
    const descriptionInput = document.getElementById('description');
    const statusSelect = document.getElementById('status');

    console.log('Elementos del DOM:', {
        form: !!form,
        createBtn: !!createBtn,
        productNameInput: !!productNameInput,
        regularPriceInput: !!regularPriceInput,
        priceInput: !!priceInput,
        descriptionInput: !!descriptionInput,
        statusSelect: !!statusSelect
    });

    if (form && createBtn) {
        // Validar campos en tiempo real
        form.addEventListener('input', () => {
            const isValid = validateForm();
            createBtn.disabled = !isValid;
            console.log('Formulario válido:', isValid);
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Formulario enviado');
            
            // Obtener datos del formulario
            const productData = {
                productName: productNameInput.value.trim(),
                regularPrice: parseFloat(regularPriceInput.value),
                price: parseFloat(priceInput.value),
                description: descriptionInput.value.trim(),
                status: statusSelect.value
            };

            console.log('Datos del producto:', productData);

            try {
                // Crear producto en Firebase
                const productId = await createProduct(productData);
                console.log('Producto creado con ID:', productId);
                
                // Mostrar mensaje de éxito
                alert('Producto creado exitosamente');
                
                // Limpiar formulario
                form.reset();
                // Deshabilitar botón después de resetear
                createBtn.disabled = true;
            } catch (error) {
                console.error('Error detallado:', error);
                // Mostrar mensaje de error
                alert('Error al crear el producto: ' + error.message);
            }
        });
    } else {
        console.error('Error: Elementos del DOM no encontrados');
    }

    // Función para validar el formulario
    function validateForm() {
        const isValid = productNameInput.value.trim() !== '' &&
               !isNaN(parseFloat(regularPriceInput.value)) &&
               !isNaN(parseFloat(priceInput.value)) &&
               descriptionInput.value.trim() !== '' &&
               statusSelect.value !== '';
        
        console.log('Validación:', {
            productName: productNameInput.value.trim() !== '',
            regularPrice: !isNaN(parseFloat(regularPriceInput.value)),
            price: !isNaN(parseFloat(priceInput.value)),
            description: descriptionInput.value.trim() !== '',
            status: statusSelect.value !== '',
            isValid
        });
        
        return isValid;
    }
});
