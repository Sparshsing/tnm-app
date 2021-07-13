import React, {useEffect} from 'react';
import './homepage.css';

export default function HomePage(props){
  useEffect(() => {
    props.setTitle('Home');
  }, [])

  return(
    <div className="hpcontainer">
      <div className="hpbackground-color">
        <p>Welcome To SFM Dropshipping</p>
      </div>
    </div>
  )
}