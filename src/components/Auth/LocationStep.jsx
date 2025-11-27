import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Select, Input } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import MapComponent from '../Map/MapComponent';
import { getGovernorates } from '../../util/getGovernates';

const { Option } = Select;

const LocationStep = React.memo(({
    form,
    handleChange,
    onMapSelect
}) => {
    const { t } = useTranslation();
    const [mapVisible, setMapVisible] = useState(false);
    const governorateOptions = getGovernorates();

    const handleMapSelect = (locationData) => {
        if (onMapSelect) {
            onMapSelect(locationData);
        }

        // Update form fields automatically
        if (locationData) {
            // You can call handleChange for each field or use a bulk update
            const eventMap = {
                'address.address_line1': locationData.address_line1 || '',
                //'address.city': locationData.city || '',
                'address.region': locationData.region || '',
                'address.governorate': locationData.governorate || '',
                'address.postal_code': locationData.postal_code || '',
                'address.latitude': locationData.latitude || '',
                'address.longitude': locationData.longitude || '',
                'address.formatted_address': locationData.formatted_address || ''
            };

            // Trigger changes for each field
            Object.keys(eventMap).forEach(fieldName => {
                const syntheticEvent = {
                    target: {
                        name: fieldName,
                        value: eventMap[fieldName]
                    }
                };
                handleChange(syntheticEvent);
            });
        }

        setMapVisible(false);
    };

    return (
        <div className="auth-form">
            <h2>{t('auth.locationInfo')}</h2>

            {/* Map Selection Button */}
            <Button
                type="dashed"
                icon={<EnvironmentOutlined />}
                onClick={() => setMapVisible(true)}
                style={{ width: '100%', marginBottom: 16, height: '40px' }}
            >
                {t('auth.selectFromMap') || 'Select Location from Map'}
            </Button>

            <Input
                className="auth-input"
                name="address.address_line1"
                placeholder={t('auth.addressLine1')}
                value={form.address_line1 || ''}
                onChange={handleChange}
                style={{ marginBottom: 12 }}
            />
            <Input
                className="auth-input"
                name="address.address_line2"
                placeholder={t('auth.addressLine2')}
                value={form.address_line2 || ''}
                onChange={handleChange}
                style={{ marginBottom: 12 }}
            />
            {/* <Input
                className="auth-input"
                name="address.city"
                placeholder={t('auth.city')}
                value={form.city || ''}
                onChange={handleChange}
                style={{ marginBottom: 12 }}
            /> */}
            <Input
                className="auth-input"
                name="address.region"
                placeholder={t('auth.region')}
                value={form.region || ''}
                onChange={handleChange}
                style={{ marginBottom: 12 }}
            />

            {/* Governorate Select */}
            <Select
                placeholder={t('auth.0') || "Select Governorate"}
                name="address.governorate"
                value={form.governorate || undefined}
                onChange={(value) => {
                    const syntheticEvent = {
                        target: {
                            name: 'address.governorate',
                            value: value
                        }
                    };
                    handleChange(syntheticEvent);
                }}
                style={{ width: '100%', marginBottom: 12 }}
                options={governorateOptions}
            />


            <Input
                className="auth-input"
                name="address.postal_code"
                placeholder={t('auth.postalCode')}
                value={form.postal_code || ''}
                onChange={handleChange}
                style={{ marginBottom: 12 }}
            />

            {/* Hidden coordinate fields */}
            <input
                type="hidden"
                name="address.latitude"
                value={form.latitude || ''}
            />
            <input
                type="hidden"
                name="address.longitude"
                value={form.longitude || ''}
            />
            <input
                type="hidden"
                name="address.country"
                value={form.country || 'Palestine'}
            />
            <input
                type="hidden"
                name="address.formatted_address"
                value={form.formatted_address || ''}
            />

            {/* Display selected coordinates if available */}
            {(form.latitude && form.longitude) && (
                <div style={{
                    marginTop: 8,
                    padding: 8,
                    background: '#f0f8ff',
                    border: '1px solid #d6e9ff',
                    borderRadius: 4,
                    fontSize: '12px'
                }}>
                    <strong>Selected Location:</strong><br />
                    Lat: {parseFloat(form.latitude).toFixed(4)}, Lng: {parseFloat(form.longitude).toFixed(4)}
                </div>
            )}

            <MapComponent
                visible={mapVisible}
                onCancel={() => setMapVisible(false)}
                onLocationSelect={handleMapSelect}
                initialLocation={form.latitude && form.longitude ? {
                    latitude: parseFloat(form.latitude),
                    longitude: parseFloat(form.longitude)
                } : null}
            />
        </div>
    );
});

export default LocationStep;