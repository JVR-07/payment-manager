
export async function fetchContractsFromAPI(backendUrl, setContracts, id) {

    try {
    const res = await fetch(`${backendUrl}/clients/${id}/contracts`);
    if (res.ok) {
      const data = await res.json();
      setContracts(data);
    } else {
      setContracts([]);
    }
  } catch (e) {
    console.log("Error al obtener contratos");
    setContracts([]);
  }
}
