import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { BACKEND_LOCALHOST } from '@env';

export default function DetailsScreen({ route }) {
  const { client } = route.params;
  const [contracts, setContracts] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContracts() {
      setLoading(true);
      try {
        const res = await fetch(`${BACKEND_LOCALHOST}/clients/${client.id}/contracts`);
        if (res.ok) {
          const data = await res.json();
          setContracts(data);
        } else {
          setContracts([]);
        }
      } catch {
        setContracts([]);
      }
      setLoading(false);
    }
    fetchContracts();
  }, [client.id]);

  const toggleExpand = (contractId) => {
    setExpanded(prev => ({
      ...prev,
      [contractId]: !prev[contractId]
    }));
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>{client.name}</Text>
      <Text>Alias: {client.alias}</Text>
      {client.email ? <Text>Email: {client.email}</Text> : null}
      {client.phone ? <Text>Tel: {client.phone}</Text> : null}
      <Text style={{ marginTop: 20, fontSize: 20, fontWeight: 'bold' }}>Contratos</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#888" style={{ marginTop: 20 }} />
      ) : contracts.length === 0 ? (
        <Text style={{ marginTop: 10, color: '#888' }}>No hay contratos para este cliente.</Text>
      ) : (
        contracts.map(contract => (
          <View key={contract.id} style={{ marginTop: 16, backgroundColor: '#f9f9f9', borderRadius: 8, padding: 12 }}>
            <TouchableOpacity onPress={() => toggleExpand(contract.id)}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                Contrato #{contract.id} - {contract.status}
              </Text>
              <Text>Primer pago: {contract.first_payment_date}</Text>
              <Text>Total: ${contract.total_amount}</Text>
              <Text>Pagos totales: {contract.total_payments}</Text>
            </TouchableOpacity>
            {expanded[contract.id] && <PaymentsList contractId={contract.id} />}
          </View>
        ))
      )}
    </ScrollView>
  );
}

function PaymentsList({ contractId }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPayments() {
      setLoading(true);
      try {
        const res = await fetch(`${BACKEND_LOCALHOST}/contracts/${contractId}/payments`);
        if (res.ok) {
          const data = await res.json();
          setPayments(data);
        } else {
          setPayments([]);
        }
      } catch {
        setPayments([]);
      }
      setLoading(false);
    }
    fetchPayments();
  }, [contractId]);

  if (loading) return <ActivityIndicator size="small" color="#888" style={{ marginTop: 10 }} />;
  if (payments.length === 0) return <Text style={{ marginTop: 10, color: '#888' }}>Sin pagos.</Text>;

  return (
    <View style={{ marginTop: 10 }}>
      {payments.map(payment => (
        <View key={payment.id} style={{ backgroundColor: '#fff', marginBottom: 6, padding: 8, borderRadius: 6 }}>
          <Text>Fecha: {payment.payment_date}</Text>
          <Text>Monto: ${payment.payment_amount}</Text>
        </View>
      ))}
    </View>
  );
}