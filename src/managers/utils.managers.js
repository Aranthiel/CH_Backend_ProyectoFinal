// fileUtils.js
import fs from 'fs/promises';

export async function writeDataToFile(path, data) {
  try {
    await fs.writeFile(path, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error(`Error al escribir en el archivo ${path}: ${error.message}`);
  }
}
