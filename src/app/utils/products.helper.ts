const APIURL = process.env.NEXT_PUBLIC_API_URL;
import { IProduct } from "../types/index";

export async function getProductsDB(
  limit = 6,
  page = 1
): Promise<{ products: IProduct[]; total: number }> {
  try {
    if (!APIURL) throw new Error("API URL not defined");
    const response = await fetch(
      `${APIURL}/products?limit=${limit}&page=${page}`
    );
    const data = await response.json();
    // Espera que el backend devuelva { products: [...], total: ... }
    return {
      products: data.products || data,
      total: data.total || (data.products ? data.products.length : data.length),
    };
  } catch (error: unknown) {
    throw new Error(`error: ${error}`);
  }
}

export async function getProductById(id: string): Promise<IProduct> {
  try {
    const { products } = await getProductsDB(1000, 1); // O ajusta según tu necesidad
    const productFiltered = products.find(
      (product) => product.id.toString() === id
    );
    if (!productFiltered) throw new Error("Product not found");
    return productFiltered;
  } catch (error: unknown) {
    throw new Error(`error: ${error}`);
  }
}
