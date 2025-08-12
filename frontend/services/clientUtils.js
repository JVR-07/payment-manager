
export async function fetchClientsFromAPI(backendUrl, setClients) {

  try {
    const res = await fetch(`${backendUrl}/clients/`);
    if (res.ok) {
      const data = await res.json();
      setClients(data);
    } else {
      setClients([]);
    }
  } catch (e) {
    console.log("Error al obtener clientes:", e);
    setClients([]);
  }
}
