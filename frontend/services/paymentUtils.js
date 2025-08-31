export async function fetchPaymentsFromAPI(
  backendUrl,
  setPayments,
  contractId
) {
  try {
    let url = `${backendUrl}/contracts/${contractId}/payments`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      setPayments(data);
      return data;
    } else {
      setPayments([]);
    }
  } catch (e) {
    console.log("Error al obtener pagos", e);
    setPayments([]);
  }
}

export async function createPayment(backendUrl, addItem, paymentData) {
  const res = await fetch(`${backendUrl}/payments/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paymentData),
  });
  if (res.ok) {
    addItem(paymentData);
    return await res.json();
  }
}

export async function updatePayment(backendUrl, paymentId, updatedFields) {
  try {
    const res = await fetch(`${backendUrl}/payments/${paymentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields),
    });
    if (res.ok) {
      return await res.json();
    } else {
      console.log("Error al actualizar pago:", res);
    }
  } catch (e) {
    console.log("Error al actualizar pago:", e);
  }
}

export async function updatePaymentsStatus(backendUrl, contractId, updatedFields) {
  try {
    const res = await fetch(
      `${backendUrl}/contracts/${contractId}/payments/update-status`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      }
    );
    if (res.ok) {
      return await res.json();
    } else {
      console.log("Error al actualizar pagos:", res);
    }
  } catch (e) {
    console.log("Error al actualizar pagos: ", e);
  }
}

export async function verifyOverduePayments(backendUrl, paymentsArray) {
  const now = new Date();
  paymentsArray.forEach(async (payment) => {
    if (payment.status === "Pending") {
      const [year, month, day] = payment.payment_date.split("-").map(Number);
      const dueDate = new Date(year, month - 1, day, 16, 0, 0, 0);
      if (now > dueDate) {
        try {
          let newDate = new Date(payment.payment_date);
          data = {
            payment_date: newDate.setDate(newDate.getDate() + 1),
            payment_amount: payment.payment_amount + 250.0,
            status: "Overdue",
          };
          await updatePayment(backendUrl, payment.id, data);
        } catch (e) {
          console.log("Error actualizando pago a Overdue", e);
        }
      }
    }
  });
}

export async function fetchTotalPendingPayments(backendUrl, contractId) {
  try {
    let url = `${backendUrl}/contracts/${contractId}/payments/count-pending`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      console.log("Error al contar los registros: ", res);
    }
  } catch (e) {
    console.log("Error al conectarse con la api", e);
  }
}
