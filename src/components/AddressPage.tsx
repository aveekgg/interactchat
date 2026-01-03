import React, { useState } from 'react';
import { Form } from './Form';
import './AddressPage.css';

interface AddressPageProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AddressData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export const AddressPage: React.FC<AddressPageProps> = ({ isOpen, onClose }) => {
  const [savedAddresses, setSavedAddresses] = useState<AddressData[]>([
    // Sample saved address
    {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  if (!isOpen) return null;

  const handleAddAddress = (formData: any) => {
    const newAddress: AddressData = {
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode
    };

    setSavedAddresses(prev => [...prev, newAddress]);
    setShowAddForm(false);

    // Trigger animation
    if ((window as any).triggerAddressAnimation) {
      (window as any).triggerAddressAnimation();
    }
  };

  const handleDeleteAddress = (index: number) => {
    setSavedAddresses(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      {/* Overlay */}
      <div className="page-overlay" onClick={onClose} />

      {/* Address Page Modal */}
      <div className="address-page-modal">
        <div className="address-page-header">
          <h2>Delivery Addresses</h2>
          <button className="close-button" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="address-page-content">
          {!showAddForm ? (
            <>
              {/* Saved Addresses */}
              <div className="saved-addresses">
                <div className="section-header">
                  <h3>Saved Addresses</h3>
                  <button
                    className="add-address-button"
                    onClick={() => setShowAddForm(true)}
                  >
                    + Add New Address
                  </button>
                </div>

                {savedAddresses.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📍</div>
                    <p>No saved addresses yet</p>
                    <button
                      className="add-first-address-button"
                      onClick={() => setShowAddForm(true)}
                    >
                      Add Your First Address
                    </button>
                  </div>
                ) : (
                  <div className="addresses-list">
                    {savedAddresses.map((address, index) => (
                      <div key={index} className="address-card">
                        <div className="address-content">
                          <div className="address-text">
                            <p className="street">{address.street}</p>
                            <p className="city-state">{address.city}, {address.state} {address.zipCode}</p>
                          </div>
                          <div className="address-actions">
                            <button className="edit-button">Edit</button>
                            <button
                              className="delete-button"
                              onClick={() => handleDeleteAddress(index)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Add Address Form */
            <div className="add-address-form">
              <div className="form-header">
                <h3>Add New Address</h3>
                <button
                  className="cancel-button"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>

              <Form
                fields={[
                  { id: 'street', label: 'Street Address', type: 'text', required: true },
                  { id: 'city', label: 'City', type: 'text', required: true },
                  { id: 'state', label: 'State', type: 'text', required: true },
                  { id: 'zipCode', label: 'ZIP Code', type: 'text', required: true }
                ]}
                onSubmit={handleAddAddress}
                onCancel={() => setShowAddForm(false)}
                title=""
                description="Please provide your delivery address information"
                submitLabel="Save Address"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};