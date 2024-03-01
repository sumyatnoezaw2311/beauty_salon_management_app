import { useEffect, useRef, useState } from "react";
import { Box, IconButton, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography, alpha } from "@mui/material"
import PrintIcon from '@mui/icons-material/Print';
import huaMeiLogo from '../../assets/images/hua_mei_logo.png'
import theme from "../../utils/theme";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getReceipt } from "../../slices/receiptSlice";
import { changeDateTime } from "../../utils/changeDateTime";
import { useReactToPrint } from 'react-to-print';
import MemberDialog from "../utils/MemberDialog";
import Loading from "../utils/Loading";

const SaleVoucherDetail = () => {
    const printRef = useRef()
    const dispatch = useDispatch()
    const { id } = useParams()
    const [ showCode,setShowCode ] = useState(false)
    const [ code,setCode ] = useState(null)
    const [ date,setDate ] = useState(null)
    const { receipt: receipt , loading } = useSelector(state=> state.Receipt)
    const [ saleList,setSaleList ] = useState([])
    const [ membershipRec,setMembershipRec ] = useState([])

    const fetchReceipt = async()=>{
        await dispatch(getReceipt({ method: 'get', data: null, type: 'sale' ,id: id }))
    }

    const handleShow = (recCode,usedDate)=>{
        setShowCode(true)
        setCode(recCode)
        setDate(usedDate)
    }

    const handlePrint = useReactToPrint({
        content: ()=> printRef.current,
        documentTitle: receipt?.data.code || Date.now(),
        // onAfterPrint: ()=>{
        //  alert("Successfully printed....") 
        // }
    })

    useEffect(()=>{
        if(receipt && receipt.data){
            setSaleList([...receipt.data.sales || [],...receipt.data.services || []])
            if(receipt.data.membershipRecordDetails){
                const memberships = receipt.data.membershipRecordDetails;
                const transformedData = memberships.reduce((acc, item) => {
                    const existingItem = acc.find((groupedItem) => groupedItem.membershipRecordId === item.membershipRecordId);
                    if (existingItem) {
                      existingItem.quantity += 1;
                    } else {
                      acc.push({ membershipRecordId: item.membershipRecordId, name: item.membershipRecordName, quantity: 1, code: item.code, usedAt: item.usedAt });
                    }
                
                    return acc;
                }, []);
                setMembershipRec(transformedData);
            }
        }
    },[receipt])

    useEffect(()=>{
        setMembershipRec([])
        fetchReceipt()
    },[])

    return (
        <Box sx={{
            bgcolor: theme.palette.common.white,
            borderRadius: '10px',
            height: '100%',
            pt: 2
        }}>
            {
                loading && <Loading></Loading>
            }
            <MemberDialog open={showCode} setOpen={setShowCode} code={code} date={date}></MemberDialog>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mb: 3, pr: 3 }}>
                <IconButton color="info" onClick={()=> handlePrint() }>
                    <PrintIcon sx={{ fontSize: '30px' }}></PrintIcon>
                </IconButton>
            </Box>
            {/* voucher section */}
            <Box
                ref={printRef}
                sx={{
                    width: { xs: '100%', lg: '100%' },
                    height: '100%',
                    px: 3,
                    py: 2,
                    '@media print': {
                        width: { xs: '210mm', lg: '210mm' },
                        height: '297mm',
                    },
                }}
                >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                        <img
                            height={80}
                            src={`${huaMeiLogo}`}
                            alt={"Hua Mei"}
                            loading="lazy"
                        />
                        <Box sx={{ ml: 2 }}>
                            <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>{receipt?.data.shop.name}</Typography>
                            <Typography>Beauty Center</Typography>
                            <Typography sx={{
                                    fontSize: '12px',
                                    maxWidth: 300,
                                    mt: 1,
                                    color: alpha(theme.palette.dark.main, 0.5)
                            }}>
                                { receipt?.data.shop.address }
                                <br></br>
                                Phone - { receipt?.data.shop.phone }
                            </Typography>
                        </Box>
                    </Box>
                    <Box>
                        <Table>
                            <TableBody>
                            <TableRow>
                                <TableCell sx={{ border: 'none', py: 1, fontSize: "14px" }} align="left">Date </TableCell>
                                <TableCell sx={{ border: 'none', py: 1 }}>-</TableCell>
                                <TableCell sx={{ border: 'none', py: 1 }} variant="body2" align="right">{receipt?.data.date && changeDateTime(receipt?.data.date)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ border: 'none', py: 1, fontSize: "14px" }} align="left">Customer Name</TableCell>
                                <TableCell sx={{ border: 'none', py: 1 }}>-</TableCell>
                                <TableCell sx={{ border: 'none', py: 1 }} variant="body2" align="right">{receipt?.data.customerName.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ border: 'none', py: 1, fontSize: "14px" }} align="left">Code</TableCell>
                                <TableCell sx={{ border: 'none', py: 1 }}>-</TableCell>
                                <TableCell sx={{ border: 'none', py: 1 }} variant="body2" align="right">{receipt?.data.code}</TableCell>
                            </TableRow>
                            </TableBody>
                        </Table>
                    </Box>
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ py: 1, fontWeight: 'bold' }} align="center">No</TableCell>
                                <TableCell sx={{ py: 1, fontWeight: 'bold' }}>Item Or Service Name</TableCell>
                                <TableCell sx={{ py: 1, fontWeight: 'bold' }} align="center">Price</TableCell>
                                <TableCell sx={{ py: 1, fontWeight: 'bold' }} align="center">Qty</TableCell>
                                <TableCell sx={{ py: 1, fontWeight: 'bold' }} align="right">Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                receipt && receipt.data && receipt.data.membershipRecord &&
                                <TableRow>
                                    <TableCell sx={{ py: 1 }} align="center">1</TableCell>
                                    <TableCell sx={{ py: 1 }}>
                                        <Box sx={{ display: 'flex' }}>
                                            {receipt.data.membershipRecord.serviceName} (membership)
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ py: 1 }} align="center">{Number(receipt.data.membershipRecord.price) / Number(receipt.data.membershipRecord.time)}</TableCell>
                                    <TableCell sx={{ py: 1 }} align="center">{Number(receipt.data.membershipRecord.time) + Number(receipt.data.membershipRecord.free_time)}</TableCell>
                                    <TableCell sx={{ py: 1 }} align="center">{receipt.data.membershipRecord.price}</TableCell>
                                </TableRow>
                            }
                            {
                                membershipRec.map((mem,index)=>(
                                    <TableRow key={index} sx={{ cursor: 'pointer' }} onClick={()=> handleShow(mem.code, mem.usedAt)}>
                                        <TableCell sx={{ py: 1 }} align="center">{index + 1}</TableCell>
                                        <TableCell sx={{ py: 1 }}>
                                            <Box sx={{ display: 'flex', color: theme.palette.primary.main }}>
                                                {mem.name} (membership)
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ py: 1 }} align="center">-</TableCell>
                                        <TableCell sx={{ py: 1 }} align="center">{mem.quantity}</TableCell>
                                        <TableCell sx={{ py: 1 }} align="center">-</TableCell>
                                    </TableRow>
                                ))
                            }
                            {saleList.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ py: 1 }} align="center">{(index + membershipRec.length) + 1}</TableCell>
                                    <TableCell sx={{ py: 1 }}>
                                        <Box sx={{ display: 'flex' }}>
                                            {item.name}
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ py: 1 }} align="center">{Number(item.totalPrice) / Number(item.quantity)}</TableCell>
                                    <TableCell sx={{ py: 1 }} align="center">{item.quantity}</TableCell>
                                    <TableCell sx={{ py: 1 }} align="right">{item.totalPrice}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell colSpan={3} sx={{ py: 1 }}></TableCell>
                                <TableCell align="right" sx={{ py: 1 }}>Subtotal</TableCell>
                                <TableCell align="right" sx={{ fontSize: '18px', py: 1 }}>{(receipt && receipt.data) && Number(receipt?.data.total_price) - (Number(receipt?.data.additionalCost) + Number(receipt?.data.tax))}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={3} sx={{ py: 1 }}></TableCell>
                                <TableCell align="right" sx={{ py: 1 }}>Additional Cost</TableCell>
                                <TableCell align="right" sx={{ fontSize: '18px', py: 1 }}>{receipt?.data.additionalCost}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={3} sx={{ py: 1 }}></TableCell>
                                <TableCell align="right" sx={{ py: 1 }}>Tax</TableCell>
                                <TableCell align="right" sx={{ fontSize: '18px', py: 1 }}>{receipt?.data.tax}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={3} sx={{ py: 1 }}></TableCell>
                                <TableCell align="right" sx={{ py: 1 }}>Total Cost</TableCell>
                                <TableCell align="right" sx={{ fontSize: '18px', py: 1, fontWeight: 'bold' }}>{receipt?.data.total_price}</TableCell>
                            </TableRow>
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={5} sx={{ border: 'none' }} align="center">
                                    <Typography>Thank you !</Typography>
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
           </Box>
        </Box>
    )
}

export default SaleVoucherDetail