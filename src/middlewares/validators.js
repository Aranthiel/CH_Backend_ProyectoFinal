export function completeProductValidator(producto) {
    const errors = [];

    // producto.title existe y es un string  
    if (!producto.title || typeof producto.title !== 'string') {
        errors.push('El título es obligatorio y debe ser un string.');
    }

    // producto.code existe y es un string
    if (!producto.code || typeof producto.code !== 'string') {
        errors.push('El código es obligatorio y debe ser un string.');
    }

    // producto.price existe y es un number
    if (!producto.price || typeof producto.price !== 'number') {
        errors.push('El precio es obligatorio y debe ser un número.');
    }

    // producto.status existe y es booleano, si no existe, lo define como true
    if (producto.status && typeof producto.status !== 'boolean') {
        errors.push('Status es obligatorio y debe ser un booleano.');
    }
    else {
        producto.status = true; // Si no se proporciona, establece el valor por defecto como true.
    }

    // producto.stock existe y es number
    if (!producto.stock || typeof producto.stock !== 'number') {
        errors.push('El stock es obligatorio y debe ser un número.');
    }

    // producto.category existe y es string
    if (!producto.category || typeof producto.category !== 'string') {
        errors.push('La categoría es obligatoria y debe ser un string.');
    }

    // producto.thumbnails es un array de strings
    if (producto.thumbnails && !Array.isArray(producto.thumbnails)) {
        errors.push('Los thumbnails deben tener formato de array de strings (si se proporcionan).');
    }
    
    if (errors.length > 0) {
        console.error('Errores de validación:');
        errors.forEach(error => {
            console.error(`- ${error}`);
        });
        return false;
    }

    return true;
}