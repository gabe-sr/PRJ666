import { useState, useRef, useCallback } from "react";
import axios from "axios";
import TableData from "../../shared//table_data/TableData.js";
import { ButtonGroup, Card, Container, Row, ToggleButton } from "react-bootstrap";
import Button from "@restart/ui/esm/Button";

const radios =[
    {name:'before', value:'2'},
    {name:'after', value:'1'}
];

/* Receives a user id as a prop, returns a table containing all the bookings for
    that user. The user is able to request a cancellation if needed.*/
const BookingList = ({user}) => {
    const [data, setData] = useState();
    const [radioValue, setRValue] = useState('1');
    const today = useRef(new Date());

    const fetchBookings = useCallback(
        async () => {
            if(radioValue === '1'){
                const res = await axios.get('/book',{
                    params:{
                        type: 'aftrequest',
                        date: today.current,
                        userid: user._id
                    }
                }) 
                setData(res.data)
            } 
            else{
                const res = await axios.get('/book',{
                    params:{
                        type: 'bfrequest',
                        date: today.current,
                        userid: user._id
                    }
                }) 
                setData(res.data)
            }
        },
        [radioValue, user._id],
    );

    const requestCancel = useCallback(async (bk)=>{
        //set cancel request -> set cancel
        if(!bk.cancel_request){
            await axios.patch(`http://localhost:8080/get/${bk._id}`,
            {
                cancel_request: true 
            })
        }if(!bk._isCancelled){
            await axios.patch(`http://localhost:8080/get/${bk._id}`,
            {
                _isCancelled: true 
            })
        }
    }, [])

    const customRequestColumn = (bk)=>{
        const request = ()=>{
            if(bk._isCancelled){
                request.variant = "danger"
                request.text = "Booking cancelled"
                request.disabled = true
            }else if(bk.cancel_request) {
                request.variant = "warning"
                request.text = "Cancel request sent"
                request.disabled = false
            }else{
                request.variant = "Secondary"
                request.text = "Request cancel"
                request.disabled = false
            }
        };
        
        return (
            <Button
                variant={request.variant}
                diabled={request.disabled}
                size="sm"
            >
                {request.text}
            </Button>
        )
    }

    return( 
        <Container>
            <Row>
                <ButtonGroup>
                    {radios.map((radio, idx)=>(
                        <ToggleButton
                            key={idx}
                            id={`radio-${idx}`}
                            type='checkbox'
                            variant='outline-success'
                            name='radio'
                            value={radio.value}
                            checked={radioValue === radio.value}
                            onChange={(e)=> setRValue(e.currentTarget.value)}
                            >
                                {radio.name}
                            </ToggleButton>
                    ))}
                </ButtonGroup>
            </Row>
            <Row>
                {data ? 
                <Card className="text-center">
                    <Card.Title>
                        No Bookings found Yet!
                    </Card.Title>
                </Card>
                :
                <TableData
                    headers={["Booking date, Price, Type"]}
                    columns={["booking_date, price_at_booking, booking_type"]}
                    values={data}
                    whenClicked={requestCancel}
                    customColumn={[
                        {
                            colDesc: "Cancel Status",
                            customColumnComp: customRequestColumn,
                        },
                    ]}
                />
                }
            </Row>
        </Container>
    )
    
}

export default BookingList
