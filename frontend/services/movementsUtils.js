import { BACKEND_URL } from "@env";

export async function syncMovements(accessToken) {
  try {
    const res = await fetch(`${BACKEND_URL}/get-emails/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken }),
    });
    return await res.json();
  } catch (error) {
    console.log("Error syncing movements", error);
    throw error;
  }
}

export async function fetchMovements(setMovements) {
  try {
    setMovements([]);
    const res = await fetch(`${BACKEND_URL}/movements/`);
    if (res.ok) {
      const data = await res.json();
      setMovements(data);
      return data;
    } else {
      console.log("Error fetching movements:", res);
      return [];
    }
  } catch (error) {
    console.log("Error fetching movements:", error);
    return [];
  }
}

export async function runMovementsSync(accessToken, setMovements) {
  try {
    const resultSync = await syncMovements(accessToken);

    if (resultSync?.message === "Sync completed") {
      await fetchMovements(setMovements);
    } else {
      console.log("Error syncing movements");
    }
  } catch (error) {
    console.log("Unexpected error in runMovementsSync()", error);
  }
}

export async function updateMovement(movementCdr, updatedFields) {
  try {
    console.log("Entrando a edit function", movementCdr, updatedFields)
    const res = await fetch(`${BACKEND_URL}/movements/${movementCdr}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updatedFields }),
    });
    if(!res.ok) {
      console.log("Error updating movement: ", res)
    }
    else {
      console.log("Fetch correcto: ", res)
    }
  } catch (e) {
    console.log("Error updating movement: ", e);
  }
}
