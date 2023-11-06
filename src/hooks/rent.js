import React, {useState, useEffect} from 'react';
import axios from 'axios';
import backend from '../api/backend';
import { useSelector, useDispatch } from "react-redux";

const useGetOccupancyList = () => {
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	const [rentals, setRentals] = useState([]);
	const [isLoadingRentals, setLoadingRentals] = useState(true);
	const [error, setError] = useState(false);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(`https://api.rentbeta.iolabsug.com/api/v1/tenants/occupancy_list?tenant_id=${user.id}&option=false`);
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
    const token = useSelector((state) => state.auth.token);
    const unit_id = useSelector((state) => state.auth.unit_id);
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	const [occupancyDetails, setOccupancyDetails] = useState({});
	const [isLoadingOccupancyDetails, setLoadingOccupancyDetails] = useState(true);
	const [occupancyError, setOccupancyError] = useState(false);
	
	try {
		const response = await axios.post(`https://api.rentbeta.iolabsug.com/api/v1/tenants/occupancy`, {"tenant_id": user.id, "unit_id": unit_id});
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
    const token = useSelector((state) => state.auth.token);
	const unit = useSelector((state) => state.auth.unit);
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	const [rentalTickets, setRentalTickets] = useState([]);
	const [isLoadingRentalTickets, setLoadingRentalTickets] = useState(true);
	const [ticketsError, setTicketsError] = useState(false);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(`https://api.rentbeta.iolabsug.com/api/v1/tenants/tickets?tenant_id=${user.id}&unit_id=${unit}`);
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