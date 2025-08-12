
import { BACKEND_URL } from "@env";

export async function assignUnassignedMovements(movementsAray, clientArray) {

  const unassignedMovements = movementsAray.filter(
    (movement) => movement.status === "Unassigned"
  );

  console.log("Unassigned movements:", unassignedMovements);

  if (unassignedMovements.length === 0) {
    console.log("No unassigned movements to assign");
    return;
  }

  for (const movement of unassignedMovements) {
    try {
      const client = clientArray.find(
        (c) => c.alias === movement.concept
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
      console.log("Contracts for client:", contracts);

      const contract = contracts.find((c) => c.status === "active");
      if (!contract) {
        console.log("No active contract found for client:", client);
        continue;
      }
      console.log("Active contract found:", contract);

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
        console.log(`Movement ${movement.cdr} assigned successfully`);
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
        console.log(`Payment ${movement.payment_id} updated successfully`);
      } else {
        console.log("Error updating payment:", await updatePay.text());
      }
    } catch (error) {
      console.error("Unexpected error during assignment:", error);
    }
  }
}
