import React, { useState } from 'react'
import '../../assets/stylesheets/home.css'
/* const fs = require('fs')
const fileName = './config.json'
const file = require(fileName) */

const AppCredentialsView = () => {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className='Body'>
      <div>Write Credentials:</div>
      <input type="text" value={value} onChange={handleChange} />
      <div>{value}</div>
    </div>
  )
}
/* const pepe = () => {
  file.token = 'PEPE'
  fs.writeFile(fileName, JSON.stringify(file), function writeJSON () { })
} */

export default AppCredentialsView
