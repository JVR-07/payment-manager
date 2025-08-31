
export async function fetchContractsFromAPI(backendUrl, setContracts, id) {

    try {
    const res = await fetch(`${backendUrl}/clients/${id}/contracts`);
    if (res.ok) {
      const data = await res.json();
      setContracts(data);
      return data;
    } else {
      setContracts([]);
    }
  } catch (e) {
    setContracts([]);
  }
}

export async function createContract(backendUrl, addItem, contractData, setError) {
  try {
    const res = await fetch(`${backendUrl}/contracts/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contractData),
    });
    if (res.ok) {
      addItem(contractData);
      return await res.json();
    } else {
      setError("Error response: ", res);
    }
  } catch (e) {
    setError("Error al crear contrato");
    throw e;
  }
}

export async function updateContract(backendUrl, contractId, updatedFields) {
  try {
    const res = await fetch(`${backendUrl}/contracts/${contractId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields),
    });
    if (res.ok) {
      return await res.json();
    } else {
      console.log("Error al actualizar contrato: ", res);
    }
  } catch (e) {
    console.log("Error al actualizar contrato: ", e);
    throw e;
  }
}
