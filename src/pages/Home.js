import React, { useEffect, useRef, useState } from 'react';
import {useAuthContext} from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import BookedData from './BookedData';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import whatsapp from '../component/image/whatsapp.png';
import InsertBooking from './InsertBooking';

function Home() {

  const {user} = useAuthContext();
  const navigate = useNavigate();
  const [bookingData,setBookingData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [unavailableDates, setUnavalableDates] = useState("");
  const [eventlist, setEventList] = useState();
  const [open, setOpen] = useState(false);
  
  const textF = (name) => {
    const text = `Hi ${name}`

    return text
  }

  useEffect(() => {
    axios.get("get-bookings", {headers: {
      accessToken:user.token
    }}).then( async (response) => {

      let events = [];
      let time = ''
      const receivedData =  await response.data;

      for(var i=0; i<receivedData.length; i++){
        const singleBooking = await receivedData[i];
        const singleBookingDate = new Date (await singleBooking.bookingDate)
        let singleDate;
        let singleMonth;
        if(singleBookingDate.getDate() < 10){
          singleDate = `0${singleBookingDate.getDate()}`
        }else{
          singleDate = singleBookingDate.getDate()
        }
        if(singleBookingDate.getMonth() + 1 < 10){
          singleMonth = `0${singleBookingDate.getMonth() + 1}`
        }else{
          singleMonth = singleBookingDate.getMonth() + 1
        }
        const singleYear = singleBookingDate.getFullYear();
        const singleBookingTime = await singleBooking.bookingTime
        if(singleBookingTime.slice(0, 2) === '3-'){
          time = process.env.REACT_APP_FIRST_SESSION_T
        }else if(singleBookingTime.slice(0, 2) === '6-'){
          time = process.env.REACT_APP_SECOND_SESSION_T
        }else if(singleBookingTime.slice(0, 2) === '9-'){
          time = process.env.REACT_APP_THIRD_SESSION_T
        }
        events.push({
          title: `${singleBooking.bookingPax} pax`,
          start: `${`${singleYear}-${singleMonth}-${singleDate}` + time}`
        })

        
      }

      setEventList(events)
      console.log(events)
      
      

    })
  }, [])


  const handleDateClick = (arg) => {
    const selectDate = `${arg.date}`
    setSelectedDate(selectDate);
    console.log(new Date(selectDate))
    const data = {selectedDate:selectDate};
    axios.post('/get-a-booking', data,  {headers: {
      accessToken:user.token
    }}).then(async (response) => {
      console.log(response.data)
      setBookingData( await response.data)
      setOpen(true)
      if(response.data.length == 0){
        axios.post('/get-a-holiday', data, {headers: {
          accessToken: user.token
        }}).then( async (res) => {
          if( await res.data.succ){
            setUnavalableDates(`${selectDate} is a day off`)
            setOpen(true)
          }
        })
      }
    })    
  }
  
  const onCloseModal = () => {
    setOpen(false);
    setUnavalableDates("");
  }

  return (
    <div className='container mb-5'>
          <Modal open={open} onClose={onCloseModal} center classNames={{
          overlay: 'customOverlay',
          modal: 'customModal',
        }}>
      <div className='row'>
        <div className='col-lg-12'>
        <h2 className='mt-4'>{selectedDate.slice(0,15)}</h2>
        <br/>
        {bookingData.length > 0 ? (<></>) : unavailableDates != '' ? (<><div class="alert alert-warning" role="alert">
          {unavailableDates}
        </div></>) : (
        <div class="alert alert-info" role="alert">
          Date has no data
        </div>)}
        {bookingData.length > 0 ? (<><div><h4>{process.env.REACT_APP_FIRST_SESSION}</h4>
        {bookingData.filter(item => item.bookingTime.includes(process.env.REACT_APP_FIRST_SESSION)).map((val,key) => {
          return(
            <>
            <p>{val.name} ( {val.phoneNumber} <a target='_blank' href={`https://api.whatsapp.com/send?phone=${val.phoneNumber}&text=${textF(val.name)}`}><img src={whatsapp} width={17}/></a> ) - {val.bookingPax} pax  <button className='btn btn-sm btn-danger'>x</button></p>
            </>
          )
        })}
        </div>
        <div className='mt-5'><h4>{process.env.REACT_APP_SECOND_SESSION}</h4>
        {bookingData.filter(item => item.bookingTime.includes('6-8PM')).map((val,key) => {
          return(
            <>
            <p>{val.name} ( {val.phoneNumber} <a target='_blank' href={`https://api.whatsapp.com/send?phone=${val.phoneNumber}&text=${textF(val.name)}`}><img src={whatsapp} width={17}/></a> ) - {val.bookingPax} pax <button className='btn btn-sm btn-danger'>x</button></p>
            </>
          )
        })}
        </div>
        <div className='mt-5'><h4>{process.env.REACT_APP_THIRD_SESSION}</h4>
        {bookingData.filter(item => item.bookingTime.includes('9-11PM')).map((val,key) => {
          return(
            <>
            <p>{val.name} ( {val.phoneNumber} <a target='_blank' href={`https://api.whatsapp.com/send?phone=${val.phoneNumber}&text=${textF(val.name)}`}><img src={whatsapp} width={17}/></a> ) - {val.bookingPax} pax <button className='btn btn-sm btn-danger'>x</button></p>
            </>
          )
        })}
        </div></>) : (<></>)}
        
        </div>
      </div>
      </Modal>
      <InsertBooking />
      <div className='card'>
        <div className='card-body'>
          <div className='row justify-content-center text-center'>
            <Fullcalendar
             plugins={[dayGridPlugin,timeGridPlugin,interactionPlugin]}
             initialView={'dayGridMonth'}
             headerToolbar= {{
              start:'',
              center:'title',
              end: 'today,prev,next dayGridMonth,timeGridWeek,timeGridDay'
             }}
             allDayContent={false}
             dateClick={handleDateClick}
             events={eventlist}
             showNonCurrentDates={false}
             eventMinWidth={10}
             moreLinkClick={'test'}
             />
          </div>
      </div>
    </div>
    </div>
  )
}

export default Home