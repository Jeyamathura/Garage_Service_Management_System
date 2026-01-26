import React, { useEffect, useState } from 'react';
import { getServices } from '../../api/service.api';
import ServiceCard from '../../components/service/ServiceCard';
import { useNavigate } from 'react-router-dom';

const Services = () => {
    const [services, setServices] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await getServices();
                setServices(data);
            } catch (error) {
                console.error("Failed to fetch services", error);
            }
        };
        fetchServices();
    }, []);

    const handleBook = (service) => {
        navigate('/customer/bookings', { state: { selectedServiceId: service.id } });
    };

    return (
        <div className="p-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-teal-800">Available Services</h1>
                <p className="text-gray-500 mt-1">Select a premium service for your vehicle</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service) => (
                    <ServiceCard
                        key={service.id}
                        service={service}
                        onBook={handleBook}
                    />
                ))}
            </div>
        </div>
    );
};

export default Services;
