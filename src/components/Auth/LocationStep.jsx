import React from 'react';
import { useTranslation } from 'react-i18next';

const LocationStep = ({ form, handleChange, onSkip }) => {
    const { t } = useTranslation();

    return (
        <div>
            <h2>{t('auth.locationInfo')}</h2>
            <input
                className="auth-input"
                name="address_line1"
                placeholder={t('auth.addressLine1')}
                value={form.address_line1 || ''}
                onChange={handleChange}
            />
            <input
                className="auth-input"
                name="address_line2"
                placeholder={t('auth.addressLine2')}
                value={form.address_line2 || ''}
                onChange={handleChange}
            />
            <input
                className="auth-input"
                name="city"
                placeholder={t('auth.city')}
                value={form.city || ''}
                onChange={handleChange}
            />
            <input
                className="auth-input"
                name="region"
                placeholder={t('auth.region')}
                value={form.region || ''}
                onChange={handleChange}
            />
            <input
                className="auth-input"
                name="postal_code"
                placeholder={t('auth.postalCode')}
                value={form.postal_code || ''}
                onChange={handleChange}
            />
            <button type="button" className="auth-button" onClick={onSkip}>
                {t('auth.skip')}
            </button>
        </div>
    );
};