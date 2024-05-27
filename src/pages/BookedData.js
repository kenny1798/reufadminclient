import React, {useState } from 'react';
import ReactDOM from 'react-dom';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

function BookedData({data}) {
    const [open, setOpen] = useState(false);
    const [err,setErr] = useState("");
  
    const onOpenModal = () =>{
      setOpen(true);
    }
    
    const onCloseModal = () => {
      setErr("")
      setOpen(false);
    }
  return (
    <div>
         <button className='btn btn-primary my-3' onClick={onOpenModal}>Reserve Now</button>
      <Modal open={open} onClose={onCloseModal} center classNames={{
          overlay: 'customOverlay',
          modal: 'customModal',
        }}>
      <div className='row'>
        <div className='col-lg-12'>
        <h2 className='mt-4'>Confirm Booking Details</h2>
        <br/>
        {err === "" ? (<></>) : (
        <div class="alert alert-danger" role="alert">
          {err}
        </div>)}
        <p>{data.selectedDate}</p>
        </div>
      </div>
      </Modal>
    </div>
  )
}

ReactDOM.createPortal(<BookedData/>, document.getElementById('root'))

export default BookedData