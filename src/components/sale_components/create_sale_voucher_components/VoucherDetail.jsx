import React, { useEffect, useState } from "react"
import { Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, alpha } from "@mui/material"
import StyledTableData from "../../utils/StyledTableData"
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from "react-redux";
import { receiptCud, removeSale } from "../../../slices/receiptSlice";
import NoDataAlert from '../../utils/NoDataAlert'
import { shopId } from "../../../utils/config";
import { useNavigate } from "react-router-dom";
import AlertDialog from "../../utils/AlertDialog";

const validationSchema = yup.object().shape({
    cash: yup.number().required('Please add cash!').typeError('Your cash is Wrong!'),
    kpay: yup.number().required('Please add kpay!').typeError('Your kpay is Wrong!'),
});

const VoucherDetail = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [showAlert, setShowAlert] = useState(false)
    const [subtotal, setSubtotal] = useState(0)
    const [additionalCost, setAdditionalCost] = useState(0)
    const [tax, setTax] = useState(0)
    const [grandTotal, setGrandTotal] = useState(0)
    const [isSaveButtonDisabled, setSaveButtonDisabled] = useState(false);
    const { saleCollections: saleCollection } = useSelector(state => state.Receipt)
    const customerData = useSelector(state => state.Receipt.customer)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            'kpay': 0,
            'cash': 0,
        }
    })

    const handleRemove = (id) => {
        dispatch(removeSale(id))
    }

    const handleCancel = () => {
        setShowAlert(false)
    }

    const handleConfirm = () => {
        setShowAlert(false)
    }

    const handleOnSubmit = async (data) => {
        if (isSaveButtonDisabled) {
            return;
        }

        setSaveButtonDisabled(true);

        const cashData = getValues('cash')
        const kpayData = getValues('kpay')
        if (!customerData) {
            setShowAlert(true)
        } else if (customerData && (Number(cashData) + Number(kpayData) === Number(subtotal) + Number(tax) + Number(additionalCost))) {
            let itemsList = [];
            let membershipsList = [];
            let servicesList = [];
            saleCollection.map(saleItem => {
                if ("item" in saleItem) {
                    itemsList.push({
                        id: saleItem.item.id,
                        employeeId: saleItem.staff.id,
                        quantity: saleItem.quantity
                    })
                } else if ("service" in saleItem) {
                    servicesList.push({
                        id: saleItem.service.id,
                        employeeId: saleItem.staff.id,
                        quantity: saleItem.quantity,
                        status: saleItem.status
                    })
                } else if ("membership" in saleItem) {
                    for (let i = 0; i < saleItem.quantity; i++) {
                        membershipsList.push({
                            id: saleItem.membership.id,
                            employeeId: saleItem.staff.id
                        })
                    }
                }
            })
            const newData = {
                ...data,
                price: grandTotal,
                additionalCost: Number(additionalCost),
                tax: Number(tax),
                customerId: customerData.id,
                shopId: shopId(),
                ...(membershipsList.length > 0 && { membershipRecords: membershipsList }),
                ...(itemsList.length > 0 && { items: itemsList }),
                ...(servicesList.length > 0 && { services: servicesList })
            }
            await dispatch(receiptCud({ method: 'post', data: newData, type: 'sale', id: null }))
            navigate('/sales-and-services')
        }

        setSaveButtonDisabled(false);
    }

    useEffect(() => {
        const total = Number(subtotal) + Number(additionalCost) + Number(tax)
        setGrandTotal(total)
        setValue('cash', total)
    }, [subtotal, additionalCost, tax])

    useEffect(() => {
        if (saleCollection) {
            const filteredCollection = saleCollection.filter(sale => sale.service || sale.item)
            const total = filteredCollection.reduce((acc, saleItem) => {
                return saleItem.item
                    ? acc + Number(saleItem.item.salePrice) * saleItem.quantity
                    : acc + Number(saleItem.service.price) * saleItem.quantity;
            }, 0);
            setSubtotal(total);
        }
    }, [saleCollection]);

    return (
        <Box sx={{
            width: '60%',
            px: 1,
            pt: 3,
        }}>
            <AlertDialog
                toggle={showAlert}
                setToggle={setShowAlert}
                cancel={handleCancel}
                confrim={handleConfirm}
                title={"Warning !"}
                content={"You need to select the customer."}
            ></AlertDialog>
            <form onSubmit={handleSubmit(handleOnSubmit)}>
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ float: 'inline-end', mb: 3 }}
                    disabled={isSaveButtonDisabled}
                >
                    Save
                </Button>
                <Box sx={{
                    mb: 3,
                    borderRadius: '10px'
                }}>
                    <TableContainer sx={{ borderRadius: '10px', pb: 3 }}>
                        <Typography sx={{ pl: 2, fontWeight: 'bold' }}>Customer Name - {customerData ? customerData.name : "Customer has not been selected yet"}</Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">No</TableCell>
                                    <TableCell>Item Or Service</TableCell>
                                    <TableCell>Staff</TableCell>
                                    <TableCell align="center">Price</TableCell>
                                    <TableCell align="center">Qty</TableCell>
                                    <TableCell align="center">Total</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {   saleCollection.length > 0 ?
                                    saleCollection.map((voucherItem, index) => (
                                    <TableRow key={index}>
                                        <StyledTableData align="center">{index + 1}</StyledTableData>
                                        <StyledTableData>{voucherItem.membership ? voucherItem.membership.service : voucherItem.service ? voucherItem.service.name : voucherItem.item.name}</StyledTableData>
                                        <StyledTableData>{voucherItem.staff.name}</StyledTableData>
                                        <StyledTableData align="center">{voucherItem.membership ? Number(voucherItem.membership.price) / Number(voucherItem.membership.time - 1 )  : voucherItem.service ? voucherItem.service.price : voucherItem.item.salePrice}</StyledTableData>
                                        <StyledTableData align="center">{voucherItem.quantity}</StyledTableData>
                                        <StyledTableData align="center">{voucherItem.membership ? "-": voucherItem.service ? voucherItem.service.price * voucherItem.quantity : voucherItem.item.salePrice * voucherItem.quantity}</StyledTableData>
                                        <TableCell align="center">
                                            <IconButton onClick={()=> handleRemove(voucherItem.id)}>
                                                <DeleteIcon color="danger"/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                                :
                                <TableRow>
                                    <TableCell colSpan={7}>
                                        <NoDataAlert content={"There is no items"}></NoDataAlert>
                                    </TableCell>
                                </TableRow>
                            }
                                <TableRow>
                                    <TableCell sx={{ borderBottom: '0px', pt: 3, pb: 1 , fontSize: '18px' }} align="right" colSpan={4}>Subtotal</TableCell>
                                    <TableCell sx={{ borderBottom: '0px', py: 1 , fontSize: '18px' }} align="center" colSpan={3}>{subtotal}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ borderBottom: '0px', py: 1, fontSize: '18px' }} align="right" colSpan={4}>
                                        <TextField onChange={(event)=> setAdditionalCost(event.target.value) } fullWidth size="small" placeholder="Additional Cost"></TextField>
                                    </TableCell>
                                    <TableCell sx={{ borderBottom: '0px', py: 1 , fontSize: '18px' }} align="center" colSpan={3}>{additionalCost}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ borderBottom: '0px', py: 1, fontSize: '18px' }} align="right" colSpan={4}>
                                        <TextField onChange={(event)=> setTax(event.target.value) } fullWidth size="small" placeholder="Tax"></TextField>
                                    </TableCell>
                                    <TableCell sx={{ borderBottom: '0px', py: 1 , fontSize: '18px' }} align="center" colSpan={3}>{tax}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ borderBottom: '0px', pt: 3, pb: 1 , fontSize: '18px' }} align="right" colSpan={4}>Total</TableCell>
                                    <TableCell sx={{ borderBottom: '0px', py: 1 , fontSize: '20px', fontWeight: 'bold' }} align="center" colSpan={3}>{grandTotal}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ borderBottom: '0px', fontSize: '18px', verticalAlign: 'top' }} align="right" colSpan={4}>Paid</TableCell>
                                    <TableCell sx={{ borderBottom: '0px', py: 1, fontSize: '18px' }} align="right" colSpan={3}>
                                        <TextField {...register('cash')} error={!!errors?.cash} helperText={errors?.cash?.message} sx={{ mb: 3 }} fullWidth size="small" label="Paid (Cash)"></TextField>
                                        <TextField {...register('kpay')} error={!!errors?.kpay} helperText={errors?.kpay?.message} fullWidth size="small" label="Paid (Kpay)"></TextField>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
           </form>
        </Box>
    )
}

export default VoucherDetail