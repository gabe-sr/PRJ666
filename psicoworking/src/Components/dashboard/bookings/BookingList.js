import { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";
import NewTableData from "../../shared/table_data_new/NewTableData.js";
import { Button,ButtonGroup, Card, Container, Modal, Row, ToggleButton } from "react-bootstrap";
import { format, parseISO } from "date-fns";

const radios =[
    {name:'before', value:'2'},
    {name:'after', value:'1'}
];

/* Receives a user id as a prop, returns a table containing all the bookings for
    that user. The user is able to request a cancellation if needed.*/
const BookingList = ({user}) => {
    const [data, setData] = useState([]);
    const [radioValue, setRValue] = useState('1');
    const [ show, setShow ] = useState(false);
    // const [ currBkng, setBkng ] = useState({});
    const bk = useRef(null);
    const today = useRef(new Date());

    const fetchBookings = useCallback(
        async () => {
            if(radioValue === '1'){
                console.log(`radio value ${radioValue}`)
                const res = await axios.get('/book',{
                    params:{
                        type: 'aftrequest',
                        date: today.current,
                        userid: user._id
                    }
                }) 
                const temp = await res.data
                setData(temp)
            } 
            else{
                console.log(`radio value ${radioValue}`)
                const res = await axios.get('/book',{
                    params:{
                        type: 'bfrequest',
                        date: today.current,
                        userid: user._id
                    }
                }) 
                const temp = await res.data
                setData(temp)
            }
        },
        [radioValue, user._id],
    );

    const requestCancel = useCallback(async (bk)=>{
        //set cancel request -> set cancel
        console.log(bk)
        if(!bk._isCancelled && user.isAdmin){
            const res = await axios.patch(`http://localhost:8080/book/cancel_approve/${bk._id}`,
            {
                _isCancelled: true 
            })
            console.log(res)
        }else if(!bk.cancel_request){
            const res = await axios.patch(`http://localhost:8080/book/cancel_request/${bk._id}`,
            {
                cancel_request: true 
            })
            console.log(res)
        }
        fetchBookings();

    }, [user,fetchBookings])

    const customRequestColumn = (bk)=>{
        const request= {variant:"secondary", text:"Request Cancel", disabled:false};
        if(bk._isCancelled){
            console.log("custom column if cancelled exec")
            request.variant = "danger"
            request.text = "Booking cancelled"
            request.disabled = true
        }else if(bk.cancel_request && !user.isAdmin) {
            console.log("custom column if cancel req exec")
            request.variant = "warning"
            request.text = "Cancel request sent"
            request.disabled = true
        }else if(bk.cancel_request && user.isAdmin){
            request.variant = "info"
            request.text = "Cancel request received"
            request.disabled = false
        }
    
        console.log(bk)
        console.log(request)
        console.log("customRequestColumn exec")
        return (
            
                <Button
                    variant={request.variant}
                    disabled={request.disabled}
                    size="sm"
                    onClick={()=>requestCancel(bk)}
                >
                    {request.text}
                </Button>
        )
    }

    useEffect(() => {
        fetchBookings();
    }, [radioValue,fetchBookings])

    const handleModalOpen = (booking)=>{
        bk.current = booking
        setShow(true)
    };
    const handleModalClose = ()=>{
        bk.current = null
        setShow(false)
    };
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
                {!data ? 
                <Card className="text-center">
                    <Card.Title>
                        No Bookings found Yet!
                    </Card.Title>
                </Card>
                :
                <NewTableData
                    headers={["Booking date", "Price", "Type", "Cancellation Request"]}
                    columns={["booking_date2", "price_at_booking", "booking_type", "cancelStatus"]}
                    values={data}
                    whenClicked={handleModalOpen}
                    customColumn={[
                        {
                            colDesc: "cancelStatus",
                            customColumnComp2: customRequestColumn,
                        },
                    ]}
                />
                }
            </Row>
            {show &&
            <Modal show={show} onHide={handleModalClose} centered>
                <Modal.Title>
                    Booking data
                </Modal.Title>
                <Modal.Body>
                    {`${format(parseISO(bk.current.booking_date), "iiii '-' do 'of' MMMM', ' yyyy")} 
                    at ${parseISO(bk.current.booking_date).getUTCHours()}:00`}
                    <br/>
                    Booking status:
                    <br/>
                    {bk.current._isCancelled ? 
                        <div class="p-3 mb-2 bg-danger text-white">Cancelled</div> 
                        : 
                        null}
                    {!bk.current._isCancelled && bk.current.cancel_request ? 
                        <div class="p-3 mb-2 bg-warning text-white">Request pending approval</div> 
                        : 
                        null}
                    {!bk.current._isCancelled && !bk.current.cancel_request ? 
                        <div class="p-3 mb-2 bg-success text-white">Booking ok</div> 
                        : 
                        null}
                </Modal.Body>
            </Modal>
            }

        </Container>
    )
    
}

export default BookingList
