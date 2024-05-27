import React, {useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import "react-datepicker/dist/react-datepicker.css";
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import DatePicker from "react-datepicker";
import {countryCode} from "./CountryCode"
import axios from '../api/axios';
import Select from 'react-select';
import { useAuthContext } from '../hooks/useAuthContext';

function InsertBooking() {
    const {user} = useAuthContext();
    const [open, setOpen] = useState(false);
    const [succ,setSucc] = useState("");
    const [err,setErr] = useState("");
    const [change,setChange] = useState("booking");
    const [selectedDate, setSelectedDate] = useState(null);
    const [hselectedDate, setHSelectedDate] = useState(null);
    const [unavailableDates, setUnavalableDates] = useState([]);
    const [hunavailableDates, setHUnavalableDates] = useState([]);
    const [selectedSession, setSelectedSession] = useState("");
    const [pax, setPax] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [cCode, setCCode] = useState("+60");
    const [mobile, setMobile] = useState("");
    const [firstSession, setFirstSession] = useState(null);
    const [secondSession, setSecondSession] = useState(null);
    const [thirdSession, setThirdSession] = useState(null);
    const adjustedCountryCode = cCode.replace(/\D/g, '');
    const [hideBtn, setHideBtn] = useState("");

    let slicedDate;
    let slicedhDate;
    let options = [];
    let adjustedMobile = mobile;

    adjustedMobile = mobile.replace(/\D/g, '')

    const phoneNumber = `${adjustedCountryCode}${adjustedMobile}`

    if(!selectedDate){
      slicedDate = ""
    }else{
  
      slicedDate = String(selectedDate).slice(0, 15);
    }

    if(!hselectedDate){
      slicedhDate = ""
    }else{
  
      slicedhDate = String(hselectedDate).slice(0, 15);
    }

    

    countryCode.map((value,key) => {
      options.push({value:  `${value.dial_code}`, label:`${value.code} ${value.dial_code}`})
    })

    var today = new Date();
    today.setDate(today.getDate() - 1);
  
    const onOpenModal = () =>{
      setOpen(true);
    }
    
    const onCloseModal = () => {
      setErr("")
      setOpen(false);
      setPax("0")
      setHideBtn("")
      setHSelectedDate(null)
      setChange("booking")
    }

    const insertBooking = (e) => {
      e.preventDefault()
      setChange("booking");
    }
    
    const insertHoliday = (e) => {
      e.preventDefault()
      setChange("holiday");
    }

    const insertText = (e) => {
      e.preventDefault()
      setChange("text");
    }

    const handlehDateChange = (date) => {
      setHSelectedDate(date);
    };

    const paxChange = () => {
      setSelectedDate(null)
      setSelectedSession("")
    }

    const handleCountryCode = (countryCode) => {
      setCCode(countryCode.value);
    }

    const handleDateChange = (date) => {
      setSelectedDate(date);
      setSelectedSession("");
      const data = {selectedDate: date.toISOString()}
      axios.post("/get-session", data, {headers: {
        accessToken: user.token
      }}).then( async (response) => {
        const json = await response.data;
        setFirstSession(await json.firstSession)
        setSecondSession(await json.secondSession)
        setThirdSession(await json.thirdSession)
      })
    };

    const handleBooking = () => {
      const delay = () => {
        setSucc("");
        setErr("");
        setPax("0");
        setHideBtn("");
        setOpen(false);
        window.location.reload();
      }
      setHideBtn("Hide");
      const sendData = {pax: pax, selectedDate: selectedDate, selectedSession: selectedSession, name: name, email: email, phoneNumber: phoneNumber}
    axios.post('/booking-admin', sendData, {headers: {
      accessToken:user.token
    }}).then((res) => {
        if(res.data.succ){
            setSucc(res.data.succ)
            setTimeout(delay, 3000)
        }else if(res.data.error){
          setErr(res.data.error)
        }
    }).catch(err =>{setErr(err.message)
      (err.message);
      setTimeout(delay, 3000)
    })
    }

    const handleHoliday = () => {
      const delay = () => {
        setSucc("");
        setErr("");
        setPax("0");
        setHideBtn("");
        setOpen(false);
        window.location.reload();
      }
      setHideBtn("Hide");
      const sendData = {selectedDate: hselectedDate};
      axios.post("/post-holidays", sendData, {headers: {
        accessToken: user.token
      }}).then((res) => {
        if(res.data.succ){
          setSucc(res.data.succ)
          setTimeout(delay, 3000)
        }else if(res.data.error){
          setErr(res.data.error)
        }
      }).catch(err =>{setErr(err.message)
        (err.message);
        setTimeout(delay, 3000)
      })
    }

    

    useEffect(() => {
      axios.get('get-holidays', {headers: {
        accessToken: user.token
      }}).then(async (response) => {
        let holidaysDate = [];
        const json = await response.data;
        for(var i = 0; i<json.length; i++){
          const singleHoliday = json[i];
          const singleDateHoliday = new Date(singleHoliday.holidayDate).toISOString().slice(0,10);
          holidaysDate.push(singleDateHoliday)
        }
  
        return setUnavalableDates(holidaysDate);
       
      })
    },[])

    useEffect(() => {
      setHUnavalableDates(unavailableDates)
      axios.get("/get-book-date", {headers: {
        accessToken: user.token
      }}).then( async (response) => {
        const json = await response.data;
        for(var i = 0; i<json.length; i++){
          const singleDate = new Date(json[i]);
          const iso = singleDate.toISOString().slice(0,10);
          hunavailableDates.push(iso)
        }
      })
    })

  return (

    <div>
         <button className='btn btn-dark my-3' onClick={onOpenModal}>+ Insert</button>
      <Modal open={open} onClose={onCloseModal} center classNames={{
          overlay: 'customOverlay',
          modal: 'customModal',
        }}>

<div className='row'>
        <div className='col-lg-12'></div>          

<div className='mt-5'>
<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    {change === "booking" && (<>
    <li class="breadcrumb-item active" aria-current="page">Reserve</li>
    <li class="breadcrumb-item" onClick={insertHoliday} aria-current="page"><a href=''>Submit Day Off</a></li>
    </>)}

    {change === "holiday" && (<>
    <li class="breadcrumb-item" onClick={insertBooking} aria-current="page"><a href=''>Reserve</a></li>
    <li class="breadcrumb-item active" aria-current="page">Submit Day Off</li>
    </>)}

    {change === "text" && (<>
    <li class="breadcrumb-item" onClick={insertBooking} aria-current="page"><a href=''>Reserve</a></li>
    <li class="breadcrumb-item" onClick={insertHoliday} aria-current="page"><a href=''>Submit Day Off</a></li>
    </>)}

  </ol>
</nav>
</div>

{err === "" ? (<></>) : (
        <div class="alert alert-danger" role="alert">
          {err}
        </div>)}

        {succ === "" ? (<></>) : (
        <div class="alert alert-success" role="alert">
          {succ}
        </div>)}

{change === 'booking' ? (<>

  <div className='row'>
        <div className='col-lg-12'>
        <h2 className='mt-4'>Insert Reservation</h2>
        <br/>
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="floatingInputValue" onChange={(event) => {setName(event.target.value)}} />
          <label for="floatingInputValue">Name</label>
        </div>

        <div className="mb-4">
         <label>Phone Number</label>
          <div class="col-auto">
            <div class="input-group">
              <Select maxMenuHeight={150} className="input-group-text" options={options} value={cCode.value} defaultInputValue="MY +60" onChange={handleCountryCode} isSearchable={true} />
              <input type="number" name="mobile" class="form-control" id="autoSizingInputGroup" onChange={(event) => {setMobile(event.target.value)}} />
             </div>
           </div>
          </div>

        <div class="form-floating mb-3">
          <input type="email" class="form-control" id="floatingInputValue" name='email' onChange={(event) => {setEmail(event.target.value)}}/>
          <label for="floatingInputValue">Email</label>
        </div>

        <div class="form-floating mb-3">
          <select class="form-select" id="floatingSelect" aria-label="Floating label select example" onChange={(event) => {
                              setPax(event.target.value)
                              paxChange()
                              }} >
            <option value="0">Select Amount of Pax</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
          <label for="floatingSelect">Pax</label>
        </div>
        {parseInt(pax, 10) > 0 ? (<>
          <label className='mt-3'>Select Date</label><br/>
        <div className='row'>
          <div className='col-sm-6'>
                                <DatePicker
                            showIcon
                            icon="fa fa-calendar"
                            placeholderText="Click Here to Select Date"
                                className="form-control mx-2"
                                selected={selectedDate}
                                inline
                                onChange={handleDateChange}
                                filterDate={date => {
                                    if(date.getMonth)
                                    if (date.getDay() === 1) {                                 
                                    return false;
                                    }
                                    if(date <  today){
                                        return false;
                                    }                              
                                    const formattedDate = date.toISOString().split('T')[0];
                                    return !unavailableDates.includes(formattedDate);
                                }}
                                
                                />
          </div>
          <div className='col-sm-6'>
          <input className='form-control my-3' type='text' value={slicedDate} disabled />
          {!selectedDate ? (<></>) : (<>
          {pax > firstSession ? (<>
                              <div className="form-check">
                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" disabled />
                            <label className="form-check-label">
                                3-5PM
                            </label> <span class="badge bg-danger">Fully Booked</span>
                            </div>
                            </>): (<>
                              <div className="form-check">
                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value='3-5PM' onClick={(event) => {setSelectedSession(event.target.value)}}/>
                            <label className="form-check-label">
                                3-5PM
                            </label>
                            </div>
                            </>)}

                            {pax > secondSession ? (
                              <div className="form-check">
                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" disabled />
                            <label className="form-check-label">
                              6-8PM 
                            </label> <span class="badge bg-danger">Fully Booked</span>
                            </div>): (
                              <div className="form-check">
                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value='6-8PM' onClick={(event) => {setSelectedSession(event.target.value)}}/>
                            <label className="form-check-label">
                              6-8PM
                            </label>
                            </div>)}

                            {pax > thirdSession ? (
                              <div className="form-check">
                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" disabled />
                            <label className="form-check-label">
                              9-11PM
                            </label> <span class="badge bg-danger">Fully Booked</span>
                            </div>
                            ):(
                              <div className="form-check">
                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value='9-11PM' onClick={(event) => {setSelectedSession(event.target.value)}}/>
                            <label className="form-check-label">
                              9-11PM
                            </label>
                            </div>
                            )}

</>)}
          </div>
        </div>
        </>) : (<></>)}
        {name === "" || mobile === "" || phoneNumber === "" || email === "" || selectedSession === "" || !selectedDate || parseInt(pax, 10) < 1 ? (<></>) : (<div class="d-grid gap-2 my-3">
            {hideBtn === 'Hide' ? (<></>) : (<button class="btn btn-dark" type="button" onClick={handleBooking}>Submit Booking</button>)} 
          </div>  )}
           

        </div>
      </div>

</>) : change === 'holiday' ? (<>

  <div className='row'>
        <div className='col-lg-12'>
        <h2 className='mt-4'>Insert Day Off</h2>
        <br/>
        <label className='mt-3'>Select Date</label><br/>
        <div className='row'>
          <div className='col-sm-6'>
          <DatePicker
                            showIcon
                            icon="fa fa-calendar"
                            placeholderText="Click Here to Select Date"
                                className="form-control mx-2"
                                selected={hselectedDate}
                                inline
                                onChange={handlehDateChange}
                                filterDate={date => {
                                    if(date.getMonth)
                                    if (date.getDay() === 1) {                                 
                                    return false;
                                    }
                                    if(date <  today){
                                        return false;
                                    }
                                
                                    const formattedDate = date.toISOString().split('T')[0];
                                    return !hunavailableDates.includes(formattedDate);
                                }}
                                
                                />
          </div>
          <div className='col-sm-6'>
          <input className='form-control mt-3' type='text' value={slicedhDate} disabled />
          <div className="mt-3">
            {!hselectedDate ? (<></>) : (<>
              <div class="d-grid gap-2 my-3">
              {hideBtn === "Hide" ? (<></>) : (<button className='btn btn-dark' onClick={handleHoliday}>Submit Date</button>)}
              </div>
            </>)}
                               
                          </div>
          </div>
        

        </div>
        </div>
      </div>

</>) : change === 'text' ? (<>
  <div className='row'>
        <div className='col-lg-12'>
        <h2 className='mt-4'>Adjust Pre-Text</h2>
        <br/>
        </div>
        </div>
</>) : (<></>)}
       

</div>

      </Modal>
    </div>
  )
}

ReactDOM.createPortal(<InsertBooking/>, document.getElementById('root'))

export default InsertBooking