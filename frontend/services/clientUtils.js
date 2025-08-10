
export async function fetchClientsFromAPI(backendUrl, setClients, setLoading, setRefreshing) {
  setLoading?.(true);

  try {
    const res = await fetch(`${backendUrl}/clients/`);
    if (res.ok) {
      const data = await res.json();
      setClients(data);
    } else {
      setClients([]);
    }
  } catch (e) {
    console.error("Error al obtener clientes:", e);
    setClients([]);
  }

  setLoading?.(false);
  setRefreshing?.(false);
}
