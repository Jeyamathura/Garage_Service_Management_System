import React, { useEffect, useState } from 'react';
import { getServices } from '../../api/service.api';
import Table from '../../components/ui/Table';

const Services = () => {
    const [services, setServices] = useState([]);

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

    return (
        <div className="p-4">
            <h1 className="mb-4">Available Services</h1>
            <Table headers={['Service Name', 'Description', 'Price']}>
                {services.map((service) => (
                    <tr key={service.id}>
                        <td>{service.service_name}</td>
                        <td>{service.description}</td>
                        <td>Rs.{parseFloat(service.price).toFixed(2)}</td>
                    </tr>
                ))}
            </Table>
        </div>
    );
};

export default Services;
