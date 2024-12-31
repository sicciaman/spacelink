import { useState } from 'react';
import { format } from 'date-fns';
import CustomerActions from './CustomerActions';
import CustomerForm from './CustomerForm';
import NewCustomerButton from './NewCustomerButton';
import NewCustomerForm from './NewCustomerForm';
import { useCustomers } from '../../../hooks/useCustomers';
import { useCreateCustomer } from '../../../hooks/useCreateCustomer';
import { useUpdateCustomer, useDeleteCustomer } from '../../../hooks/useCustomerMutations';
import ConfirmDialog from '../../common/ConfirmDialog';
import EmptyCustomers from './EmptyCustomers';

export default function CustomerList() {
  const { data: customers, isLoading } = useCustomers();
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleCreateCustomer = async (data: any) => {
    try {
      await createCustomer.mutateAsync(data);
      setShowNewForm(false);
    } catch (error) {
      console.error('Failed to create customer:', error);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;
    
    try {
      await deleteCustomer.mutateAsync(customerToDelete);
      setCustomerToDelete(null);
    } catch (error) {
      console.error('Failed to delete customer:', error);
    }
  };

  const handleUpdateCustomer = async (customerId: string, data: any) => {
    try {
      await updateCustomer.mutateAsync({ customerId, data });
      setEditingCustomerId(null);
    } catch (error) {
      console.error('Failed to update customer:', error);
    }
  };

  return (
    <div className="space-y-4">
      {!showNewForm && (
        <div className="flex justify-end">
          <NewCustomerButton onClick={() => setShowNewForm(true)} />
        </div>
      )}

      {showNewForm ? (
        <div className="bg-white shadow sm:rounded-lg p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Customer</h2>
          <NewCustomerForm
            onSubmit={handleCreateCustomer}
            onCancel={() => setShowNewForm(false)}
            isLoading={createCustomer.isLoading}
          />
        </div>
      ) : !customers?.length ? (
        <EmptyCustomers />
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telegram
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    {editingCustomerId === customer.id ? (
                      <td colSpan={5} className="px-6 py-4">
                        <CustomerForm
                          customer={customer}
                          onSubmit={(data) => handleUpdateCustomer(customer.id, data)}
                          onCancel={() => setEditingCustomerId(null)}
                        />
                      </td>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="text-sm font-medium text-gray-900">
                              {customer.first_name} {customer.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{customer.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.company || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.telegram_username || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(customer.user_created_at), 'PP')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <CustomerActions
                            customerId={customer.id}
                            onEdit={() => setEditingCustomerId(customer.id)}
                            onDelete={() => setCustomerToDelete(customer.id)}
                          />
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!customerToDelete}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={handleDeleteCustomer}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}