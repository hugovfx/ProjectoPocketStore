const API_URL = 'https://jsonplaceholder.typicode.com/users';

export async function getProducts() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Error al obtener los datos');
  return res.json();
}