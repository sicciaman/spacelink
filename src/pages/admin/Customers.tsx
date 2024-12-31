import CustomerList from '../../components/admin/customers/CustomerList';

export default function Customers() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Customers</h1>
      <CustomerList />
    </div>
  );
}