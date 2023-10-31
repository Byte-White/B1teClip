"use client"
import React, { useState } from 'react';

import { initializeApp } from "firebase/app";
import {getFirestore,collection,doc,getDoc,getDocs,setDoc, onSnapshot} from "firebase/firestore"

//require('dotenv').config()

const firebaseConfig = {

  apiKey: process.env.NEXT_PUBLIC_API_KEY,

  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,

  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,

  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,

  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,

  appId: process.env.NEXT_PUBLIC_APP_ID

};
console.log(firebaseConfig)
const fire = initializeApp(firebaseConfig);
const db = getFirestore(fire);
const history = collection(db,'clipboard');
const current = doc(history,'current');


export default function Clipboard() {
  const [text, setText] = useState('');
  const [copyState, setCopyState] = useState('Copy');

  getDoc(current).then((doc) => {
    if (doc.exists) {
      // Document data is available in the `data()` method
      const data = doc.data();
      setText(data.data);
      } else {
        console.log('Document does not exist');
      }
    }).catch((error) => {
      console.error('Error getting document:', error);
    });
    // Use onSnapshot to listen for changes to the document
    onSnapshot(current, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if(data.data!=text)
        {
          setText(data.data);
          setCopyState('Copy');
        }
      } else {
        console.log('Document does not exist');
      }
    });
    const handleChange = (e) => {
      setText(e.target.value)
      const newData = {
        data : e.target.value
        };
      setDoc(current, newData)
      setCopyState('Copy');
    }
    
    
    const handleClear = () => {
      setText('')
      setCopyState('Copy');
    }
    const handleCopy = () =>{
      if(text!='' && copyState != 'Copied!')
      {
        navigator.clipboard.writeText(text);
        setCopyState('Copied!');
      }
    }
    return (
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="bg-black bg-opacity-40 rounded-lg w-2/3 p-8">
          <div className="text-white text-3xl text-center mb-4">Clipboard</div>
          
          {/* Text Input */}
          <textarea
            type="text"
            className="w-full py-16 px-3 bg-transparent rounded-md"
            placeholder="Enter text..."
            value={text}
            onChange={(e) => handleChange(e)}
          ></textarea>

          {/* Copy and Save to History Buttons */}
          <div className="flex justify-between mt-4">
            <button className="bg-green-500 w-1/2 text-white px-4 py-2 rounded-md" onClick={handleCopy}>{copyState}</button>
            <button className="bg-white w-1/2 text-black px-4 py-2 rounded-md">Save to History</button>
          </div>

          {/* View History Button */}
          <button className="bg-blue-500 w-3/5 h-full text-white px-4 py-2 rounded-md mt-4">History</button>
          <button className="bg-red-500 w-2/5 h-full text-white px-4 py-2 rounded-md mt-4" onClick={handleClear}>Clear</button>
        </div>
      </div>
    )
  }