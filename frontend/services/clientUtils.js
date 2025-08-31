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

export async function createClientWithAPI(
  backendUrl,
  clientData,
  setErrorMessage
) {
  try {
    const response = await fetch(`${backendUrl}/clients/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: clientData.name,
        creation_date: new Date().toISOString().split("T")[0],
        email: clientData.email,
        phone: clientData.phone,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      setErrorMessage("Error agregando cliente");
      return;
    }
  } catch (error) {
    setErrorMessage("Error de conexión con el servidor");
  }
}

export async function updateClientWithAPI(
  backendUrl,
  clientId,
  clientData,
  setErrorMessage
) {
  try {
    const response = await fetch(`${backendUrl}/clients/${clientId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...clientData }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.log("Error updating client:", errorData);
      setErrorMessage("Error actualizando cliente");
      return;
    }
  } catch (error) {
    console.log("Error connecting to server:", error);
    setErrorMessage("Error de conexión con el servidor");
  }
}
