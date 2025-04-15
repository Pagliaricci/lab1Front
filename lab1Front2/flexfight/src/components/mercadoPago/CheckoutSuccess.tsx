import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckoutSuccess: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const courseId = localStorage.getItem("courseToSubscribe");
        const userId = localStorage.getItem("userId");

        if (courseId && userId) {
            console.log("courseId", courseId);
            console.log("userId", userId);
            fetch('http://localhost:8081/course/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, routineId: courseId }),
            })
                .then(res => {
                    if (res.ok) {
                        console.log("Suscripción exitosa");
                        localStorage.removeItem("courseToSubscribe");
                    } else {
                        console.error("Fallo la suscripción");
                    }
                });
        }

        const timer = setTimeout(() => {
            navigate('/home');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-green-100 flex items-center justify-center">
            <h1 className="text-3xl font-bold text-green-700">¡Subscripción exitosa! Redirigiendo...</h1>
        </div>
    );
};

export default CheckoutSuccess;
