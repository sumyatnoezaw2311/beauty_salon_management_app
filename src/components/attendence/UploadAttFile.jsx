import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as ExcelJS from 'exceljs';
import { useDispatch, useSelector } from 'react-redux';
import { setAttRecs, attReport } from '../../slices/attendenceSlice';
import AlertDialog from '../utils/AlertDialog'
import { getInfoFromLocal } from '../../utils/config';
import { format } from 'date-fns';


const UploadAttFile = ()=>{

    const dispatch = useDispatch()
    const [ showAlert, setShowAlert ] = useState(false)
    const { attRecs , data } = useSelector(state=> state.Attendence)
    const [ fileName,setFileName ] = useState(null)

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
      });

      const fetchData = async ()=>{
        await dispatch(attReport({ method: 'get', data: null }))
      }

      const handleUpload = async ()=>{
        if(attRecs && attRecs.length > 0){
            const attData = []
            attRecs.map(att=>{
                const timeString = att.clock_in_out_time;
                const formattedDate = format(new Date(att.date), 'yyyy-MM-dd');
                const [startTime, endTime] = timeString.split(' ');
                const formattedData = {
                    name: att.name,
                    date : formattedDate,
                    arrivedAt: startTime === "" || startTime === undefined ? null : startTime,
                    leftAt: endTime === "" || endTime === undefined ? null : endTime,
                    absent: Boolean(att.absent),
                    lateMinute: att.late === "" || undefined ? null : att.late,
                }
                attData.push(formattedData)
            })
            const data= { shopId: getInfoFromLocal().user.shopId, attendances: attData }
            await dispatch(attReport({ method: 'post', data: data }))
            fetchData()
        }
    }

    const handleCancel = ()=>{
      setShowAlert(false)
    }

    const handleConfirm = ()=>{
      setFileName(null)
      setShowAlert(false)
    }

    const handleOnChange = async (e) => {
        const file = e.target.files[0];
        if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          setShowAlert(true)
        }else{
          setFileName(file.name);
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(file);
          const worksheet = workbook.getWorksheet(1);
          const jsonData = [];
          const headers = [];
          worksheet.getRow(1).eachCell((cell) => {
            headers.push(cell.value.toLowerCase().replace(/[ \-/\.]+/g, '_'));
          });
        
          for (let i = 2; i <= worksheet.rowCount; i++) {
              const rowObject = {};
              const row = worksheet.getRow(i);
              headers.forEach((header, colNumber) => {
                rowObject[header] = row.getCell(colNumber + 1).value.toString();
              });
              jsonData.push(rowObject);
          }
          dispatch(setAttRecs(jsonData));
        }
      };

      useEffect(()=>{
        if(data && data.message && data.message === "New Records are created."){
            setFileName(null)
            dispatch(setAttRecs(null))
        }
      },[data])
      
    return (
        <>
            <AlertDialog
                toggle={showAlert}
                setToggle={setShowAlert}
                cancel={handleCancel}
                confrim={handleConfirm}
                title={"Invalid File Type!"}
                content={"Please select an xlsx file."}
            ></AlertDialog>
            <Button component="label" variant="text" startIcon={<CloudUploadIcon />}>
                { fileName ? fileName.length > 15 ? `${fileName.substring(0, 14)}...`: fileName : "Upload Att File"}
                <VisuallyHiddenInput type="file" onChange={(e)=> handleOnChange(e) } />
            </Button>
            {
              (attRecs && attRecs.length > 0) &&
              <Button onClick={()=> handleUpload() } variant='contained'>Done</Button>
            }
        </>
    )
}

export default UploadAttFile