import React, {useState, useEffect} from 'react';
import axiosInstance from '../api/axiosInstance';
import { useSelector } from "react-redux";

const useGetOccupancyList = () => {
    const user = useSelector((state) => state.auth.user);
    const [rentals, setRentals] = useState([]);
    const [isLoadingRentals, setLoadingRentals] = useState(true);
    const [error, setError] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`/api/v1/tenants/occupancy_list?tenant_id=${user.id}&option=false`);
                setRentals(response.data.data);
                setLoadingRentals(false);
            } catch (e) {
                setError(true);
                setLoadingRentals(false);
            }
        };
        fetchData();
    }, [user]);
    return { rentals, isLoadingRentals, error };
}

const useGetOccupancyDetails = async () => {
    const user = useSelector((state) => state.auth.user);
    const unit_id = useSelector((state) => state.auth.unit_id);
    const [occupancyDetails, setOccupancyDetails] = useState({});
    const [isLoadingOccupancyDetails, setLoadingOccupancyDetails] = useState(true);
    const [occupancyError, setOccupancyError] = useState(false);
    
    try {
        const response = await axiosInstance.post(`/api/v1/tenants/occupancy`, {
            "tenant_id": user.id, 
            "unit_id": unit_id
        });
        setOccupancyDetails(response.data.data);
        setLoadingOccupancyDetails(false);
    } catch (e) {
        setOccupancyError(true);
        setLoadingOccupancyDetails(false);
    }
        
    return { occupancyDetails, isLoadingOccupancyDetails, occupancyError };
}

const useGetTenantTicketsList = () => {
    const user = useSelector((state) => state.auth.user);
    const unit = useSelector((state) => state.auth.unit);
    const [rentalTickets, setRentalTickets] = useState([]);
    const [isLoadingRentalTickets, setLoadingRentalTickets] = useState(true);
    const [ticketsError, setTicketsError] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`/api/v1/tenants/tickets?tenant_id=${user.id}&unit_id=${unit}`);
                setRentalTickets(response.data.data);
                setLoadingRentalTickets(false);
            } catch (e) {
                setTicketsError(true);
                setLoadingRentalTickets(false);
            }
        };
        fetchData();
    }, []);
    return { rentalTickets, isLoadingRentalTickets, ticketsError };
}

export {useGetOccupancyList, useGetOccupancyDetails, useGetTenantTicketsList}