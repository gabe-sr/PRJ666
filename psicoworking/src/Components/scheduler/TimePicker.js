import React, { useState, useEffect } from 'react'
import { ListGroup } from 'react-bootstrap'
import { format } from 'date-fns'

export default function TimePicker({date}) {
    const curr = date

    const [label, setLabel] = useState("")

    const [ tslots, setTslots] = useState(new Array(11).fill(false))

    const times = [ "8:00AM","9:00AM","10:00AM","11:00AM","1:00PM","2:00PM","3:00PM","4:00PM"
                    ,"5:00PM","6:00PM","7:00PM" ]

    useEffect(()=>{
        setLabel(format(curr,"do MMM yyyy"))
        // console.log(label)
    },[])
    
    useEffect(()=>{
        setLabel(format(curr,"do MMM yyyy"))
        // console.log(label)
    },[curr])
    
    const handleClick = (value)=>{
        const newts = [...tslots]
        newts[value] = !newts[value]
        // for(let ts in newts){
        //     if(newts[ts]!=newts[value] && newts[ts]){
        //         newts[ts]=false
        //     }
        // }
        for(let i= 0; i<newts.length;i++){
            if(i!=value && newts[i] == true){
                newts[i]=false
            }
        }
        setTslots(newts)
        if(newts[value]){alert(`Your chosen booking is: ${format(curr,"MMM do yyy")} at ${times[value]}`)}
        
    }

    return (
        <div>
            <div>{label}</div>
            {/* <div>{format(mess,"do MMM yyyy")}</div> */}
            {/* <div>{msg}</div> */}
            <ListGroup>
                <ListGroup.Item id={0} key={0} action active={tslots[0]} variant="" onClick={()=>handleClick(0)}>
                    8:00 AM
                </ListGroup.Item>
                <ListGroup.Item  key={1} action active={tslots[1]} variant="secondary" onClick={()=>handleClick(1)}>
                    9:00 AM
                </ListGroup.Item>
                <ListGroup.Item  key={2} action active={tslots[2]} variant="" onClick={()=>handleClick(2)}>
                    10:00 AM
                </ListGroup.Item>
                <ListGroup.Item  key={3} action active={tslots[3]} variant="secondary" onClick={()=>handleClick(3)}>
                    11:00 AM
                </ListGroup.Item>
                <ListGroup.Item  key={4} action active={tslots[4]} variant="" onClick={()=>handleClick(4)}>
                    1:00 PM
                </ListGroup.Item>
                <ListGroup.Item  key={5} action active={tslots[5]} variant="secondary" onClick={()=>handleClick(5)}>
                    2:00 PM
                </ListGroup.Item>
                <ListGroup.Item  key={6} action active={tslots[6]} variant="" onClick={()=>handleClick(6)}>
                    3:00 PM
                </ListGroup.Item>
                <ListGroup.Item  key={7} action active={tslots[7]} variant="secondary" onClick={()=>handleClick(7)}>
                    4:00 PM
                </ListGroup.Item>
                <ListGroup.Item  key={8} action active={tslots[8]} variant="" onClick={()=>handleClick(8)}>
                    5:00 PM
                </ListGroup.Item>
                <ListGroup.Item  key={9} action active={tslots[9]} variant="secondary" onClick={()=>handleClick(9)}>
                    6:00 PM
                </ListGroup.Item>
                <ListGroup.Item  key={10} action active={tslots[10]} variant="" onClick={()=>handleClick(10)}>
                    7:00 PM
                </ListGroup.Item>
            </ListGroup>
        </div>
    )
}
