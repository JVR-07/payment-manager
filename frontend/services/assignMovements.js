
import { BACKEND_URL } from "@env";

export async function assignUnassignedMovements(clientArray, movementsArray) {
  const unassignedMovements = movementsArray.filter(
    (movement) => movement.status === "Unassigned"
  );

  if (unassignedMovements.length === 0) {
    return;
  }

  for (const movement of unassignedMovements) {
    try {
      const client = clientArray.find(
        (c) => c.phone === movement.concept
      );

      if (!client) {
        console.log("Cliente no encontrado para:", movement.concept);
        continue;
      }

      const contractRes = await fetch(
        `${BACKEND_URL}/clients/${client.id}/contracts`
      );
      if (!contractRes.ok) {
        console.log("Error fetching active contract for client:", client);
        continue;
      }
      const contracts = await contractRes.json();

      const contract = contracts.find((c) => c.status === "active");
      if (!contract) {
        console.log("No active contract found for client:", client);
        continue;
      }

      const paymentRes = await fetch(
        `${BACKEND_URL}/contracts/${contract.id}/payments/first-pending`
      );
      if (!paymentRes.ok) {
        console.log("Error fetching first pending payment for contract:", contract);
        continue;
      }
      const payment = await paymentRes.json();

      const updateRes = await fetch(
        `${BACKEND_URL}/movements/${movement.cdr}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "Assigned",
            payment_id: payment.id,
          }),
        }
      );

      if (updateRes.ok) {
        movement.status = "Assigned";
        movement.payment_id = payment.id;
      } else {
        console.log("Error assigning movement:", await updateRes.text());
      }

      const updatePay = await fetch(
        `${BACKEND_URL}/payments/${movement.payment_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "Paid",
          }),
        }
      );
      if (updatePay.ok) {
      } else {
        console.log("Error updating payment:", await updatePay.text());
      }
    } catch (error) {
      console.error("Unexpected error during assignment:", error);
    }
  }
}
