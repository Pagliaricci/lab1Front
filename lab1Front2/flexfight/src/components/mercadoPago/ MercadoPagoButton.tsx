import React from 'react';
import { Wallet } from '@mercadopago/sdk-react';

interface Props {
    preferenceId: string;
}

const MercadoPagoButton: React.FC<Props> = ({ preferenceId }) => {
    if (!preferenceId) {
        return <p>Loading payment...</p>;
    }

    return (
        <div>
            <Wallet initialization={{ preferenceId }} />
        </div>
    );
};

export default MercadoPagoButton;
